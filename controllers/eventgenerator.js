const {create} = require("../services/eventgeneratorservice");

module.exports = {

    createEvent: (req ,res) => {

        const body = req.body;

            create(body, (err,results) => {

                if(err){
    
                    return res.status(500).json({
    
                        message: err
    
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