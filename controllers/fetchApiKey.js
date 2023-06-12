const {fetchapikey} = require("../services/fetchApiKeyService");

module.exports = {

    fetchApiKey: (req ,res) => {

        const body = req.body;

        fetchapikey(body, (err,results,errCode) => {

            if(err && errCode != 200){

                console.log(err);

                return res.status(500).json({
                    message: err
                });

            }
            else if(results.length === 0 && errCode === 200){

                return res.status(200).json({
                    NoApiKeyFound: err 
                });

            }
            else{

                return res.status(200).json({
                    data: results
                });

            }
            
        }); 
    }
   
}
