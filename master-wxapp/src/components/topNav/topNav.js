// components/dialog/dialog.js

import store from '../../store/index'
import { category as categoryType} from '../../common/actionType'


Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
        categoryList: {
        	type: Array,
			value: [{id: '999', name: '国画1'}, {id: '888', name: '太极1'}]
		},
        chooseCategoryIndex: {
        	type: Number,
            observer(newVal, oldVal) {
        		console.log('chooseCategoryIndex change')
				if (newVal !== oldVal ) {
                    this.setData({
                        choosedIndex: newVal
					})
				}
			}
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		choosedIndex: 0
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		switchNav(event) {
			console.log('切换tab');
			console.log()
			this.setData({
                choosedIndex: event.target.dataset.index
			})
			store.dispatch({
				type: categoryType.chooseCategoryIndex,
				payload: {
                    chooseCategoryIndex: event.target.dataset.index
				}
			})
            this.triggerEvent('changeTab', {}, {})
		}
	}

})
