const DbManager = require('./DbManager')
const { JWT_TABLE } = require('../../../config')

class Jwt extends DbManager {
    constructor (userData) {
        super(userData, JWT_TABLE)
    }
}

module.exports = Jwt