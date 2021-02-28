const { HEADER_NAME } = require('../config')
const { generateToken } = require('../lib/token/actionToken')
const { createUserModel } = require('../lib/utils/genUserModel')
const { createProfileModel } = require('../lib/utils/genProfileModel')
const { emailValidate } = require('../lib/utils/email')
const newUser = require('../lib/middleware/newUser')

const signup = async (req) => {
    const { body: { login, password, confirm_password } } = await newUser(req, ['login', 'password', 'confirm_password'])

    if (password !== confirm_password) {
        throw {
            msg: "password and confirm_password can't be different",
            debug: {
                password,
                confirm_password,
            },
        }
    }

    let user
    try {
        emailValidate(login)
        user = await createUserModel({ email: login, password })
    } catch (warning) {
        const defaultRegex = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/)
        if (login && defaultRegex.test(login)) {
            console.warn('Email-Invalide it set like username' , warning, login)
        }

        user = await createUserModel({ username: login, password })
        console.log(user)
    }

    await createProfileModel(user)

    const sigJwt = await generateToken({
        user,
        genType: 'signup',
        headers: req.headers,
        key: true,
    })

    return {
        data: {
            message: 'New user saved',
            sigJwt,
        },
        headers: {
            [HEADER_NAME]: sigJwt,
        },
    }
}

module.exports = signup
