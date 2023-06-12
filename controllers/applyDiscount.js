const { Apply_Discount } = require("../services/interact");

module.exports.Apply_Discount = async function(req, res) {
    var body = req.body;
     var json_=JSON.stringify(body);
     var jsonobj =(JSON.parse(json_));
    // const { email, discount } = req.body;
    try{
        const result = await Apply_Discount(jsonobj.total, jsonobj.amount , jsonobj.id,jsonobj.pin);
        console.log(result.grandTotal);
        console.log(result.res);
        if(result.res === '0'){
            res.status(201).json({message:"Invalid pin"});
        }else if(result.bal === '-1' || result.bal === -1){
            res.status(500).json({message:"Insufficient fund"});
        }
        else{
            // Send a response indicating that the coupon has been generated
            data = {
                status : 200,
                grandTotal : parseInt(result.grandTotal),
                txn : result.tx
            }
            res.send(data);
        }
        
        // res.send(data);
    }catch(err){
        // console.log("applydiscount catch");
        // console.log(err);
        res.send({status : 500 , err:err.message});
    }
    
}