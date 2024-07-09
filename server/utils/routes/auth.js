const express = require('express')
const router = express.Router()
const {registerCustomer} = require('../controllers/auth');

router.get('/me', (req,res) => {
    if(!req.session.user){
        return res.status(401).json({message:'Not authenticated'});
    }

    res.status(200).json(req.session.user);

});
router.post('/registerCustomer', registerCustomer);

module.exports = router;