import throttle from '../../utils/throttle'
import doubanApi from '../../api/douban'

Page({
  data: {
    order_by: '',
    scrollTop: 0,
    isLoading: false,
    comments: []
  },
  state: {
    count: 18,
    hot: {
      start: 0,
      total: 0,
      scrollTop: 0,
      comments: [],
      isEnd: false
    },
    latest: {
      start: 0,
      total: 0,
      scrollTop: 0,
      comments: [],
      isEnd: false
    }
  },
  onLoad (options) {
    if (!options.id) {
      wx.switchTab({
        url: '/pages/movie/index'
      })
      return
    }

    this.setData({
      order_by: options.order_by || 'hot'
    })

    this.requestData({ isFirst: true })
  },
  onPullDownRefresh () {
    let item = this.state[this.data.order_by]
    item.start = 0
    item.comments = []
    item.isEnd = false
    this.requestData({ isPull: true })
  },
  requestData (options = {}) {
    let order_by = this.data.order_by
    let item = this.state[order_by]

    if (this.data.isLoading || item.isEnd) return

    if (options.isFirst) {
      wx.showLoading({ title: '加载中...' })
    } else {
      this.setData({ isLoading: true })
    }

    const self = this
    const count = this.state.count
    let start = item.start

    doubanApi.movieInterests({
      inlineData: {
        id: this.options.id
      },
      data: {
        start,
        count,
        order_by
      },
      success (resData) {
        item.start = start + count
        item.total = resData.total || 0
        // 判断是否为最后一页
        if (item.start >= item.total) {
          item.isEnd = true
        }

        item.comments = item.comments.concat(resData.interests || [])
        self.setData({ comments: item.comments, isLoading: false })

        options.isFirst && wx.hideLoading()
        options.isPull && wx.stopPullDownRefresh()
      }
    })
  },
  onScrollToLower: throttle(function () {
    this.requestData()
  }),
  onScroll: throttle(function (ev) {
    this.state[this.data.order_by].scrollTop = ev.detail.scrollTop
  }, 50),
  onTapTab (ev) {
    let order_by = ev.target.dataset.orderBy

    if (this.data.order_by !== order_by) {
      let { comments, scrollTop } = this.state[order_by]

      this.setData({ comments, order_by, scrollTop, isLoading: false })

      if (comments.length === 0) {
        this.requestData({ isFirst: true })
      }
    }
  }
})
