const { readFileSync } = require('fs')
const crypto = require('crypto')

class CertificateManager {
  /**
   * @param {string} publicKeyPath
   * @param {boolean} privateKeyPath
   * @param {string|null} passphrase
   */
  constructor (publicKeyPath, privateKeyPath = null, passphrase = null) {
    this.privateKeyPath = privateKeyPath
    this.publicKeyPath = publicKeyPath
    this.passphrase = passphrase
  }

  /**
   * @returns {Object}
   */
  getCert () {
    return {
      key: this.getPrivateKey(),
      passphrase: this.passphrase
    }
  }

  /**
   * @returns {string}
   */
  getPrivateKey () {
    if (!this.privateKey) {
      this.privateKey = readFileSync(__dirname + this.privateKeyPath, 'utf8').toString()
    }

    return this.privateKey
  }

  /**
   * @returns {string}
   */
  getPublicKey () {
    if (!this.publicKey) {
      this.publicKey = readFileSync(__dirname + this.publicKeyPath, 'utf8').toString()
    }

    return this.publicKey
  }

  /**
   * @returns {string}
   */
  getKeyId () {
    return crypto.createHash('sha1').update(this.getPublicKey(), 'utf8').digest('hex')
  }
}

module.exports = CertificateManager
