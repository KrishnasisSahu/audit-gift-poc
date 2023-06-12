const pool = require("../databaseConfig");
const {decrypt, encrypt} = require("../helper/AES");
const masterKey = process.env.MASTER_KEY;

module.exports = {
    deleteContract : (data, callBack) =>{
        // var encryptedId = encrypt(data.smartContractId);
       
        var id = Number(decrypt(data.smartContractId));
        
        var sql = "UPDATE smart_contracts SET isDeleted = 1 where id = ?";
 
        pool.query(sql, (id), (error, result) => {
            
            if(error){
                return callBack(error);
            }else{
                return callBack(null, result);
            }
        })
    }
}