const { errorHandler } = require('~/services/abersoft-core');
const Customer = require('../../databases/models/customerModel');
const moment = require("moment");


exports.customer_add = async (req, res) => {

    //console.log(req.body);
    var obj = req.body;
    var company = obj.company;
    var projectManagers = obj.projectManagers;
    var workers = obj.workers;
    var isActive= obj.isActive;
    // store to collection 

    const newCustomer = new Customer({
        company: company,
        projectManagers: projectManagers,
        workers: workers,
        isActive:isActive
    });

    await newCustomer.save();

    var response = req.body;
    res.json({ success: 1, data:  'Customer Data Add'  });
}

// get customers
exports.customer_get = async (req, res) => {
    Customer.find({}, function(err, customs) {
        res.json({
            success: 1,
            data: customs
        });
    })
}