//logs.js
import store from '../../../store/index'

Component({
  properties: {
    keyfield: {
      type: String,
      value: ''
    },
    headers: {
      type: Array,
      value: [],
    },
    index: {
      type: Number,
      value: 0,
      observer: function (nv, oldv) {
        if (nv != oldv) {
          this.currentIndex = nv;
        }
      }
    }
  },
  data: {
    currentIndex: 0
  },
  methods: {
    onChange({ currentTarget }) {
      this.setData({
        currentIndex: currentTarget.dataset.index
      })
      this.triggerEvent('change', { dataset: currentTarget.dataset })
    }
  }
})
