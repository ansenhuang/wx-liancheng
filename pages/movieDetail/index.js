import doubanApi from '../../api/douban'

Page({
  data: {
    detail: {},
    interests: [],
    totalComment: 0,
    showPage: false
  },
  onLoad (options) {
    const self = this
    const id = options.id

    if (!id) {
      wx.switchTab({
        url: '/pages/movie/index'
      })
      return
    }

    wx.showLoading({ title: '加载中...' })

    doubanApi.movieDetail({
      inlineData: { id },
      success (resData) {
        wx.setNavigationBarTitle({
          title: resData.title || '电影'
        })

        self.setData({
          detail: resData,
          showPage: true
        })

        wx.hideLoading()
      }
    })

    doubanApi.movieInterests({
      inlineData: { id },
      success (resData) {
        self.setData({
          interests: resData.interests || [],
          totalComment: resData.total || 0
        })
      }
    })
  }
})
