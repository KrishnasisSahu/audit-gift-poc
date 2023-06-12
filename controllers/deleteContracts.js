const {deleteContract} = require("../services/deleteContractService");
const messages = require('../common/messages');

module.exports = {

    deleteContract: (req, res) => {
        const body = req.body;

        deleteContract(body, (err, results) => {
            if(err){
                console.log("error occured"+results);
                return res.status(500).json({
                    status : 500,
                    message : messages.DELETE_SMART_CONTRACT_FAILURE_ERROR_MESSAGE
                });
            }
            else if(results.affectedRows == 0){
                return res.status(200).json({
                    status : 200,
                    message : messages.NO_SMARTCONTRACT_FOUND_ERROR_MESSAGE
                });
            }else if(results.affectedRows > 0){
               return res.status(200).json({
                    status : 200,
                    message : messages.DELETE_SMART_CONTRACT_SUCCESS_MESSAGE
                });
            }
        });
         
    }
}