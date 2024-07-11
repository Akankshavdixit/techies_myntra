const express = require('express')

const { uploadPost, addLike, removeLike , getPosts, follow, unfollow} = require('../controllers/PostController')
const reqAuth = require('../middlewares/auth-middleware')
const router = express.Router()
const multer = require('multer')
const { bucket } = require('../db/FirebaseAdmin');
const { getDriver } = require('../db/database')

const upload = multer({
    storage: multer.memoryStorage() // Store uploads in memory before sending to GCS
  });
router.use(reqAuth);


  

router.post('/add-like/:postId', addLike)
router.post('/remove-like/:postId', removeLike)
router.get('/all', getPosts)
router.post('/upload', upload.array('images', 10), async(req,res)=>{
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
        const tags = req.body.tags
        console.log(tags)
        const productLinks = JSON.parse(req.body.productLinks || '[]'); // Parse JSON product links
        const createdAt = new Date().toISOString();
        const result = await session.run(
            `MATCH (u:User {username: $username})
            CREATE (p:Post {
                            id: apoc.create.uuid(),
                            imageUrls: $imageUrls, 
                            likes: 0, 
                            createdAt: $createdAt,
                            description: $description, 
                            tags: $tags,
                            productLinks: $productLinks})
            CREATE (u)-[:CREATED]->(p)
            RETURN p`,
            { username: req.user.username, imageUrls: publicUrls, description: description, createdAt: createdAt, tags: tags,  productLinks: productLinks}
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

router.post('/follow/:influencerUsername', follow);
router.post('/unfollow/:influencerUsername', unfollow);

module.exports = router;