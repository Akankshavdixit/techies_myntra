const express = require('express')

const { uploadPost, addLike, removeLike , getPosts} = require('../controllers/postController')
const reqAuth = require('../middlewares/auth-middleware')
const router = express.Router()

router.use(reqAuth);
router.post('/add-like/:postId', addLike)
router.post('/remove-like/:postId', removeLike)
router.get('/all', getPosts)

module.exports = router;