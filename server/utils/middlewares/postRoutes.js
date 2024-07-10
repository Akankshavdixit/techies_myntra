
const express = require('express')
const router = express.Router()


router.post('/upload', upload.array('images', 10), async (req, res) => {
    try {
      // Validate request body
      if (!req.files || !req.body.description) {
        return res.status(400).send({ message: 'No files or description provided' });
      }
  
      // Limit number of uploaded files
      if (req.files.length > 10) {
        return res.status(400).send({ message: 'You can upload a maximum of 10 images.' });
      }
  
      // Upload images to Google Cloud Storage
      const uploadPromises = req.files.map(file => {
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype
          }
        });
  
        return new Promise((resolve, reject) => {
          blobStream.on('error', (err) => {
            console.error(`Failed to upload image ${file.originalname}: ${err}`);
            reject(`Failed to upload image ${file.originalname}: ${err}`);
          });
  
          blobStream.on('finish', async () => {
            try {
              await blob.makePublic(); // Make uploaded image publicly accessible
              const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
              resolve(publicUrl);
            } catch (error) {
              console.error(`Failed to make image public ${file.originalname}: ${error}`);
              reject(`Failed to make image public ${file.originalname}: ${error}`);
            }
          });
  
          blobStream.end(file.buffer); // Write file buffer to GCS
        });
      });
  
      // Wait for all uploads to complete
      const publicUrls = await Promise.all(uploadPromises);
  
      // Create post in Neo4j database
      const driver = getDriver();
      const session = driver.session();
      const description = req.body.description;
      const productLinks = JSON.parse(req.body.productLinks || '[]'); // Parse JSON product links
  
      const result = await session.run(
        'CREATE (p:Post {imageUrls: $imageUrls, likes: 0, description: $description, productLinks: $productLinks}) RETURN p',
        { imageUrls: publicUrls, description: description, productLinks: productLinks }
      );
  
      session.close();
  
      // Prepare response data
      const post = {
          id: result.records[0].get('p').properties.id, // Assuming 'id' is the identifier property of your Post node
          imageUrls: result.records[0].get('p').properties.imageUrls,
          likes: result.records[0].get('p').properties.likes,
          description: result.records[0].get('p').properties.description,
          productLinks: result.records[0].get('p').properties.productLinks
      };
        
  
      // Send success response
      res.status(200).send({ message: 'Images uploaded and post created successfully', urls: publicUrls, post: post });
    } catch (error) {
      console.error('Failed to upload images and create post:', error);
      res.status(500).send({ message: 'Failed to upload images and create post', error });
    }
  });
  
router.post('/add-like/:postId', async (req, res) => {
      const { postId } = req.params;
    
      try {
        const driver = getDriver();
        const session = driver.session();
    
        // Cypher query to increment likes for the Post node
        const result = await session.run(
          'MATCH (p:Post) WHERE id(p) = $postId SET p.likes = p.likes + 1 RETURN p.likes as likes',
          { postId: parseInt(postId) } // Convert postId to integer if it's a string
        );
    
        session.close();
    
        if (result.records.length === 0) {
          return res.status(404).send({ message: 'Post not found' });
        }
    
        const likes = result.records[0].get('likes').toNumber();
        res.status(200).send({ message: 'Post liked successfully', likes: likes });
      } catch (error) {
        console.error('Failed to like post:', error);
        res.status(500).send({ message: 'Failed to like post', error });
      }
    });
  
    app.post('/remove-like/:postId', async (req, res) => {
      const { postId } = req.params;
    
      try {
        const driver = getDriver();
        const session = driver.session();
    
        // Cypher query to increment likes for the Post node
        const result = await session.run(
          'MATCH (p:Post) WHERE id(p) = $postId SET p.likes = p.likes - 1 RETURN p.likes as likes',
          { postId: parseInt(postId) } // Convert postId to integer if it's a string
        );
    
        session.close();
    
        if (result.records.length === 0) {
          return res.status(404).send({ message: 'Post not found' });
        }
    
        const likes = result.records[0].get('likes').toNumber();
        res.status(200).send({ message: 'Post like removed successfully', likes: likes });
      } catch (error) {
        console.error('Failed to like post:', error);
        res.status(500).send({ message: 'Failed to remove post', error });
      }
    });
  
router.get('/all', async(req,res)=>{
      const driver = getDriver();
      const session = driver.session();
      try {
          const result = await session.run('MATCH (p:Post) RETURN p');
          const posts = result.records.map(record => {
            const post = record.get('p').properties;
            // Convert Neo4j integers to JavaScript numbers
            post.likes = post.likes.toNumber();
            return post;
          });
      
          res.status(200).send(posts);
      }catch(error){
          console.log("Error fetching posts: ", error);
          res.status(500).json({message: 'Failed to fetch posts: ', error})
      }finally{
          await session.close()
      }
  });

module.exports = router
  