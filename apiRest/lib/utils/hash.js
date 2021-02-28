const { createHash, createHmac } = require('crypto')

const getHash = (text, algorithm = 'sha256') => {
    return createHash(algorithm).update(text, 'utf8').digest('hex')
}

const getHmac = (text, salt, algorithm = 'sha256') => {
    return createHmac(algorithm, salt).update(text, 'utf8').digest('hex')
}

const sha1 = (text, salt) => {
    return salt ? getHmac(text, salt, 'sha1') : getHash(text, 'sha1')
}

const sha256 = (text, salt) => {
    return salt ? getHmac(text, salt, 'sha256') : getHash(text, 'sha256')
}

const sha512 = (text, salt) => {
    return salt ? getHmac(text, salt, 'sha512') : getHash(text, 'sha512')
}

const md5 = (text, salt) => {
    return salt ? getHmac(text, salt, 'md5') : getHash(text, 'md5')
}

module.exports = {
    md5,
    sha1,
    sha256,
    sha512
}