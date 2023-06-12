const { Add_Recharge } = require("../services/interact");
const {message} = require("../common/messages");

module.exports.Add_Recharge = async function(req, res) {
    var body = req.body;
     var json_=JSON.stringify(body);
     var jsonobj =(JSON.parse(json_));

    try{
        const result = await Add_Recharge(jsonobj.hash, jsonobj.amount , jsonobj.pin);
      
        if (result === 1 || result === '1') {

            data = {
                status : 200,
                message : `Recharge successful for the hash ${jsonobj.hash}`,
                txn : result.transactionHash
            }
            res.send(data);
           
            
        } else {
            // Send a response indicating that the coupon has been generated
            res.send({message :"Error while recharging"});
        }
        
    }catch(err){
        // console.log("inside addrecharge catch");
        // throw err;
        // console.log(err);
        res.send({status : 500 , err:err.message});
    }
    
}