
const{config} = require('dotenv');
config();
const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./utils/routes/auth.js')
const {connectToDB} = require('./utils/db/database.js');
const {registerCustomer, loginCustomer, registerInfluencer, loginInfluencer} = require('./utils/controllers/auth.js');

const app=express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());

app.use(bodyParser.json());
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))







app.post('/register/customer', registerCustomer);
app.use('/api/user', authRoutes);
app.post('/login/customer', loginCustomer);
app.post('/register/influencer', registerInfluencer);
app.post('/login/influencer', loginInfluencer);

app.listen(process.env.PORT,()=>{
    console.log('listening on port -> ', process.env.PORT)
    connectToDB();
})








