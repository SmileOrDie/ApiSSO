const { HEADER_NAME } = require('../config')
const { generateToken } = require('../lib/token/actionToken')
const DbRepertory = require('../lib/db/DbRepertory')
const newUser = require('../lib/middleware/newUser')
const authUser = require('../lib/middleware/authUser')
const { hashPassword } = require('../lib/utils/password')
const { emailValidate } = require('../lib/utils/email')
const { User } = require('../lib/models/db')

const dbRepertory = new DbRepertory()

const sigError = {
  status: 400,
  debug: {}
}

const logIn = async (req) => {
  let user = null
  if (req.headers[HEADER_NAME]) {
    const data = await authUser(req)
    return {
      data: {
        message: 'user log',
        renewSigJwt: data.renewSigJwt,
        sigJwt: data.sigJwt
      },
      headers:{
        [HEADER_NAME]: data.sigJwt
      }
    }
  }
  const {body: { password, login }} = await newUser(req, ['login', 'password'])
  if (login) {
    try {
      emailValidate(login)
      user = await dbRepertory.getByEmailItem(new User({ email: login }))
    } catch (e) {
      user = await dbRepertory.getByUsernameItem(new User({ username: login }))
    }

  }

  if (!user){
    sigError.msg = 'Unknow account.'
    sigError.debug.login = login
    throw sigError
  }

  const passwordHash = hashPassword(password, user.salt)
  if (passwordHash !== user.passwordhash) {
    sigError.msg = 'Wrong password.'
    sigError.debug.login = login
    sigError.debug.user = user
    throw sigError
  }

  [, sigJwt] = await Promise.all([
    dbRepertory.updateItem(new User(user), 'lastloginat', Date.now()),
    generateToken({ user, genType: 'login', headers: req.headers, key: true })
  ])

  return {
    data: {
      message: 'user log',
      sigJwt
    },
    headers:{
      [HEADER_NAME]: sigJwt
    }
  }
}

module.exports = logIn
