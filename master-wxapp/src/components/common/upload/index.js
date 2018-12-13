//logs.js
const util = require('../../../utils/util.js')
import store from '../../../store/index'
import regeneratorRuntime from 'regenerator-runtime'
let imgcount = 0;

Component({
  properties: {
    count: {
      type: Number,
      value: 1,
    },
    name: {
      type: String,
      value: 'file'
    },
    api: {
      type: String,
    }
  },
  data: {
    selects: ['照片', '拍照'],

    selPic: []
  },
  methods: {
    onPickerSel: function ({ detail }) {
      let index = detail.value
      if (index == 0) {

      }
    },
    toImg() {
      wx.chooseImage({
        count: this.properties.count,
        sizeType: 'original',
        sourceType: ['album'],
        success: (res) => {
          this.onPicSel(res)
        },
        fail: () => {

        }
      })
    },
    toCamera() {
      wx.chooseImage({
        count: this.properties.count,
        sizeType: 'original',
        sourceType: ['camera'],
        success: (res) => {
          this.onPicSel(res)
        },
        fail: () => {

        }
      })
    },
    onPicSel: async function () {

      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths
      this.trigger('picPre', { detail: tempFilePaths }, {})
      this.selPic = tempFilePaths;
      let rs = [];
      if (tempFilePaths.length == 1) {
        rs.push(await this.uploadOne(tempFilePaths[0]))
      }

      if (tempFilePaths.length > 1) {
        for (var i in tempFilePaths) {
          rs.push(await this.uploadOne(tempFilePaths[i]))
        }
      }

      this.triggerEvent('change', { detail: rs }, {})

    },
    formatHeader() {
      let token = store.getState().user.get('token')
      return {
        authorization: 'Bear ' + token
      }
    },
    async uploadOne(tmpFile) {

      let extra = Date.now() + '-' + (++imgcount)

      return new Promise((s, f) => {
        wx.uploadFile({
          url: this.properties.api,
          filePath: tmpFile,
          name: this.properties.name,
          header: this.formatHeader(),
          success: (res) => {
            s(res.data.fileName)
          },
          fail: err => {
            f(err)
          }
        })
      })
    },
    onUploadSucc: function () {

    },
  },


  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
