const router=require('express').Router();
const users=require('../model/userSchema');
const config=require('../config/config')
const authtoken=require('../middleware/auth')
const {ErrorHandler,statusHandler } = require('../middleware/errorHandling')
//Validate fields
const { check, validationResult } = require('express-validator')
/* password bycrypt*/
const bycrypt=require('bcryptjs')
const jwt = require("jsonwebtoken");

/*Register Post method */
router.post('/register',
[
    //Validation for empty and valid email check
    check('name','Name is requried').not().isEmpty(),
    check('email','Please give the valid email').isEmail(),
    check('password','please Enter a password with 6 or more characters').isLength({min:6})
],
async(req,res,next)=>{
    const error=validationResult(req);
    /* show validation error Msg*/
    if(!error.isEmpty()){
       
        return res.status(400).json({
            Status:"Error",
          statusCode:400,
          message:"Field validation Error",
          errormsg:error.array()
        })
    }
    
    try{
        /* Check Existing email id*/
        let emailExist= await users.findOne({email:req.body.email});
        
        if(emailExist){
            throw new ErrorHandler(400, 'Email Already Exists')
           
        }
       /* bycrypt  password */
        const salt=await bycrypt.genSalt(10);
        const hsahdata=await bycrypt.hash(req.body.password,salt);
        user=new users({
            name:req.body.name,
            email:req.body.email,
            password:hsahdata
        });
        
        
const userData=await user.save()
throw new statusHandler(200, 'User register successfully');
//throw new statusHandler(200, 'User register successfully',userData);
next()


    }catch(err){
    next(err);
    }
   

});



router.post('/login', 
[
    
    check('email','Please give the valid email').isEmail(),
    check('password','please Enter a password').exists()
],
async(req, res,next) => {
    const error=validationResult(req);
    /* show validation error Msg*/
    if(!error.isEmpty()){
        return res.status(400).json({
            Status:"Error",
          statusCode:400,
          message:"Field validation Error",
          errormsg:error.array()
        })
       
    }
      try{
        let userdata= await users.findOne({email:req.body.email});
        if(!userdata){
            throw new ErrorHandler(400, 'User Email not Exists')
           
        }
        let ispass= await bycrypt.compare(req.body.password,userdata.password);
        if(!ispass){
            throw new ErrorHandler(400, 'USer PAssword Not Exists')
           
        }
        //console.log()
        const accessToken = jwt.sign({ email: userdata.email },config );
        throw new statusHandler(200, 'Success',{accessToken:accessToken});
       
        next();

      }catch(err){
         
        next(err)
      }
        
});

router.get("/getAll",authtoken,async(req, res, next) => {
    try{
        const data= await users.find().select('-password');
        if (!data)
        throw new ErrorHandler(404, "No user are found!");

        throw new statusHandler(200, 'success',data);
       // res.status(200).json(data)
        next()
    }catch(err){
       next(err)
    }  
            
});

router.get("/:id",authtoken,async(req, res, next) => {
    try{
        const getById= await users.findById(req.params.id).select('-password');
        if (!getById)
        throw new ErrorHandler(404, "No user are found!");
        
        throw new statusHandler(200, 'success',getById);
       
        next()
    }catch(err){
        next(err)
    }  
            
});

router.put("/:id",authtoken,async(req, res, next) => {
    try{
        const update= await users.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, user) {
                if (err) {

                 return res.status(500).json({
                    Status:"Error",
                  statusCode:500,
                  message:"Server  Error",
                  errormsg: err.message || "Some error occurred while creating the Note."
                });
            }
                res.status(200).json(
                    {
                        Status:"Success",
                      statusCode:200,
                      message:"User Update Successfully",
                      
                    })
               // res.send('User Update Successfully');
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

/* @ Delete User Data
@success and faild msg display*/

router.delete("/:id",authtoken,async(req, res, next) => {
    try{
        const data= await users.findByIdAndRemove(req.params.id);
        if(!data) {
            throw new ErrorHandler(404, "User not found with id !");   
        }
        throw new statusHandler(200, 'User Data Deleted SuccessFully')
       // throw new statusHandler(200, 'User Data Deleted SuccessFully',data)
    }catch(err){
       next(err)
    }  
            
});

module.exports=router;