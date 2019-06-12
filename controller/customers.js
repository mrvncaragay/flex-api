const Customer = require('../model/customer');

exports.index = async (req, res) => {

    const result = await Customer.find().sort('name');

    if ( !result.length ) return res.send('No customers.');

    res.send(result);
};

exports.postCustomer =  async (req, res) => {

    let customer = new Customer({ 

        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone 
    });

    await customer.save();

    res.send(customer);
};

exports.updateCustomer= async (req, res) => {

    const customer = await Customer.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone

    }, { 
        new: true 
    });

    if( !customer ) return res.status(404).send('The customer with the given ID was not found.');
    
    res.send(customer);
};

exports.removeCustomer = async (req, res) => {

    const customer = await Customer.findByIdAndRemove(req.params.id)

    if( !customer ) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
};

exports.getCustomer = async (req, res) => {


    const customer = await Customer.findById(req.params.id)

    if( !customer ) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
}