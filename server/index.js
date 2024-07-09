import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'

import { connectToDB } from './utils/database.js'
dotenv.config()
const app=express()
app.use(cors())

app.listen(process.env.PORT,()=>{
    console.log('listening on port -> ', process.env.PORT)
    connectToDB();
})