const { v4: uuid } = require('uuid')
const { generatePasswordInfo } = require('../utils/password')
const { genRandomString } = require('../utils/genRandom')
const { emailValidate, clean } = require('../utils/email')
const { User } = require('../models/db')
const DbRepertory = require('../db/DbRepertory')

const dbRepertory = new DbRepertory()

const createUserModel = async ({ email, username, password }) => {
    if (!email && !username) {
        throw {
            msg: "email and username can't be empty to create account",
            debug: {
                email,
                username,
            },
        }
    }

    if (email) {
        email = clean(email)
        emailValidate(email)
    }
    if (!username) {
        username = 'user-' + Date.now() + '-' + genRandomString(6)
    }

    const passwordInfo = generatePasswordInfo(password)

    const user = {
        id: uuid(),
        email,
        username,
        passwordhash: passwordInfo.passwordHash,
        salt: passwordInfo.passwordSalt,
        strategy: passwordInfo.passwordStrategy,
        createdat: Date.now(),
    }
    await dbRepertory.createItem(new User(user))
    return user
}

module.exports = {
    createUserModel,
}
