export default {
    /** 格式化日期对象，根据分隔符把日期对象转换为yyyyMMdd */
    formatDateToYYYYMMDD: function (dateObj, separator) {
        let year = dateObj.getFullYear()
        let month = dateObj.getMonth() + 1
        let date = dateObj.getDate()

        if (month < 10) month = '0' + month
        if (date < 10) date = '0' + date

        if (!separator) separator = ''

        return year + separator + month + separator + date
    },
    /** 格式化yyymmdd日期为date对象，根据分隔符拆分 */
    formatYYYYMMDDToDate: function (yyyyMMdd, separator) {
        yyyyMMdd += ''
        let year
        let month
        let date
        let dateObj = new Date()

        if (separator) {
            var fragments = yyyyMMdd.split(separator)
            year = fragments[0]
            month = fragments[1]
            date = fragments[2]
        } else {
            year = yyyyMMdd.slice(0, 4)
            month = yyyyMMdd.slice(4, 6)
            date = yyyyMMdd.slice(6)
        }

        dateObj.setDate(date)
        dateObj.setMonth(month - 1)
        dateObj.setFullYear(year)

        dateObj.setHours(0)
        dateObj.setMinutes(0)
        dateObj.setSeconds(0)
        dateObj.setMilliseconds(0)

        return dateObj
    },
    /** 获取两个时间对象的天数差 */
    getDaysDiff: function (dateObjFrom, dateObjThrough) {
        var timestampFrom = dateObjFrom.getTime()
        var timestampThrough = dateObjThrough.getTime()

        if (timestampThrough < timestampFrom) throw new Error('第一个参数时间必须更小！')

        return (timestampThrough - timestampFrom) / 1000 / 60 / 60 / 24
    },
    /** 为指定时间对象增加指定天数 */
    increaseDaysForDateObj: function (dateObj, days) {
        var dateObjTimestamp = dateObj.getTime()
        var daysTimestamp = days * 24 * 60 * 60 * 1000

        var finalTimestamp = dateObjTimestamp + daysTimestamp

        dateObj.setTime(finalTimestamp)

        return dateObj
    },
    /** 为指定时间对象增加指定月数 */
    increaseMonthsForDateObj: function (dateObj, months) {
        var currMonth = dateObj.getMonth()
        months = parseInt(months)

        dateObj.setMonth(currMonth + months)

        // 若月份比预期的大一个月
        if (currMonth + months + 1 === dateObj.getMonth()) {
            var lastDay = this.getMonthLastDayByYearAndMonth(dateObj.getFullYear(), currMonth + months + 1)
            dateObj.setDate(lastDay)
            dateObj.setMonth(currMonth + months)
        }

        return dateObj
    },
    /** 某月最后一天 */
    getMonthLastDayByYearAndMonth: function (year, month) {
        year = parseInt(year)
        month = parseInt(month)
        console.log(month)
        if (month > 12) { // 如果当前大于12月，则年份转到下一年
            month -= 12
            ++year
        }
        var dt = new Date(year, month, 1)// 取当年当月中的第一天
        return (new Date(dt.getTime() - 1000 * 60 * 60 * 24)).getDate()// 获取当月最后一天日期
    },
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)可以用 1-2 个占位符
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * eg:
     * (new Date()).pattern('yyyy-MM-dd hh:mm:ss.S')==> 2006-07-02 08:09:04.423
     * (new Date()).pattern('yyyy-MM-dd E HH:mm:ss') ==> 2009-03-10 二 20:09:04
     * (new Date()).pattern('yyyy-MM-dd EE hh:mm:ss') ==> 2009-03-10 周二 08:09:04
     * (new Date()).pattern('yyyy-MM-dd EEE hh:mm:ss') ==> 2009-03-10 星期二 08:09:04
     * (new Date()).pattern('yyyy-M-d h:m:s.S') ==> 2006-7-2 8:9:4.18
     */
    pattern: function (date, fmt) {
        var o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
            'H+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            'S': date.getMilliseconds() // 毫秒
        }
        var week = {
            '0': '/u65e5',
            '1': '/u4e00',
            '2': '/u4e8c',
            '3': '/u4e09',
            '4': '/u56db',
            '5': '/u4e94',
            '6': '/u516d'
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[date.getDay() + ''])
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    }
}
