const hash = require('./hash')
const { genRandomString } = require('./genRandom')
/**
 * @param {string} password
 * @param {string} salt
 *
 * @return {string}
 * @private
 */
const hashPassword = (password, salt) => {
  const sh512 = hash.sha512(password, salt)
  return sh512
}

/**
 * @param {string} password
 *
 * @return {{passwordSalt: string, passwordHash: string}}
 * @private
 */
const _saltHashPassword = (password) => {
  const passwordSalt = genRandomString(16)
  const passwordHash = hashPassword(password, passwordSalt)
  return { passwordSalt, passwordHash }
}

/**
 * @param {string} passwordRaw
 *
 * @return {{passwordStrategy: string, passwordSalt: string, passwordHash: string}}
 */
const generatePasswordInfo = (passwordRaw) => {
  const passwordInfo = _saltHashPassword(passwordRaw)
  passwordInfo.passwordStrategy = 'sigPwd512'

  return passwordInfo
}

module.exports = {
  generatePasswordInfo,
  genRandomString,
  hashPassword
}
