const HttpError = require('../../utility/constant/http-error');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require('../../models/vendors/vendor');
const twofaModal = require('../../models/vendors/2fa');
const { encrypt } = require('../../utility/middleware/crypto');
const { getOneVendor } = require('../../repository/vendor-repo');
const { getOne } = require('../../repository/user-repo');
const user = require('../../models/users/user');
const { sendMail } = require('../../utility/constant/sendMail');


const signup = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(500).json({ message: 'Invalid input enter.please enter valid input.' });
        // return next(new HttpError('Invalid input enter.please enter valid input.'));
    }
    const { firstName, lastName, userName, storeName, address1, address2, city, state, postcode, phoneNumberStore, emailVerify, roleType, shortDescription, email, password, country } = req.body;

    let existingUser;
    try {
        existingUser = await getOne({ email: email });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong.could not find Vendor.' });
        // return next(new HttpError('Something went wrong.could not find Vendor', 500));
    }
    let emailCode;
    try {
        emailCode = await twofaModal.findOne({ email: email, disable: false });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong.could not find Email code.' });
        // return next(new HttpError('Something went wrong.could not find Vendor', 500));
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
        res.status(500).json({ message: 'Something went wrong.could not find Vendor.' });
        // return next(new HttpError('Something went wrong.could not find Vendor', 500));
    }
    if (existingVendor) {
        res.status(401).json({ message: 'Email is already registered.please use diffrent email.' });
        // return next(new HttpError('Email is already registered.please use diffrent email', 401));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        res.status(500).json({ message: 'Could not create Vendor,please try again.' });
        // const error = new HttpError('Could not create Vendor,please try again.', 500);
        // return next(error)
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
        emailVerify: emailVerify === emailCode.code,
        roleType,
        shortDescription,
        email,
        country,
        password: hashedPassword,
        role: "vendor",
    });
    const doc = await twofaModal.findOneAndUpdate(
        { email: email, disable: false }, { disable: true }
    ).catch(function (err) {
        console.log(err);
    });
    await doc.save();
    //console.log(createdVendor);
    let token;
    try {
        await createdVendor.save();
        token = jwt.sign({ email: email, role: "vendor", roleType: roleType },
            process.env.JWT_KEY,
            { expiresIn: '5d' });

    }
    catch (err) {
        res.status(500).json({ message: 'Vendor Creation Failed.plese try again' });
        // return next(new HttpError('Vendor Creation Failed.plese try again', 500));
    }
    res.status(200).json({ message: 'Vendor Created successfully', data: encrypt({ email: email, role: "vendor", roleType: roleType, token: token }) });
};

const twofa = async (req, res, next) => {

    const { email } = req.body;
    let emailCode;
    try {
        emailCode = await twofaModal.findOne({ email: email, disable: false });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong.could not find Email code.' });
        // return next(new HttpError('Something went wrong.could not find Vendor', 500));
    }
    let randomCode = Math.floor(100000 + Math.random() * 900000);
    try {
        if (emailCode) {
            const doc = await twofaModal.findOneAndUpdate(
                { email: email, disable: false }, { code: randomCode }
            ).catch(function (err) {
                console.log(err);
            });
            await doc.save();
        } else {
            const tokenverification = new twofaModal({
                email,
                code: randomCode
            })
            tokenverification.save();
        }
        await sendMail({
            to: email,
            subject: 'Email Verification Code',
            html: `
                    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                        <div style="margin:50px auto;width:70%;padding:20px 0">
                            <div style="border-bottom:1px solid #eee">
                            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Construction</a>
                            </div>
                            <p style="font-size:1.1em">Hi,</p>
                            <p>Thank you for choosing Construction. Use the following OTP to complete your Sign Up procedures.</p>
                            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${randomCode}</h2>
                            <p style="font-size:0.9em;">Regards,<br />Construction</p>
                            <hr style="border:none;border-top:1px solid #eee" />
                            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                            <p>Construction Inc</p>
                            <p>1600 Amphitheatre Parkway</p>
                            <p>California</p>
                            </div>
                        </div>
                    </div>
                `
        });
    } catch (error) {
        res.status(500).json({ message: '2f Authentication Creation Failed.plese try again' });
    }

    res.status(200).json({ message: 'Code Is send on Your Mail.' });
}


exports.signup = signup;
exports.twofa = twofa;