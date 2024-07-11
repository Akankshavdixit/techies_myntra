const express = require('express');
const { getDriver } = require('../db/database');

const { Timestamp } = require('mongodb');




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

const follow = async(req,res) => {
    const { influencerUsername } = req.params;
    const username = req.user.username;
    const driver = getDriver();
    const session = driver.session();

    try {
        await session.run(
            `MATCH (u:User {username: $username})
             MATCH (i:User {username: $influencerUsername})
             MERGE (u)-[:FOLLOWS]->(i)
             RETURN i`,
            { username, influencerUsername }
        );

        res.status(200).send({ message: `Successfully followed ${influencerUsername}` });
    } catch (error) {
        console.error(`Failed to follow ${influencerUsername}:`, error);
        res.status(500).send({ message: `Failed to follow ${influencerUsername}`, error });
    } finally {
        await session.close();
    }

}

const unfollow = async(req,res) => {

    const { influencerUsername } = req.params;
    const username = req.user.username;
    const driver = getDriver();
    const session = driver.session();

    try {
        await session.run(
            `MATCH (u:User {username: $username})-[r:FOLLOWS]->(i:User {username: $influencerUsername})
             DELETE r
             RETURN i`,
            { username, influencerUsername }
        );

        res.status(200).send({ message: `Successfully unfollowed ${influencerUsername}` });
    } catch (error) {
        console.error(`Failed to unfollow ${influencerUsername}:`, error);
        res.status(500).send({ message: `Failed to unfollow ${influencerUsername}`, error });
    } finally {
        await session.close();
    }

}

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
  
const getPosts = async (req, res) => {
    const username = req.user.username;
    const driver = getDriver();
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (p:Post)
             OPTIONAL MATCH (p)<-[:LIKES]-(u:User {username: $username})
             OPTIONAL MATCH (i:User)-[:CREATED]->(p)
             OPTIONAL MATCH (f:User)-[:FOLLOWS]->(i)
             RETURN p, count(u) as liked, ID(p) as postId, i.username as influencerUsername, count(f) as followerCount`,
            { username }
        );

        const posts = result.records.map(record => {
            const post = record.get('p').properties;
            post.likes = post.likes.toNumber();
            post.liked = record.get('liked').toNumber() > 0;
            post.influencerUsername = record.get('influencerUsername');
            post.followerCount = record.get('followerCount').toNumber();
            return post;
        });

        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch posts', error });
    } finally {
        await session.close();
    }
};


module.exports={ addLike, removeLike, getPosts, follow, unfollow};