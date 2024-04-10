// 格式化时间
export function formatDate(date, format) {
  // const map = {
  //     mm: date.getMonth() + 1,
  //     dd: date.getDate(),
  //     yyyy: date.getFullYear()
  // }
  const map = {
    mm: (date.getMonth() + 1 + '').padStart(2, '0'),
    dd: (date.getDate() + '').padStart(2, '0'),
    yyyy: date.getFullYear() + '',
    hh: (date.getHours() + '').padStart(2, '0'),
    MM: (date.getMinutes() + '').padStart(2, '0'),
    ss: (date.getSeconds() + '').padStart(2, '0')
  }
  return format.replace(/mm|dd|yyyy|hh|MM|ss/gi, matched => map[matched])
}

export function formatValue(value) {
  if (value < 1000) {
    return '$' + value
  }
  value += ''
  const valueArr = value.split('.')
  const preStr = valueArr[0]
  const total = []
  // 取整
  const mul = parseInt(preStr.length / 3)
  // 取余
  const rem = preStr.length % 3
  if (rem !== 0) {
    total.push(preStr.slice(0, rem))
  }
  for (let i = 0; i < mul; i++) {
    total.push(preStr.slice(rem + i * 3, rem + (i + 1) * 3))
  }
  let totalStr = total.join(',')
  if (valueArr.length === 2) {
    totalStr = [totalStr, valueArr[1]].join('.')
  }
  return '$' + totalStr
}

// 判断是否为url
export function isUrl(str) {
  var v = new RegExp(
    '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    'i'
  )
  return v.test(str)
}
