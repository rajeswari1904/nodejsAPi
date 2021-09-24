var mongoose = require('mongoose');

const UserSchema  = mongoose.Schema({
    name:{
        type:String,
        require:true,
        maxlength: 15 
    },
    email:{
        type:String,
        require:true,
        unique: true
    },
    password:{
        type:String,
        require:true
    }

})

const Users = mongoose.model('Users', UserSchema)

module.exports = Users;

