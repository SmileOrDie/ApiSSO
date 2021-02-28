const { HEADER_NAME } = require('../config')
const DbRepertory = require('../lib/db/DbRepertory')
const authUser = require('../lib/middleware/authUser')
const { updateProfileModel } = require('../lib/utils/genProfileModel')
const { User } = require('../lib/models/db')

const dbRepertory = new DbRepertory()

const updateProfile = async (request) => {
  const { sigJwt, user, renewSigJwt } = await authUser(request)

  user.logoutat = Math.floor(Date.now() / 1000)
  user.updatedat = user.logoutat

  const [, profileFieldUpdated] = await Promise.all([
    dbRepertory.updateItem(new User(user)),
    updateProfileModel({ ...request.body, id: user.id } )
  ])

  return {
    data: {
      message: 'profile updated',
      renewSigJwt,
      profileFieldUpdated,
      sigJwt
    },
    headers:{
      [HEADER_NAME]: sigJwt
    }
  }
}

module.exports = updateProfile
