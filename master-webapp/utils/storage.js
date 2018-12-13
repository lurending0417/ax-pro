import Cookie from "./cookie"
import _map from "lodash/map"

import { EXPIRE, STOARGEKEY } from "../common/constant"

const emptyFun = "$empty$"
const emptyF = () => null;

export default class Storage {
	constructor({/**白名单 cookie存储*/cookieList = [] }) {
		this.cookieList = cookieList;
	}

	getItemRaw(key, rawCookie = null) {
		let v;
		if (!process.browser) {
			// 服务器 从 cookie 里面取
			if (this.cookieList.indexOf(key) != -1) {
				v = Cookie.get(key, rawCookie)
			}
			return v;
		}
		else
			v = localStorage.getItem(key);
		if (!v) {
			return (null)
		}
		try {
			v = JSON.parse(decodeURIComponent(v))
			if (v && v.length == 3 && v[0] == STOARGEKEY) {
				if (Date.now() < v[2]) {
					v = v[1]
				}
				else {
					v = null;
				}
			}
		}
		catch (e) {

		}
		return (v);
	}

	getItem(key, rawCookie = null) {
		const rs = this.getItemRaw(key, rawCookie);
		return Promise.resolve(rs)
	}

	setItem(key, value, expire) {
		// 存两份 localStorage  cookie
		if (!process.browser) {
			return;
		}
		localStorage.setItem(key, encodeURIComponent(JSON.stringify([STOARGEKEY, value, Date.now() + 1000 * (expire || EXPIRE)])))
		if (this.cookieList.indexOf(key) != -1) {
			Cookie.set(key, value, expire)
		}
	}
}

export const storageParse = obj => {
	if (!obj) return {};
	return _map(obj, (k, v) => {
		if (typeof v === "function") {
			v = emptyFun
		}
	})
}

export const storageRecover = obj => {
	if (!obj) return {};
	return _map(obj, (k, v) => {
		if (v === emptyFun) {
			v = emptyF;
		}
	})
}