var CryptoJS = require('crypto-js');
var dotenv = require('dotenv');
dotenv.config();

// Encrypt
const encrypt = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), process.env.CRYPTO_KEY).toString();
}

// Decrypt
const decrypt = (req, res, next, cb = null) => {
    var bytes = CryptoJS.AES.decrypt(req.body.data, process.env.CRYPTO_KEY);
    if (cb) {
        cb(JSON.parse(bytes.toString(CryptoJS.enc.Utf8)));
    }
    req.body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    next();
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;