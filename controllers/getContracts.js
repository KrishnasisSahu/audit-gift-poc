const {getcontracts} = require("../services/getContractsService");

module.exports = {

    getContracts: (req ,res) => {

        const body = req.body;

        var items = JSON.parse(req.params.items);

        var page = JSON.parse(req.params.page);

        getcontracts(body, items, page, (err,results, totalCount) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    message : "Error occurred while fetching smart contracts"
                });

            }
            else{
                console.log(totalCount);
                return res.status(200).json({
                    data: results,
                    totalCount: totalCount
                });
                
            }
            
        }); 
    }
   
}
