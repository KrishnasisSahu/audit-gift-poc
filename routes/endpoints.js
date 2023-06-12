const generateEvent = require("../controllers/eventCreator");

const viewUserDetails = require("../controllers/viewUserDetails");

const getBalance = require("../controllers/getBalance");

const generateCoupon = require("../controllers/generateCoupon");

const Apply_Discount = require("../controllers/applyDiscount");

const  Add_Recharge = require("../controllers/addRecharge");

const history  = require("../controllers/historyofHash");

const viewDiscount  = require("../controllers/viewDiscount");

const fetchDataType = require("../controllers/fetchDatatype");

const fetchfunctionname = require("../controllers/fetchfunctionname")

const fetchchoice = require("../controllers/choiceOfContract");

const fetchemitteddata = require("../controllers/EmittedData");

const {createEvent} = require("../controllers/eventgenerator");

const contracts = require("../controllers/deleteContracts")

const getcontracts = require("../controllers/getContracts");

const fetchevents = require("../controllers/fetchEvents");

const fetchargs = require("../controllers/fetchArgs");

const tenantController = require("../controllers/tenantController");

const {signupValidation,loginValidation} = require("../services/loginvalidation");

const generateApiKey = require("../controllers/generateApiKeys");

const router = require("express").Router();

const authJWT = require("../helper/authJWT");

const authApiKey = require("../helper/authAPI")

const fetchApiKey = require("../controllers/fetchApiKey");

const fetchbal = require("../controllers/getbalanceaudit");

router.post("/createevent", authJWT, generateEvent.createevents);

router.get("/datatypes", authJWT, fetchDataType.getDataTypes);

router.post("/emittedevents", authJWT, fetchemitteddata.emitevents);

router.post("/postevents/:apikey", authApiKey, createEvent);

router.post("/getContracts/:items/:page", authJWT, getcontracts.getContracts); 

router.post("/fetchEvents", authJWT, fetchevents.fetchEvents);

router.post("/fetchArgs", authJWT, fetchargs.fetchArgs);

router.post("/deleteContracts", authJWT, contracts.deleteContract);

router.post('/register', signupValidation);

router.post('/login', loginValidation);

router.get('/fetchtenantname', tenantController.getTenantName);

router.post('/generateApiKey', authJWT, generateApiKey.generateApiKeys);

router.post('/fetchApiKey', authJWT, fetchApiKey.fetchApiKey)

router.post('/addtenant', authJWT, tenantController.addTenant);

router.get("/balance", authJWT, fetchbal.fetchbal);

router.get("/functionname", authJWT, fetchfunctionname.getfunctionNames);

router.get("/choices", authJWT, fetchchoice.getChoices);

router.post("/user",authJWT,viewUserDetails.viewUserDetails);

router.post("/balances",authJWT,getBalance.getBalance);

router.post("/generategiftcard",authJWT,generateCoupon.generateCoupon);

router.post("/redeem",authJWT,Apply_Discount.Apply_Discount);

router.post("/recharge",authJWT,Add_Recharge.Add_Recharge);

router.post("/history",authJWT,history.history);

router.post("/viewredeem",authJWT,viewDiscount.viewDiscount);


module.exports = router;