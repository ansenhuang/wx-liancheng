import debounce from '../../utils/debounce'
import throttle from '../../utils/throttle'
import doubanApi from '../../api/douban'

Page({
  data: {
    total: 0,
    status: 0, // 0：未搜索，1：搜索结果为空，2：没有更多内容了，3：还有下一页
    subjects: []
  },
  state: {
    q: '',
    start: 0,
    count: 20,
    isFetching: false
  },
  onCancel () {
    wx.navigateBack()
  },
  requestData (options = {}) {
    if (this.state.isFetching || this.status === 2) return
    if (this.state.q === '') {
      this.setData({
        total: 0,
        status: 0,
        subjects: []
      })
      return
    }

    this.state.isFetching = true

    const self = this
    let start = options.isFirst ? 0 : this.state.start
    let { count, q } = this.state

    doubanApi.movieSearch({
      data: {
        start,
        count,
        q
      },
      success (resData) {
        self.state.isFetching = false
        self.state.start = start + count

        let total = resData.total || 0
        let subjects = options.isFirst ? resData.subjects : self.data.subjects.concat(resData.subjects)
        let status

        if (subjects.length === 0) {
          status = 1
        } else if (self.state.start >= total) {
          status = 2
        } else {
          status = 3
        }

        self.setData({
          total,
          status,
          subjects
        })
      }
    })
  },
  onSearchInput: debounce(function (ev) {
    this.state.q = ev.detail.value.trim()
    this.state.isFetching = false
    this.requestData({ isFirst: true })
  }, 500),
  onScrollToLower: throttle(function () {
    this.requestData()
  })
})
