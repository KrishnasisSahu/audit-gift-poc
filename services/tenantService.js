const pool = require("../databaseConfig");
const {encrypt, decrypt} = require("../helper/AES");
const message = require("../common/messages");
 
module.exports = {
    get: (data, callBack) => {
        const tenantDetails = new Array();
        pool.query(`select id,tenantName as name from tenant order by id desc`,
        (error,results,fields) => {
            if(error){
               return callBack(error);
            }else{
                
                results.forEach(element => {
                    
                    var details = {};
                    details.id = encrypt(element.id);
                    details.name = element.name;
                    tenantDetails.push(details);
                });
                return callBack(null,tenantDetails);
            }            
        })
    },

    add: (data, userId, callBack) => {
        var decUserId = Number(decrypt(userId));
        pool.query(`SELECT * from users WHERE id = ?`, [decUserId],
        (err, results) => {
            if(err){
                return callBack(message.ADD_TENANT_FAILURE_ERROR_MESSAGE);
            }
            else if(!results.length){ 
                return callBack("User doesn't exist");
            }
        
		
            pool.query(`Select tenantName from tenant where domainName = ?`, [data.domainName],
            (error, results) =>{
                if(results.length != 0){
                    return callBack(message.DOMAIN_NAME_EXIST_ERROR_MESSAGE)
                }else{
                    pool.query(`Select * from tenant where tenantName = ?`, [data.tenantName],
                    (error, results) =>{
                        if(results.length != 0){
                            return callBack(message.TENANT_NAME_EXIST_ERROR_MESSAGE)
                        }else{
                            pool.query(`INSERT INTO tenant (tenantName, createdBy, domainName) VALUES (?, ?, ?)`,[data.tenantName, decUserId, data.domainName],
                            (error,results) => {
                                if(error){
                                    return callBack(message.ADD_TENANT_FAILURE_ERROR_MESSAGE);
                                }
                               
                                tenantId = encrypt(results.insertId);
                                
                                return callBack(null,tenantId);
                                        
                            });
                        }
                    });    
                }
            });
        });
        
    }

}

