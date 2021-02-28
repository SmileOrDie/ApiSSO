const DbManager = require('./DbManager')
const { USER_TABLE } = require('../../../config')

class User extends DbManager {
    constructor (userData) {
        super(userData, USER_TABLE)
    }
}

module.exports = User