class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
class statusHandler extends Error {
    constructor(statusCode, message, data) {
    super();
    this.status ="success";
    this.statusCode = statusCode;
    this.message = message;
    this.data = data || null
    
    }
    }
    
const handleError = (err, res) => {
    const { statusCode, message,data } = err;
    let statusData="Error" 
    if(statusCode==200){
        statusData="Success"   
    }

    res.status(statusCode).json({
      status:statusData,
      statusCode,
      message,
      data
    });
  };
  
    
module.exports = {
  ErrorHandler,
  handleError,
  statusHandler
}