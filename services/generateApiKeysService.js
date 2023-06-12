const pool = require("../databaseConfig");

const {encrypt,decrypt} = require("../helper/AES");

const crypto = require("crypto");
const message = require("../common/messages");

// const {v4: uuidv4} = require('uuid');

module.exports = {

    generateapikey: (data, callBack) => {

        let userId = Number(decrypt(data.userId)); 
        console.log(userId);

        let smartContractId = Number(decrypt(data.smartContractId));
        console.log(smartContractId);
        let email = data.email;

        // pool.query(`SELECT COUNT(*) FROM smart_contracts WHERE id = ?;`,[smartContractId],function(err, result){

        //     console.log(result)

        //     if(result[0]['COUNT(*)'] > 0){

                pool.query(`SELECT COUNT(*) FROM api_keys WHERE smartContractId = ?;`,[smartContractId],function(err, result1){
        
                    // console.log(result1[0]['COUNT(*)'] === 0)
        
                    if(result1[0]['COUNT(*)'] === 0){
        
                        // pool.query(`SELECT COUNT(*) FROM users WHERE id = ?`,[userId], function(err, results){
        
                            // console.log(results)
        
                            // if(!(results[0]['COUNT(*)'] === 0)){
                                        
                                // if((!((userId <=0 )||(userId === undefined))) && (!((email === undefined)||(email === '')||(email === ' ')))){
                        
                                    // Using Crypto module to generate random bytes and convert into string
                                    // (crypto.randomBytes(4).toString('hex'))+'-'+(crypto.randomBytes(2).toString('hex'))+'-'+(crypto.randomBytes(2).toString('hex'))+'-'+(crypto.randomBytes(2).toString('hex'))+'-'+(crypto.randomBytes(6).toString('hex'))
        
                                    // const apiKey =  uuidv4(); // Same as crypto.randomUUID()
                                    const Original_ApiKey = crypto.randomUUID();
        
                                    let Encrypted_ApiKey = encrypt(Original_ApiKey);
        
                                    // console.log(userId, smartContractId, email, Original_ApiKey)
                                    
                                    let sql = `INSERT INTO api_keys(usersId, smartContractId, emailId, apiKey) VALUES (?, ?, ?, ?)`;
                
                                    pool.query(sql,[userId, smartContractId, email, Encrypted_ApiKey],function (err, results1){

                                        console.log(results1);
                
                                        return callBack(null,[{"Success": `API Key for User `,
                                                               "APIKEY": Original_ApiKey}]);
                
                                    });
                        
                                // }
                                // else if((((userId <=0 )||(userId === undefined))) || (((email === undefined)||(email === '')||(email === ' ')))){
                        
                                //     return callBack('email / userId invalid (Id Cannot be 0 or -ve and email cannot be empty)',[]);
                        
                                // }
                                // else{
        
                                //     return callBack('something went wrong :(',[]);
        
                                // }
                            // }
                            // else if(results[0]['COUNT(*)'] === 0){
        
                            //     return callBack('Invalid UserID / EMAILID',[]);
        
                            // }
                            // else{
        
                            //     return callBack('Something went wrong while generating API key for userID: ${userId} / Email: ${email}\nPlease try again later :(');
                
                            // }
                        // })
        
                    }
                    // If User already have API key
                    else if(result1[0]['COUNT(*)'] > 0){
        
                        return callBack(message.API_KEY_EXISTS_ERROR_MESSAGE);
        
                    }
                    else{
        
                        return callBack(message.GENERATE_API_KEY_FAILURE_MESSAGE);
        
                    }
                    
                });

            // }
            // else if(result[0]['COUNT(*)'] === 0){

            //     return callBack(`Invalid User: User with userID: ${userId} / smartContract: ${smartContractId} doesn't exists`,[]);

            // }
            // else{

            //     return callBack(`Something went wrong while generating API key for userID: ${userId} / smartContract: ${smartContractId}\nPlease try again later :(`);

            // }

        // })

    }

}

