import { getData } from '../../utils/util'
import throttle from '../../utils/throttle'
import doubanApi from '../../api/douban'
import movieConfig from '../../config/movie'

Page({
  data: {
    isEnd: false,
    subjects: [],
  },
  state: {
    isFetching: false,
    start: 0,
    count: 18,
    total: 0
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
  requestData (options = {}) {
    if (this.state.isFetching || this.data.isEnd) return

    this.state.isFetching = true

    const self = this
    let { start, count } = this.state
    let apiKey = this.options.key

    doubanApi[apiKey]({
      data: {
        start,
        count
      },
      success (resData) {
        self.state.isFetching = false
        self.state.start = start + count
        self.state.total = resData.total || 0
        // 判断是否为最后一页
        let isEnd = self.state.start >= self.state.total
        let subjects = getData(resData, 'subject_collection_items', [])
        self.setData({
          isEnd,
          subjects: self.data.subjects.concat(subjects)
        })
      }
    })
  },
  onScrollToLower: throttle(function () {
    this.requestData()
  })
})
