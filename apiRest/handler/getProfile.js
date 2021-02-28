const authUser = require('../lib/middleware/authUser')
const { HEADER_NAME } = require('../config')
const DbRepertory = require('../lib/db/DbRepertory')
const { Profile } = require('../lib/models/db')

const dbRepertory = new DbRepertory()

const getProfile = async (request) => {
  const { sigJwt, user, renewSigJwt} = await authUser(request)

  const userProfile = await dbRepertory.getByIdItem(new Profile(user))
  delete userProfile.id

  return {
    data: {
      message: 'user Profile',
      userProfile,
      renewSigJwt,
      sigJwt
    },
    headers:{
      [HEADER_NAME]: sigJwt
    }
  }
}

module.exports = getProfile
