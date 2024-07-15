const { getDriver } = require('../db/database')

const GetInfluencerRecommendations=async(req,res)=>{
    const username = req.user.username;
    const driver = getDriver()
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (u:User {username: $username})-[:LIKES|FOLLOWS]->(p:Post)<-[:LIKES|FOLLOWS]-(otherUser:User)
            WHERE u <> otherUser AND otherUser.role = 'influencer' AND NOT (u)-[:FOLLOWS]->(otherUser)
            WITH otherUser, COUNT(*) AS commonInteractions
            ORDER BY commonInteractions DESC
            LIMIT 5
            RETURN otherUser.username AS username`,
            { username: username }
        );

        if(result.records.length==0){
            return res.status(200).json({recommendations: null})
        }
        
        const recommendations = result.records.map(record => ({
            username: record.get('username')
        }));
        return res.status(200).json({ recommendations: recommendations});
    } catch (error) {
        console.error('Error retrieving recommendations', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await session.close();
    }
}

const getPostRecommendations=async(req,res)=>{
    const username = req.user.username;
    const driver = getDriver()
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (u:User {username: $username})-[:LIKES|FOLLOWS]->(p:Post)<-[:LIKES|FOLLOWS]-(otherUser:User)
            MATCH (otherUser)-[:CREATED]->(recommendedPost:Post)
            WHERE NOT (u)-[:LIKES]->(recommendedPost) AND NOT (u)-[:FOLLOWS]->(otherUser) AND NOT (u)-[:FOLLOWS]->(otherUser)
            WITH DISTINCT recommendedPost, COUNT(*) AS interactionCount, otherUser
            ORDER BY interactionCount DESC
            LIMIT 5
            OPTIONAL MATCH (u)-[f:FOLLOWS]->(otherUser)
            RETURN recommendedPost,otherUser.username AS creator, CASE WHEN f IS NULL THEN false ELSE true END AS isFollowed
            UNION
            MATCH (u:User {username: $username})-[:LIKES]->(p:Post)
            UNWIND p.tags AS tag
            MATCH (recommendedPost:Post)
            WHERE tag IN recommendedPost.tags AND NOT (u)-[:LIKES]->(recommendedPost)
            WITH DISTINCT recommendedPost, COUNT(*) AS interactionCount
            ORDER BY interactionCount DESC
            LIMIT 5
            MATCH (creator)-[:CREATED]->(recommendedPost)
            OPTIONAL MATCH (u)-[f:FOLLOWS]->(creator)
            WHERE NOT (u)-[:LIKES]->(recommendedPost) AND NOT (u)-[:FOLLOWS]->(creator)
            RETURN recommendedPost,creator, CASE WHEN f IS NULL THEN false ELSE true END AS isFollowed
            `,
            { username: username }
        );
        if(result.records.length==0){
            return res.status(200).json({recommendations: null})
        }

        const posts = result.records.map(record => {
            const postNode = record.get('recommendedPost');
            const post = postNode.properties;
            post.likes = post.likes.toNumber();
            post.liked = false
            post.isFollowed = record.get('isFollowed')
            if (record.get('creator').properties){
                post.creator = record.get('creator').properties.username
            }
            else{
                post.creator = record.get('creator');
            }
            
            console.log(post.creator)
             
              return post;
          });
          console.log(posts)

        return res.status(200).json({ recommendations: posts});
    } catch (error) {
        console.error('Error retrieving recommendations', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await session.close();
    }
}

module.exports={GetInfluencerRecommendations, getPostRecommendations}