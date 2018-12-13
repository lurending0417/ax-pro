Component({
  properties: {

    info: {
      type: Object,
    },
    star: {
      type: String,
      value: "/assets/imgs/icon/icon_star_tint@2x.png",
    },
    vip: {
      type: Boolean,
      value: true
    },
  },
  data: {
    vipIcon: "/assets/imgs/icon/icon_user_vip@2x.png",
    masterIcon: "/assets/imgs/icon/icon_medal@2x.png",
  },


  ready() {
    console.log("------------read")
    console.log(this.info)
  }
})