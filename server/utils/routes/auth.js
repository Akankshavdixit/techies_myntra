const {Router} = require('express')
const router = Router()
const {registerCustomer} = require('../controllers/auth');


router.post('/registerCustomer', registerCustomer);

module.exports = router;