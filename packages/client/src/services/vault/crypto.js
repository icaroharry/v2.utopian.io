// imports.
import { makeAESParams, randomData, subtle } from './common'

// text encoder instance.
const encoder = new TextEncoder()

// text decoder instance.
const decoder = new TextDecoder()

/**
 * Encrypt any data and return.
 *
 * @param key
 * @param rawData
 * @param ivParameter
 *
 * @return {Promise<*>}
 */
export const encrypt = async (key, rawData, ivParameter = null) => {
  // if no IV was provided, generate one with 12 bytes.
  const iv = ivParameter || randomData(12)
  // construct the AES-GCM params.
  const params = makeAESParams(iv)

  // encode / serialize the data before encryption.
  const data = encoder.encode(JSON.stringify(rawData))

  // encrypt the provided data.
  const payload = await subtle.encrypt(params, key, data)

  // if there was a payload response, return.
  if (payload) {
    return {
      // the encrypted data is a ArrayBuffer which will be transformed
      // int Uint8Array before return.
      encrypted: new Uint8Array(payload),
      // the original IV is required to decrypt.
      iv: iv
    }
  }

  // return null on no payload found.
  return null
}

/**
 * Decrypt some data.
 *
 * @param key
 * @param payload
 * @return {Promise<any>}
 */
export const decrypt = async (key, payload) => {
  // generate the AES-GCM params.
  const params = makeAESParams(payload.iv)

  // try decrypting.
  const decrypted = await subtle.decrypt(params, key, payload.encrypted)

  // decode / un-serialize the found values.
  if (decrypted) {
    return JSON.parse(decoder.decode(new Uint8Array(decrypted)))
  }

  // return null of not.
  return null
}
