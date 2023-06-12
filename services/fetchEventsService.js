const pool = require("../databaseConfig");
const {encrypt,decrypt} = require("../helper/AES");

module.exports = {

    fetchevents: (data, callBack) => {
        
        console.log(data);

        var eventDetails = [];

        pool.query(`SELECT id, eventName from event_details WHERE smartContractId = ?`,[
            Number(decrypt(data.smartContractId))
        ],
        (error,results,fields) => {

            if(error){

               return callBack(error);

            }else{

                console.log(results);

                results.forEach(element => {

                   const event = {
                        id : encrypt(element.id),
                        eventName : element.eventName
                   }; 

                   eventDetails.push(event);

                });

                return callBack(null,eventDetails);
            }
                       
        })

    }

}

