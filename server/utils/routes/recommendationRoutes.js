const express = require('express')
const reqAuth = require('../middlewares/auth-middleware');
const { GetInfluencerRecommendations, getPostRecommendations } = require('../controllers/recommendationController');
const router = express.Router()



router.use(reqAuth);

router.get('/influencers', GetInfluencerRecommendations)
router.get('/posts', getPostRecommendations)
module.exports=router