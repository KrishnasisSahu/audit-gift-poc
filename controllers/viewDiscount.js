const { getBalance } = require("../services/interact");


module.exports.viewDiscount = async function(req, res) {
var body = req.body;
var json_=JSON.stringify(body);
var jsonobj =(JSON.parse(json_));
let total_am;
try{
         const bal = await getBalance(jsonobj.hash,jsonobj.pin);
         console.log(bal);
         if(bal>=jsonobj.amount)
{
total_am=(jsonobj.total-jsonobj.amount);
 }
data={
status:200,
 total : parseInt(total_am)
}
 res.send(data);

 }catch(err){res.send(err.message);
     }

}
