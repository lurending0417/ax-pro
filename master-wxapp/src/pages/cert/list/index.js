//logs.js
const util = require('../../../utils/util.js')
import {
  connect
} from '../../../libs/wx-redux/connect.js'

Page(connect({
  data: state => ({
    text: state.cert.text,
    logs: []
  }),
  action: (dispatch) => ({
    test: () => dispatch({
      type: 'test'
    })
  }),
  testBack: () => {
    wx.navigateTo({
      // url: '../../tabbar/cert/index'
      url: '../detail/index'
    })
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
}))
