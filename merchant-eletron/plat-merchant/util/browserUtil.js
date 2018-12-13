export default {
    getCookie(name) {
        let arr
        let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2])
        } else {
            return null
        }
    },
    deleleteCookie(name) {
        let exp = new Date()
        exp.setTime(exp.getTime() - 1)
        let cval = this.getCookie(name)
        if (cval != null) {
            document.cookie = name + '=' + cval + ';expires=' + exp.toUTCString() + ';path=/';
        }
    },
    setCookie(name, value, time) {
        if (this.getCookie(name)) {
            this.deleleteCookie(name)
            // return
        }
        let strsec = this.getsec(time)
        let exp = new Date()
        exp.setTime(exp.getTime() + strsec * 1)
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toUTCString() + ';path=/';
    },
    getsec(str) {
        if (!str) str = 10 * 60 + 's'
        let str1 = str.substring(1, str.length) * 1
        let str2 = str.substring(0, 1)
        if (str2 === 's') {
            return str1 * 1000
        } else if (str2 === 'h') {
            return str1 * 60 * 60 * 1000
        } else if (str2 === 'd') {
            return str1 * 24 * 60 * 60 * 1000
        }
    }
}
