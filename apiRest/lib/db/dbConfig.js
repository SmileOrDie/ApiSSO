const { ENV_PG_VARS, JWT_TABLE, USER_TABLE, PROFILE_TABLE, ENVIRONMENT } = require('../../config')
const { Client } = require('pg')

const request = async (query) => {
    const client = new Client(ENV_PG_VARS)
    await client.connect()
    client.query(query, (err, res) => {
        client.end()
        if (err) {
            return err
        }
        return res
    })

}

const bdCreate = async () => {
    const tableJwt = JWT_TABLE + ((ENVIRONMENT) ? '_' + ENVIRONMENT  : '')
    const tableUser = USER_TABLE + ((ENVIRONMENT) ? '_' + ENVIRONMENT  : '')
    const tableProfile = PROFILE_TABLE + ((ENVIRONMENT) ? '_' + ENVIRONMENT  : '')

    await request(`CREATE TABLE IF NOT EXISTS ${tableUser} (
        id VARCHAR UNIQUE PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        createdAt BIGINT NOT NULL,
        lastLoginAt BIGINT,
        logoutAt BIGINT,
        updatedAt BIGINT,
        passwordHash VARCHAR,
        strategy VARCHAR(40),
        salt VARCHAR(40)
    )`)

    await request(`CREATE TABLE IF NOT EXISTS ${tableProfile} (
        id VARCHAR UNIQUE PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        username VARCHAR(255) UNIQUE,
        lastname VARCHAR(255),
        firstname VARCHAR(255),
        birthday VARCHAR(255),
        gender VARCHAR(255),
        country VARCHAR(255),
        city VARCHAR(255),
        adress VARCHAR(255),
        zipcode VARCHAR(255),
        avatar VARCHAR(255)
    )`)

    await request(`CREATE TABLE IF NOT EXISTS  ${tableJwt} (
        id VARCHAR UNIQUE PRIMARY KEY,
        jwtLst VARCHAR,
        exp BIGINT,
        revokedAt BIGINT
    )`)

}

module.exports = bdCreate