
const{config} = require('dotenv');
config();



const express = require('express')
const cors = require('cors')



const {connectToDB} = require('./utils/db/database.js');
const {registerCustomer, loginCustomer} = require('./utils/controllers/auth.js');






const app=express()
app.use(cors())
app.use(express.json());

app.post('/register/customer', registerCustomer);
app.post('/login/customer', loginCustomer);

app.listen(process.env.PORT,()=>{
    console.log('listening on port -> ', process.env.PORT)
    connectToDB();
})