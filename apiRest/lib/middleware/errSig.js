const { ENVIRONMENT, JWT_HEADER_NAME } = require('../../config')

const _hasToken = (data) => {
  return (data && data.response && data.response.token)
}

const errorHandler = async (handler, request, context) => {
  let body,headers, statusCode
  try {
    const data = await handler(request)
    statusCode = data.statusCode || 200
    delete data.statusCode

    headers = data.headers
    body = data.data

    // if (_hasToken(data)) {
    //   response.headers[JWT_HEADER_NAME] = data.response.token
    //   delete data.response.token
    // }
  } catch (error) {
    console.error(error)
    statusCode = error.status || 500

    body = {
      [ENVIRONMENT + '-error']: {
        [context]: error.msg || error
      }
    }
  }

  return { body, statusCode, headers }
}

module.exports = errorHandler
