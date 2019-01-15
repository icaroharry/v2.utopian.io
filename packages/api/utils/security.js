const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const IV_LENGTH = 16
const key = process.env.ENCRYPTION_KEY

const encrypt = (data) => {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv)
  let encrypted = cipher.update(data)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

const decrypt = (data) => {
  const [iv, encryptedText] = data.split(':').map(part => Buffer.from(part, 'hex'))
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

/**
 * Generate a random alphanum string of the specified length
 *
 * @param length
 * @returns {string}
 * @author Grégory LATINIER
 */
const random = (length) => {
  const random13chars = () => Math.random().toString(16).substring(2, 15)
  const loops = Math.ceil(length / 13)
  return new Array(loops).fill(random13chars).reduce((string, func) => string + func(), '').substring(0, length)
}

module.exports = {
  encrypt,
  decrypt,
  random
}