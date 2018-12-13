export const platform = () => {
	if (typeof navigator == "undefined") {
		return;
	}
	var u = navigator.userAgent;
	if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
		//安卓手机
		return "android"
	} else if (u.indexOf("iPhone") > -1) {
		//苹果手机
		return "ios"
	} else if (u.indexOf("Windows Phone") > -1) {
		//winphone手机
		return "win"
	}
}

export const isIos = () => {
	return platform() == "ios"
}