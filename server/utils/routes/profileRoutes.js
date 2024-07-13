const express = require('express')
const reqAuth = require('../middlewares/auth-middleware');
const { getCustomerProfile, getInfluencerProfile, getInfluencerAccount } = require('../controllers/profileController');
const router = express.Router()


router.use(reqAuth);

router.get('/cprofile',getCustomerProfile)

router.get('/iprofile',getInfluencerProfile)

router.get('/iaccount/:iname', getInfluencerAccount)


module.exports = router
