//logs.js
const util = require('../../../utils/util.js')
require('../../../utils/dateUtil.js')
import { common } from '../../../common/api'
import { connect } from '../../../libs/wx-redux/connect'

Page(connect({
  data: state => ({
    selects: ['照片', '拍照'],
    fields: [{
      dataIndex: 'instiution',
      label: '荣誉颁发者',
      required: true,
      rules: {
        required: true,
        pattern: /^\S{2,20}/,
        message: '颁发机构长度不对{2，20}',
      }
    }, {
      dataIndex: 'ceriticate_name',
      required: true,
      label: '荣誉名称',
      rules: {
        required: true,
        pattern: /^\S{4,20}/,
        message: '荣誉名称长度不对{4，20}',
      }
    }, {
      dataIndex: 'activity_name',
      label: '活动名称',
      rules: {
        pattern: /^\S{4,20}/,
        message: '活动名称长度不对{4，20}',
      }
    }, {
      dataIndex: 'award_date',
      required: true,
      type: 'date',
      defaultValue: new Date().format('yyyy-MM-dd'),
      label: '颁发时间',
      rules: {
        required: true
      }
    }, {
      dataIndex: 'ceriticate_dir',
      required: true,
      type: 'upload',
      api: common.upload.cert.toString(),
      label: '证明文件',
    }]
  }),
  toGenerate() {
    // wx.navigateTo({
    //   url: '../generate/index'
    // })
  },
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
  },
  bindDateChange() {

  }
}))
