import ChinaAreaData from "china-area-data"

function getCityByCode(code) {
	if (!code)
		return ""
	let provinceCode = code.substring(0, 2) + "0000",
		cityCode = code.substring(0, 4) + "00",
		procinceCode = code.substring(0, 6)
	let provinceName = ChinaAreaData["86"][provinceCode],
		cityName = ChinaAreaData[provinceCode][cityCode],
		areaName = ChinaAreaData[cityCode][procinceCode]

	return provinceName + " " + cityName + " " + areaName;
}


export default {
	getCityByCode
}
