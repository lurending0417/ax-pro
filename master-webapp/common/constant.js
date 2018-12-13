// 图片文件服务器地址
export const fileServer = ""

// URL地址
export const getAppBaseUrl = () => {
	switch (process.env.NODE_ENV) {
		case "dev":
			return ""
		case "test":
			return ""
		case "prod":
			return ""
		default:
			return ""
	}
}

// 接口URL地址
export const getApiUrl = () => {

	switch (process.env.NODE_ENV) {
		case "development":
			return "https://api.9999ax.com"
			return "http://10.0.0.163:8338"
		case "test":
			return "https://api.9999ax.com"
		case "production":
			return "https://api.9999ax.com"
		default:
			return "https://api.9999ax.com"
	}
}

// 微信APPID
export const getAppid = () => {
	switch (process.env.NODE_ENV) {
		case "development":
			return "wx8f40475477d53b43"
		case "test":
			return "wx8f40475477d53b43"
		case "production":
			return "wx8f40475477d53b43"
	}
	return "wx8f40475477d53b43"
}


export const EXPIRE = 30 * 24 * 3600 // 秒
export const STOARGEKEY = "$S$"

export const WxAuthUser = "http://10.0.0.22:3001/wx/door/auth";
export const WxAuthJs = "http://10.0.0.22:3001/wx/door/jsapi";
// export const WxAppId="wx4babfbb6f9057a16"
export const WxAppId = getAppid()

// 定义的什么鬼哟

const billType = ["QUESTION", "QUESTION_LISTEN", "QUESTION_REPLAY",
	"APPOINT_OUT", "APPOINT_IN", "WANTED", "REWARD_OUT", "REWARD_IN",
	"RECHARGE", "WITHDRAW", "COMMENT"];





export const billTypeInMsg = ["QUESTION", "QUESTION_LISTEN", "QUESTION_REPLY",
	"APPOINT", "WANTED", "WANTED_REPLY", "REWARD", "RECHARGE", "WITHDRAW",
	"COMMENT", "COMMENT_REPLY", "VIP", "LIVE", "COURSE", "MALL", "OFFLINE"]
export const BillTypes = {
	APPOINT: "APPOINT"
}

export const BILL_TYPE = [
	{ id: "QUESTION", name: "解惑" },
	{ id: "QUESTION_LISTEN", name: "解惑偷听" },
	{ id: "QUESTION_REPLAY", name: "解惑回复" },
	{ id: "APPOINT_OUT", name: "" },
	{ id: "APPOINT_IN", name: "" },
	{ id: "WANTED", name: "悬赏" },
	{ id: "REWARD_OUT", name: "打赏支出" },
	{ id: "REWARD_IN", name: "打赏收入" },
	{ id: "RECHARGE", name: "提现" },
	{ id: "WITHDRAW", name: "退款" },
	{ id: "COMMENT", name: "评论" }
]

export const GATEWAY = ["WALLET", "WEIXIN_MP", "WEIXIN_WAP", "WEIXIN_TRANSFER", "ALIPAY"];
export const PayGATEWAY = {
	"WALLET": "WALLET", WEIXIN_MP: "WEIXIN_MP", WEIXIN_WAP: "WEIXIN_WAP", WEIXIN_TRANSFER: "WEIXIN_TRANSFER", ALIPAY: "ALIPAY"
}

export const SYS_MSG_TYPE = [
	{ id: "COMMENT", name: "评论" },
	{ id: "AGREE", name: "点赞" },
	{ id: "WANTED", name: "悬赏" }
]

export const NAV_INIT = "none";//jump

export const HOME_ROUTE = "/index/home";


