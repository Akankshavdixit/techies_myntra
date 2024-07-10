const express = require('express');
const { getDriver } = require('../db/database');
const { bucket } = require('../db/FireBaseAdmin');




const AddPost = async (req, res) => {
    try {
        // Validate request body
        if (!req.files || !req.body.description) {
            return res.status(400).send({ message: 'No files or description provided' });
        }

        // Limit number of uploaded files
        if (req.files.length > 10) {
            return res.status(400).send({ message: 'You can upload a maximum of 10 images.' });
        }

        // Upload images to Google Cloud Storage
        const uploadPromises = req.files.map(file => {
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            });

            return new Promise((resolve, reject) => {
                blobStream.on('error', (err) => {
                    console.error(`Failed to upload image ${file.originalname}: ${err}`);
                    reject(`Failed to upload image ${file.originalname}: ${err}`);
                });

                blobStream.on('finish', async () => {
                    try {
                        await blob.makePublic(); // Make uploaded image publicly accessible
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                        resolve(publicUrl);
                    } catch (error) {
                        console.error(`Failed to make image public ${file.originalname}: ${error}`);
                        reject(`Failed to make image public ${file.originalname}: ${error}`);
                    }
                });

                blobStream.end(file.buffer); // Write file buffer to GCS
            });
        });

        // Wait for all uploads to complete
        const publicUrls = await Promise.all(uploadPromises);

        // Create post in Neo4j database
        const driver = getDriver();
        const session = driver.session();
        const description = req.body.description;
        const productLinks = JSON.parse(req.body.productLinks || '[]'); // Parse JSON product links
        const influencerUsername = req.headers.authorization.split(' ')[1]; // Assuming influencer username is passed in the Authorization header

        const result = await session.run(
            'CREATE (p:Post {id: apoc.create.uuid(), imageUrls: $imageUrls, likes: 0, description: $description, productLinks: $productLinks, influencerUsername: $influencerUsername}) RETURN p',
            { imageUrls: publicUrls, description, productLinks, influencerUsername }
        );

        session.close();

        // Prepare response data
        const post = {
            id: result.records[0].get('p').properties.id,
            imageUrls: result.records[0].get('p').properties.imageUrls,
            likes: result.records[0].get('p').properties.likes,
            description: result.records[0].get('p').properties.description,
            productLinks: result.records[0].get('p').properties.productLinks,
            influencerUsername: result.records[0].get('p').properties.influencerUsername // Include influencer username in the response
        };

        // Send success response
        res.status(200).send({ message: 'Images uploaded and post created successfully', urls: publicUrls, post: post });
    } catch (error) {
        console.error('Failed to upload images and create post:', error);
        res.status(500).send({ message: 'Failed to upload images and create post', error });
    }
};

const addLike = async (req, res) => {
    console.log('addLike: ', req.user)
    const username = req.user.username;
    const { postId} = req.params;
    console.log("adding",postId, username)
    const driver = getDriver();
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (p:Post {id: $postId})
             MATCH (u:User {username: $username})
             MERGE (u)-[:LIKES]->(p)
             SET p.likes = p.likes + 1
             RETURN p`,
            { postId: postId, username }
        );
        console.log(result)

        res.status(200).send({ message: 'Like added successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to add like', error });
    } finally {
        await session.close();
    }
};

const removeLike = async (req, res) => {
    const username = req.user.username
    const { postId} = req.params;
    const driver = getDriver();
    const session = driver.session();
    console.log(postId,username)

    try {
        await session.run(
            `MATCH (u:User {username: $username})-[r:LIKES]->(p:Post {id: $postId})
             DELETE r
             SET p.likes = p.likes - 1
             RETURN p`,
            { postId: postId, username }
        );

        res.status(200).send({ message: 'Like removed successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to remove like', error });
    } finally {
        await session.close();
    }
};
  
// const getPosts = async (req, res) => {
//     console.log(req.user)
//     const username = req.user.username;
//     const driver = getDriver();
//     const session = driver.session();

//     try {
        
//         const result = await session.run(
//                 `MATCH (p:Post)
//                  OPTIONAL MATCH (p)<-[:LIKES]-(u:User {username: $username})
//                  RETURN p, count(u) as liked, ID(p) as postId`,
//                 { username }
//             );
//         console.log(result.records[0].get.properties)

//         const posts = result.records.map(record => {
//             const post = record.get('p').properties;
//             post.likes = post.likes.toNumber();
//             post.liked = record.get('liked').toNumber() > 0;
//             console.log('here' , post.id)
//             return post;
//         });
        

//         res.status(200).send(posts);
//     } catch (error) {
//         res.status(500).send({ message: 'Failed to fetch posts', error });
//     } finally {
//         await session.close();
//     }
// };

const getPosts = async (req, res) => {
    const username = req.user.username;
    const driver = getDriver();
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (p:Post)
             OPTIONAL MATCH (p)<-[:LIKES]-(liker:User {username: $username})
             OPTIONAL MATCH (influencer:User)-[:POSTED]->(p)
             OPTIONAL MATCH (influencer)<-[follow:FOLLOWS]-(follower:User)
             WITH p, count(liker) as liked, ID(p) as postId, influencer, count(follow) as followersCount
             RETURN p, liked, postId, influencer, followersCount`,
            { username }
        );

        const posts = result.records.map(record => {
            const post = record.get('p').properties;
            post.likes = post.likes.toNumber();
            post.liked = record.get('liked').toNumber() > 0;

            const influencerNode = record.get('influencer');
            if (influencerNode) {
                post.influencer = influencerNode.properties;
                post.followersCount = influencerNode.properties.followers ? influencerNode.properties.followers.toNumber() : 0;
            } else {
                post.influencer = null;
                post.followersCount = 0;
            }

            return post;
        });

        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch posts', error });
    } finally {
        await session.close();
    }
};



const followInfluencer = async (req, res) => {
    const username = req.user.username;
    const { postId } = req.params;
    const driver = getDriver();
    const session = driver.session();

    try {
        // Check if the post exists and get the influencer's username
        const checkPostQuery = `
            MATCH (p:Post {id: $postId})<-[:POSTED]-(influencer:User)
            RETURN influencer.username as influencerUsername
        `;
        const checkPostParams = { postId };
        const result = await session.run(checkPostQuery, checkPostParams);

        if (result.records.length === 0) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const influencerUsername = result.records[0].get('influencerUsername');

        // Create a follow relationship
        const followQuery = `
            MATCH (customer:User {username: $username})
            MATCH (influencer:User {username: $influencerUsername})
            MERGE (customer)-[:FOLLOWS]->(influencer)
            SET influencer.followers = coalesce(influencer.followers, 0) + 1
            RETURN influencer.followers as followersCount
        `;
        const followParams = { username, influencerUsername };
        const followResult = await session.run(followQuery, followParams);

        const followersCount = followResult.records[0].get('followersCount').toNumber();

        res.status(200).send({ message: 'Followed influencer successfully', followersCount });
    } catch (error) {
        res.status(500).send({ message: 'Failed to follow influencer', error });
    } finally {
        await session.close();
    }
};

const unfollowInfluencer = async (req, res) => {
    const username = req.user.username;
    const { postId } = req.params;
    const driver = getDriver();
    const session = driver.session();

    try {
        // Check if the post exists and get the influencer's username
        const checkPostQuery = `
            MATCH (p:Post {id: $postId})<-[:POSTED]-(influencer:User)
            RETURN influencer.username as influencerUsername
        `;
        const checkPostParams = { postId };
        const result = await session.run(checkPostQuery, checkPostParams);

        if (result.records.length === 0) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const influencerUsername = result.records[0].get('influencerUsername');

        // Remove the follow relationship
        const unfollowQuery = `
            MATCH (customer:User {username: $username})-[follow:FOLLOWS]->(influencer:User {username: $influencerUsername})
            DELETE follow
            SET influencer.followers = coalesce(influencer.followers, 0) - 1
            RETURN influencer.followers as followersCount
        `;
        const unfollowParams = { username, influencerUsername };
        const unfollowResult = await session.run(unfollowQuery, unfollowParams);

        const followersCount = unfollowResult.records[0].get('followersCount').toNumber();

        res.status(200).send({ message: 'Unfollowed influencer successfully', followersCount });
    } catch (error) {
        res.status(500).send({ message: 'Failed to unfollow influencer', error });
    } finally {
        await session.close();
    }
};

module.exports = { AddPost, addLike, removeLike, getPosts, followInfluencer, unfollowInfluencer };

