const { v4: uuid } = require('uuid')
const { generatePasswordInfo } = require('../utils/password')
const { genRandomString } = require('../utils/genRandom')
const { emailValidate, clean } = require('../utils/email')
const { User } = require('../models/db')
const DbRepertory = require('../db/DbRepertory')

const dbRepertory = new DbRepertory()

const beginUsernameDefault = 'user-'

const createUserModel = async ({ username, password, email = '' }) => {
    if (!email && !username) {
        throw {
            msg: "email and username can't be empty to create account",
            debug: {
                email,
                username,
            },
        }
    }
    if (!username) {
        username = beginUsernameDefault + Date.now() + '-' + genRandomString(7)
    }

    const passwordInfo = generatePasswordInfo(password)

    const user = {
        id: uuid(),
        username,
        passwordhash: passwordInfo.passwordHash,
        salt: passwordInfo.passwordSalt,
        strategy: passwordInfo.passwordStrategy,
        createdat: Date.now(),
    }

    if (email) {
        user.email = clean(email)
        emailValidate(user.email)
    }
    try {
        await dbRepertory.createItem(new User(user))
    } catch (err) {
        throw {
            status: 400,
            msg: err.detail,
            debug: {
                previousError: err,
                email,
                username,
            },
        }
    }
    return user
}

module.exports = {
    createUserModel,
}
