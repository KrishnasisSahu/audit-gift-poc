const { viewUserDetails } = require("../services/interact");


module.exports.viewUserDetails = async function(req, res) {
    var body = req.body;
     var json_=JSON.stringify(body);
     var jsonobj =(JSON.parse(json_));
    // const { email } = req.body;
    const userDetails = await viewUserDetails(jsonobj.email);
    // Do something with userDetails, such as sending it back in the response
    data = {
        status : 200,
        email : userDetails.email,
        bal : parseInt(userDetails.price),
        couponCount : parseInt(userDetails.couponCount),
        giftcard : userDetails.hash
    }
    res.send(data);
}