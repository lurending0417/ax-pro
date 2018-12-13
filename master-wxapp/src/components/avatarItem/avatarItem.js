// components/dialog/dialog.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		src: {
			type: String,
			value: '/assets/imgs/test/avatar.jpeg'
		},
		isVip: {
			type: Boolean,
			value: true
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		redStarSrc: '/assets/imgs/icon/icon_star@2x.png',
		greyStarSrc: '/assets/imgs/icon/icon_star_grey@2x.png',
		starArr: [],
		tagArr: ['专业', '耐心', '大师']
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

	},

	ready() {
		let starArr = [];
		for (let i = 0; i < 5; i++) {
			if (this.properties.starCode >= i + 1) {
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
