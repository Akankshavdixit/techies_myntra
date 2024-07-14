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
            res.status(200).json({recommendations: {}})
        }
        
        const recommendations = result.records.map(record => ({
            username: record.get('username')
        }));
        res.status(200).json({ recommendations: recommendations});
    } catch (error) {
        console.error('Error retrieving recommendations', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await session.close();
    }
}

module.exports={GetInfluencerRecommendations}