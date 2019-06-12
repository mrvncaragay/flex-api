const { validateObjectId, isBodyValid } = require('../middleware/customer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();

const customer = require('../controller/customers')

router.get('/', customer.index);
router.get('/:id', validateObjectId, customer.getCustomer);
router.post('/', auth.isTokenValid, isBodyValid, customer.postCustomer);
router.put('/:id', auth.isTokenValid, [ validateObjectId,  isBodyValid ], customer.updateCustomer);
router.delete('/:id', auth.isTokenValid, admin.isAdmin, validateObjectId, customer.removeCustomer);

module.exports = router;