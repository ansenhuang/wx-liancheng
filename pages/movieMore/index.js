import { getData } from '../../utils/util'
import throttle from '../../utils/throttle'
import doubanApi from '../../api/douban'
import movieConfig from '../../config/movie'

Page({
  data: {
    isLoading: false,
    subjects: [],
  },
  state: {
    start: 0,
    count: 18,
    total: 0,
    isEnd: false
  },
  onLoad (options) {
    if (!options.key) {
      options.key = 'movieShowing'
      this.options.key = options.key
    }

    wx.setNavigationBarTitle({
      title: movieConfig[options.key]
    })

    this.requestData({ isFirst: true })
  },
  onPullDownRefresh () {
    let item = this.state[this.data.order_by]
    this.state.start = 0
    this.state.isEnd = false
    this.data.subjects = []
    this.requestData({ isPull: true })
  },
  requestData (options = {}) {
    if (this.data.isLoading || this.state.isEnd) return

    if (options.isFirst) {
      wx.showLoading({ title: '加载中...' })
    } else {
      this.setData({ isLoading: true })
    }

    const self = this
    let { start, count } = this.state
    let apiKey = this.options.key

    doubanApi[apiKey]({
      data: {
        start,
        count
      },
      success (resData) {
        self.state.start = start + count
        self.state.total = resData.total || 0
        // 判断是否为最后一页
        if (self.state.start >= self.state.total) {
          self.state.isEnd = true
        }

        let subjects = getData(resData, 'subject_collection_items', [])
        self.setData({
          isLoading: false,
          subjects: self.data.subjects.concat(subjects)
        })

        options.isFirst && wx.hideLoading()
        options.isPull && wx.stopPullDownRefresh()
      }
    })
  },
  onScrollToLower: throttle(function () {
    this.requestData()
  })
})
