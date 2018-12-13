Component({
  properties: {
    info: {
      type: Object
    },
    status: {
      type: String,
      value: "MASTER" // "MASTER" | "ANSWER" | "REWARD" | "COURSE"
    },
    tags: {
      type: Array,
      value: [
        "专业",
        "回答非常耐心"
      ]
    }
  },
  data: {
    arrowIcon: "/assets/imgs/icon/icon-next.png"
  },
  methods: {
    getLeftTime: function(timeStamp) {
      if (!timeStamp) {
        return "即将";
      }
      const now = Date.now();
      const leftTime = timeStamp - now;
      var leftHours = leftTime / (60 * 60 * 1000);

      if (leftHours > 0) {
        const l1 = parseInt(leftHours)
        return l1 > 1 ? `${l1}小时后` : "1小时内";
      } else {
        return "即将"
      }
    }
  },

  onLoad: function () {
    console.log("lolllllllllll")
  },
  ready() {
    console.log("----------lll")
    console.log()
  }
})