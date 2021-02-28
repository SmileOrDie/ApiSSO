const DbRepertory = require('../db/DbRepertory')
const { User } = require('../models/db')

const dbRepertory = new DbRepertory()

const _hasField = (obj, fieldMandatoryLst) => {
    const fieldEmpty = []
    if (fieldMandatoryLst.length > 0 && !obj) {
        throw {
            status: 400,
            msg: 'object can\'t be undefined',
            debug: {
                obj,
                fieldMandatoryLst
            }
        }
    }

    for (const field of fieldMandatoryLst) {
        if (!obj[field]) {
            fieldEmpty.push(field)
        }
    }
    if (fieldEmpty.length > 0) {
        throw {
            status: 400,
            msg: 'this field can\'t be empty or undefined : ' + fieldEmpty.join(', '),
            debug: {
                obj,
                fieldMandatoryLst,
                fieldEmpty
            }
        }
    }
}

const newUser = async ({ headers, body}, fieldBodyLst = [], fieldHeadearsLst = []) => {
    _hasField(body, fieldBodyLst)
    _hasField(headers, fieldHeadearsLst)

    // try {
    //     const user = await dbRepertory.getByEmailItem(new User({ email: body.email }))
    //     // console.log(user)
    // } catch (err) {
    //     // console.error(err)
    // }
    return { body, headers}
}

module.exports = newUser