import moment from "moment"

import {baseUtil} from "~/util"

import {renderUtil} from "./"

import api from "~/api"

import ChinaAreaData from "china-area-data"

export default {

    detectors: {
        isString: function (data) {
            return (typeof data == 'string') && data.constructor == String;
        },
        isArray: function (data) {
            return (typeof data == 'object') && data.constructor == Array;
        },
        isNumber: function (data) {
            return (typeof data == 'number') && data.constructor == Number;
        },
        isDate: function (data) {
            return (typeof data == 'object') && data.constructor == Date;
        },
        isBoolean: function (data) {
            return (typeof data == 'boolean') && data.constructor == Boolean;
        },
        isFunction: function (data) {
            return (typeof data == 'function') && data.constructor == Function;
        },
        isObject: function (data) {
            return (typeof data == 'object') && data.constructor == Object;
        },
    },


    format(data, pattern) {
        let strarr = data.toString().split('.');
        let fmtarr = pattern ? pattern.split('.') : [''];
        let retstr = '';

        // 整数部分
        let str = strarr[0];
        let fmt = fmtarr[0];
        let i = str.length - 1;
        let comma = false;
        for (let f = fmt.length - 1; f >= 0; f--) {
            switch (fmt.substr(f, 1)) {
                case '#':
                    if (i >= 0) retstr = str.substr(i--, 1) + retstr;
                    break;
                case '0':
                    if (i >= 0) retstr = str.substr(i--, 1) + retstr;
                    else retstr = '0' + retstr;
                    break;
                case ',':
                    comma = true;
                    retstr = ',' + retstr;
                    break;
                case '-' :
                    retstr = '-' + retstr;
                    break;
            }
        }
        if (i >= 0) {
            if (comma) {
                var l = str.length;
                for (; i >= 0; i--) {
                    retstr = str.substr(i, 1) + retstr;
                    if (i > 0 && ((l - i) % 3) == 0) retstr = ',' + retstr;
                }
            }
            else retstr = str.substr(0, i + 1) + retstr;
        }

        retstr = retstr + '.';
        // 处理小数部分
        str = strarr.length > 1 ? strarr[1] : '';
        fmt = fmtarr.length > 1 ? fmtarr[1] : '';
        i = 0;
        for (let d = 0; d < fmt.length; d++) {
            switch (fmt.substr(d, 1)) {
                case '#':
                    if (i < str.length) retstr += str.substr(i++, 1);
                    break;
                case '0':
                    if (i < str.length) retstr += str.substr(i++, 1);
                    else retstr += '0';
                    break;
            }
        }
        return retstr.replace(/^,+/, '').replace(/\.$/, '');
    },

    renderYmd() {
        let data = renderUtil._getArgumentData(arguments);
        if (!data) {
            return "";
        }
        if (renderUtil.detectors.isString(data)) {
            data = parseInt(data) || data;
        }
        if (renderUtil.detectors.isNumber(data)) {
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
        let data = renderUtil._getArgumentData(arguments);
        return data && renderUtil.detectors.isNumber(data) ? renderUtil._getNumberSign(data) + Math.abs(data).format("###,###,###.##") : '';
    },

    renderGender() {
        let data = renderUtil._getArgumentData(arguments);
        return data && renderUtil.renderEnum('gender', data);
    },

    renderMoney() {
        let data = renderUtil._getArgumentData(arguments);
        return data && renderUtil.detectors.isNumber(data) ? '¥' + renderUtil._getNumberSign(data) + Math.abs(data).format("###,###,###.##") : '';
    },

    renderGold() {
        let data = renderUtil._getArgumentData(arguments);
        return data && renderUtil.detectors.isNumber(data) ? renderUtil._getNumberSign(data) + (Math.abs(data) >= 1000 ? (Math.abs(data) / 1000).format("###,###,###.###") + 'g' : Math.abs(data) + "mg") : '';
    },

    renderWeightedPrice() {
        let data = renderUtil._getArgumentData(arguments);
        return data && renderUtil.detectors.isNumber(data) ? '¥' + renderUtil._getNumberSign(data) + Math.abs(data).format("###,###,###.##") + '/g' : '';
    },

    renderTime() {
        let data = renderUtil._getArgumentData(arguments);
        return data && renderUtil.detectors.isNumber(data) ? moment(data).format('YYYY-MM-DD HH:mm:ss') : "";
    },

    renderEnabled() {
        let data = renderUtil._getArgumentData(arguments);
        return data ? '启用' : '停用';
    },

    renderEnum(type, id) {
        return baseUtil.getEnum(type, id);
    },

    renderPhone() {
        let data = renderUtil._getArgumentData(arguments);
        if (!data) {
            return "";
        }
        if (!renderUtil.detectors.isString(data)) {
            data = data.toString();
        }
        if (data.length == 11) {
            return (parseInt(data) || 0).format("###-####-####")
        }
        return data;
    },

    renderDistrictCode() {
        let data = renderUtil._getArgumentData(arguments);
        if (!data || data.length != 6) {
            return "";
        }
        let provinceCode = data.substring(0, 2) + "0000", provinceName = ChinaAreaData['86'][provinceCode];
        let cityCode = data.substring(0, 4) + "00", cityName = ChinaAreaData[provinceCode][cityCode];
        let districtName = ChinaAreaData[cityCode][data];

        let names = [provinceName];
        if (cityName !== '市辖区' && cityName !== '县') {
            names.push(cityName);
        }
        names.push(districtName);
        return names.join(" ");
    },


    renderResource(path, appendix) {
        if (!path) {
            return "";
        }
        return "https://static.9999ax.com/" + path + (appendix ? appendix : "");
    },


    renderProtectedResource(path, appendix, el) {
        if (!path) {
            return "";
        }
        api.request({
            url: api.url.file.get,
            params: {
                path: path,
                open: false
            },
            success(json) {
                let url = json.result + (appendix ? appendix : '');
            }
        });
    },


    renderTab(container) {
        if (!container.initTabs) {
            container.initTabs = [];
        }
        let tabs = container.$refs.tabComponent;
        if (!tabs) {
            return;
        }
        for (let i = 0, j = tabs.length; i < j; i++) {
            let tab = tabs[i], alias = tab.$attrs.name;
            if (alias === container.activeTab) {
                if (container.initTabs.indexOf(alias) === -1) {
                    container.initTabs.push(alias);
                    tab.$emit("init");
                }
                break;
            }
        }
    },


    resetTab(container) {
        container.initTabs = [];
        container.activeTab = null;
        let tabs = container.$refs.tabComponent;
        if (tabs) {
            for (let i = 0, j = tabs.length; i < j; i++) {
                let tab = tabs[i];
                tab.$emit("reset");
            }
        }
        if (container.tabs && renderUtil.detectors.isArray(container.tabs) && container.tabs.length > 0) {
            setTimeout(() => {
                container.activeTab = container.tabs[0].alias;
            }, 10);
        }
    },


    round: function (value, decimals) {
        try {
            var d = Math.pow(10, decimals);
            return Math.round(eval(value) * d) / d;
        } catch (err) {
            return 0;
        }
    },


    ceil: function (value, decimals) {
        try {
            var d = Math.pow(10, decimals);
            return Math.ceil(eval(value) * d) / d;
        } catch (err) {
            return 0;
        }
    },


    floor: function (value, decimals) {
        try {
            var d = Math.pow(10, decimals);
            return Math.floor(eval(value) * d) / d;
        } catch (err) {
            return 0;
        }
    },


    _getArgumentData(args) {
        if (!args) {
            return null;
        }
        switch (args && args.length) {
            case 1:
                return args[0];
            case 4:
                return args[2];
            default:
                return null;
        }
    },

    _getNumberSign(data) {
        return data && renderUtil.detectors.isNumber(data) && data < 0 ? "-" : "";
    }

}
