const router=require('express').Router();
const students=require('../model/studentSchema');
const config=require('../config/config')
const authtoken=require('../middleware/auth')
const {ErrorHandler,statusHandler } = require('../middleware/errorHandling')
//Validate fields
const { check, validationResult } = require('express-validator')

/*@Create the Student
@validate the Field
@check unique Email Address
@save Data to Db
*/

router.post('/create',
[
check('name','Name is requried').not().isEmpty(),
check('age','Please Enter Valid Age').optional().isNumeric(),
check('email','Please give the valid email').isEmail(),
check('mobile','Please Enter valid mobile number').optional().isNumeric(),
check('addresses.*.addressline1',"addressline1 is Required").exists(),
], 
authtoken,async(req,res,next)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            Status:"Error",
          statusCode:400,
          message:"Field validation Error",
          errormsg:error.array()
        })
    }
    try{
        let emailExist= await students.findOne({email:req.body.email});
        
        if(emailExist){
            throw new ErrorHandler(400, 'Student Email Already Exists')
           
        }

        const student=new students({
            name:req.body.name,
            age:req.body.age,
            email:req.body.email,
            mobile:req.body.mobile,
            addresses:req.body.addresses
            
        });
        const saveStudent=await student.save();
        throw new statusHandler(200, 'Student Create successfully',saveStudent);
        next()  

    }catch(err){
      next(err)
    }

});

/*@get All list fromDb
@hangling Nodata
@server Error*/


router.get("/getAll",authtoken,async(req, res, next) => {
    try{
        const data= await students.find();
        if(!data){
            throw new ErrorHandler(404, "Student Data Notfound!");
        }else{
            throw new statusHandler(200, 'success',data);
        }
       next();
    }catch(err){

       next(err)
    }  
            
});

/*@get single list fromDb
@hangling Nodata
@server Error*/

router.get("/:id",authtoken,async(req, res, next) => {
    try{
        const getById= await students.findById(req.params.id);
        if(!getById){
            throw new ErrorHandler(404, "Student Data Notfound!");
        }else{
            throw new statusHandler(200, 'success',getById);
        }
        next()
        
    }catch(err){
        next(err)
    }  
            
});
/*@Update Student Data to Db
@hangling success and Faild Msg
@using Put Method
@server Error*/
router.put("/:id",authtoken,async(req, res, next) => {
    try{
        const updateStudent= await students.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, student) {
                if (err) {
                    return res.status(500).json({
                        Status:"Error",
                      statusCode:500,
                      message:"Server  Error",
                      errormsg: err.message || "Some error occurred while creating the Note."
                    })
                }
                res.status(200).json(
                    {
                        Status:"Success",
                      statusCode:200,
                      message:"Student Update Successfully",
                      
                    })
            });
       // res.status(200).json(getById)
    }catch(err){
        return res.status(500).json({
            Status:"Error",
          statusCode:500,
          message:"Server  Error",
          errormsg: err.message || "Some error occurred while creating the Note."
        })
    }  
            
});

/* Delete The Single data to db
@hangling Error Msg*/

router.delete("/:id",authtoken,async(req, res, next) => {
    try{
        const data= await students.findByIdAndRemove(req.params.id);
        if(!data) {
            throw new ErrorHandler(404, "User not found with id !");   
        }
        throw new statusHandler(200, 'Student Data Deleted SuccessFully',data);
        next()
    }catch(err){
        next(err)
    }  
            
});




module.exports=router;