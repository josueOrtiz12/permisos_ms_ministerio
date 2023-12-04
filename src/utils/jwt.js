const jwt = require('jsonwebtoken');
const { env: { APP_SECRET_KEY, APP_EXP_TIME } } = process

function generateToken(payload, expiresIn = APP_EXP_TIME, secretKey = APP_SECRET_KEY, options = {}) {

    return jwt.sign(payload, secretKey, {expiresIn : expiresIn , ...options})
}

function verifyToken(token, secretKey = APP_SECRET_KEY) {
   
    try {
        const decoded = jwt.verify(token, secretKey);
        const { exp, ...payload } = decoded;
        console.log(`pipi ${secretKey}`);
        return { payload, exp };
    } catch (e) {
        throw new Error(e.message);
    } 
}

module.exports = {
    generateToken,
    verifyToken
}