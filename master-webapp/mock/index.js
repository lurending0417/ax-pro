import _each from "lodash/forEach";
const mock = process.browser && process.env.NODE_ENV == "development" ? require("mockjs") : null;

import { getApiUrl } from "../common/constant"



if (process.env.NODE_ENV !== "production" && mock) {

	// 配置 模板数据
	const _cached = [
		require("./apis/test1").default,
		require("./apis/user").default,
		require("./apis/meet").default,
		require("./apis/question").default,
		require("./apis/reward").default,
    require("./apis/message").default,
	];

	mock.setup({
		timeout: 30 * 1000
	})

	const rawFetch = window.fetch;

	const newfetch = (url, opts = {}) => {
		let m = opts.method && opts.method.toLowerCase() || "";
		m = m == "get" ? "" : m;

		const key = url.replace(/\?.*/g, "") + (m ? ("-" + m) : "");
		const server = getApiUrl();

		const rs = _cached.reduce((last, now) => {
			if (last) return last;
			return Object.keys(now).reduce((l, n) => {
				if (l) return l;
				return server + n == key ? now[n] : null;
			}, null)
		}, null)
		if (rs) {
			$.showIndicator();
			return Promise.resolve({
				json: () => new Promise(s => {
					setTimeout(() => {
						s(rs)
						$.hideIndicator();
					}, 1500)
				})
			})
		}

		return rawFetch(url, opts);
	}

	window.fetch = newfetch;
	global.fetch = newfetch;
}