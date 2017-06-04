import request from '../utils/request'

export default request({
  // 影院热映
  movieShowing: {
    url: 'https://m.douban.com/rexxar/api/v2/subject_collection/movie_showing/items',
    method: 'GET',
    data: {
      start: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 8
      }
    }
  },
  // 新片速递
  movieLatest: {
    url: 'https://m.douban.com/rexxar/api/v2/subject_collection/movie_latest/items',
    method: 'GET',
    data: {
      start: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 8
      }
    }
  },
  // 高分电影
  movieScoreHot: {
    url: 'https://m.douban.com/rexxar/api/v2/subject_collection/filter_movie_score_hot/items',
    method: 'GET',
    data: {
      start: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 8
      }
    }
  },
  // 电影条目信息
  movieDetail: {
    url: 'https://m.douban.com/rexxar/api/v2/movie/:{id}',
    method: 'GET'
  },
  // 电影评论
  movieInterests: {
    url: 'https://m.douban.com/rexxar/api/v2/movie/:{id}/interests',
    method: 'GET',
    data: {
      start: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 5
      },
      order_by: {
        type: String,
        default: 'hot' // latest
      }
    }
  }
}, {
  'Content-Type': 'application/x-www-form-urlencode'
})
