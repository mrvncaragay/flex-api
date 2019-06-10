const validator = require('../middleware/customer');
const express = require('express');
const router = express.Router();

const customer = require('../controller/customers')

router.get('/', customer.index);
router.get('/:id', customer.getCustomer);
router.post('/', validator.isBodyValid, customer.postCustomer);
router.put('/:id', validator.isBodyValid, customer.updateCustomer);
router.delete('/:id', customer.removeCustomer);

module.exports = router;