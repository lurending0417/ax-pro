//index.js
//获取应用实例
import {
	connect
} from '../../../libs/wx-redux/connect.js'
import actions from '../../../store/actions/index/index.js'
import { HomeItems } from "../../../common/homeItem"
import { object2Query } from '../../../libs/tools/func'

const app = getApp()


const testData = {
	label: '吃饭了'
}

Page(connect({
	data: (state) => {
    let home = state.home.toJS()
		return {
      banners: home.banners["BANNER"],
      courses: home.courses,
      masters: home.masters,
      questions: home.questions,
      wanteds: home.wanteds,
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      active_color: "#CF9F41",
      indicator_color: "#FFFFFF",
      homeItems: HomeItems,
		}
	},
  action: actions,

  bannerClick: function(e) {
    var target =  e.currentTarget.dataset.key
    var path = ""
    this.data.banners.map(item => {
      if(item.img === target) {
        path = item.url
      }
    })
    var passed = {}
    passed.redirect = path
    setTimeout(() => {
      wx.navigateTo({
        url: '/src/pages/tabbar/webpage/index?' + object2Query(passed)
      })
    }, 0);
  },

  itemClick: function(e) {

	  var passed ={};
    var target =  e.currentTarget.dataset.key
    console.log("tar", target)
    switch(target) {
      case "大师课程":
        passed.redirect = "/course/list"
        passed.title = "大师课程"
        break;
      case "大师解惑":
        passed.redirect = "/disabuse/db_main"
        passed.title = "大师解惑"
        break;
      case "悬赏问答":
        passed.redirect = "/reward/reward"
        passed.title = "悬赏问答"
        break;
      case "约见大师":
        passed.redirect = "/meet/list"
        passed.title = "约见大师"
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
    console.log("path", '/src/pages/tabbar/webpage/index?' + object2Query(passed))
  },
  masterClick: function(e) {
    var target =  e.currentTarget.dataset.key
    var ms = {}
    this.properties.masters.map(itemm => {
        if(target === itemm.id) {
          ms = itemm
        }
    })
    var passed = {}
    passed.redirect = "/master/detail"
    passed.data = {
      id: ms.id,
      avatar: ms.avatar,
      intro: ms.intro,
      nick: ms.nick,
      master: ms.master,
      appointCost: ms.appointCost,
      questionEnabled: ms.questionEnabled,
      questionCost: ms.questionCost,
      score: ms.score,
      followTimes: ms.followTimes,
      follow: ms.follow,
      enabled: ms.enabled,
      appointEnabled: ms.appointEnabled,
    }
    setTimeout(() => {
      wx.navigateTo({
        url: '/src/pages/tabbar/webpage/index?' + object2Query(passed)
      })
    }, 0);
    console.log("path", '/src/pages/tabbar/webpage/index?' + object2Query(passed))
  },
  questionClick: function(e) {
    var target =  e.currentTarget.dataset.key
    var passed = {}
    passed.a = {
      questionId: target
    }
    passed.redirect = "/disabuse/db_detail"
    setTimeout(() => {
      wx.navigateTo({
        url: '/src/pages/tabbar/webpage/index?' + object2Query(passed)
      })
    }, 0);
  },

  rewardClick: function(e) {
    var target =  e.currentTarget.dataset.key
    var passed = {}
    passed.wantedId = target
    passed.redirect = "/reward/rewardDetail"
    setTimeout(() => {
      wx.navigateTo({
        url: '/src/pages/tabbar/webpage/index?' + object2Query(passed)
      })
    }, 0);
  },
  courseClick: function(e) {
    var target =  e.currentTarget.dataset.key
    var course = {}
    this.properties.courses.map(itm => {
      if(itm.targetId === target) {
        course = itm
      }
    })
    var passed = {}
    passed.redirect = course.targetType == "COURSE" ? "/course/group" : "/course/one"
    passed.courseId = course.targetId
    passed.title = course.title
    setTimeout(() => {
      wx.navigateTo({
        url: '/src/pages/tabbar/webpage/index?' + object2Query(passed)
      })
    }, 0);
  },


	onLoad: function () {
    this.getHomeData()
  },

}))