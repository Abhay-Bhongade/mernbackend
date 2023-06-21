const Vendor = require('../models/vendors/vendor');

const getOneVendor = async (condition) => {
        return await Vendor.findOne(condition);
}

const getAllVendor = async () => {
        return await Vendor.find({},'-password');
}

const deleteOneVendor = async (condition) => {
    return await Vendor.deleteOne(condition);
}

exports.getOneVendor = getOneVendor;
exports.getAllVendor = getAllVendor;
exports.deleteOneVendor = deleteOneVendor;