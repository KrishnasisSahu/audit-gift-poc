function errorHandler (err, req, res, next){

    if(err instanceof TypeError){
        res.status(400).json({message: 'Invalid request data'});
    }
    else if(err instanceof Error && err.message.includes('PollingBlockTracker - encountered an error while attempting to update latest block')){
        res.status(500).json({
            error: "server Error",
            code: err.code,
            message: "An error occured while processing web3 request"
        })
    }
    else if(err.code === -32603 || err.code === 'ERR_UNHANDLED_ERROR' || err.code === 'ESOCKETTIMEDOUT'){
        res.status(500).json({
            error: "server Error",
            code: err.code,
            message: "An error occured while processing user request"
        })
    }
    else{
            err.statusCode = err.statusCode || 500;
            err.message = err.message || "Internal Server Error";
            res.status(err.statusCode).json({
              message: err.message
            });
    }
}

module.exports = errorHandler;