const { error } = require("console");
const pool = require("../databaseConfig");
const {decrypt, encrypt} = require("../helper/AES");
 
module.exports = {
  getcontracts: (data, item, page, callBack) => {

    console.log(item, page)
    var totalCount = 0;
    var tenantId = Number(decrypt(data.tenantId));

    pool.query(`select count(*) as contractCount from smart_contracts where tenantId = ? and isDeleted = 0`, [tenantId],
      (error, result) =>{
        if(error){
          callBack(error);
        }else{
           totalCount = result[0].contractCount;

          pool.query(
            `select c.id, c.address, c.contractName, c.createdTimestamp, CONCAT(u.fName , ' ', u.lName) AS full_name  from smart_contracts c left join users u on c.deployerId = u.id WHERE c.tenantId = ? AND c.isDeleted = 0 order by c.createdTimestamp desc LIMIT ? OFFSET ?`,
            [tenantId, item, (page - 1) * item],
            (error, results, fields) => {

              if (error) {
                return callBack(error);
              }

              if(results.length > 0){

                var contractData = [];

                results.forEach((result) => {
          
                  // const date = new Date(result.createdTimestamp).toLocaleDateString().replace(/\//g, "-");

                  const contract = {
                    id: encrypt(result.id),
                    address: result.address,
                    contractName: result.contractName,
                    date: result.createdTimestamp,
                    userName : result.full_name
                  };
            
                  // Add the contract object to the contractData array
                  contractData.push(contract);
                });
                
                return callBack(null, contractData, totalCount); 
              }
              else if(results.length === 0){
                return callBack(null, []);
              }
            }
          );
        }
      }
    );

  }

};