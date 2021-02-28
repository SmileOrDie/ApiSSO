const { sign, verify } = require('jsonwebtoken')
const CertificateManager = require('./CertificateManager')

const defaultConfig = { env: 'local', cert: { privateKeyPath: false, publicKeyPath: false, passphrase: null } }

class TokenManager {
  /**
     * @param {{cert: {privateKeyPath: string, publicKeyPath: string, passphrase: null}, env: string}} config
     * @param {Object} headers
     */
  constructor (config = defaultConfig, headers = {}) {
    this.TOKEN_HEADER = 'x-sig-jwt'
    this.config = config
    this.headers = headers
    this.certificateManager = new CertificateManager(
      this.config.cert.publicKeyPath,
      this.config.cert.privateKeyPath,
      this.config.cert.passphrase
    )
  }

  /**
   * @param {Object} headers
   */
  setHeaders (headers) {
    this.headers = headers
  }

  /**
   * @param {string} token
   * @param {Object} opt
   *
   * @return {Object}
   */
  decode (token, opt = {}) {
    const publicKey = this.certificateManager.getPublicKey()
    const options = this._getTokenOptions(opt)
    return verify(token, publicKey, options)
  }

  /**
     * @param {Object} data
     * @param {number} expiry second
     * @returns {string}
     */
  encode (data, expiry) {
    const cert = this.certificateManager.getCert()
    const options = this._getTokenOptions()

    return sign({ ...data, exp: expiry }, cert, options)
  }

  /**
     * @protected
     * @returns {Object}
     */
  _getTokenOptions (opt = {}) {
    return {
      ...opt,
      keyid: this.certificateManager.getKeyId(),
      algorithm: 'RS256'
    }
  }
}

module.exports = TokenManager
