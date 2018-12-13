import store from '../../store/index'
import { sns } from '../../common/api'
import { object2Query } from '../../libs/tools/func'

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
        refresh: {
        	type: Function,
			value: () => {}
		},
		master: {
			type: Object,
			value: {
				"appointCost": 0,
				"appointEnabled": false,
				"avatar": "/assets/imgs/test/avatar.jpeg",
				"categoryColor": "string",
				"categoryId": "string",
				"categoryName": "国画",
				"courseEnabled": false,
				"districtCode": "string",
				"enabled": true,
				"follow": false,
				"followTimes": 55,
				"id": "string",
				"intro": "闫芳，河北省第五届武术协会副主席，石家庄第十届政协委员，因网上流传的一段拍摄于2012年6月24日视频为人所知，被称为“最强太极推手”，掌风能击倒人。",
				"master": true,
				"nick": "梅凯",
				"questionCost": 0,
				"questionEnabled": false,
				"questionTimes": 0,
				"score": 4,
				"subscribe": false,
				"tags": [
					"和蔼", "大师"
				],
				"vip": false,
				"walletBalance": 0
			}
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		redStarSrc: '/assets/imgs/icon/icon_star@2x.png',
		greyStarSrc: '/assets/imgs/icon/icon_star_grey@2x.png',
		starArr: []
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
        follow(event) {
            let {follow, id, followtimes} = event.target.dataset;
            // 关注
            let api, message;
            if (follow) {
                api = sns.follow.delete;
                message = '取消关注';
                followtimes = parseInt(followtimes) - 1;
            } else {
                api = sns.follow.post;
                message = '关注成功';
                followtimes = parseInt(followtimes) + 1;
            }
            store.dispatch({
                type: 'CallApi',
                payload: {
                    api,
                    body: {
                        masterId: id
                    },
                    success: (result) => {
                        wx.showToast({
                            title: message,
                            icon: 'none',
                            duration: 2000
                        });
						this.setData({
							'master.followTimes': followtimes,
							'master.follow': !event.target.dataset.follow
						})
                    },
                    fail: (err) => {
                        wx.showToast({
                            title: err.message,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }
            })
		},
        toMasterDetail() {
        	console.log('click master')
            let passed = {};
            passed.redirect = "/master/detail";
            let master = this.properties.master;
            passed.data = {
                id: master.id,
				avatar: master.avatar,
                intro: master.intro,
                nick: master.nick,
                master: master.master,
                appointCost: master.appointCost,
                questionEnabled: master.questionEnabled,
                questionCost: master.questionCost,
                score: master.score,
                followTimes: master.followTimes,
                follow: master.follow,
                enabled: master.enabled,
                appointEnabled: master.appointEnabled,
            }
            setTimeout(() => {
                wx.navigateTo({
                    url: '/src/pages/tabbar/webpage/index?' + object2Query(passed)
                })
            }, 0);
		}
	},

	ready() {
		let starArr = [];
		for(let i = 0; i < 5; i++) {
			if (this.properties.master.score >= i + 1) {
				starArr.push(1)
			} else {
				starArr.push(0)
			}
		}
		this.setData({
			starArr: starArr
		})
	}
})
