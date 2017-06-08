import { getData } from '../../utils/util'
import doubanApi from '../../api/douban'
import movieConfig from '../../config/movie'

const movieConfigKeys = Object.keys(movieConfig)
let movies = {}
movieConfigKeys.forEach(key => {
  movies[key] = {
    key,
    name: movieConfig[key],
    subjects: []
  }
})

Page({
  data: {
    movies
  },
  onLoad () {
    const self = this

    movieConfigKeys.forEach(apiKey => {
      doubanApi[apiKey]({
        success (resData) {
          self.setData({
            [`movies.${apiKey}.subjects`]: getData(resData, 'subject_collection_items', [])
          })
        }
      })
    })
  },
  onSearchFocus () {
    wx.navigateTo({
      url: '/pages/movieSearch/index'
    })
  }
})
