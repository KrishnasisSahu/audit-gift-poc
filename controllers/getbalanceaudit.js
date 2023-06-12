module.exports = {

    fetchbal: (req ,res) => {

        let roleId = req.query.roleId;

        // console.log(typeof roleId);

        // console.log(roleId === "2")

        if(roleId === "2"){

            const Web3 = require('web3');
    
            const HDWalletProvider = require('@truffle/hdwallet-provider');
            
            const web3 = new Web3();
            
            require('dotenv').config();
        
            const {PRIVATE_KEY, POLYGON_MUMBAI_RPC, PUBLIC_KEY} = process.env 
        
            // initialize the web3 instance with the Mumbai test network provider and the specified private key
            const provider = new HDWalletProvider(PRIVATE_KEY, POLYGON_MUMBAI_RPC);
        
            web3.setProvider(provider);
    
            web3.eth.getBalance(PUBLIC_KEY,function(err,result){
    
                if(err){
    
                  console.log(err);
    
                } else {
    
                    return res.status(200).json({
                        success: true,
                        balance: web3.utils.fromWei(result, "ether") + " ETH"
                        // contractABI: deployedContract.options.jsonInterface
                      });
               }
           
      
              })

        }
        else{
            return res.status(401).json({
                UNAUTHORIZED: "SUPER ADIMN ONLY OPERATION"
              });
        }

    }
}