const pool = require("../databaseConfig");
const {encrypt, decrypt} = require("../helper/AES");

module.exports = {

    fetchargs: (data, callBack) => {

        /*
        pool.query(`SELECT id, args FROM event_detail WHERE (address) = (?) AND (event)= (?)`,[
            data.contractAddress,
            data.event
        ], 
        */
        var argList = [];
        pool.query(`SELECT id, args, argTypes FROM event_details WHERE id = ?`,[
            Number(decrypt(data.id))
        ],
        (error,results,fields) => {

            if(error){
               return callBack(error);
            }else{
                results.forEach(element => {
                    var argumentDetails = {
                        id : encrypt(element.id),
                        args : element.args,
                        argTypes : element.argTypes
                    };
                    argList.push(argumentDetails);
                });
                return callBack(null,argList);
            }
            
        })

    }


}

