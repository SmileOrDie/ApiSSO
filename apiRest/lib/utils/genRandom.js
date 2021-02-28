const { randomBytes } = require('crypto')

const genRandomChar = (haystack) => {
  const pos = genRandomInt(1, haystack.length)

  return haystack.substring(pos - 1, pos)
}

const genRandomCharLower = () => {
  return genRandomChar('abcdefghijklmnopqrstuvwxyz')
}

const genRandomCharUpper = () => {
  return genRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
}

const genRandomCharSpecial = () => {
  return genRandomChar('$*£%()[]{}_-&@#?,;.:/+=')
}

const genRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min)) + min
}

const genRandomString = (length) => {
  return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)
}

module.exports = {
  genRandomString,
  genRandomInt,
  genRandomChar,
  genRandomCharLower,
  genRandomCharUpper,
  genRandomCharSpecial,
}
