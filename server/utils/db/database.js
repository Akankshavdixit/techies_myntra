import neo4j from 'neo4j-driver';

const connectToDB=async()=> {
  const URI = process.env.URL
  const USER = 'neo4j'
  const PASSWORD = process.env.password
  let driver

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
    const serverInfo = await driver.getServerInfo()
    console.log('Connection established')
    console.log(serverInfo)
  } catch(err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
  }
};


const runQuery = async (query, params) => {
  if (!driver) {
      throw new Error('Database driver is not initialized. Call connectToDB() first.');
  }

  const session = driver.session();
  try {
      const result = await session.run(query, params);
      return result.records;
  } finally {
      await session.close();
  }
};

module.exports = {
  connectToDB,
  runQuery,
};