export default {
    encrypt: function (mobile) {
        let lastOne = mobile.slice(-1); // 手机号码倒数第一位
        let lastTwo = mobile.slice(-2, -1); // 手机号码倒数第二位
        let lastThree = mobile.slice(-3, -2); // 手机号码倒数第三位
        let timestamp = new Date().getTime(); // 时间戳
        let mobileFragment = mobile.slice(3, 6); // 手机号码片段
        let randomNum = this.randomNum(lastThree);
        let sign; // 随机数
        sign = this.sign1(randomNum, lastTwo, timestamp);
        sign = this.sign2(sign, lastOne, mobileFragment);
        return sign;
    },

    randomNum: function (lastThree) {
        let randomNum = '';
        for (let i = 0; i < 20 + lastThree; ++i) {
            randomNum += i;
        }
        return randomNum;
    },

    sign1: function (randomNum, lastTwo, timestamp) {
        return randomNum.slice(0, lastTwo) + timestamp + randomNum.slice(lastTwo);
    },

    sign2: function (sign, lastOne, mobileFragment) {
        return sign.slice(0, lastOne) + mobileFragment + sign.slice(lastOne);
    }

};
