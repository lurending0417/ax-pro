//logs.js
import util from '../../../utils/renderUtil'

Component({
  properties: {
    src: {
      type: String,
      value: ''
    },
    tag: {
      type: String,
      value: '',
      observer: function (nv, oldv) {
        this.setData({
          tagCls: this.tagClsm(nv),
          tagTxt: this.tagTxtm(nv)
        })
      }
    },
    status: {
      type: String, // "HOME" |
    },
    time: {
      type: String,
      value: '',
      observer: function (nv, oldV) {
        this.setData({
          timeText: util.renderTimeSeconds(nv),
        })
      }
    }
  },
  data: {
    tagTxt: '免费课程',
    timeText: '00:00:00',
    tagCls: 'tag-blue',
  },
  methods: {
    tagTxtm: function (v) {
      if (v == "FREE") {
        return "免费课程"
      }
      if (v == "DISCOUNT") {
        return "限时折扣"
      }
      return ''
    },
    tagClsm: function (v) {
      if (v == "FREE") {
        return "tag-blue"
      }
      if (v == "DISCOUNT") {
        return "tag-yellow"
      }
      return ''
    }
  },
  ready: function () {
    this.setData({
      tagCls: this.tagClsm(this.properties.tag),
      tagTxt: this.tagTxtm(this.properties.tag)
    })
  }
})
