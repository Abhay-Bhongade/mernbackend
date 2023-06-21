const express = require('express');
const usersRoutes = require('./users-routes');
const { encrypt, decrypt } = require('../utility/middleware/crypto');
const vendorsRoutes = require('./vendors-routes');

const router = express.Router();

router.use('/users',usersRoutes);
router.post('/encrypt',(req,res,next) => {
    res.status(200).json({ data: encrypt(req.body.data) });
})
router.post('/decrypt',(req,res,next) => {
    decrypt(req,res,next,(result) => {
        res.status(200).json({ ...result });
    })
})
router.use('/vendors',vendorsRoutes);

module.exports = router;