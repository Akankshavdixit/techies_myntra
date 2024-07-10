const express = require('express')

const { uploadPost, addLike, removeLike , getPosts, followInfluencer, unfollowInfluencer} = require('../controllers/PostController')
const reqAuth = require('../middlewares/auth-middleware')
const router = express.Router()

router.use(reqAuth);
router.post('/add-like/:postId', addLike)
router.post('/remove-like/:postId', removeLike)
router.get('/all', getPosts)
router.post('/follow/:postId', followInfluencer);
router.post('/unfollow/:postId', unfollowInfluencer);

module.exports = router;