// components/writeItem/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:{
      type:String
    },
    borded:{
      type:Boolean,
      value:false
    },
    index:{
      type:null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    edit:function(){
      this.triggerEvent('edit', {index:this.properties. index, text:this.properties.text})
    },
    del:function(){
      this.triggerEvent('del', { index: this.properties.index, text: this.properties.text })
    }
  }
})
