const {get, add } = require("../services/tenantService");
const message = require("../common/messages");


module.exports = {
    getTenantName: (req ,res) => {
        const body = req.body;
        get(body, (err,results) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: message.GET_TENANT_NAME_FAILURE_ERROR_MESSAGE
                });
            }
            return res.status(200).json({
                success:1,
                data: results
            });
        }); 
    },

    addTenant: (req, res) =>{
        const body = req.body;
        add(body, req.user.id, (err, results) => {
            if(err){
                return res.status(500).json({
                    message : err
                });
            }else{
                return res.status(200).json({
                    success : 1,
                    tenantId : results,
                    message : message.ADD_TEANANT_SUCCESS_MESSAGE
                })
            }
        });
    }
   
}
