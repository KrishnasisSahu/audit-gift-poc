const {get,getdata} = require("../services/fetchDatatypeService");


module.exports = {
    getDataTypes: (req ,res) => {
        const body = req.body;
        get(body, (err,results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:0,
                    message: "database  connection error"
                });
            }
            return res.status(200).json({
                success:1,
                data: results
            });
        }); 
    }
   
}
