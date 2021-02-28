let envVars

if (process.env.NODE_ENV === 'production') {
    envVars = {
        env: '',
        pg: {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        }
    }
} else {
    envVars = require('../.localEnv')
}

module.exports = {
    ENV_PG_VARS: envVars.pg,
    ENVIRONMENT: envVars.env,

    PASSPHRASE_JWT: 'SigameJsonWebToken',
    PATH_PUBLIC_KEY: '/../../../ressources/jwt/public-key.pem',
    PATH_PRIVATE_KEY: '/../../../ressources/jwt/private-key.pem',

    EXPIRY_JWT: 60 * 2,
    EXPIRY_KEY_JWT: 3600 * 24 * 365,
    EXPIRY_COOKIE: 3600 * 24 * 7,
    HEADER_NAME: 'x-sig-jwt',

    USER_TABLE: 'sigame_users',
    JWT_TABLE: 'sigame_tokens',
    PROFILE_TABLE: 'sigame_profile',
}
