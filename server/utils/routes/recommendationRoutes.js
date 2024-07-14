const express = require('express')
const reqAuth = require('../middlewares/auth-middleware');
const { GetInfluencerRecommendations } = require('../controllers/recommendationController');
const router = express.Router()



router.use(reqAuth);

router.get('/influencers', GetInfluencerRecommendations)

module.exports=router