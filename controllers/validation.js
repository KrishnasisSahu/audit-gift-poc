const { check } = require('express-validator');
 
exports.signupValidation = [
     check('fName', 'fName is requied').not().isEmpty(),
     check('lName', 'lName is required').not().isEmpty(),
     check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
     check('mobileNumber','please include a valid mobilenumber').not().isEmpty(),
     check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
     check('tenantId','please include a valid tenantId').not().isEmpty()
 ]

exports.loginValidation = [
     check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
     check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
 
]
