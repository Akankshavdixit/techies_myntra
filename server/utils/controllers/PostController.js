const express = require('express');
const { getDriver } = require('../db/database');





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

module.exports={ addLike, removeLike, getPosts, getExplore}