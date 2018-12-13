//logs.js
const util = require('../../../utils/util.js')
import { connectComponent } from '../../../libs/wx-redux/connect'
import regeneratorRuntime from 'regenerator-runtime'
import Validator from '../../../libs/async-validator/es/index'
import Toast from '../../../ui/vant-weapp/toast/toast'
let imgcount = 0;

Component(connectComponent({
  properties: {
    fields: {
      type: Array,
      value: []
    },
    api: {
      type: Object,
      value: null
    },
    saveText: {
      type: String,
      value: '保存'
    },
    saveHandler: {
      type: Boolean,
      value: false
    },
    record: {
      type: Object,
      value: {},
      observer: function (nv, oldv, changedPath) {
        if (nv != oldv) {
          let nnv = {}
          this.properties.fields.forEach(f => {
            if (f.dataIndex)
              nnv[f.dataIndex] = nv[f.dataIndex]
          })
          this.setData({
            values: nnv
          })
        }
      }
    }
  },
  data: {
    values: {},
    dirty: {}
  },
  action: dispath => ({
    save(values) {
      let me = this;
      dispath({
        type: 'CallApi',
        payload: {
          api: this.properties.api,
          body: values,
          success: () => {
            me.triggerEvent('saved', { values: me.data.values })
          },
          done: () => {
            me.data.dirty = {}
          }
        }
      })
    }
  }),
  methods: {
    getV(v) {
      if (typeof v == 'object') {
        if (v.detail) {
          return this.getV(v.detail)
        }
        return v.value;
      }
      return v;
    },
    onChange(e) {
      let v = this.getV(e.detail);
      let key = e.target.dataset.key
      this.data.values[key] = v;
      this.setData({
        values: { ...this.data.values }
      })
      this.data.dirty[key] = v;

    },
    async submit() {
      await this.validate().catch(err => {
        // 
        Toast(err)

        return Promise.reject(err);

      })

      // 保存前可能需要 处理 不能直接传入处理函数  通过事件绕一下
      if (this.properties.saveHandler) {
        this.triggerEvent('savepre', {
          cb: (newForm) => {
            this.save(newForm)
          },
          form: this.data.dirty,
          raw: this.data.values
        }, {})
      }
      else {
        this.save(this.data.dirty)
      }





    },
    validate() {
      return new Promise((s, f) => {
        this.validator.validate(this.data.values, (errs, fields) => {
          if (errs) {
            let msg = errs[0].message;
            return f(msg);
          }
          s();
        })
      })
    }
  },


  ready: function () {
    let rules = {};
    this.properties.fields.forEach(item => {
      if (item.rules)
        rules[item.dataIndex] = item.rules
      if ('defaultValue' in item) {
        this.data.values[item.dataIndex] = item.defaultValue;
      }
    })

    this.setData({
      values: { ...this.data.values }
    })

    this.validator = new Validator(rules)
  }
}))
