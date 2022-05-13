const router = require('express').Router();
const auth = require('~/src/middleware/check-auth');

// init controller
const {
    customer_add,
    customer_get
} = require('~/src/controllers/customers/customerController');

router.route('/')
    .get(auth,customer_get);

router.route('/add')
    .post(auth,customer_add);




module.exports = router;