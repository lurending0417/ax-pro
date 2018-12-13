export const isEmpty = v => {
	return !v && v !== 0
}

export const isNull = v => {
	return isEmpty(v) && v !== ""
}

/**
 * 必填参数
 * @return {[type]} [description]
 */
export const required = function required(paramName = "") {
	throw new Error(`函数必填参数${paramName}不能为空！`);
}

export const join = function (url1) {
	if (arguments.length === 1) return url1;
	return Array.prototype.reduce.call(arguments, (last, now) => {
		const left = last.slice(-1) === '/' ? last.slice(0, -1) : last;
		if (!now) {
			return left;
		}
		const right = now.slice(0, 1) === '/' ? now : `/${now}`;
		return left + right;
	})
}

export const getUrlParam = (name, source) => {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = (source || window.location.search.substr(1)).match(reg);
	if (r != null) return decodeURI(decodeURI(r[2]));
	return "";
}


export const query2Object = str => {
	if (!str) {
		return {}
	}
	if (/\?/.test(str)) {
		str = str.replace(/.*\?/g, "")
	}
	return str.split("&").reduce((last, now) => {
		const rs = now.split("=");
		if (rs.length == 2) {
			last[rs[0]] = decodeURIComponent(rs[1]);
		}
		return last;
	}, {})
}

export const object2Query = body => {
	return Object.keys(body || {}).reduce((last, key) => {
		let v = typeof body[key] == 'object' ? JSON.stringify(body[key]) : body[key];
		last += (last ? "&" : "") + key + "=" + (v);
		return last;
	}, "") || ""
}

export const preImgFromFile = file => {
	var url = null;
	// 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
	if (window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if (window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if (window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}

function randomNumber(length) {
	const arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	let str = "";
	for (let i = 0; i < length; i++) {
		const pos = Math.round(Math.random() * (arr.length - 1));
		str += arr[pos];
	}
	return str;
}

export const smsSign = function genSign(mobile) {
	const num1 = parseInt(mobile[mobile.length - 1], 10); // 倒数第一位
	const num2 = parseInt(mobile[mobile.length - 2], 10); // 倒数第二位
	const num3 = parseInt(mobile[mobile.length - 3], 10); // 倒数第三位
	const subMobile = mobile.slice(3, 6); // 4-6位

	let token = randomNumber(20 + num3); // 生成20 + num3位随机数字
	const timestamp = Date.now();
	token = token.slice(0, num2) + timestamp + token.slice(num2);
	token = token.slice(0, num1) + subMobile + token.slice(num1);
	console.log("生成时间戳:", timestamp, "token:", token);
	return token;
}

export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
	const byteCharacters = atob(b64Data);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, { type: contentType });
	return blob;
}
