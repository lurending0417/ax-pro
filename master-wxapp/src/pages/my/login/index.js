//logs.js
const util = require('../../../utils/util.js')
import { user } from '../../../common/api'
import { user as userAction } from '../../../common/actionType'
import { connect } from '../../../libs/wx-redux/connect'

Page(connect({
  data: state => ({
    selCert: {},
    fields: [{
      dataIndex: 'account',
      label: '手机号',
    }, {
      dataIndex: 'password',
      label: '密码',
    }]
  }),
  action: dispatch => ({
    login(userInfo) {
      dispatch({
        type: 'CallApi',
        payload: {
          api: user.login,
          body: userInfo,
          success: userAction.loginSucc,
          done: () => {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  }),
  onChange: function (e) {
    this.selCert = this.selCert || {};
    this.selCert[e.target.dataset.key] = e.detail;
  },
  submit() {
    this.login(this.selCert)
  },
  onLoad: function () {
  }
}))
