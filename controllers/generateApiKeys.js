const {generateapikey} = require("../services/generateApiKeysService");
const message = require("../common/messages");

module.exports = {

    generateApiKeys: (req ,res) => {

        const body = req.body;

        generateapikey(body, (err,results) => {

            if(err){

                return res.status(500).json({
                    message: err
                });

            }
            else if(results.length<=0){

                return res.status(200).json({
                    NoContractsFound: message.NO_SMART_CONTRACT_FOUND_ERROR_MESSAGE
                });

            }
            else{

                return res.status(200).json({
                    userId: body.userId,
                    KeyInfo: results
                });

            }
            
        }); 
    }
   
}


