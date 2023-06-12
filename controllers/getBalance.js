const { getBalance } = require("../services/interact");


module.exports.getBalance = async function(req, res) {
     var body = req.body;
     var json_=JSON.stringify(body);
     var jsonobj =(JSON.parse(json_));
    try{
        const bal = await getBalance(jsonobj.hash,jsonobj.pin);
        data = {
            status : 200,
            balance : parseInt(bal)
        }
        res.send(data);

    }catch(err){ 
        res.send({status : 500 , err : err.message});
    }
    
}