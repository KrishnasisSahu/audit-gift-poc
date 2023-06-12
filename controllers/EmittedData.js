var Web3 = require('web3');

var pool = require('../databaseConfig');

require("dotenv").config();

const web3 = new Web3(process.env.ALCHEMY_WEBSOCKET);
 
module.exports.emitevents = async function(req, res){

  var eventabi = '';

  var stringpayload = '';

  var searchValue ='';

  var data = [];
 
  var items = Number(req.query.noOfItems);

  var page = Number(req.query.pageNo);

  console.log(items + "page " +page)
  
  if(req.body){

    var reqs = req.body;

    var json__ = JSON.stringify(reqs);

    var jsonevents = (JSON.parse(json__));

    var finalJson = jsonevents.data;
 
    var contractAddress = jsonevents.address;
  
    pool.query (`select address,abi from smart_contracts where address = ?`,[contractAddress],
      (error, results, ) => {

        if (error) {

          res.status(500).json({
            Error : error
          })
          
        }

        stringpayload = results[0];

        if(results.length === 0){

          res.status(500).json({
            success : '0',
            result : "Address or abi is invalid or not found"
          })
          
        }
        else if(results.length > 0){

          eventabi =  JSON.parse(stringpayload.abi);
          
          async function main() {
            
            const contract = new web3.eth.Contract(eventabi, contractAddress);

            var from = 0;
          
            var to = "latest";

            contract.getPastEvents('allEvents', {

                fromBlock: from,

                toBlock : to
              }, 
              function(error, events){

                if(items > 0 && page > 0){
                                
                  events.reverse();

                  var totalCount = events.length;

                  const stratIndex = (page - 1) * items;

                  const endIndex = stratIndex + items;

                  const pageData = events.slice(stratIndex, endIndex);
    
                  res.status(200).json({
                    success : "1",
                    result : pageData,
                    totalCount : totalCount
                  })

                }
                else if (Object.keys(req.query).length >0){

                  var queryName = req.query;

                  var  searchKey = Object.keys(queryName)[0];

                  var  searchkey1 = Object.keys(queryName)[1];

                  var  searchkey2 = Object.keys(queryName)[2]
                
                  var  searchValue = Object.values(queryName)[0];

                  var  searchValue1 = Object.values(queryName)[1];

                  var  searchValue2 =  Object.values(queryName)[2];
                
                  try {

                    type = searchKey;

                    type1 = searchkey1;

                    type2 = searchkey2;

                    value = searchValue;

                    value1 = searchValue1;

                    value2 = searchValue2;
                  
                    for (let i=0; i<=events.length-1; i++)
                    {
                      
                      if((
                        (type === 'search' && type1 === 'fromdate' && type2=== 'todate') && 
                        (value === events[i].event && events[i].returnValues.date >= value1  && events[i].returnValues.date <= value2)))
                      {
                          data.push(events[i]);
                      }
                      
                      else{
                              
                        revert = 'NO Records Found'

                      }

                    }
                    
                    if(data.length > 0){

                      res.status(200).json({
                          success : "1",
                          result : data
                        });

                    }
                    else{

                        res.status(200).json({
                          success : "0",
                          result  : revert
                        })
                        
                    }

                  } catch (error) {

                    console.log(error);

                    res.status(500).json({
                      InvalidRequest: 'Error retrieving events'
                    });
                    
                  }
                
                }
              
                else{
                  
                  console.log('Somethiing went wrong');

                  return res.status(500).json({
  
                    Error: "Somethiing went wrong",
                                        
                  }); 

                }
               
              }

            ) 

          }

          main();

        }

      }

    )
  
  }
  else if(!req.body){

    console.log("missing address");

      return res.status(500).json({
        InvalidRequest: "MISSING POST REQUEST address" 
      });

  }
  else{

    console.log('Somethiing went wrong');
    
    return res.status(500).json({
      
      Error:"Somethiing went wrong",
      
    });     
    
  }

}



