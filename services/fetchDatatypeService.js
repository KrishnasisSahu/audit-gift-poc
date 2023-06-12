const pool = require("../databaseConfig");
const { encrypt } = require("../helper/AES");
 
 
module.exports = {
    get: (data, callBack) => {
        
        var dataTypeList = new Array();
        pool.query(`select id, datatype from datatype order by datatype desc`,[
            JSON.stringify(data.eventpayload),
            0
        ],
        (error,results,fields) => {
            if(error){
               return callBack(error);
            }
            console.log(results);
            results.forEach(element => {
                var datatype = {};
                datatype.id = encrypt(element.id);
                datatype.datatype = element.datatype;
                dataTypeList.push(datatype);
            });
            return callBack(null,dataTypeList);
        })
    }


}

