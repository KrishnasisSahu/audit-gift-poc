module.exports.createevents = async function(req, res){

  var pool = require('../databaseConConfig');
  
  const express = require('express');

  const msgs = require('../common/messages');
  
  const Web3 = require('web3');
  
  const HDWalletProvider = require('@truffle/hdwallet-provider');
  
  const solc = require("solc");
  
  const app = express();
  
  const web3 = new Web3();
  
  require('dotenv').config();

  const {encrypt, decrypt} = require("../helper/AES");
  
  const {PRIVATE_KEY, ALCHEMY_WEBSOCKET, POLYGON_MUMBAI_RPC} = process.env 
  
  // initialize the web3 instance with the Mumbai test network provider and the specified private key
  const provider = new HDWalletProvider(PRIVATE_KEY, POLYGON_MUMBAI_RPC);

  web3.setProvider(provider);
  
  async function cleanup() {

    await provider.engine.stop();
    
  }
  
  // Get the current nonce of the wallet
  const nonce = await web3.eth.getTransactionCount(provider.getAddress(),'latest');
  
  var mysql = require('mysql');

  let currentTime = Date.now();

  var count = 0;

  var contractAbi = [];

  //naming contracts
  var EventLogger = '';

  var fileContents='';

  var argContents=[];

  var parContent=[];

  var funContent=[];

  var eventkey = [];

  var eventargs = [];

  var argtype = [];

  var Events = [];

  var EventNames = [];

  var EventNames1 = [];

  var myContract = '';

  var compileErrMsg = '';

  var funid = [];

  if(req.body){

    const body = req.body;

    const jsonobj = body;

    const data = jsonobj.functionId;
    
    const choiceoptions = Number(decrypt(req.body.id_options))
    

    for (i in data){
      funid.push(Number(decrypt(data[i])))
    }
   
    

   

    var Deployer = Number(decrypt(jsonobj.userId));

    var tenent = Number(decrypt(jsonobj.tenentId));

    var stringarr = JSON.stringify(body);

    var parsearr = JSON.parse(stringarr);

    var finalJson = parsearr.data;

    //generated 3D Array

    // [
    //   [
    //     'Transfer',
    //     [ 'address', 'address', 'uint256' ],
    //     [ 'from', 'to', 'value' ]
    //   ],
    //   [ 'Random', [ 'bytes' ], [ 'hash_' ] ]
    // ]

    // Creating the 3D Array 
    finalJson.forEach(({eventName, argument}) => {

      const keys = argument.map(argType => (argType.argType === 2) ? 'int': 'string' );

      const keysForDb = argument.map(argType => 
                        (argType.argType === 1) ? 'string'
                        : (argType.argType === 3) ? 'JSON'
                        : 'int');
      
      const args = argument.map(arg => Object.values(arg)[0]);

      console.log(args);

      console.log(eventName);

      console.log(args[0] === eventName);

      compileErrMsg = (new Set(args).size !== args.length) ? msgs.SAME_NAME_FOR_MULTIPLE_INPUTS : 
                      (args[0] === eventName) ? msgs.SAME_NAME_FOR_EVENT_AND_ITS_ARGUMENT: 
                      msgs.SAME_NAME_FOR_MULTIPLE_EVENTS;
                      
      console.log(compileErrMsg);

      EventNames.push([eventName, keys, args]);

      EventNames1.push([eventName, keysForDb, args]);
      
    });

    console.log(EventNames);

    async function solify() {

      var choice = [];
      
        if(EventNames.length === 1){

          EventLogger = EventNames[0][0];

          Contract_name = (`${EventLogger}`);

        }
        else{

          EventLogger = EventNames[0][0]+'To'+EventNames[EventNames.length - 1][0];

          Contract_name = (`${EventLogger}`);

        }
    
        for(var i = 0; i<= EventNames.length - 1; i++){
      
          argContents[i] = '';
      
          parContent[i] = '';
      
          funContent[i] = '';
      
        }
      
        for (var i = 0; i <= EventNames.length - 1; i++){
      
          for(var j = 0; j <= EventNames[i][1].length - 1; j++){
    
              if(j === EventNames[i][1].length - 1){
    
                  argContents[i] = argContents[i] + EventNames[i][1][j]+' '+ EventNames[i][2][j];
    
                  parContent[i] = parContent[i] + EventNames[i][2][j];
    
                  if(EventNames[i][1][j] === 'string' || EventNames[i][1][j] === 'bytes'){
    
                      funContent[i] = funContent[i] + EventNames[i][1][j] +' memory '+ EventNames[i][2][j] 
    
                  }
                  else{
    
                      funContent[i] = funContent[i] + EventNames[i][1][j] +' '+ EventNames[i][2][j]
                
                  }
    
              }
              else{
    
                  argContents[i] = argContents[i] + EventNames[i][1][j]+' '+ EventNames[i][2][j] + ', ';
    
                  parContent[i] = parContent[i] + EventNames[i][2][j] + ', '
    
                  if(EventNames[i][1][j] === 'string' || EventNames[i][1][j] === 'bytes'){
    
                    funContent[i] = funContent[i] + EventNames[i][1][j] +' memory '+ EventNames[i][2][j] + ', '
    
                  }
                  else{
    
                      funContent[i] = funContent[i] + EventNames[i][1][j] +' '+ EventNames[i][2][j] + ', '
    
                  }
              }
          }
    
      }
        
      for (var i = 0; i <= EventNames.length - 1; i++) {
      
          fileContents += `\n    event ${EventNames[i][0]}(
              
              ${argContents[i]}, int date
              
      
          );
      
          function ${EventNames[i][0]}Emitter (${funContent[i]}, int date) public restricted{
      
              emit ${EventNames[i][0]}(${parContent[i]}, date);
      
          }\n`;
      
      }

      var fun1 = "function Generate_Coupon_Id(string memory email,string memory hash, uint price) public  { "+
        "couponCount++;"+
        
        "hashToValue[hash] = price;"+
       " Users[email]=User(email,price,couponCount,hash);"+

 
        "}"

    

      var fun2 = "function find_coupon(string memory hash) internal view returns(uint){return hashToValue[hash];}"

      var fun3 = "function Apply_Discount(uint total, uint amount, string memory id) public returns (uint) {"+
      "  a = find_coupon(id);"+
      " require(amount <= a, 'Insufficient Balance');"+

        "Grand_Total = total - amount;"+
        "hashToValue[id] = a - amount;"+

        "transactionAmounts[id].push(Transaction(amount, block.timestamp));"+

        "emit ApplyDiscount(Grand_Total);"+

        "return Grand_Total;   }"


      var fun4 = "function getBalance(string memory hash) public view returns (uint256) {return hashToValue[hash];}"

      var fun5 =  "function Add_Recharge(string memory hash, uint amount) public returns(bool) { hashToValue[hash] += amount; return true;}"


      var fun6 = "function getTransactionAmounts(string memory id) public view returns (Transaction[] memory) {return transactionAmounts[id]; }"

      var options = [fun1,fun2,fun3,fun4,fun5,fun6]

      for (let i in funid){
        if (funid[i] === 1) {
          choice.push(fun1)
        }
        else if (funid[i]===2){
          choice.push(fun2)
        }
        else if (funid[i]===3){
          choice.push(fun3)
        }
        else if (funid[i]===4){
          choice.push(fun4)
        }
        else if (funid[i]===5){
          choice.push(fun5)
        }
        else if (funid[i]===6){
          choice.push(fun6)
        }
        else {
          console.log("no functions added")
        }
      }
     // console.log(choice)
      

      var contentToBeAdded = "";

      for(let i=0;i<options.length;i++)
      {
        for(let j=0;j<choice.length;j++)
          {
              if(options[i]==choice[j])
              {
                  contentToBeAdded += choice[j];
              }
          }
      }

     
      if(choiceoptions === 0)
      {
         console.log("Its zero")
         sourceCode = (`// SPDX-License-Identifier: MIT
      
      pragma solidity ^0.8.18;
      
      contract ${EventLogger}{

        struct User {
          string email;
          uint price;
          uint couponCount;
          string hash;
      }
         struct Transaction {
          uint amount;
          uint timestamp;
      }
      uint Grand_Total;
      uint a;
      bytes32 desc='0x0e0ffe4daa13c0fe41a48f862bd';
      mapping (string => User) public Users;
      mapping (string => Transaction[]) transactionAmounts;
      uint public couponCount;
      mapping(string => uint256) public hashToValue;
      // event CouponGenerated(bytes32 hash1);
      event ApplyDiscount(uint Grand_Total); 
      
          address public owner;
      
          string public ownerName;
      
          constructor() {
      
              owner  = msg.sender;
      
              ownerName = "Smartcontract-Polygon Network";
      
          }
          
          //modifier to restrict contract address limit to creater
      
          modifier restricted() {
      
              require(msg.sender == owner, 'Permission denied, Admin account only');
      
              _;
      
          }
      
          ${fileContents}        
      }`);
    
      }
      else if(choiceoptions === 2)
      {
        console.log("Some choices are there")
        sourceCode = (`// SPDX-License-Identifier: MIT
      
      pragma solidity ^0.8.18;
      
      contract ${EventLogger}{

        struct User {
          string email;
          uint price;
          uint couponCount;
          string hash;
      }
         struct Transaction {
          uint amount;
          uint timestamp;
      }
      uint Grand_Total;
      uint a;
      bytes32 desc='0x0e0ffe4daa13c0fe41a48f862bd';
      mapping (string => User) public Users;
      mapping (string => Transaction[]) transactionAmounts;
      uint public couponCount;
      mapping(string => uint256) public hashToValue;
      // event CouponGenerated(bytes32 hash1);
      event ApplyDiscount(uint Grand_Total); 
      
          address public owner;
      
          string public ownerName;
      
          constructor() {
      
              owner  = msg.sender;
      
              ownerName = "Smartcontract-Polygon Network";
      
          }
          
          //modifier to restrict contract address limit to creater
      
          modifier restricted() {
      
              require(msg.sender == owner, 'Permission denied, Admin account only');
      
              _;
      
          }
      
          ${fileContents}
          ${contentToBeAdded}
      
      }`);
      }
    
      console.log('\n');

      console.log(sourceCode);
    
      var fileName = EventLogger+'.sol';

      try{

        // Smart Contract Compilation by creating a new contract instance using the source code

        var compiledContract = JSON.parse(solc.compile(JSON.stringify({
          language: "Solidity",
          sources: {
            [fileName]: { //The name of the contract should match with the '[fileName]' in the source: {[fileName]:{ content: sourcecode}} should 
              content: sourceCode
            }
          },
          settings: {
            outputSelection: {
              "*": {
                "*": ["*"]
              }
            },
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        })));

        const abi = compiledContract.contracts[fileName][EventLogger].abi;
        console.log(abi)

        myContract = new web3.eth.Contract(abi);

        console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"+nonce);

      }
      catch (error){
        
        console.error({
          COMPILATION_ERROR: error
        });

        cleanup();

        return res.status(500).json({
          COMPILATION_ERROR: error
        });

      }

      //Smart Contract Deployment

      try {

        const bytecode = compiledContract.contracts[fileName][EventLogger].evm.bytecode.object;

        const gasEstimate = await myContract.deploy({
          data: "0x" + bytecode,
          arguments: []
        }).estimateGas({
          from: provider.getAddress()
        });

        const deployedContract = await myContract.deploy({
          data: "0x" + JSON.parse(solc.compile(JSON.stringify({
            language: "Solidity",
            sources: {
              [fileName]: {
                content: sourceCode
              }
            },
            settings: {
              outputSelection: {
                "*": {
                  "*": ["*"]
                }
              },
              optimizer: {
                enabled: true,
                runs: 200
              }
            }
          }))).contracts[fileName][EventLogger].evm.bytecode.object,
          arguments: []
        }).send({
          from: provider.getAddress(),
          gas: gasEstimate,
          nonce: nonce
        });
    
        console.log(gasEstimate);
    
        contractAbi = JSON.stringify(deployedContract.options.jsonInterface);
    
        addresss = deployedContract.options.address;
    
        console.log(deployedContract);
      
        console.log({
          success: true,
          address: deployedContract.options.address,
          contractABI: JSON.stringify(deployedContract.options.jsonInterface)
        });
    
        var sql = `INSERT INTO smart_contracts (contractName, address, abi, deployerId, tenantId, choiceoptions) VALUES (?,?,?,${Deployer}, ${tenent}, ${choiceoptions})`
    
        pool.query(sql, [Contract_name, addresss, contractAbi], function (err, result) {
    
          console.log(result);
      
          if (err) {
      
            if(err.code === 'ER_DUP_ENTRY'){
      
              console.log('ER_DUP_ENTRY');

              cleanup();

              return res.status(500).json({
                Error:`Error: Error occured with the code(${err.code}) occured while recoding deployemnt data :(  Please try again`,
                error: err
              });
              
            }
            else{
      
              console.error(err);
    
              clearCache();

              cleanup();
    
              return res.status(500).json({
                MySQLError:"Error occured while recoding deployemnt data :(  Please try again",
                error: err
              });
      
            }
      
          }
    
          console.log('length of events: '+EventNames.length);
              
            for (var i = 0; i <= EventNames1.length - 1; i++) {
    
              var rawArgTypes = EventNames1[i][1];
    
              var argTypes = JSON.stringify(rawArgTypes);
              
              var rawArgs = EventNames1[i][2];
    
              var args = JSON.stringify(rawArgs);
              
              var sql = `INSERT INTO event_details (smartContractId, eventName,	args,	argTypes) VALUES (?, ?, ?, ?)`;
          
              pool.query(sql, [result.insertId, EventNames1[i][0], args, argTypes], function (err, result) {
          
                if (err) {
            
                  if(err.code === 'ER_DUP_ENTRY'){
            
                    count++;
                    
                  }
                  else{
            
                    console.error(err);
    
                    clearCache();
      
                    cleanup();
            
                    // 'res' instead of 'throw e' for keeping server active;
                    return res.status(500).json({
    
                          MySQLError:"Failed to record events deployment details :( Please try again",
    
                          error: err
                          
                    });

                  }
            
                }
          
              });

            }
      
            console.log("event or events recorded successfully\n");

            cleanup();
    
            return res.status(200).json({
              success: true,
              address: deployedContract.options.address,
              // contractABI: deployedContract.options.jsonInterface
            });
    
        });
    
      } catch (error) {

        console.log({
          message: 'Error deploying contract',
          Error: error
        });

        cleanup();

        return res.status(500).json({
          DEPLOYEMENT_FAILED: 'Contract deployment failed due to unstable blockchain network / Traffic... Please Try Again...' 
        });
      }
    
    }
    
    function clearCache(){
    
      EventNames=[];
    
      Events = [];
    
      fileContents = '';
    
      EventLogger = '';
    
      contractAbi = '';
    
      count = 0;
    
      data="";
    
      console.log('Cleared Cache Successfully!');
    
    }
    // process.on("unhandledRejection", function(reason, p){}); 

// process.on("uncaughtException", function(reason, p){}); 

    function checkEventNames(){

      if(EventNames.length > 0){

          solify();

      }
      else{
    
          console.log("Empty Events cannot be created");
    
          clearCache();

          cleanup();
    
          return res.status(400).json({
            BadRequest: "Empty events"
        });
    
      }
    }
    
    function main() {
    
      checkEventNames();
    
    }
    
    main();

  }
  else if(!req.body){

    console.log("missing Object");

    return res.status(500).json({
      success:"MISSING POST REQUEST OBJ",
      
    });


  }
  else{

    console.log('Somethiing went wrong');

    return res.status(500).json({
      success:"Somethiing went wrong",
      
    });

  }

}