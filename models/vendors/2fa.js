const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const twofaSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },    
    code:{
        type:Number,
        required:true,
    },
    disable:{
        type:Boolean,
        default: false
    }    
},{
    timestamps: true
});

twofaSchema.plugin(uniqueValidator);

module.exports = mongoose.model('twofas',twofaSchema);