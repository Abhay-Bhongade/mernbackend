const HttpError = require('../../utility/constant/http-error');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require('../../models/vendors/vendor');
const { encrypt } = require('../../utility/middleware/crypto');
const { getOneVendor } = require('../../repository/vendor-repo');
const { getOne } = require('../../repository/user-repo');
const user = require('../../models/users/user');


const signup = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new HttpError('Invalid input enter.please enter valid input.'));
    }
    const { firstName, lastName, userName, storeName, address1, address2, city, state, postcode, phoneNumberStore, emailVerify, roleType, shortDescription, email, password, country } = req.body;

    let existingUser;
    try {
        existingUser = await getOne({ email: email });
    }
    catch (err) {
        return next(new HttpError('Something went wrong.could not find Vendor', 500));
    }
    if (existingUser) {
        const doc = await user.findOneAndUpdate(
            { email: email },
            {
                disable: true,
            }
        ).catch(function (err) {
            console.log(err);
        });
        await doc?.save();
    }
    let existingVendor;
    try {
        existingVendor = await getOneVendor({ email: email });
    }
    catch (err) {
        return next(new HttpError('Something went wrong.could not find Vendor', 500));
    }
    if (existingVendor) {
        return next(new HttpError('Email is already registered.please use diffrent email', 401));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('Could not create Vendor,please try again.', 500);
        return next(error)
    }


    const createdVendor = new Vendor({
        firstName,
        lastName,
        userName,
        storeName,
        address1,
        address2,
        city,
        state,
        postcode,
        phoneNumberStore,
        emailVerify,
        roleType,
        shortDescription,
        email,
        country,
        password: hashedPassword,
        role: "vendor",
    });
    //console.log(createdVendor);
    let token;
    try {
        await createdVendor.save();
        token = jwt.sign({ email: email, role: "vendor", roleType: roleType },
            process.env.JWT_KEY,
            { expiresIn: '5d' });

    }
    catch (err) {
        return next(new HttpError('Vendor Creation Failed.plese try again', 500));
    }
    res.status(201).json({ message: 'Vendor Created successfully', data: encrypt({ email: email, role: "vendor", roleType: roleType, token: token }) });
};


exports.signup = signup;