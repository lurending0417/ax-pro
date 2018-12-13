//logs.js
const util = require('../../../utils/util.js')
import { user } from '../../../common/api'
import { UserRefresh, user as userAction } from '../../../common/actionType'
import { connect } from '../../../libs/wx-redux/connect'

let fields = [{
  dataIndex: 'name',
  label: '姓名',
}, {
  dataIndex: 'id_number',
  label: '身份证',
}, {
  dataIndex: 'gender',
  label: '性别',
  type: 'radio',
  data: [{
    text: '男',
    value: 'male'
  }, {
    text: '女',
    value: 'female'
  }]
}, {
  dataIndex: 'nickname',
  label: '昵称',
}, {
  dataIndex: 'avatar',
  label: '头像',
  type: 'upload'
}]

Page(connect({
  data: state => {
    let userState = state.user.get('userInfo').toJS();
    let sp = ['name', 'gender', 'id_number']

    fields.forEach(item => {
      if (sp.indexOf(item.dataIndex) > -1) {
        item.disabled = userState[item.dataIndex] !== ''
      }
    })
    return {
      saveApi: user.info,
      selCert: userState || {},
      fields: [...fields]
    }
  },
  action: dispatch => ({
    refresh(userInfo) {
      dispatch({
        type: UserRefresh,
        payload: {
          result: userInfo
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
  savepre: function (e) {
    if (e.detail.cb) {
      let changed = e.detail.form;
      let sp = ['name', 'gender', 'id_number']

      sp.forEach(k => {
        if (this.data.selCert[k] !== '') {
          changed[k] = ''
        }
      })
      e.detail.cb(changed);
    }
  },
  saved: function (e) {
    this.refresh(e.detail.values)
  },
  onLoad: function () {

  }
}))
