
// const neo4j = require('neo4j-driver');

// exports.connectToDB = async()=> {
//   const URI = process.env.URL
//   const USER = 'neo4j'
//   const PASSWORD = process.env.password
//   let driver

//   try {
//     driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
//     const serverInfo = await driver.getServerInfo()
//     console.log('Connection established')
//     console.log(serverInfo)
//   } catch(err) {
//     console.log(`Connection error\n${err}\nCause: ${err.cause}`)
//   }
// };


// exports.runQuery = async (query, params) => {
//   if (!driver) {
//       throw new Error('Database driver is not initialized. Call connectToDB() first.');
//   }

//   const session = driver.session();
//   try {
//       const result = await session.run(query, params);
//       return result.records;
//   } finally {
//       await session.close();
//   }
// };


const neo4j = require('neo4j-driver');

let driver; 

exports.connectToDB = async () => {
    const URI = process.env.URL;
    const USER = 'neo4j';
    const PASSWORD = process.env.password;

    try {
        driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
        const session = driver.session();
        const serverInfo = await driver.getServerInfo();
        console.log('Connection established');
        console.log(serverInfo);
        await session.close();
    } catch (err) {
        console.error('Connection error:', err.message);
        throw err;
    }
};

exports.runQuery = async (query, params) => {
    if (!driver) {
        throw new Error('Database driver is not initialized. Call connectToDB() first.');
    }

    const session = driver.session();
    try {
        const result = await session.run(query, params);
        return result.records.map(record => record.toObject());
    } finally {
        await session.close();
    }
};

exports.closeConnection = () => {
    if (driver) {
        driver.close();
        console.log('Database connection closed');
    }
};

