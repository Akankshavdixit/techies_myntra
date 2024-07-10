const express = require('express');
const { getDriver } = require('../db/database');
const { bucket } = require('../db/FireBaseAdmin');




const AddPost = async(req,res)=>{
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
    
        const result = await session.run(
          'CREATE (p:Post {imageUrls: $imageUrls, likes: 0, description: $description, productLinks: $productLinks}) RETURN p',
          { imageUrls: publicUrls, description: description, productLinks: productLinks }
        );
    
        session.close();
    
        // Prepare response data
        const post = {
            id: result.records[0].get('p').properties.id, // Assuming 'id' is the identifier property of your Post node
            imageUrls: result.records[0].get('p').properties.imageUrls,
            likes: result.records[0].get('p').properties.likes,
            description: result.records[0].get('p').properties.description,
            productLinks: result.records[0].get('p').properties.productLinks
        };
          
    
        // Send success response
        res.status(200).send({ message: 'Images uploaded and post created successfully', urls: publicUrls, post: post });
      } catch (error) {
        console.error('Failed to upload images and create post:', error);
        res.status(500).send({ message: 'Failed to upload images and create post', error });
      }
}
const addLike = async (req, res) => {
    console.log('addLike: ', req.user)
    const username = req.user.username;
    const { postId} = req.params;
    console.log("adding",postId)
    const driver = getDriver();
    const session = driver.session();

    try {
        await session.run(
            `MATCH (p:Post) WHERE is(p) = $postId
             MATCH (u:User {username: $username})
             MERGE (u)-[:LIKES]->(p)
             SET p.likes = p.likes + 1
             RETURN p`,
            { postId: parseInt(postId), username }
        );

        res.status(200).send({ message: 'Like added successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to add like', error });
    } finally {
        await session.close();
    }
};

const removeLike = async (req, res) => {
    console.log(req.user)
    const username = req.user.username
    const { postId} = req.params;
    const driver = getDriver();
    const session = driver.session();

    try {
        await session.run(
            `MATCH (u:User {username: $username})-[r:LIKES]->(p:Post) WHERE id(p) = $postId
             DELETE r
             SET p.likes = p.likes - 1
             RETURN p`,
            { postId: parseInt(postId), username }
        );

        res.status(200).send({ message: 'Like removed successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to remove like', error });
    } finally {
        await session.close();
    }
};
  
const getPosts = async (req, res) => {
    console.log(req.user)
    const username = req.user.username;
    const driver = getDriver();
    const session = driver.session();

    try {
        
        const result = await session.run(
                `MATCH (p:Post)
                 OPTIONAL MATCH (p)<-[:LIKES]-(u:User {username: $username})
                 RETURN p, count(u) as liked, ID(p) as postId`,
                { username }
            );
        console.log(result.records[0].get.properties)

        const posts = result.records.map(record => {
            const post = record.get('p').properties;
            post.likes = post.likes.toNumber();
            post.liked = record.get('liked').toNumber() > 0;
            post.id = record.get('postId').low
            console.log('here' , post.id)
            return post;
        });
        

        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch posts', error });
    } finally {
        await session.close();
    }
};

module.exports={AddPost, addLike, removeLike, getPosts}