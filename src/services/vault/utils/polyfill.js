const polyTextEncoder = () => { }
const polyTextDecoder = () => { }

const utf8ToBytes = (str, units) => {
  let codePoint
  let length = str.length
  let leadSurrogate = null
  let bytes = []
  let i = 0

  for (; i < length; i++) {
    codePoint = str.charCodeAt(i)
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      if (leadSurrogate) {
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          leadSurrogate = codePoint
          continue
        } else {
          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
          leadSurrogate = null
        }
      } else {
        if (codePoint > 0xDBFF) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else {
          leadSurrogate = codePoint
          continue
        }
      }
    } else if (leadSurrogate) {
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      leadSurrogate = null
    }
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x200000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }
  return bytes
}

const utf8Slice = (buf, start, end) => {
  let res = ''
  let tmp = ''
  end = Math.min(buf.length, end || Infinity)
  start = start || 0
  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }
  return res + decodeUtf8Char(tmp)
}

const decodeUtf8Char = (str) => {
  try {
    return decodeURIComponent(str)
  } catch (_) {
    return String.fromCharCode(0xFFFD)
  }
}

polyTextEncoder.prototype.encode = (str) => {
  let result

  if (typeof Uint8Array === 'undefined') {
    result = utf8ToBytes(str)
  } else {
    result = new Uint8Array(utf8ToBytes(str))
  }
  return result
}

polyTextDecoder.prototype.decode = (bytes) => {
  return utf8Slice(bytes, 0, bytes.length)
}

export {
  polyTextEncoder,
  polyTextDecoder
}
