require('dotenv').config()


const jwt =require("jsonwebtoken")
const { runQuery } = require('../db/database')

const reqAuth=async (req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
        return res.status(401).json({error:"Authorization token required"})
    }
    
    const token=authorization.split(' ')[1]
    console.log(token)
    try{
        const {username}=jwt.verify(token,process.env.SECRET)
        const existingUserQuery = 'MATCH (u:User {username: $username}) RETURN u';
        const existingUserParams = { username };
        const result = await runQuery(existingUserQuery, existingUserParams);
        const user = result[0].u.properties; 
        req.user = {
            username:user.username,
            bio:user.bio,
            age:user.age,
            role:user.role,
            following:user.following
        }
        console.log("Authenticated")
        next()
    }
    catch(error){
        console.log(error)
        res.status(401).json({error:"Request not authorized"})
    }
}

module.exports=reqAuth