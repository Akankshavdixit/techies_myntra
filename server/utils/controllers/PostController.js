const express = require('express');
const { getDriver } = require('../db/database');
const { NULL } = require('mysql/lib/protocol/constants/types');



const follow = async (req, res) => {
    const { creator } = req.params;
    console.log(creator)
    const username = req.user.username;
    const driver = getDriver();
    const session = driver.session();

    try {
        // Create the FOLLOWS relationship and update follower count in a single query
        const result = await session.run(
            `MATCH (u:User {username: $username})
             MATCH (i:User {username: $creator})
             MERGE (u)-[:FOLLOWS]->(i)
             SET u.following = u.following + 1, 
             i.followers = i.followers + 1
             RETURN i`,
            { username : username, creator : creator }
        );
        console.log(result.records)

        res.status(200).send({ message: `Successfully followed ${creator}` });
    } catch (error) {
        console.error(`Failed to follow ${creator}:`, error);
        res.status(500).send({ message: `Failed to follow ${creator}`, error });
    } finally {
        await session.close();
    }
};

const unfollow = async (req, res) => {
    const { creator } = req.params;
    const username = req.user.username;
    const driver = getDriver();
    const session = driver.session();

    try {
        // Delete the FOLLOWS relationship and update follower count in a single query
        await session.run(
            `MATCH (u:User {username: $username})-[r:FOLLOWS]->(i:User {username: $creator})
             DELETE r
             SET u.following = u.following - 1, 
                 i.followers = i.followers - 1
             RETURN i`,
            {username:  username, creator: creator }
        );
        

        res.status(200).send({ message: `Successfully unfollowed ${creator} `});
    } catch (error) {
        console.error(`Failed to unfollow ${creator}:`, error);
        res.status(500).send({ message: `Failed to unfollow ${creator}`, error });
    } finally {
        await session.close();
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
  
const getPosts = async (req, res) => {
    console.log(req.user)
    const username = req.user.username;
    const driver = getDriver();
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (p: Post)<-[:CREATED]-(i:User)
            OPTIONAL MATCH (u:User {username : $username })
            OPTIONAL MATCH (u)-[like: LIKES]->(p)
            OPTIONAL MATCH (u)-[follow:FOLLOWS]->(i)
            RETURN p,i,
              CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
              CASE WHEN follow IS NOT NULL THEN true ELSE false END AS isFollowed`,
            { username : username}
        );
        console.log(result.records)
        
        const posts = result.records.map(record => {
            const post = record.get('p').properties;
            post.likes = post.likes.toNumber();
            post.liked = record.get('liked')
            
            post.isFollowed = record.get('isFollowed');
            post.creator = record.get('i').properties.username;
            
            console.log(post)
            return post;
        });

        console.log(posts);
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch posts', error });
    } finally {
        await session.close();
    }
};

const getExplore=async(req,res)=>{
  const driver = getDriver();
  const session = driver.session();
  const username = req.user.username
  console.log('inside explore')
  try {
    
    const priorDate = new Date(new Date().setDate(new Date().getDate()-5)).toISOString().split('T')[0]
    console.log(priorDate, username)
    const result = await session.run(
      `MATCH (p:Post)
       WHERE p.createdAt >= date($trendDate)
       OPTIONAL MATCH (p)<-[:LIKES]-(u:User {username: $username})
       RETURN p, p.likes AS likeCount, count(u) AS liked
       ORDER BY likeCount DESC`,
      { trendDate: priorDate, username: username }
  );
    

      const posts = result.records.map(record => {
         
          const post = record.get('p').properties;
       
          post.likes = post.likes.toNumber();
     
          post.liked = record.get('liked').toNumber() > 0;
          
          console.log('here' , post.id)
          return post;
      });
      

      res.status(200).send(posts);
  } catch (error) {
      res.status(500).send({ message: 'Failed to fetch posts', error });
  } finally {
      await session.close();
  }
}

module.exports={ addLike, removeLike, getPosts, follow, unfollow, getExplore};