const DbManager = require('./DbManager')
const { PROFILE_TABLE } = require('../../../config')

class Profile extends DbManager {
    constructor (profileData) {
        super(profileData, PROFILE_TABLE)
    }
}

module.exports = Profile