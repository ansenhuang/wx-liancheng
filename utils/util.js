function formatDate (date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  let o = {
    MM: date.getMonth() + 1,
    dd: date.getDate(),
    hh: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds()
  }

  fmt = fmt.replace('yyyy', date.getFullYear())
  Object.keys(o).forEach(k => {
    fmt = fmt.replace(k, o[k] > 9 ? o[k] : '0' + o[k])
  })

  return fmt
}

function getData (data, keyString, defaultValue = '') {
  if (!data || typeof data !== 'object') {
    return defaultValue
  }

  let result = data
  let keyArray = keyString.split('.')

  for (let i = 0, l = keyArray.length; i < l; i++) {
    let key = keyArray[i]
    if (result[key] !== undefined) {
      result = result[key]
    } else {
      return defaultValue
    }
  }

  return result
}

export {
  getData,
  formatDate
}