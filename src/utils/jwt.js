function generateToken(payload, secretKey, options = {}) {
    return jwt.sign(payload, secretKey, options)
}

function verifyToken(token, secretKey) {
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