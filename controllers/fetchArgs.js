const {fetchargs} = require("../services/fetchArgsService");

module.exports = {

    fetchArgs: (req ,res) => {

        const body = req.body;

        fetchargs(body, (err,results) => {

            var arr = [];

            var res_ = JSON.stringify(results);

            var ress_ = JSON.parse(res_);
            
            if(err){

                console.log(err);

                return res.status(500).json({
                    message: err
                });

            }
            else if(results.length<=0){

                return res.status(200).json({
                    NoContractsFound: 'Requested resource not found'
                });

            }
            else{

                if(ress_[0].id !== 'UNDEFINED'){

                    arr.push({
                        "name": JSON.parse(ress_[0].args), 
                        "argTypes": JSON.parse(ress_[0].argTypes)
                    });
            
                    return res.status(200).json({
                        data: arr
                    });
    
                }
                else{
                    return res.status(200).json({
                        NoContractsFound: 'Requested resource not found'
                    });
                }

                

            }
            
        }); 
    }
   
}
