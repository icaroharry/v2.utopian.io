// imports.
import { randomData, subtle } from './common'
// import * as secrets from '../../database/tables/secrets'

/**
 * Generate a random AES-GCM encryption key.
 *
 * @return {Promise<*>}
 */
export const generateEncryptionKey = async () => {
  // define the key algorithm.
  const algo = { name: 'AES-GCM', length: 256 }

  // allow key to encrypt and decrypt only.
  const usages = ['encrypt', 'decrypt']

  // only non extractable keys should be used.
  const extractable = false

  // encryption key generation.
  const encryptionKey = await subtle.generateKey(algo, extractable, usages)

  // return the key if the type is correct, null otherwise.
  return (encryptionKey instanceof CryptoKey) ? encryptionKey : null
}

/**
 * Generate a derivation key (for PBKDF2)
 *
 * @return {Promise<*>}
 */
export const generateDerivationKey = async () => {
  // use PBKDF2 as the main generator.
  const algo = { name: 'PBKDF2' }

  // get 32 bytes of random data.
  const seed = randomData(32)

  // allow key derivation and bit derivation.
  const usages = ['deriveKey', 'deriveBits']

  // only non extractable keys should be used.
  const extractable = false

  // generate the key.
  const derivationKey = await subtle.importKey('raw', seed, algo, extractable, usages)

  // only if success, return the result.
  if (derivationKey instanceof CryptoKey) {
    return derivationKey
  }

  // return null otherwise.
  return null
}
