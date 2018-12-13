//logs.js
import { object2Query } from '../../../libs/tools/func'
import store from '../../../store/index'
import regeneratorRuntime from 'regenerator-runtime'
let imgcount = 0;

Component({
  properties: {
    store: {
      type: Object,
      value: {
        title: '讲故事',
        priceLabel: '250',
        studentCount: 5,
        intro: '很久很久很久以前，连个和尚挑水吃。。。个和',
        students: ['https://f1.9999ax.com/user/avatar/201810/d8d37675e047444a988444f6a9aa16e7', 'https://f1.9999ax.com/user/avatar/201810/d8d37675e047444a988444f6a9aa16e7', 'https://f1.9999ax.com/user/avatar/201810/d8d37675e047444a988444f6a9aa16e7']
      },
      observer: function (data) {
        const priceLabel = (data.count ? data.count + "讲/" : "") + (data.targetType == "COURSE" && data.coursePrice ? "￥" + data.coursePrice : (data.targetType == "SECTION" && data.sectionPrice ? "￥" + data.coursePrice : "免费"));
        const intro = data.intro || '简介暂无';
        this.setData({
          priceLabel,
          intro: intro.length > 40 ? intro.slice(0, 40) + '...' : intro,
          avatars: data.students.filter(Boolean)
        })
      }
    },
  },
  data: {
    intro: '',
    title: '讲故事',
    priceLabel: '250',
    avatars: []
  },
  computed: {

  },
  methods: {
    onTap: function () {
      let passed = {
        courseId: this.properties.store.id,
        title: this.properties.store.title,
      };
      if (this.properties.store.targetType == "COURSE") {
        passed.redirect = '/course/group'
      }
      else {
        passed.redirect = '/course/one'
      }
      wx.navigateTo({
        url: '/src/pages/tabbar/webpage/index?' + object2Query(passed)
      })
    }
  }
})
