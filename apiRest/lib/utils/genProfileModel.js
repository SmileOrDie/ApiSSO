const { Profile } = require('../models/db')
const DbRepertory = require('../db/DbRepertory')
const { genRandomString } = require('../utils/genRandom')

const dbRepertory = new DbRepertory()

const PROFILE_FIELDS = ['username', 'lastname', 'firstname', 'birthday', 'gender', 'country', 'city', 'adress', 'zipcode', 'avatar']

const createProfileModel = async ({ id, username, email, lastname = '', firstname = '', birthday = '', gender = '', country = '', city = '', adress = '', zipcode = '', avatar = '' }) => {
    const profile = {
        id,
        username,
        lastname,
        firstname,
        birthday,
        gender,
        country,
        city,
        adress,
        zipcode,
        avatar
    }

    profile.email = (email) ? email : "defaultEmail" + Date.now() + '-' + genRandomString(7) + "@noEmail.com"

    await dbRepertory.createItem(new Profile(profile))

    return profile
}

const updateProfileModel = async (data) => {
    let profile = {
        id: data.id
    }
    for (const [key, value] of Object.entries(data)) {
        if (PROFILE_FIELDS.includes(key)) {
            profile[key] = value
        }
    }

    await dbRepertory.updateItem(new Profile(profile))
    delete profile.id
    return profile
}
module.exports = {
    createProfileModel,
    updateProfileModel
}