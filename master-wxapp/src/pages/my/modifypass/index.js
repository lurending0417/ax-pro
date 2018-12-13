//logs.js
const util = require('../../../utils/util.js')

Page({
  data: {
    fields: [{
      dataIndex: 'name',
      label: '新密码',
    }, {
      dataIndex: 'id_number',
      label: '确认新密码',
    }, {
      dataIndex: 'nickname',
      label: '昵称',
    }, {
      dataIndex: 'avatar',
      label: '头像',
    }]
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
