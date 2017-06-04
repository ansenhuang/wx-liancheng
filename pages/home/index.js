const app = getApp()

Page({
  data: {
    userInfo: {}
  },
  onLoad () {
    app.getUserInfo(userInfo => {
      this.setData({ userInfo })
    })
  },
  bindViewTap () {
    wx.navigateTo({
      url: '/pages/people/index'
    })
  }
})
