const {runQuery} = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {SECRET} = require('../constants/index');
const {hash} = require('bcryptjs');


exports.registerCustomer = async (req, res) => {
    const { username, password, bio, age } = req.body;
    console.log('Received registration request:', req.body);
    try {
        const hashedPassword = await hash(password, 10);

        
        const existingUserQuery = 'MATCH (u:User {username: $username}) RETURN u';
        const existingUserParams = { username };
        const existingUsers = await runQuery(existingUserQuery, existingUserParams);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        
        const createUserQuery = `
            CREATE (u:User {
                username : $username,
                password : $password,
                bio : $bio,
                age : $age,
                role : 'customer',
                following : 0
            })
            RETURN u
        `;
        const createUserParams = { username, password: hashedPassword, bio, age };

        const result = await runQuery(createUserQuery, createUserParams);
        console.log('Created user:', result);

        if (result.length === 0) {
            throw new Error('Failed to create user');
        }

        const newUser = result[0].u.properties;
        const token = jwt.sign({ username: newUser.username }, process.env.SECRET, { expiresIn: '3d' });
        console.log(newUser);
        res.status(201).json({
            message: 'Customer registered successfully',
            user: {
                username: newUser.username,
                bio: newUser.bio,
                age: newUser.age,
                role: newUser.role,
                following: newUser.following,
                token:token
            }
        });
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({ message: 'Failure to register customer' });
    }
};


exports.loginCustomer = async (req, res) => {
    const { username, password } = req.body;

    try {
        
        const findUserQuery = 'MATCH (u:User {username: $username}) RETURN u';
        const findUserParams = { username };

        const result = await runQuery(findUserQuery, findUserParams);

        
        if (result.length === 0 || !result[0].u) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result[0].u.properties;
        const hashedPassword = user.password;

        
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        
        req.session.user = {
            username: user.username,
            bio: user.bio,
            age: user.age,
            role: user.role,
            following: user.following
        };

        
        const token = jwt.sign({ username: user.username }, SECRET, { expiresIn: '3d' });

        
        res.status(200).json({
            message: 'Login successful',
            user: {
                username: user.username,
                bio: user.bio,
                age: user.age,
                role: user.role,
                following: user.following,
                token: token
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Failed to login' });
    }
};


exports.registerInfluencer = async (req, res) => {
    const { username, password, bio, age } = req.body;
    console.log('Received registration request:', req.body);
    try {
        const hashedPassword = await hash(password, 10);

        
        const existingUserQuery = 'MATCH (u:User {username: $username}) RETURN u';
        const existingUserParams = { username };
        const existingUsers = await runQuery(existingUserQuery, existingUserParams);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        
        const createUserQuery = `
            CREATE (u:User {
                username : $username,
                password : $password,
                bio : $bio,
                age : $age,
                role : 'influencer',
                followers : 0
            })
            RETURN u
        `;
        const createUserParams = { username, password: hashedPassword, bio, age };

        const result = await runQuery(createUserQuery, createUserParams);
        console.log('Created user:', result);

        if (result.length === 0) {
            throw new Error('Failed to create user');
        }

        const newUser = result[0].u.properties;
        const token = jwt.sign({ username: newUser.username }, process.env.SECRET, { expiresIn: '3d' });
        console.log(newUser);
        res.status(201).json({
            message: 'Influencer registered successfully',
            user: {
                username: newUser.username,
                bio: newUser.bio,
                age: newUser.age,
                role: newUser.role,
                followers: newUser.followers,
                token:token
            }
        });
    } catch (error) {
        console.error('Error registering Influencer:', error);
        res.status(500).json({ message: 'Failure to register Influencer' });
    }
};


exports.loginInfluencer = async (req, res) => {
    const { username, password } = req.body;

    try {
        
        const findUserQuery = 'MATCH (u:User {username: $username}) RETURN u';
        const findUserParams = { username };

        const result = await runQuery(findUserQuery, findUserParams);

        
        if (result.length === 0 || !result[0].u) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result[0].u.properties;
        const hashedPassword = user.password;

        
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        
        const token = jwt.sign({ username: user.username }, SECRET, { expiresIn: '3d' });

        
        res.status(200).json({
            message: 'Login successful',
            user: {
                username: user.username,
                bio: user.bio,
                age: user.age,
                role: user.role,
                followers: user.followers,
                token: token
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Failed to login' });
    }
};


