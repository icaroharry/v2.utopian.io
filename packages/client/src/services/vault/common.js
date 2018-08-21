// alias WebCrypto API as crypto.
export const crypto = window.crypto

// alias WebCrypto API as subtle.
export const subtle = crypto.subtle

// generate a given amount of random data (safe PRNG)
export const randomData = (bytes = 32) => crypto.getRandomValues(new Uint8Array(bytes))

// generate AES-GCM parameters.
export const makeAESParams = (iv, ad = null, tagLength = 128) => {
  return {
    name: 'AES-GCM',
    iv: iv,
    additionalData: ad || Buffer.from([]),
    tagLength: tagLength
  }
}
