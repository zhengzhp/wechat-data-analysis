export function getNickName(fullNameInfo) {
  // 过滤掉不能正常展示的ASCII码
  // eslint-disable-next-line no-control-regex
  var sep = fullNameInfo.replace(/[\x00-\x1f]+/g, '|').split('"')[0]
  return sep.split('|').filter(value => value !== '')
}

export function getChatterMd5(tableName) {
  var sep = tableName.split('_')
  return sep.pop()
}

export function getHeadImg(headImage) {
  var str = headImage.toString('utf8')
  var start = str.search('http:')
  var end = str.search('/132')
  return str.slice(start, end)
}

export function getMomentsBg(dbSocial) {
  var str = dbSocial.toString('utf8')
  let start = str.search(/http/)
  let end = str.search(/\/0R/)
  return str !== -1 ? str.slice(start, end + 2) : str
}

export function isPhoneAdd(dbSocial) {
  var str = dbSocial.toString('utf8')
  let end = str.search(/\/0R/)
  if (str[end + 4] === 'Z') {
    return str.slice(str.length - 13, str.length - 2)
  } else {
    return null
  }
}

export function Utf8ArrayToStr(array) {
  var out, i, len, c
  var char2, char3

  out = ''
  len = array.length
  i = 0
  while (i < len) {
    c = array[i++]
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c)
        break
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++]
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f))
        break
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++]
        char3 = array[i++]
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        )
        break
    }
  }
  return out
}

export default {}
