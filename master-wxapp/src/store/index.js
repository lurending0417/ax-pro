import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import Storage from '../libs/tools/storage.js'
import api from './middleware/api'
import reducers from './reducers/index.js'
import Immutable from 'immutable'

const persistConfig = {
	key: 'root',
	storage: new Storage(),
	whitelist: ['user'],
	transforms: [
		createTransform(
			(state, key) => {
				if (state.toJS) {
					let rs = state.toJS();
					rs.__ = true;
					return rs;
				}
				return state;
			}, // 存
			(state, key) => {
				console.log(state)
				if (state.__) {
					return Immutable.fromJS(state);
				}
				return state;
			} // 恢复
		)
	]
}

const persistedReducer = persistReducer(persistConfig, reducers);


const store = createStore(
	persistedReducer,
	applyMiddleware(thunk, api,
		createLogger({
			duration: true,
			predicate: (getState, action) => false,
			// 打印immutablejs的state
			stateTransformer: (state) => {
				const result = {};
				Object.keys(state).forEach((key) => {
					if (state[key].toJS) {
						result[key] = state[key].toJS();
					} else {
						result[key] = state[key];
					}
				});
				return result;
			},
		}))
);


persistStore(store, {

});

export default store;