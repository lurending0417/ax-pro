import { isWx, auth, setUp } from "../utils/wx"
import { loginSucc, loginOut } from "../service/login";
import { getUrlParam } from "../utils/func"
(0, () => {
	// 微信 初始化
	if (process.browser) {
		if (isWx()) {
			const willClear = getUrlParam("clear");
			if (willClear) {
				loginOut()
			}

			console.log("auth")
			auth((err, rs) => {
				console.log("authed>")
				rs && loginSucc(rs)
			});


			setUp();
		}
	}
})()