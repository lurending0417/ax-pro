import { IMGHOST } from '../common/constant'

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



export const detectors = {
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
}

const exp = {
      format(data, pattern) {
            var strarr = data.toString().split('.');
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
                        case '-':
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
      },

      renderYmd() {
            let args = arguments;
            let data = args.length > 0 ? args[args.length - 1] : null;
            if (!data) {
                  return "";
            }
            if (detectors.isString(data)) {
                  data = parseInt(data) || data;
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
            let args = arguments;
            let data = args.length > 0 ? args[args.length - 1] : null;
            return data && detectors.isNumber(data) ? data.format("####,###.##") : '';
      },

      renderMoney() {
            let args = arguments;
            let data = args.length > 0 ? args[args.length - 1] : null;
            return data && detectors.isNumber(data) ? '¥' + data.format("####,###.##") : '';
      },

      renderTime() {
            let args = arguments;
            let data = args.length > 0 ? args[args.length - 1] : null;
            return data && moment(data).format('YYYY-MM-DD HH:mm:ss') || "";
      },
      renderTableTime() {

      },

      renderEnabled() {
            let args = arguments;
            let data = args.length > 0 ? args[args.length - 1] : null;
            return data ? '启用' : '停用';
      },

      renderPhone() {
            let args = arguments;
            let data = args.length > 0 ? args[args.length - 1] : null;
            if (!data) {
                  return "";
            }
            if (!detectors.isString(data)) {
                  data = data.toString();
            }
            if (data.length == 11) {
                  return (parseInt(data) || 0).format("###-####-####")
            }
            return data;
      },

      renderDistrictCode() {
            let args = arguments;
            let data = args.length > 0 ? args[args.length - 1] : null;
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
      renderGender() {
            let args = arguments;
            let gender = args.length > 0 ? args[args.length - 1] : null;
            return gender ? (gender == 'male' ? "男" : "女") : ''
      },
      renderGenderReverse() {
            let args = arguments;
            let gender = args.length > 0 ? args[args.length - 1] : null;
            return gender == 'male';
      },
      renderImg() {
            let args = arguments;
            let path = args.length > 0 ? args[args.length - 1] : null;
            if (/http/.test(path)) {
                  return path;
            }
            if (!path) {
                  return '';
            }
            return join(IMGHOST, path);
      },
      renderCert() {
            let args = arguments;
            let path = args.length > 0 ? args[args.length - 1] : null;
            if (/http/.test(path)) {
                  return path;
            }
            if (!path) {
                  return '';
            }
            path = path.slice(path.indexOf('/') + 1)
            return join(IMGHOST, "v1/file.show?fileName=" + (path));
      },
      renderChainState() {
            let args = arguments;
            let data = args.length > 0 ? args[args.length - 1] : null;
            switch (data) {
                  case -1: return "上链中"
                  case 0: return '上链失败'
                  case 1: return '上链成功'
                  default: return "未知"
            }
      },
      // table 的formatter 最后时 cell 序号
      bindTableFormatter2Render(k) {
            return (...args) => {
                  if (args.length > 3) {
                        return exp[k](...args.slice(0, -1))
                  }
                  return exp[k](...args)
            }
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

}

export default exp;



