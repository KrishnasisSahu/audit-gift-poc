const { history } = require("../services/interact");


module.exports.history = async function(req, res) {
    var body = req.body;
    const arr=[];
     var json_=JSON.stringify(body);
     var jsonobj =(JSON.parse(json_));
    const result = await history(jsonobj.hash);
    data = result.data;
    for (let i = 0; i < data.length; i++) {
        var a = data[i][1];
        const s = parseInt(a);
        const date = new Date(s * 1000);
        const deductedAmount = data[i][1];
        const method = data[i][0];
        const before=data[i][3];
        const after =data[i][4];
        const time = date.toString();
        if(method==="redeem"){
            arr.push({
            method : method,
            amount: "-"+parseInt(deductedAmount),
            date: time,
            beforeRedeem :parseInt(before),
            afterRedeem :parseInt(after)
            });
        }
        else{
            arr.push({
                method : method,
                date: time,
                recharged :parseInt(deductedAmount),
                total :parseInt(after)
                });
        }
      }
    res.send(arr);
       
}