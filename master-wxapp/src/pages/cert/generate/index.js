//logs.js
const util = require('../../../utils/util.js')
import { connect } from '../../../libs/wx-redux/connect'

Page(connect({
  data: state => ({
    selCert: state.cert.selCert,
    fields: [{
      dataIndex: 'hash',
      label: '链上hash',
    }, {
      dataIndex: 'id',
      label: '荣誉颁发者',
    }, {
      dataIndex: 'name',
      label: '荣誉名称',
    }, {
      dataIndex: 'name',
      label: '活动名称',
    }, {
      dataIndex: 'name',
      label: '荣誉接受者',
    }, {
      dataIndex: 'name',
      label: '身份证',
    }, {
      dataIndex: 'time',
      label: '颁发时间',
    }, {
      dataIndex: 'pic',
      label: '证明文件',
    }]
  }),
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
}))
