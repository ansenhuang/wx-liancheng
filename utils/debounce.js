export default function (callback, delay = 100) {
  let timer = null
  let isFunction = typeof callback === 'function'

  return function () {
    clearTimeout(timer)

    timer = setTimeout(() => {
      isFunction && callback.apply(this, arguments)
    }, delay)
  }
}