var pool = require('../databaseConfig');
const {signupValidation , loginValidation } = require('../controllers/validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenKey = process.env.TOKEN_KEY;
const {encrypt, decrypt} = require("../helper/AES");

module.exports = {
    signupValidation : (req, res, next) => {
       // console.log(req.body)
    
        pool.query(
        `SELECT * FROM users WHERE LOWER(emailId) = LOWER(${pool.escape(
        req.body.emailId
        )});`,
        (err, result) => {
        if (result.length) {
        return res.status(409).send({
        msg: 'User already exist with same email ID'
        });
        } else {
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)
        
        //console.log(req.body.tenantId.id)
        pool.query(`select * from users where tenantId = ?`,[Number(decrypt(req.body.tenantId.id))],(error, results, ) => {
            // console.log(results.length)
            
  
              if (error) {
                  console.log(error);
                  return res.status(500).send({
                    msg : error
                  });
                }
           if(results.length >0){
            pool.query(
                `INSERT INTO users (fName,lName, emailId,mobileNumber, passwordSalt,roleId,tenantId) VALUES ('${req.body.fName}','${req.body.lName}',${pool.escape(req.body.emailId)},'${req.body.mobileNumber}', ${pool.escape(hash)},3,${Number(decrypt(req.body.tenantId.id))})`,
                (err, result) => {
                if (err) {
                throw err;
                return res.status(400).send({
                msg: err
                });
                }
                return res.status(201).send({
                msg: 'The user has been registered with us!'
                });
                }
                );
            
           }
           else if(results.length===0) {
            pool.query(
                `INSERT INTO users (fName,lName, emailId,mobileNumber, passwordSalt,roleId,tenantId) VALUES ('${req.body.fName}','${req.body.lName}',${pool.escape(req.body.emailId)},'${req.body.mobileNumber}', ${pool.escape(hash)},1,${Number(decrypt(req.body.tenantId.id))})`,
                (err, result) => {
                if (err) {
                throw err;
                return res.status(400).send({
                msg: err
                });
                }
                return res.status(201).send({
                msg: 'The user has been registered with us!'
                });
                }
                );
           }
           else{
            return res.status(400).send({
                msg: 'Something went wrong!'
            });
           }
        }) 
       
   
    

}
}
);
},

    loginValidation : (req, res, next) => {
    pool.query(
    `SELECT * FROM users WHERE emailId = ${pool.escape(req.body.emailId)};`,
    (err, result) => {
    // user does not exists
    if (err) {
    throw err;
    return res.status(400).send({
    msg: err
    });
    }
    if (!result.length) {
    return res.status(400).send({
    msg: 'Email or password is incorrect!'
    });
    }
    
    bcrypt.compare(
        req.body.password,

        result[0]['passwordSalt'],
        
        (bErr, bResult) => {
        // wrong password
        if (bErr) {
        throw bErr;
        return res.status(400).send({
        msg: 'Email or password is incorrect!'
        });
        }
        if (bResult) {
        const token = jwt.sign({id:result[0].id,emailId:result[0].emailId},tokenKey,{ expiresIn: '1h' });
        pool.query(
        `UPDATE users SET logintime = now() WHERE id = '${result[0].id}'`
        );
        
        //setting the userdetails
        var userDetails = {};
        userDetails.id = encrypt(result[0].id);
        userDetails.fName = result[0].fName;
        userDetails.lName = result[0].lName;
        userDetails.emailId = result[0].emailId;
        userDetails.profile = result[0].profile;
        userDetails.roleId = result[0].roleId;
        userDetails.tenantId = encrypt(result[0].tenantId);
        userDetails.loginTime = result[0].loginTime;

        return res.status(200).send({
        msg: 'Logged in!',
        token,
        user: userDetails
        
        });
        }
        return res.status(400).send({
        msg: 'Username or password is incorrect!'
        });
        }
        );
        }
        );
        }};
