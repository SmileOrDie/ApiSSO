const { ENVIRONMENT, JWT_HEADER_NAME } = require('../../config')

const errorHandler = async (handler, request, context) => {
  let body, headers, statusCode
  try {
    const data = await handler(request)
    statusCode = data.statusCode || 200
    delete data.statusCode

    headers = data.headers
    body = data.data
  } catch (error) {
    console.error(error)
    statusCode = error.status || 500

    body = {
      [ENVIRONMENT + '-error']: {
        [context]: error.msg || 'Internal Server Erreur'
      }
    }
  }

  return { body, statusCode, headers }
}

module.exports = errorHandler
