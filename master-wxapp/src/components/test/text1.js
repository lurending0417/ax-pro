// components/text.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tabCount:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPress:function(){
      this.setData({
        tabCount: this.data.tabCount + 1
      })
    }
  }
})
