const pool = require("../databaseConfig");

const {decrypt} = require("../helper/AES");
const message = require("../common/messages");
 
module.exports = {

    fetchapikey: (data, callBack) => {

       pool.query(`SELECT apiKey FROM api_keys WHERE smartContractId = ?;`, [Number(decrypt(data.smartContractId))],
        
        (error,results) => {

            if(error){

               return callBack(error);

            }
            else if(results.length > 0){
            
                return callBack(null, decrypt(results[0].apiKey));

            }
            else if(results.length === 0){
            
                return callBack(message.NO_API_KEY_FOUND_MESSAGE,[],200);

            }
            else{
                
                return callBack("Something went wrong on fetching API key",[]);

            }
            
        });

    }


}