const express=require('express');
const app=express();
const mongoose=require('mongoose');
const morgan = require('morgan');
var cors = require('cors')
const userRouter=require('./route/userRouter')
const studentRouter=require('./route/studentRouter')
const { handleError } = require('./middleware/errorHandling')

/* Env variable  Access*/
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

app.use(express.json({extended:false}))//json parser
app.use(morgan('dev'));//logger middleware
app.use(cors())//crass orgin error handling



app.use('/user',userRouter)
app.use('/student',studentRouter)

app.use((err, req, res, next) => {
    handleError(err, res);
  });

/* Server */
app.listen(port, () => console.log('Example app listening at http://localhost:'+port))

/* Db Connection*/
mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
mongoose.set('useCreateIndex',true);
mongoose.set('useNewUrlParser',true);

mongoose.connect(process.env.DBCONNECTSTR,
    (err)=>{
    if(!err){
        console.log("DB Connected successfully")
    }else{
        console.log("DB  Not Connected")
    }

});