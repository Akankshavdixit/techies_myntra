const { getDriver } = require('../db/database')

const getCustomerProfile=async(req,res)=>{
    const username = req.user.username;
    const driver = getDriver()
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (user:User {username: $username})-[:LIKES]->(post:Post)<-[:CREATED]-(creator:User)
            OPTIONAL MATCH (user)-[f:FOLLOWS]->(creator)
            RETURN post, user, creator, f IS NOT NULL AS isFollowed`,
            { username: username }
        );
        if (result.records.length === 0) {
            return res.status(200).json({ liked: [], following: 0 });
        }
        
        const posts = result.records.map(record => {
            const isFollowed = record.get('isFollowed');
            const post = record.get('post').properties;
            const creator = record.get('creator').properties;
        
            post.likes = post.likes.toNumber();
            post.liked = true;
            post.isFollowed = isFollowed;
            post.creator = creator.username; // Assuming you want to display the username of the creator
        
            return post;
        });
        res.status(200).json({ liked: posts , following: result.records[0].get('user').properties.following.toNumber()});
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
            OPTIONAL MATCH (user)-[f:FOLLOWS]->(creator)
            RETURN post, creator, f IS NOT NULL AS isFollowed`,
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
            return post, user`,
            {username: username}
        )
        let person;

        if (createdResults.records.length==0){
             r = await session.run(
                `MATCH (user:User {username: $username})
                RETURN user`,
                {username: username}
             )
             person=r.records[0].get('user').properties
        }
        
        const CreatedPosts = createdResults.records.map(r=>{
            const p=r.get('post').properties
            p.likes = p.likes.toNumber();
            p.creator = username
            return p
    })  
        const followingResult = await session.run(
            `MATCH (:User {username: $username})-[:FOLLOWS]->(following)
            RETURN COUNT(following) AS numberOfFollowing`,
            {username: username}
        )
        console.log(createdResults.records)
        console.log(person)

        res.status(200).json({created: CreatedPosts, 
            liked: LikedPosts, 
            numberofFollowing: followingResult.records.length>0?followingResult.records[0].get('numberOfFollowing').toNumber():0, 
            person: createdResults.records.length>0? createdResults.records[0].get('user').properties:person})


    }catch (error) {
        console.error('Error retrieving liked posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await session.close();
    }
}

const getInfluencerAccount=async(req,res)=>{
    const {iname}=req.params
    const username = req.user.username;
    const driver = getDriver()
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (i:User {username: $influencer_username})-[:CREATED]->(p:Post)
            OPTIONAL MATCH (u:User {username: $username})
            OPTIONAL MATCH (u)-[l:LIKES]->(p)
            OPTIONAL MATCH (u)-[f:FOLLOWS]->(i)
            RETURN p, i,
              l IS NOT NULL AS liked,
              f IS NOT NULL AS isFollowed`,
            { influencer_username:iname , username: username}
        );
        
        const posts = result.records.map(record => {
            const isFollowed = record.get('isFollowed');
            const post = record.get('p').properties;
            post.creator = iname;
            post.likes = post.likes.toNumber();
            post.liked = record.get('liked')
            post.isFollowed = isFollowed;
            return post;
        });
        const influencer = result.records[0].get('i').properties
        const follows = result.records[0].get('isFollowed')
        res.status(200).json({ posts: posts, follows: follows, influencer: influencer});
    } catch (error) {
        console.error('Error retrieving liked posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await session.close();
    }
}

module.exports={getCustomerProfile, getInfluencerProfile, getInfluencerAccount}