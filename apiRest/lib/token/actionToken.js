const { PASSPHRASE_JWT, PATH_PUBLIC_KEY, PATH_PRIVATE_KEY, ENVIRONMENT, EXPIRY_JWT, EXPIRY_KEY_JWT } = require('../../config')
const TokenManager = require('./manager/TokenManager')
const hash = require('./../utils/hash')
const UAParser = require('ua-parser-js')
const { Jwt } = require('../models/db')
const DbRepertory = require('../db/DbRepertory')

const uaParser = new UAParser()
const dbRepertory = new DbRepertory()
const config = {
  cert: {
    privateKeyPath: PATH_PRIVATE_KEY,
    publicKeyPath: PATH_PUBLIC_KEY,
    passphrase: PASSPHRASE_JWT
  },
  env: ENVIRONMENT
}


let tokenManager = null

const _initToken = (headers) => {
  if (!tokenManager) {
    tokenManager = new TokenManager(config, headers)
  }
}

const _getUserAgent = (userAgent) => {
  uaParser.setUA(userAgent)

  return uaParser.getResult()
}

const generateToken = async ({ user, genType = 'authJwt', expJwt = null, headers = null, key = false }) => {
  let sigKey = await dbRepertory.getByIdItem(new Jwt({ id: user.id }))

  _initToken(headers)
  const uaParsed = _getUserAgent(headers['user-agent'])
  const ua = hash.sha256(headers['user-agent'])
  const uaDetail = {
    browser: uaParsed.browser.name,
    engine: uaParsed.engine.name,
    os: uaParsed.os.name,
    device: uaParsed.device.type,
  }

  const data = {
    userId: user.id,
    genType,
    ua
  }

  if (!expJwt) {
    expJwt = Date.now() + EXPIRY_JWT
  }

  const sigJwt = tokenManager.encode(data, expJwt)

  const jwtInfo = {
    jwtHash: hash.md5(sigJwt),
    uaHash: ua,
    uaDetail
  }
  if (key && !sigKey) {
    await dbRepertory.createItem(new Jwt({
      exp: Math.floor(Date.now() / 1000) + EXPIRY_KEY_JWT,
      id: user.id,
      jwtlst: JSON.stringify([jwtInfo])
    }))
  } else {
    sigKey = sigKey || await dbRepertory.getByIdItem(new Jwt({ id: user.id }))
    sigKey.jwtlst = JSON.parse(sigKey.jwtlst)
    sigKey.jwtlst.push(jwtInfo)
    sigKey.jwtlst = JSON.stringify(sigKey.jwtlst)
    await dbRepertory.updateItem(new Jwt(sigKey), 'jwtlst', sigKey.jwtlst)
  }

  return sigJwt
}

const deleteToken = async ({ jwt = '', payload = null, headers = null}) => {
  if (!payload && !jwt) {
    throw {
      status: 500,
      msg: 'token to remove',
      debug: {
        jwt,
        payload
      }
    }
  }
  _initToken(headers)

  if (!payload) {
    payload = tokenManager.decode(jwt, { ignoreExpiration: true })
  }

  return await dbRepertory.deleteItem(new Jwt({ id: payload.userId }))
}

const decodeToken = (token, opt= {}, headers = null) => {
  _initToken(headers)

  return tokenManager.decode(token, opt)
}

const getToken = (headers) => {
  _initToken(headers)

  return tokenManager.headers[tokenManager.TOKEN_HEADER]
}


const getTokenFromDb = (headers) => {
  _initToken(headers)

  return tokenManager.headers[tokenManager.TOKEN_HEADER]
}
module.exports = {
  generateToken,
  deleteToken,
  decodeToken,
  getToken,
  tokenManager
}
