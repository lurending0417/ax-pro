import { object2Query } from '../../libs/tools/func'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String
    }
  },
  methods: {
    jumpPage: function () {

      var path = ""
      var passed ={};
      var target = this.properties.title
      switch(target) {
        case "推荐大师":
          passed.redirect = "/master/meetlist"
          break;
        case "推荐课程":
          passed.redirect = "/course/list"
          break;
        case "解惑精选":
          passed.redirect = "/disabuse/db_main"
          break;
        case "悬赏精选":
          passed.redirect = "/reward/reward"
          break;
        default:
          break;
      }
      console.log("path", '/src/pages/tabbar/webpage/index?' + object2Query(passed))
      setTimeout(() => {
        wx.navigateTo({
          url: '/src/pages/tabbar/webpage/index?' + object2Query(passed)
        })
      }, 0);
    }
  }
})
