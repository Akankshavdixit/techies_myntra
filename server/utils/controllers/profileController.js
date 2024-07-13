const { getDriver } = require('../db/database')

const getCustomerProfile=async(req,res)=>{
    const username = req.user.username;
    const driver = getDriver()
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (user:User {username: $username})-[:LIKES]->(post:Post)
             RETURN post`,
            { username:username }
        );

        const posts = result.records.map(record => {
            p=record.get('post').properties
            p.likes = p.likes.toNumber();
            return p
    });

        res.status(200).json({ liked: posts });
    } catch (error) {
        console.error('Error retrieving liked posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await session.close();
    }
}

const getInfluencerProfile = async(req,res)=>{
    const username = req.user.username;
    const driver = getDriver();
    const session = driver.session();
    try{
        const likeResult = await session.run(
            `MATCH (user:User {username: $username})-[:LIKES]->(post:Post)<-[:CREATED]-(creator:User)
            OPTIONAL MATCH (user)-[:FOLLOWS]->(creator)
            RETURN post, creator, COUNT(user) > 0 AS isFollowed`,
            { username: username }
        );
        
        const LikedPosts = likeResult.records.map(record => {
            const post = record.get('post').properties;
            const creator = record.get('creator').properties;
            const isFollowed = record.get('isFollowed');
        
            post.likes = post.likes.toNumber();
            post.liked = true;
            post.creator = creator.username;
            post.isFollowed = isFollowed;
        
            return post;
        });

        const createdResults = await session.run(
            `MATCH (user:User {username: $username})-[:CREATED]->(post:Post)
            return post`,
            {username: username}
        )
        
        const CreatedPosts = createdResults.records.map(r=>{
            p=r.get('post').properties
            p.likes = p.likes.toNumber();
            p.creator = username
            return p
    })

        res.status(200).json({created: CreatedPosts, liked: LikedPosts})


    }catch (error) {
        console.error('Error retrieving liked posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await session.close();
    }
}

module.exports={getCustomerProfile, getInfluencerProfile}