export default {
    getDetailAddress(districtCode, arr, type) {
        let proCode = districtCode.slice(0, 2) + '0000';
        let cityCode = districtCode.slice(0, 4) + '00';
        let str = '';
        for (let province = 0, proLen = arr.length; province < proLen; province++) {
            if (arr[province].value === proCode) {
                str += arr[province].label + ' ';
                for (let city = 0, cityLen = arr[province].children.length; city < cityLen; city++) {
                    if (arr[province].children[city].value === cityCode) {
                        str += arr[province].children[city].label + ' ';
                        for (let area = 0, areaLen = arr[province].children[city].children.length; area < areaLen; area++) {
                            if (arr[province].children[city].children[area].value === districtCode) {
                                str += arr[province].children[city].children[area].label;
                                break;
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }
        if (type) {
            return {
                pro: proCode,
                city: cityCode,
                area: districtCode
            }
        } else {
            return str
        }
    }
}
