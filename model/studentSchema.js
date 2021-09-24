var mongoose = require('mongoose');

const StudentSchema  = mongoose.Schema({
    name:{
        type:String,
        require:true,
        maxlength: 15 
    },
    age:{
        type:Number,
        require:true

    },
    email:{
        type:String,
        require:true,
        unique: true
    },
    mobile:{
        type:Number,
        require:true
    },
    addresses: [{
        addressline1:{
            type:String,
            require:true
        },
        addressline2:{
            type:String
        },
        city:{
            type:String
        }, 
    state:{
        type:String
    },
pincode:{
    type:Number
}

    }]

})

const Students = mongoose.model('Students', StudentSchema)

module.exports = Students;

