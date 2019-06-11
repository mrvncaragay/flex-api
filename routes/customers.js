const validator = require('../middleware/customer');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

const customer = require('../controller/customers')

router.get('/', customer.index);
router.get('/:id', validator.validateObjectId, customer.getCustomer);
router.post('/', auth.isTokenValid, validator.isBodyValid, customer.postCustomer);
router.put('/:id', auth.isTokenValid, validator.isBodyValid, customer.updateCustomer);
router.delete('/:id', auth.isTokenValid, customer.removeCustomer);

module.exports = router;