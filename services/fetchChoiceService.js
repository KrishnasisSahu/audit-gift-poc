const pool = require("../databaseConfig");
const { encrypt } = require("../helper/AES");
 
 
module.exports = {
    get: (data, callBack) => {
        
        var choiceList = new Array();
        pool.query('SELECT options, id_options FROM choice_for_smartContarct ORDER BY id_options ASC',[
            JSON.stringify(data.eventpayload),
            0
        ],
        (error,results,fields) => {
            if(error){
               return callBack(error);
            }
            console.log(results);
            results.forEach(element => {
                var choices = {};
                choices.id_options = encrypt(element.id_options);
                choices.options = element.options;
                choiceList.push(choices);
            });
            return callBack(null,choiceList);
        })
    }


}
