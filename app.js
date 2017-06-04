App({
  globalData: {
    userInfo: null
  },
  getUserInfo (cb) {
    const self = this

    if (this.globalData.userInfo) {
      typeof cb === 'function' && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success () {
          wx.getUserInfo({
            success (res) {
              self.globalData.userInfo = res.userInfo
              typeof cb === 'function' && cb(res.userInfo)
            }
          })
        }
      })
    }
  }
})