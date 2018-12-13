//阿拉伯数字转换为简写汉字
export default function Arabia_To_SimplifiedChinese(Num) {
	for (let i = Num.length - 1; i >= 0; i--) {
		Num = Num.replace(",", "")//替换Num中的“,”
		Num = Num.replace(" ", "")//替换Num中的空格
	}
	if (isNaN(Num)) { //验证输入的字符是否为数字
		//alert("请检查小写金额是否正确");
		return;
	}
	//字符处理完毕后开始转换，采用前后两部分分别转换
	let part = String(Num).split(".");
	let newchar = "";
	//小数点前进行转化
	for (let i = part[0].length - 1; i >= 0; i--) {
		if (part[0].length > 10) {
			//alert("位数过大，无法计算");
			return "";
		}//若数量超过拾亿单位，提示
		let tempNewChar = "";
		let PerChar = part[0].charAt(i);
		switch (PerChar) {
			case "0":  tempNewChar = "零" + tempNewChar;break;
			case "1": tempNewChar = "一" + tempNewChar; break;
			case "2": tempNewChar = "二" + tempNewChar; break;
			case "3": tempNewChar = "三" + tempNewChar; break;
			case "4": tempNewChar = "四" + tempNewChar; break;
			case "5": tempNewChar = "五" + tempNewChar; break;
			case "6": tempNewChar = "六" + tempNewChar; break;
			case "7": tempNewChar = "七" + tempNewChar; break;
			case "8": tempNewChar = "八" + tempNewChar; break;
			case "9": tempNewChar = "九" + tempNewChar; break;
		}
		switch (part[0].length - i - 1) {
			case 0: tempNewChar = tempNewChar; break;
			case 1: if (PerChar !== 0) tempNewChar = tempNewChar + "十"; break;
			case 2: if (PerChar !== 0) tempNewChar = tempNewChar + "百"; break;
			case 3: if (PerChar !== 0) tempNewChar = tempNewChar + "千"; break;
			case 4: tempNewChar = tempNewChar + "万"; break;
			case 5: if (PerChar !== 0) tempNewChar = tempNewChar + "十"; break;
			case 6: if (PerChar !== 0) tempNewChar = tempNewChar + "百"; break;
			case 7: if (PerChar !== 0) tempNewChar = tempNewChar + "千"; break;
			case 8: tempNewChar = tempNewChar + "亿"; break;
			case 9: tempNewChar = tempNewChar + "十"; break;
		}
		newchar = tempNewChar + newchar;
	}
	//替换所有无用汉字，直到没有此类无用的数字为止
	while (newchar.search("零零") !== -1 || newchar.search("零亿") !== -1 || newchar.search("亿万") !== -1 || newchar.search("零万") !== -1) {
		newchar = newchar.replace("零亿", "亿");
		newchar = newchar.replace("亿万", "亿");
		newchar = newchar.replace("零万", "万");
		newchar = newchar.replace("零零", "零");
	}
	//替换以“一十”开头的，为“十”
	if (newchar.indexOf("一十") === 0) {
		newchar = newchar.substr(1);
	}
	//替换以“零”结尾的，为“”
	if (newchar.lastIndexOf("零") === newchar.length - 1) {
		newchar = newchar.substr(0, newchar.length - 1);
	}
	return newchar;
}
