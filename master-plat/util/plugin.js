Number.prototype.format = function (pattern) {
    var strarr = this.toString().split('.');
    var fmtarr = pattern ? pattern.split('.') : [''];
    var retstr = '';

    // 整数部分
    var str = strarr[0];
    var fmt = fmtarr[0];
    var i = str.length - 1;
    var comma = false;
    for (var f = fmt.length - 1; f >= 0; f--) {
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
    for (var d = 0; d < fmt.length; d++) {
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
};


import {baseUtil, renderUtil} from "~/util"

export default {

    install(Vue) {
        Vue.prototype.renderYmd = renderUtil.renderYmd;
        Vue.prototype.renderTime = renderUtil.renderTime;
        Vue.prototype.renderNumber = renderUtil.renderNumber;
        Vue.prototype.renderGender = renderUtil.renderGender;
        Vue.prototype.renderMoney = renderUtil.renderMoney;
        Vue.prototype.renderGold = renderUtil.renderGold;
        Vue.prototype.renderWeightedPrice = renderUtil.renderWeightedPrice;
        Vue.prototype.renderEnum = renderUtil.renderEnum;
        Vue.prototype.renderPhone = renderUtil.renderPhone;
        Vue.prototype.renderEnabled = renderUtil.renderEnabled;
        Vue.prototype.renderDistrictCode = renderUtil.renderDistrictCode;
        Vue.prototype.renderResource = renderUtil.renderResource;
        Vue.prototype.renderProtectedResource = renderUtil.renderProtectedResource;
    }

}
