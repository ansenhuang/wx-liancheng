import throttle from '../../utils/throttle'
import doubanApi from '../../api/douban'

Page({
  data: {
    order_by: '',
    scrollTop: 0,
    isEnd: false,
    comments: []
  },
  state: {
    isFetching: false,
    count: 18,
    hot: {
      start: 0,
      total: 0,
      scrollTop: 0,
      scrollHeight: 0,
      comments: [],
      isEnd: false
    },
    latest: {
      start: 0,
      total: 0,
      scrollTop: 0,
      scrollHeight: 0,
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

    if (this.state.isFetching || item.isEnd) return

    this.state.isFetching = true

    const self = this
    const { count } = this.state
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
        self.state.isFetching = false
        item.start = start + count
        item.total = resData.total || 0
        // 判断是否为最后一页
        item.isEnd = item.start >= item.total

        item.comments = item.comments.concat(resData.interests || [])
        self.setData({
          isEnd: item.isEnd,
          comments: item.comments
        })
        
        options.isPull && wx.stopPullDownRefresh()
      }
    })
  },
  onScrollToLower: throttle(function () {
    this.requestData()
  }),
  onScroll: throttle(function (ev) {
    let item = this.state[this.data.order_by]
    let { scrollTop, scrollHeight } = ev.detail

    item.scrollTop = scrollTop
    item.scrollHeight = scrollHeight
  }, 50),
  onTapTab (ev) {
    let order_by = ev.target.dataset.orderBy

    if (this.data.order_by !== order_by) {
      let { comments, scrollTop } = this.state[order_by]

      this.setData({ 
        comments, 
        order_by, 
        scrollTop,  
        isEnd: false
      })

      if (comments.length === 0) {
        this.state.isFetching = false
        this.requestData({ isFirst: true })
      }
    }
  }
})
