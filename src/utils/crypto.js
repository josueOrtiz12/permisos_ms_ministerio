const crypto = require('crypto');
const { env: { APP_RANDOM_BYTES, APP_DIGEST } } = process

// const salt = crypto.randomBytes(parseInt(APP_RANDOM_BYTES || 32)).toString('hex');
const salt = 'salt'

function hashString(string) {
    return crypto.pbkdf2Sync(string, salt, 100000, 64, APP_DIGEST || 'sha256').toString('hex');
}

function hashCompare(string) {
    return crypto.pbkdf2Sync(string, salt, 100000, 64, APP_DIGEST || 'sha256').toString('hex');
}

module.exports = {
    hashString,
    hashCompare
}