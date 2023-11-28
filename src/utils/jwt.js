const jwt = require('jsonwebtoken');
const { env: { APP_SECRET_KEY } } = process

function generateToken(payload, secretKey = APP_SECRET_KEY, options = {}) {
    return jwt.sign(payload, secretKey, options)
}

function verifyToken(token, secretKey = APP_SECRET_KEY) {
    try {
        const decoded = jwt.verify(token, secretKey)
        return decoded;
    } catch (e) {
        throw new Error(e)
    }
}


module.exports = {
    generateToken,
    verifyToken
}