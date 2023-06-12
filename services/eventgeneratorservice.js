module.exports = {

  create: (data, callBack) => {

    var loggedEvents = [];
  
    var contractEvents = [];

    var contractArgs = [];

    var emitRequestId;

    var payload;

    var string_payload;

    var status;

    var txnId;

    var eventname;

    var argument;

    var argument_length;

    var args = [];

    var argsValue = [];
    
    var eventDetailsId;

    const pool = require("../databaseConfig");

    var mysql = require("mysql");

    const logger = require("../logger");
    const {encrypt, decrypt} = require("../helper/AES");

    var event_name = data.eventpayload["eventname"];

    var eveId = Number(decrypt(data.eventpayload["id"]));
    console.log("eventId" + eveId);

    console.log(data.eventpayload["choice"]);

    pool.query(
      "SELECT COUNT(*) FROM `events_log_details` WHERE transaction_id = ?;", [data.eventpayload["txnId"]],
      function (err, result) {

        if (err) {

          return res.status(500).json({ error: err });

        } 
        else if((result[0]['COUNT(*)'] === 0)){

            var eventPayloadForDb = (data.eventpayload["choice"] === 0) ? JSON.stringify(data.eventpayload) : JSON.stringify({choice: data.eventpayload["choice"]});

            if(data.eventpayload["choice"] === 0 || data.eventpayload["choice"] === 1){

              pool.query(
                `insert into events(eventDetailsId,eventPayload,eventStatus)values(?,?,?)`,
                [
                  JSON.stringify(eveId),
                  eventPayloadForDb,
                  0,
                ],
                (error, results, fields) => {

                  emitRequestId = results.insertId;
          
                  if (error) {
          
                    return callBack(error);
          
                  }
          
                  async function dn(req, res) {
          
                    pool.query(
                      "select * from events where id = ?",
                      [emitRequestId],
                      function (err, results) {
          
                        status = results[0].eventStatus;
          
                        eventDetailsId = results[0].eventDetailsId;
          
                        console.log("emittedId" + eventDetailsId);
          
                        payload = results[0].eventPayload;
          
                        string_payload = data.eventpayload;

                        var string_payload_ = JSON.stringify(string_payload);
          
                        txnId = string_payload.txnId;
          
                        console.log("txId" + txnId);
          
                        eventname = string_payload.eventname;
          
                        argument = string_payload.arguments;
          
                        argument_length = argument.length;
          
                        for (let i = 0; i < argument_length; i++) {
          
                          args[i] = [];
          
                          argsValue[i] = [];
          
                          args[i] += argument[i].arg;
          
                          
                          if(typeof argument[i].argValue === 'object' &&  argument[i].argValue !== null){

                            argsValue[i] += JSON.stringify(argument[i].argValue);

                          }
                          else{

                            argsValue[i] += argument[i].argValue;
                            
                          }
          
                        }

                        async function emit() {
          
                          if (
                            status === 0
                          ) {
          
                            var eventFunction = eventname + "Emitter";
          
                            pool.query(
                              `select c.address, c.abi from smart_contracts c join event_details ed on ed.smartContractId = c.id where ed.id = ${eveId}`,
                              function (err, result) {
          
                                console.log(result);
          
                                if (err) {
          
                                  return err;
          
                                } 
                                else {
          
                                  var abi = result[0].abi;
          
                                  var address = result[0].address;
          
                                  var event = eventname;
          
                                  var q = [];
          
                                  for (let i = 0; i < argsValue.length; i++) {
          
                                    if((typeof argsValue[i] === "object"|| typeof argsValue[i] === Object) && argsValue[i] !== null){

                                      console.log("\n\n\n\n\n\n\n\n\n\n\nIts here\n\n\n\n\n\n\n\n\n\n\n");

                                        
                                      console.log("\nJSONOBJECT\n")


                                      q.push(JSON.stringify(argsValue[i]));

                                    }
                                    else{

                                      console.log("\n\n\n\n\n\n\n\n\n\n\nNotJSON\n\n\n\n\n\n\n\n\n\n\n");

                                      q.push(argsValue[i]);

                                    }
          
                                  }
          
                                  async function createScript() {
          
                                    try{  
                                      
                                    var mysql = require("mysql");
          
                                    const Web3 = require("web3");

                                    require("dotenv").config();
          
                                    const HDWalletProvider = require("@truffle/hdwallet-provider");
          
                                    const PRIVATE_KEY = process.env.PRIVATE_KEY;
          
                                    console.log(typeof PRIVATE_KEY);
          
                                    const providerUrl = process.env.POLYGON_MUMBAI_RPC;

                                    const provider = new HDWalletProvider(
                                      PRIVATE_KEY,
                                      providerUrl
                                    );
          
                                    const web3 = new Web3(provider);

                                    const nonce = await web3.eth.getTransactionCount(provider.getAddress(),'latest');

                                    console.log("NONCE \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"+nonce)
          
                                    const logger = require("../logger");
          
                                    const pool = require("../databaseConfig.js");
          
                                    console.log(typeof abi);
          
                                    abi = JSON.parse(abi);
          
                                    console.log(abi);
          
                                    console.log(typeof abi);
          
                                    console.log(address);
          
                                    console.log(typeof address);
          
                                    var stringPayload = `${string_payload_}`;
          
                                    console.log(eventFunction);
          
                                    const contract = new web3.eth.Contract(abi, address);
          
                                    q.push(Date.now());
                                   
                                      const receipt = await contract.methods[eventFunction](
                                        ...q
                                      )
                                      .send({
                                        from: process.env.PUBLIC_KEY,
                                        nonce: nonce
                                      })
                                      .on("receipt", function (receipt) {
                                        
                                        logger.dataLogger.log(
                                          "info",
                                          "The emitted event is : "
                                        );
          
                                        logger.dataLogger.log("info", receipt.events);
          
                                        async function cleanup() {

                                          await provider.engine.stop();

                                        }
                              
                                        cleanup();

                                        let event_ = receipt.events[eventname].event;
          
                                        console.log("event " + event_);
          
                                        let address_ = receipt.events[eventname].address;
          
                                        console.log("address_ " + address_);
          
                                        let blockNumber_ = receipt.events[eventname].blockNumber;
          
                                        console.log("blockNumber_ " + blockNumber_);
          
                                        let status_ = "Emitted";
          
                                        let Data_ = JSON.stringify(stringPayload);
          
                                        console.log("Data_ " + Data_);
          
                                        let tID = `${txnId}`;
          
                                        console.log("tID " + tID);
          
                                        let transactionHash_ = receipt.events[eventname].transactionHash;
          
                                        console.log(
                                          "transactionHash_ " + transactionHash_
                                        );
          
                                        console.log("eventId " + eventDetailsId);
          
                                        pool.query(
                                          "UPDATE events SET eventStatus=1,loggeddate=CURRENT_TIMESTAMP where id= ? ",
                                          [`${emitRequestId}`],
                                          function (err) {
          
                                            if (err)
                                              return res.status(500).json({ error: err });
          
                                            logger.dataLogger.log(
                                              "info",
                                              "This event Successfully Emitted."
                                            );
                                            try {
          
                                              console.log(receipt);
          
                                              var sql = `INSERT INTO events_log_details (transaction_id, eventsId, address, block_number, status, data, transactionHash) VALUES (?, ?, ?, ?, ?, ?,?)`;
          
                                              pool.query(
                                                sql,
                                                [
                                                  tID,
                                                  emitRequestId,
                                                  receipt.events[eventname].address,
                                                  receipt.events[eventname].blockNumber,
                                                  status_,
                                                  Data_,
                                                  receipt.events[eventname]
                                                    .transactionHash,
                                                ],
                                                function (err, result) {
          
                                                  console.log("result " + result);
          
                                                  return callBack(null, {
                                                    result: `Event ${eventname} Succesfully Emitted.`,
                                                    emittedInfo: receipt
                                                  });
          
                                                }
          
                                              );
          
                                            } catch (err) {
                                              
                                              async function cleanup() {

                                                await provider.engine.stop();
      
                                              }
                                    
                                              cleanup();

                                              console.log(err);

                                              return callBack(err);
                                              
                                            }
          
                                          }
          
                                        );
          
                                      });
                                    } catch (err) {

                                      async function cleanup() {

                                        await provider.engine.stop();

                                      }
                            
                                      cleanup();

                                      return callBack(err);
                                    }
                                  }
          
                                  createScript();
          
                                }
          
                              }
          
                            );
          
                          } else {
          
                            logger.dataLogger.log(
                              "info",
                              "This transaction id is already Logged."
                            );
          
                            pool.query(
                              `UPDATE events SET eventStatus=1,loggeddate=CURRENT_TIMESTAMP where id= ? `,
                              txnId,
                              function (err) {
          
                                if (err) return res.status(500).json({ error: err });
                                return callBack(null, {
                                  result: `This transaction ${txnId} is already Logged.`,
                                });
          
                              }
          
                            );
                          }
          
                        }
        
                        emit();
          
                      }
          
                    );
          
                  }
          
                  dn();
          
                }
          
              );

            }            
            else{
        
              return callBack({INVALID_CHOICE: "Choice can be either '0' (store payload in Database) or '1' (not to store payload in Database)"}, []);
        
            }

        }
        else if(result[0]['COUNT(*)'] > 0){
            
          return callBack(`Transaction with transaction ID ${data.eventpayload["txnId"]} already processed`, []);

        }
        else{
              
          return callBack(`Something went wrong while processing ${txnId} transaction`, []);

          }

      }

    );

  },

};
