const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const vendorSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
    },
    storeName:{
        type:String,
        required:true,
    },
    address1:{
        type:String,
        required:true,
    },
    address2:{
        type:String,
    },
    city:{
        type:String,
    },
    state:{
        type:String,
    },
    country:{
        type:String,
        required:true,
    },
    postcode:{
        type:Number,
        required:true,
    },
    phoneNumberStore:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    emailVerify:{
        type:Boolean,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    role:{
        type:String,
        required:true,
    },    
    roleType:{
        type:String,
        required:true,
    },    
    shortDescription:{
        type:String,
        required:true,
    },    
    disable:{
        type:Boolean,
        default: false
    }    
},{
    timestamps: true
});

vendorSchema.plugin(uniqueValidator);

module.exports = mongoose.model('vendors',vendorSchema);