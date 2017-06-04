export default function (callback, delay = 100) {
  let wait = false
  let isFunction = typeof callback === 'function'

  return function () {
    if (!wait) {
      isFunction && callback.apply(this, arguments)
      wait = true

      setTimeout(() => {
        wait = false
      }, delay)
    }
  }
}