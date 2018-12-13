// components/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    text:{
      type:String,
    },
    testFun:{
      type:Function
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel:function(){
      this.triggerEvent('cancel')

      this.hide();
    },
    confirm: function () {
      this.triggerEvent("confirm")

      this.hide();
    } ,
    show:function(){
      this.setData({
        visible:true
      })
    },
    hide:function(){
      this.setData({
        visible: false
      })
    }
  }
})
