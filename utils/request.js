function getType (value) {
  let type = typeof value

  if (type === 'object') {
    if (Array.isArray(value)) {
      return 'array'
    } else if (value === undefined) {
      return 'undefined'
    } else if (value === null) {
      return 'null'
    } else {
      return 'object'
    }
  }

  return type
}

function checkTypes (value, types) {
  types = Array.isArray(types) ? types : [types]

  let realType = getType(value)
  let expectedTypes = []
  let isValid = false

  types.forEach(type => {
    let flag
    
    switch (type) {
      case String:
        flag = realType === 'string'
        expectedTypes.push('string')
        break;
      case Number:
        flag = realType === 'number'
        expectedTypes.push('number')
        break;
      case Boolean:
        flag = realType === 'boolean'
        expectedTypes.push('boolean')
        break;
      case Object:
        flag = realType === 'object'
        expectedTypes.push('object')
        break;
      case Array:
        flag = realType === 'array'
        expectedTypes.push('array')
        break;
      case Function:
        flag = realType === 'function'
        expectedTypes.push('function')
        break;
      default:
        flag = value instanceof type
    }

    if (!isValid) {
      isValid = flag
    }
  })

  return {
    isValid,
    realType,
    expectedType: expectedTypes.join(', ')
  }
}

function checkData (validate, data = {}) {
  if (validate && typeof validate === 'object') {
    for (let key in validate) {
      if (validate.hasOwnProperty(key)) {
        let param = validate[key]
        let checkResult = checkTypes(data[key], param.type)
        if (data[key] !== undefined) {
          if (!checkResult.isValid) {
            console.warn(`[request] Invalid default prop: type check failed for prop "${key}". Expected ${checkResult.expectedType}, got ${checkResult.realType}.`)
            return
          }
        } else {
          if (param.default !== undefined) {
            data[key] = param.default
          } else if (param.required) {
            console.warn(`[request] Missing required prop option: "${key}"`)
            return
          }
        }
      }
    }
  }

  return data
}

export default function (api, header = {}) {
  let map = {}

  for (let name in api) {
    if (api.hasOwnProperty(name)) {
      map[name] = ({ data, inlineData, success, errorMsg }) => {
        let config = api[name]
        let url = config.url
        let mergeData = checkData(config.data, data)

        if (!mergeData) return
        if (inlineData && typeof inlineData === 'object') {
          Object.keys(inlineData).forEach(key => {
            url = url.replace(`:{${key}}`, inlineData[key])
          })
        }

        wx.request({
          url,
          method: config.method.toUpperCase(),
          header: Object.assign({}, header, config.header || {}),
          data: mergeData,
          success (res) {
            let data = res.data || {}

            if (res.statusCode === 200) {
              typeof success === 'function' && success(data)
            } else {
              wx.showModal({
                title: '请求失败',
                content: errorMsg || data.msg || '请刷新重试~',
                showCancel: false
              })
            }
          },
          fail () {
            wx.showModal({
              title: '请求出错',
              content: '服务器接口异常，请刷新重试~',
              showCancel: false
            })
          }
        })
      }
    }
  }

  return map
}