//logs.js
import store from '../../../store/index'

Component({
  properties: {
    api: {
      type: String,
    }
  },
  data: {
    label: '发送验证码'
  },
  methods: {
    onChange(e) {
      this.triggerEvent('change', e)
    },
    sendCode() {
      if (this.time) {
        return;
      }
      this.time = 60;
      this.startTime();
    },
    startTime() {

      this.setData({
        label: !this.time ? "发送验证码" : (this.time + 's')
      })
      if (--this.time >= 0)
        return setTimeout(() => {
          this.startTime()
        }, 1000)
    }
  }
})
