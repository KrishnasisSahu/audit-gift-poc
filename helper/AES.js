/**
 * AES Encryption/Decryption with AES-256-CBC 
 * @type {exports}
 */

// load the build-in crypto functions
var crypto = require('crypto');
const messages = require('../common/messages');
const { SECRET_KEY, SECRET_IV } = process.env

// encrypt/decrypt functions
module.exports = {
    encrypt: function(data){
        try {
            var iv = SECRET_IV;
            var key = SECRET_KEY;
           
            // AES 256 CBC Mode
            var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

            // encrypt the given text
            var encrypted = Buffer.concat([cipher.update(data.toString(), 'utf8'), cipher.final()]);

            // generate output
            return encrypted.toString('base64');

        }catch(e){
            console.log(e.message);
            throw new Error(messages.ENCRYPTION_ERROR_MESSAGE);
        }
    },

    decrypt:function(data){
        try {
            // base64 decoding
            var bData = Buffer.from(data, 'base64');

            var iv = SECRET_IV;
            var key = SECRET_KEY;

            // AES 256 CBC Mode
            var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

            // decrypt the given text
            var decrypted = decipher.update(bData, 'binary', 'utf8') + decipher.final('utf8');
            
            return decrypted;

        }catch(e){
            console.log(e.message);
           
            if(data != null || (typeof data) != (undefined) || !"".equals(data) ) return data;
        }
        return null;
    }
};