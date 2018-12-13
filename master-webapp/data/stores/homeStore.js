import { observable, action } from "mobx";
import BaseStore from "./BaseStore";
import { persist } from "mobx-persist";
import api from "../../api/api";
import { API_INDEX_PAGE } from "../../common/api";

// import Home1 from "../../static/images/home/1.png"
// import Home2 from "../../static/images/home/2.png"
// import Home3 from "../../static/images/home/3.png"

// import Avatar1 from "../../static/images/avatars/1.png"
// import Avatar2 from "../../static/images/avatars/2.png"

// import AdPic from "../../static/images/home/ad.jpg"

class HomeStore extends BaseStore {

    @persist @observable aa = 0;

    @observable swipers = [
        /* { src: "/static/images/home/1.png" },
         { src: "/static/images/home/2.png" },
         { src: "/static/images/home/3.png" }*/
    ]

    @observable courses = [{
        tag: "限时折扣",
        src: "/static/images/home/1.png"
    }, {
        tag: "免费观看",
        src: "/static/images/home/2.png"
    }]

    @observable answerMasters = [{
        avatar: "/static/images/avatars/1.png",
        type: "国画",
        tag: "gray",
        nick: "梅凯",
        score: 5,
        listenTimes: 10,
        listenCost: 10,
        tags: ["专业", "回答非常耐心"],
        intro: "国画里面有些什么绘画手法是能简单易学出效果的？新手想要知道一些绘画的简单技巧。"
    }, {
        avatar: "/static/images/avatars/2.png",
        tag: "red",
        type: "武术",
        nick: "潘崇福",
        score: 5,
        listenTimes: 100,
        listenCost: 20,
        tags: ["专业", "回答非常耐心"],
        intro: "太极拳除了套路，还有一种特殊的练习方式，即两人对练的推手。通过推手学会对力的感觉，学会通过放松肌肉和转动关节来化解力量、抓准着力点借力打力；如何才能够达到很好锻炼推手的做法呢？请大师回答。"
    }]

    @observable masters = [{
        avatar: "/static/images/avatars/1.png",
        type: "国画",
        tag: "gray",
        nick: "梅凯",
        score: 5,
        followTimes: 165,
        intro: "现任四川美术家协会理事，四川中国画研究院副院长，中国美术家协会会员，中国画坛百杰画家。"
    }, {
        avatar: "/static/images/avatars/2.png",
        tag: "red",
        type: "武术",
        nick: "潘崇福",
        score: 5,
        followTimes: 84,
        intro: "1946年生于青城地区，中国武术协会会员。2006年入选《中国当代武林名人志·海外卷》。"
    }]

    @observable ad = {
        imgSrc: "/static/images/home/ad.jpg"
    }

    @observable rewards = [{
        id: "123",
        bounty: 0.1,
        content: "画画如何临摹？画画如何临摹？画画如何临摹？画画如何临摹？",
        replyTimes: 3,
        closed: true,
        answer: "你是初学者，所以不懂得如何构图，定位。你画画是初于个人兴趣爱好，还是以后要学画啊？如果是以后想学画，建议你去画室学一下素描和色彩。画上定位很简单的，先确立画的高度，画画不可顶天立地，这是构图的大忌。按比例定出人物的头部，身体，腿等。你是初学者不会目测，可以用铅笔来量距离拉！画画最好用中华牌木头铅笔。人的脸可以分为三停五眼的，可以用三停五眼方法来画准比例。建议你最好先去买本相关的书籍看一下。人物速写啊之类的。还有画画是靠多练练出来的。我第一次画石膏像的时候，都快画成了四不像。多练了，就会越来越逼真的",
        user: {
            nick: "梅凯",
            avatar: "/static/images/avatars/1.png"
        },
        attaches: [
            {
                path: "/static/images/avatars/3.png"
            }
        ]
    }, {
        id: "3",
        bounty: 0.1,
        content: "太极拳能实战吗",
        answer: "太极拳肯定能实战的，现在流行的太极拳和太极拳大师教授徒弟的时候基本以练力量为突破，快速的让学员达到技击的水平。其实，传统的太极拳套路分为练功架（慢架）、功夫架（中速）、快架（以前有个说法是一炷香要打一百遍）。还有辅助联系推手。",
        replyTimes: 3,
        closed: false,
        user: {
            nick: "潘崇福",
            avatar: "/static/images/avatars/2.png"
        },
        attaches: [
            {
                path: "/static/images/avatars/3.png"
            }
        ]
    }]


    @action
    recovery(store) {
        if (store) {
            return Object.assign(this, store);
        }
        return this.getIndexPage().catch(err => {
            // 出错返回空的
            return Promise.resolve(null)
        })
    }


    @action
    async getIndexPage() {
        return api.request({
            url: API_INDEX_PAGE,
            params: {},
            auth: false,
            showLoading: false
        }).then(rs => {
            if (rs.status === 200) {
                const result = rs.result
                const aim = {
                    swipers: result.banners["BANNER"] || [],
                    ad: result.banners || [],
                    courses: result.courses,
                    masters: result.masters,
                    answerMasters: result.questions.map(item => {
                        item["nick"] = item.master.nick
                        item["score"] = item.master.score
                        return item
                    }),
                    rewards: result.wanteds
                }
                Object.assign(this, aim);
                // this.swipers = result.banners["BANNER"] || [];
                // this.ad = result.banners || [];
                // this.courses = result.courses;
                // this.masters = result.masters;
                // this.answerMasters = result.questions.map(item => {
                //     item["nick"] = item.master.nick
                //     item["score"] = item.master.score
                //     return item
                // });
                // this.rewards = result.wanteds;

                return (aim);
            }
        })
    }
}


export default new HomeStore();