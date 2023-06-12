const {fetchevents} = require("../services/fetchEventsService");
const message = require("../common/messages");

module.exports = {

    fetchEvents: (req ,res) => {

        const body = req.body;

        fetchevents(body, (err,results) => {

            var arr = [];

            for(var i = 0; i <= results.length-1; i++){
                arr.push({
                    "id": results[i].id,
                    "name": results[i].eventName
                });
            }

            if(err){

                return res.status(500).json({
                    message: message.DEFAULT
                });

            }
            else if(results.length <=0){

                return res.status(200).json({
                    NoContractsFound: message.NO_SMART_CONTRACT_FOUND_ERROR_MESSAGE
                });

            }
            else{

                return res.status(200).json({
                    data: arr
                });

            }
            
        }); 
    }
   
}
