export default {

    _METADATA_NAME: 'ax_metadata',
    _BASIC_INFO: 'ax_basicInfo',
    _ACCESS_TOKEN: 'access-token',

    cookie: {
        get(name) {
            if (process.browser) {
                let arr
                let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
                if (arr = document.cookie.match(reg)) {
                    return unescape(arr[2])
                } else {
                    return {}
                }
            }
            return {};
        },
        set(name, value) {
            if (!process.browser) {
                return;
            }
            var cookie = name + '=' + value + '; expires=0; path=/';
            document.cookie = cookie;
        },
        delete(name) {
            if (!process.browser) {
                return;
            }
            document.cookie = name + '=; expires=0; path=/'
        }
    },

    sms: {
        sign: function (mobile) {
            let lastOne = mobile.slice(-1); // 手机号码倒数第一位
            let lastTwo = mobile.slice(-2, -1); // 手机号码倒数第二位
            let lastThree = mobile.slice(-3, -2); // 手机号码倒数第三位
            let timestamp = new Date().getTime(); // 时间戳
            let mobileFragment = mobile.slice(3, 6); // 手机号码片段
            let randomNum = this.randomNum(lastThree);
            let sign; // 随机数
            sign = this.magic1(randomNum, lastTwo, timestamp);
            sign = this.magic2(sign, lastOne, mobileFragment);
            return sign;
        },

        randomNum: function (lastThree) {
            let randomNum = '';
            for (let i = 0; i < 20 + lastThree; ++i) {
                randomNum += i;
            }
            return randomNum;
        },

        magic1: function (randomNum, lastTwo, timestamp) {
            return randomNum.slice(0, lastTwo) + timestamp + randomNum.slice(lastTwo);
        },

        magic2: function (sign, lastOne, mobileFragment) {
            return sign.slice(0, lastOne) + mobileFragment + sign.slice(lastOne);
        }
    },

    login(json) {
        if (process.browser) {

            this.cookie.set(this._ACCESS_TOKEN, json.token);

            sessionStorage.setItem(this._METADATA_NAME, JSON.stringify(json.metadata || {}))

            let newBasicInfo = {
                user: json.user,
                merchant: json.merchant,
                stores: json.stores,
                staff: json.staff,
                platEmployee: json.platEmployee,
                store: json.store,
                authorizedPages: json.authorizedPages || []
            };
            sessionStorage.setItem(this._BASIC_INFO, JSON.stringify(newBasicInfo))
        }
    },


    logout() {
        if (process.browser) {
            this.cookie.delete(this._ACCESS_TOKEN);
            sessionStorage.removeItem(this._METADATA_NAME);
            sessionStorage.removeItem(this._BASIC_INFO);
        }
        window.location = "/"
    },

    getAccessToken() {
        return this.cookie.get(this._ACCESS_TOKEN);
    },


    getMetadata(type, id) {
        if (!process.browser) {
            return [];
        }
        var raw = sessionStorage.getItem(this._METADATA_NAME)
        if (!raw) {
            console.log(" redirected by getMetadata()...")
            this.logout();
        }
        var metadata = [];
        try {
            metadata = JSON.parse(raw);
        } catch (e) {
        }

        if (type) {
            metadata = metadata[type] || [];
        }

        if (id) {
            let done = false;
            for (let i = 0, j = metadata.length; i < j; i++) {
                if (metadata[i].id === id) {
                    metadata = metadata[i]
                    done = true;
                    break
                }
            }
            if (!done) {
                metadata = {};
            }
        }

        return metadata;
    },


    getEnum(type, id) {
        var enums = this.getMetadata('enums');
        if (typeof (enums) == 'array') {
            enums = {};
        }
        if (type) {
            enums = enums[type] || [];
        }
        if (id) {
            for (var i = 0, j = enums.length; i < j; i++) {
                let temp = enums[i];
                if (temp.id === id) {
                    return temp.name;
                }
            }
            return "";
        }
        return enums;
    },


    getBasicInfo() {
        if (!process.browser) {
            return {};
        }
        let raw = sessionStorage.getItem(this._BASIC_INFO);
        if (!raw) {
            console.log(" redirected by getBasicInfo()...")
            this.logout();
        }
        return JSON.parse(raw);
    },


    getUser() {
        return getBasicInfo().user || {};
    },


    getMerchant() {
        return getBasicInfo().merchant || {};
    },


    getStore() {
        return getBasicInfo().store || {};
    },


    getStaff() {
        return getBasicInfo().staff || {};
    },


    getStore() {
        return getBasicInfo().store || {};
    },


    round(value, decimals) {
        try {
            var d = Math.pow(10, decimals || 2);
            return Math.round(eval(value) * d) / d;
        } catch (err) {
            return 0;
        }
    }


}
