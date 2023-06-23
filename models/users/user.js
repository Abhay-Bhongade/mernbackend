const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
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
    country:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minlength:6
    },
    role:{
        type:String,
        required:true,
    },    
    provider:{
        type:String,
        default: "Manual"
    },    
    disable:{
        type:Boolean,
        default: false
    }    
},{
    timestamps: true
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User',userSchema);