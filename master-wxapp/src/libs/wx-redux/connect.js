import isEqual from '../diff'

const _store = {
	['default']: {}
}

const pickFun = obj => {
	// 筛选action
}

// component  方法 放在 methods 里面

const connect = (/* 组建或页面的元素  重载data 和 action */componentProps, options = {}) => {
	const { alias = 'default', type = 'page' } = options
	let rawData = componentProps.data;

	let store = _store[alias]
	if (!store) {
		return componentProps
	}

	let { getState, dispatch, subscribe } = store;
	if (typeof rawData == "function") {
		let listener = componentProps.data
		let initState = listener(store.getState())
		componentProps.data = initState;

		// 重载onLoad
		let loadKey = type == "page" ? "onReady" : 'ready';
		let unloadKey = type == "page" ? "onUnload" : 'detached';
		let rawOnLoad = componentProps[loadKey];
		componentProps[loadKey] = function () {
			var me = this;
			let lastState = {};

			function changeState() {
				let nowState = listener(getState())

				// 自己就不能用setData了
				// if (!isEqual(nowState, lastState)) {
				// 	me.setData(nowState, () => {
				// 		lastState = nowState
				// 	})
				// }

				// // 变化 传递到ui
				// 只改变需要改变的 自己也可维护自己的data
				let changedState = {};
				Object.keys(nowState).forEach(k => {
					if (!isEqual(nowState[k], lastState[k])) {
						changedState[k] = nowState[k]
					}
				})
				if (Object.keys(changedState).length)
					me.setData(changedState, () => {
						lastState = nowState
					})
			}

			// 添加数据监听
			me._unsubscribe = subscribe(() => {
				changeState()
			})

			// 因为微信的组建 是开始就创建的
			// state 可能状态不同步  需要刷新一下
			changeState()


			rawOnLoad && rawOnLoad.call(me);
		}

		// 移除subscribe
		let rawUN = componentProps[unloadKey]
		componentProps[unloadKey] = function () {
			var me = this;

			me._unsubscribe();
			rawUN && rawUN.call(me)
		}
	}

	// actions
	let action = componentProps.action;
	if (typeof action == "function") {
		delete componentProps.action;
		let actions = action(dispatch);
		if (type != 'page') {
			componentProps.methods = componentProps.methods || {};
			Object.assign(componentProps.methods, actions)
		}
		else Object.assign(componentProps, actions)
	}

	return componentProps;
}

const connectComponent = (props, options) => connect(props, Object.assign({}, options, { type: 'component' }))

const provider = (store,/* 用别名 识别 多个 store */alias = 'default') => {
	_store[alias] = store;
}

module.exports = {
	provider, connect, connectComponent
}