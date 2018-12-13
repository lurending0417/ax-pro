/*
 直接从后台copy的
*/

import moment from "moment"
import ChinaAreaData from "china-area-data"

let _enums = {};

const detectors = {
	isString: (data) => {
		return (typeof data === "string") && data.constructor === String;
	},
	isArray(data) {
		return (typeof data === "object") && data.constructor === Array;
	},
	isNumber(data) {
		return (typeof data === "number") && data.constructor === Number;
	},
	isDate(data) {
		return (typeof data === "object") && data.constructor === Date;
	},
	isBoolean(data) {
		return (typeof data === "boolean") && data.constructor === Boolean;
	},
	isFunction(data) {
		return (typeof data === "function") && data.constructor === Function;
	},
	isObject(data) {
		return (typeof data === "object") && data.constructor === Object;
	}
}

const format = (data, pattern) => {
	const strarr = data.toString().split(".");
	const fmtarr = pattern ? pattern.split(".") : [""];
	let retstr = "";

	// 整数部分
	let str = strarr[0];
	let fmt = fmtarr[0];
	let i = str.length - 1;
	let comma = false;
	for (let f = fmt.length - 1; f >= 0; f--) {
		switch (fmt.substr(f, 1)) {
			case "#":
				if (i >= 0) retstr = str.substr(i--, 1) + retstr;
				break;
			case "0":
				if (i >= 0) retstr = str.substr(i--, 1) + retstr;
				else retstr = `0${retstr}`;
				break;
			case ",":
				comma = true;
				retstr = `,${retstr}`;
				break;
			case "-":
				retstr = `-${retstr}`;
				break;
			default:
				break;
		}
	}
	if (i >= 0) {
		if (comma) {
			const l = str.length;
			for (; i >= 0; i--) {
				retstr = str.substr(i, 1) + retstr;
				if (i > 0 && ((l - i) % 3) === 0) retstr = `,${retstr}`;
			}
		} else retstr = str.substr(0, i + 1) + retstr;
	}

	retstr += ".";
	// 处理小数部分
	str = strarr.length > 1 ? strarr[1] : "";
	fmt = fmtarr.length > 1 ? fmtarr[1] : "";
	i = 0;
	for (let d = 0; d < fmt.length; d++) {
		switch (fmt.substr(d, 1)) {
			case "#":
				if (i < str.length) retstr += str.substr(i++, 1);
				break;
			case "0":
				if (i < str.length) retstr += str.substr(i++, 1);
				else retstr += "0";
				break;
			default:
				break;
		}
	}
	return retstr.replace(/^,+/, "").replace(/\.$/, "");
}

export default {
	_init(meta) {
		//
		_enums = meta.enums;
	},
	format,
	renderYmd() {
		const args = arguments;
		let data = args.length > 0 ? args[args.length - 1] : null;
		if (!data) {
			return "";
		}
		if (detectors.isString(data)) {
			data = parseInt(data, 0) || data;
		}
		if (detectors.isNumber(data)) {
			switch (data.toString().length) {
				case 4:
					return data.format("####");
				case 6:
					return data.format("####-##");
				default:
					return data.format("####-##-##");
			}
		}
		return data;
	},

	renderNumber() {
		const args = arguments;
		const data = args.length > 0 ? args[args.length - 1] : null;
		return data && detectors.isNumber(data) ? data.format("####,###.##") : "";
	},

	renderMoney(data, showSign = true) {
		// return data && detectors.isNumber(data) ? `${showSign ? '￥' : ''}${format(data, '####,###.##')}` : '';
		return data && detectors.isNumber(data) ? `${showSign ? "￥" : ""}${format(data, "####.##")}` : "";
	},

	renderTime() {
		const args = arguments;
		const data = args.length > 0 ? args[args.length - 1] : null;
		return data && detectors.isNumber(data) ? moment(data).format("YYYY-MM-DD HH:mm") : "";
	},

	renderEnabled() {
		const args = arguments;
		const data = args.length > 0 ? args[args.length - 1] : null;
		return data ? "启用" : "停用";
	},


	renderPhone() {
		const args = arguments;
		let data = args.length > 0 ? args[args.length - 1] : null;
		if (!data) {
			return "";
		}
		if (typeof data !== "string") {
			data = data.toString();
		}
		if (data.length === 11) {
			return (parseInt(data, 0) || 0).format("###-####-####")
		}
		return data;
	},
	renderSubPhone() {
		const args = arguments;
		let data = args.length > 0 ? args[args.length - 1] : null;
		if (!data) {
			return "";
		}
		if (typeof data !== "string") {
			data = data.toString();
		}
		if (data.length === 11) {
			return `${data.substring(0, 3)}****${data.substring(7, 11)}`;
		}
		return data;
	},
	renderBankNum() {
		const args = arguments;
		let data = args.length > 0 ? args[args.length - 1] : null;
		if (!data) {
			return "";
		}
		if (typeof data !== "string") {
			data = data.toString();
		}
		if (data.length > 11) {
			return data.substring(data.length - 4, data.length);
		}
		return data;
	},
	renderEnum(id, type) {
		const enums = _enums[type];
		if (enums) {
			return (enums.find(item => item.id === id) || {}).name
		}
		return "未知";
	},

	renderTimeSeconds(ts, unit = true) {
		ts /= 1000;

		const h = ts > 3600 ? Math.floor(ts / 3600) : 0;
		ts %= 3600;

		const m = ts > 60 ? Math.floor(ts / 60) : 0;
		ts = Math.floor(ts % 60) || 0

		const end = [];
		const v = (t) => { return t < 10 ? "0" + t : t };

		if (unit) {
			if (h) end.push(`${v(h)}${"小时"}`)
			if (m) end.push(`${v(m)}${"分钟"}`)
			if (ts) end.push(`${v(ts)}${"秒"}`)
		}
		else {
			end.push(`${v(h)}${":"}`)
			end.push(`${v(m)}${":"}`)
			end.push(`${v(ts)}${""}`)
		}

		return end.join("")
	},


	// 返回两个时间间隔的 小时 分钟 秒 表示
	renderTimeSpan(time0, time11) {
		const time1 = time11 || Date.now();
		const ts = time0 - time1;
		return this.renderTimeSeconds(ts)
	},
	// 返回天数
	renderTimeSpanDays(time0, time1) {
		time1 = time1 || Date.now();
		let ts = (time0 - time1);
		ts /= 1000;

		const d = ts > 0 ? 1 : -1;

		return Math.floor(Math.abs(ts / (60 * 60 * 24))) * d;
	},

	renderDistrictCode() {
		const args = arguments;
		let data = args.length > 0 ? args[args.length - 1] : null;
		if (!data || data.length !== 6) {
			return "";
		}
		data = data.toString();
		const provinceCode = `${data.substring(0, 2)}0000`;
		const provinceName = ChinaAreaData["86"][provinceCode];
		const cityCode = `${data.substring(0, 4)}00`;
		const cityName = ChinaAreaData[provinceCode][cityCode];
		const districtName = ChinaAreaData[cityCode][data];

		const names = [provinceName];
		if (cityName !== "市辖区" && cityName !== "县") {
			names.push(cityName);
		}
		names.push(districtName);
		return names.join(" ");
	},
	renderSimpleNums(num) {
		//  使用略写
		// 12000 1.2万
		const tags = ["万", "亿"]
		const nums = [10000, 100000000]
		if (num > nums[0]) {
			for (let i = nums.length - 1; i >= 0; i--) {
				if (num > nums[i]) {
					return (num / nums[i]).toFixed(2) + tags[i];
				}
			}
		}
		return num;
	},
	renderGoldUnit(num) {
		if (+num > 1000) {
			return "g"
		}
		return "mg"
	},

	renderGoldNum(num) {
		if (+num > 1000) {
			return (+num / 1000).toFixed(2)
		}
		return num;
	},
	renderBigNum(/*生成 大叔字+*/num = 0) {
		const arr0 = [1000, 10000, 100000, 1000000, 10000000]
		const arr1 = ["{num}", "${n}千+", "${n}万+", "${n}万+", "${n}百万+"]
		if (num < arr0[0]) {
			return num
		}
		for (var i = 1, l = 6; i < l; i++) {
			if (num < arr0[i]) {
				return arr1[i].replace("${n}", parseInt(num / arr1[i - 1]))
			}
		}

		return "千万+"
	},

	renderCourseState(item) {
		if (!item.video) {
			return {
				label: "待更新",
				cla: "",
				tag: ""
			}
		}

		return {
			label: "",
			cla: !item.playAble ? "icon-locked" : (item.studied ? "icon-readed" : "icon-unread"),
			tag: item.studied ? "已看" : ""
		}
	},
	renderCourseTag(discountType) {
		if (discountType == "FREE") {
			return "免费课程"
		}
		if (discountType == "DISCOUNT") {
			return "限时折扣"
		}
		return "";
	}


}
