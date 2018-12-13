

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "H+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
Date.prototype.day = function () {
    return this.getDate();
};
Date.prototype.localeStr = function () {
    return this.format("yyyy-MM-dd");
};
Date.prototype.localTimeStr = function () {
    return this.format("yyyy/MM/dd HH:mm:ss");
}
Date.parse1 = function (datestr) {//ios 专用
    datestr = datestr.replace(/-/g, "/");
    return new Date(datestr);
}
Date.prototype.week = function () {
    return ' 星期' + '日一二三四五六'.charAt(this.getDay());
};
Date.prototype.addMilliseconds = function (value) {
    this.setMilliseconds(this.getMilliseconds() + value);
    return this;
};
Date.prototype.add = function (value) { return this.addMilliseconds(value * 86400000); };
Date.prototype.addDays = Date.prototype.add;
Date.prototype.addHour = function (value) { return this.addMilliseconds(value * 3600000); };
Date.today = function () {
    return new Date();
};
Date.between = function (d1, d2) {
    return Math.abs(d1.getTime() - d2.getTime()) / 1000;
}

Date.prototype.getUnixTimeStamp = function () {
    return Math.round(this.getTime() / 1000);
}

Date.prototype.getLocalString = function () {
    return this.format('yyyy-MM-dd HH:mm:ss')
}

//获取给定日期的上一周
Date.prototype.getLastSunday = function () {
    // return new Date();
    var nowd = this.getDay();
    nowd = nowd == 0 ? 7 : nowd;
    return new Date(this.valueOf() - nowd * 24 * 3600 * 1000);
}
Date.getMonthLastDayByYearAndMonth = function (year, month) {
    year = parseInt(year)
    month = parseInt(month)
    if (month > 12) {
        month -= 12
        ++year
    }
    var dt = new Date(year, month, 1)// 取当年当月中的第一天
    return (new Date(dt.getTime() - 1000 * 60 * 60 * 24)).getDate()// 获取当月最后一天日期
}

module.exports = {
    getUnixTimeStamp: function (date) {
        if (!date)
            date = new Date();
        if (typeof date == "string")
            date = Date.parse(date);
        return Math.round(date.getTime() / 1000);
    }
}

