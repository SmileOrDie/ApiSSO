const DbRepertory = require('../lib/db/DbRepertory')
const hash = require('../lib/utils/hash')
const authUser = require('../lib/middleware/authUser')
const { Jwt, User } = require('../lib/models/db')

const dbRepertory = new DbRepertory()

const logOut = async (req) => {
    const { user, sigKeyPayload, sigJwt } = await authUser(req)
    let find = false

    sigKeyPayload.jwtlst = JSON.parse(sigKeyPayload.jwtlst)

    const sigJwtHash = hash.md5(sigJwt)
    for (let index = 0; index < sigKeyPayload.jwtlst.length; index++) {
        if (sigKeyPayload.jwtlst[index] && sigKeyPayload.jwtlst[index].jwtHash === sigJwtHash) {
            sigKeyPayload.jwtlst.splice(index, 1)
            find = true
            break
        }
    }
    if (!find) {
        return {
            data: {
                message: 'user already disconnect'
            }
        }
    }
    sigKeyPayload.jwtlst = JSON.stringify(sigKeyPayload.jwtlst)
    if (sigKeyPayload.jwtlst.length === 0) {
        await dbRepertory.deleteItem(new Jwt({sigKeyPayload}))
    } else {
        await dbRepertory.updateItem(new Jwt(sigKeyPayload), 'jwtlst', sigKeyPayload.jwtlst)
    }

    user.logoutat = Math.floor(Date.now() / 1000)
    user.updatedat = user.logoutat
    await dbRepertory.updateItem(new User(user))

    return {
        data: {
            message: 'user disconnected'
        }
    }
}

module.exports = logOut