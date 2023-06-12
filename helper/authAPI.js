const {encrypt, decrypt} = require('./AES');

const messages = require('../common/messages');

const pool = require("../databaseConfig");

const verifyApiKey = (req, res, next) => {

    const token = req.body.token || req.query.token || req.params.apikey;
    
    const Apikey = req.params.apikey;
                
    const EnAPI = encrypt(`${Apikey}`);

    console.log(EnAPI)

    const eventId = decrypt(req.body.eventpayload.id);

    if (!token) {
        
        pool.query(`SELECT apiKey FROM api_keys WHERE smartContractId = (SELECT smartContractId FROM event_details WHERE id = ?);`,[eventId], function (err, result){

            if(err){
            
                return res.status(500).send("Internal Server Error: Failed to authenticate API key!");

            }
            else if(result === undefined || result.length === 0){
                    
                return res.status(500).send("NO_API_KEY_FOUND: Please ask admin to create an API Key for the smart contract!");

            }
            else{
        
                return res.status(500).send("Please provide API Key! Need API Key to use this API");

            }

        });
      
    }
    else{

        try {
    
            pool.query(`SELECT apiKey FROM api_keys WHERE smartContractId = (SELECT smartContractId FROM event_details WHERE id = ?);`,[eventId], function (err, result){
    
                console.log(err);
                if(err){
                
                    return res.status(500).send("Internal Server Error: Failed to authenticate API key!");
    
                }
                else{
    
                    if(result[0].apiKey === EnAPI){
    
                        return next();
            
                    }
                    else if(!result[0].apiKey === EnAPI){
                  
                        return res.status(401).send("Invalid API Key");
            
                    }
                    else{
                        
                        return res.status(500).send("Internal Server Error: Failed to authenticate API key!");
            
                    }
    
                }
    
            });
            
        } catch (err) {

          return res.status(401).send(err);

        }

    }

  };
  
  module.exports = verifyApiKey;

