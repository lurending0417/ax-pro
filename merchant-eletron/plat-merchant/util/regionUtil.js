import ChinaAreaData from 'china-area-data';
export default {
    getDetailAddress(districtCode, type) {
        let proCode = districtCode.slice(0, 2) + '0000';
        let cityCode = districtCode.slice(0, 4) + '00';

        let provinceName = ChinaAreaData['86'][proCode];
        let cityName = ChinaAreaData[proCode][cityCode];
        let districtName = ChinaAreaData[cityCode][districtCode];

        let names = [provinceName];
        if (cityName !== '市辖区' && cityName !== '县' && cityName) {
            names.push(cityName);
        }
        if (districtName) {
            names.push(districtName);
        }
        if (type) {
            return {
                pro: proCode,
                city: cityCode,
                area: districtCode
            }
        } else {
            return names.join(' ')
        }
    }
}
