const User = require('../models/users/user');

const getOne = async (condition) => {
        return await User.findOne(condition);
}

const getAll = async () => {
        return await User.find({},'-password');
}

const deleteOne = async (condition) => {
    return await User.deleteOne(condition);
}

exports.getOne = getOne;
exports.getAll = getAll;
exports.deleteOne = deleteOne;