const express = require('express')
const path = require('path')
const { readFileSync } = require('fs')
const user = require('./handler')
const errorHandler = require('./lib/middleware/errSig')
const react = require('./lib/middleware/react')
const bdCreate = require('./lib/db/dbConfig')
const portApi = process.env.PORT || 5000

bdCreate().then(console.log('db charged Done!'))

const app = express()
app.use(express.json())

app.use(express.static(path.resolve(__dirname, '../../public')))

app.get('/profile', async (req, response) => {
    const { body, statusCode, headers } = await errorHandler(user.getProfile, req, 'getProfile')

    if (headers){
        for (const [key, value] of Object.entries(headers)) {
            response.setHeader(key, value)
        }
    }

    response.status(statusCode).json(body)
})

app.get('/logout', async (req, response) => {
    const { body, statusCode } = await errorHandler(user.logOut, req, 'logOut')

    response.status(statusCode).json(body)
})

app.post('/profile', async (req, response) => {
    const { body, statusCode, headers } = await errorHandler(user.updateProfile, req, 'updateProfile')

    if (headers){
        for (const [key, value] of Object.entries(headers)) {
            response.setHeader(key, value)
        }
    }

    response.status(statusCode).json(body)
})

app.post('/login', async (req, response) => {
    const { body, statusCode, headers } = await errorHandler(user.logIn, req, 'logIn')

    if (headers){
        for (const [key, value] of Object.entries(headers)) {
            response.setHeader(key, value)
        }
    }

    response.status(statusCode).json(body)
})

app.post('/signup', async (req, response) => {
    const { body, statusCode, headers } = await errorHandler(user.signUp, req,'signUp')

    if (headers){
        for (const [key, value] of Object.entries(headers)) {
            response.setHeader(key, value)
        }
    }

    response.status(statusCode).json(body)
})

app.get('/public-key', async (req, response) => {
    const publicKey = readFileSync(__dirname + '/ressources/jwt/public-key.pem', 'utf8').toString()
    response.status(200).json({ publicKey })
})

app.use(react)

app.listen(portApi, () => {
    console.log(`apiSigame listen to ${portApi}`)
})
