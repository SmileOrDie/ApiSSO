const actionToken = require('../token/actionToken')
const hash = require('../utils/hash')
const { HEADER_NAME } = require('../../config')
const DbRepertory = require('../db/DbRepertory')
const { User, Jwt } = require('../models/db')

const dbRepertory = new DbRepertory()

const _hasField = (obj, fieldMandatoryLst) => {
  const fieldEmpty = []

  for (const field of fieldMandatoryLst) {
    if (!obj[field]) {
      fieldEmpty.push(field)
    }
  }
  if (fieldEmpty.length > 0) {
    throw {
      status: 400,
      msg: 'this field can\'t be empty or undefined : ' + fieldEmpty.join(', '),
      debug: {
        obj,
        fieldMandatoryLst,
        fieldEmpty
      }
    }
  }
}

const _isJwtExpired = (sigJwtPayload) => {
  return (Date.now() - sigJwtPayload.exp) < 0
}

const _hasKey = (sigKeyPayload, sigJwtHash) => {
  sigKeyPayload.jwtlst = JSON.parse(sigKeyPayload.jwtlst)
  for (let index = 0; index < sigKeyPayload.jwtlst.length; index++) {
    if (sigKeyPayload.jwtlst[index] && sigKeyPayload.jwtlst[index].jwtHash === sigJwtHash) {
      return true
    }
  }
  return false
}

const authUser = async ({ headers, body}, fieldBodyLst = [], fieldHeadearsLst = []) => {
  fieldHeadearsLst.push(HEADER_NAME)
  _hasField(body, fieldBodyLst)
  _hasField(headers, fieldHeadearsLst)

  let renewSigJwt = false

  // Todo add extract from Cookies
  let sigJwt = headers[HEADER_NAME]

  let sigJwtPayload = actionToken.decodeToken(sigJwt, { ignoreExpiration: true }, headers)
  const sigJwtHash = hash.md5(sigJwt)

  const user = await dbRepertory.getByIdItem(new User({ id: sigJwtPayload.userId }))
  let sigKeyPayload = null
  if (user) {
    sigKeyPayload = await dbRepertory.getByIdItem(new Jwt(user))
  }

  if (!sigKeyPayload || !_hasKey(sigKeyPayload, sigJwtHash)) {
    throw {
      status: 403,
      msg: 'Token key expired or deleted',
      debug: {
        jwtlst: (!sigKeyPayload) ? undefined : JSON.stringify(sigKeyPayload.jwtlst, null, 2),
        sigJwtHash
      }
    }

  }
  if (_isJwtExpired(sigJwtPayload)) {
    if (!sigKeyPayload || _isJwtExpired(sigKeyPayload)) {
      await actionToken.deleteToken({ jwt: sigJwt })
      throw {
        status: 401,
        msg: 'Token key expired or deleted',
        debug: {
          sigKeyPayload,
          sigJwtHash
        }
      }
    }
    sigJwt = await actionToken.generateToken({ user , genType: 'authUser', headers})
    renewSigJwt = true
  }


  return { sigJwt, user, sigJwtPayload, renewSigJwt, sigKeyPayload }
}

module.exports = authUser
