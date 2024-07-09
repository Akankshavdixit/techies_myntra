
const{config} = require('dotenv');
config();
const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./utils/routes/auth.js')








const {connectToDB} = require('./utils/db/database.js');
const {registerCustomer, loginCustomer} = require('./utils/controllers/auth.js');

const app=express()

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))




app.use('/api/user', authRoutes);
app.post('/register/customer', registerCustomer);
app.post('/login/customer', loginCustomer);

app.listen(process.env.PORT,()=>{
    console.log('listening on port -> ', process.env.PORT)
    connectToDB();
})