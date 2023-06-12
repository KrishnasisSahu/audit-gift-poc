const pool = require("../databaseConfig");
const { encrypt } = require("../helper/AES");
 
 
module.exports = {
    get: (data, callBack) => {
        
        var FunctionNameList = new Array();
        pool.query(`select id, Function_name from Functions order by id `,[
            JSON.stringify(data.eventpayload),
            0
        ],
        (error,results,fields) => {
            if(error){
               return callBack(error);
            }
            console.log(results);
            results.forEach(element => {
                var FunctionName = {};
                FunctionName.id = encrypt(element.id);
                FunctionName.Function_name = element.Function_name;
                FunctionNameList.push(FunctionName);
            });
            return callBack(null,FunctionNameList);
        })
    }


}

