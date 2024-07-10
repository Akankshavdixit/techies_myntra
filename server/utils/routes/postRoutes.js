const express = require('express')

const { uploadPost, addLike, removeLike , getPosts} = require('../controllers/postController')
const router = express.Router()


router.post('/addLike/:postId', addLike)
router.post('removeLike/:postId', removeLike)
router.get('/all', getPosts)

module.exports = router;