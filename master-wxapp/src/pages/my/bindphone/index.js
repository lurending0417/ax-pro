//logs.js
const util = require('../../../utils/util.js')
import { user } from '../../../common/api'
import { user as userAction } from '../../../common/actionType'
import { connect } from '../../../libs/wx-redux/connect'

Page(connect({
  data: state => ({
    openid: state.user.getIn(['wxUser', 'openid']),
    fields: [{
      dataIndex: 'account',
      label: '手机号',
    }, {
      dataIndex: 'code',
      label: '验证码',
      type: 'code'
    }]

  }),
  action: dispatch => ({
    login(userInfo) {
      dispatch({
        type: 'CallApi',
        payload: {
          api: user.login,
          body: userInfo,
          success: userAction.loginSucc
        }
      })
    }
  }),
  onChange: function (e) {
    this.selCert = this.selCert || {};
    this.selCert[e.target.dataset.key] = e.detail;
  },
  savepre: function (e) {
    if (e.detail.cb) {
      let changed = e.detail.form;
      changed.openid = this.data.openid

      e.detail.cb(changed);
    }
  },
  saved: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  submit() {
    this.login(this.selCert)
  },
  onLoad: function () {
  }
}))
