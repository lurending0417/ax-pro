//logs.js

Component({
  properties: {
    hasTitle: {
      type: Boolean,
      value: false,
    },
    checked: {
      type: Number,
      value: 0,
      observer: function () {
        this.delayHandle()
      }
    },
    helped: {
      type: Number,
      value: 0
    },
    total: {
      type: Number,
      value: 90
    }

  },
  data: {
    studied: false,
    prog: 0
  },
  methods: {
    toSign: function () {
      wx.navigateTo({
        url: '/src/pages/tabbar/webpage/index?redirect=/attendance/attendance'
      })
    },
    delayHandle: function () {
      setTimeout(() => {
        this.setData({
          prog: ((this.properties.checked + this.properties.helped) / this.properties.total).toFixed(2) * 100
        })
      })
    },
    onTap2: function () {
      this.triggerEvent('onetap')
    }
  },
})
