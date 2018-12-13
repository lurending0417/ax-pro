function getSmsSign(mobile) {
    var lastOne = mobile.slice(-1),//手机号码倒数第一位
        lastTwo = mobile.slice(-2, -1),//手机号码倒数第二位
        lastThree = mobile.slice(-3, -2),//手机号码倒数第三位
        timestamp = new Date().getTime(),//时间戳
        mobileFragment = mobile.slice(3, 6),//手机号码片段
        randomNum = randomNumFunc(lastThree),
        sign;//随机数
    sign = sign1(randomNum, lastTwo, timestamp);
    sign = sign2(sign, lastOne, mobileFragment);
    return sign;
}

function randomNumFunc(lastThree) {
    var randomNum = '';
    for (var i = 0; i < 20 + lastThree; ++i) {
        randomNum += i;
    }
    return randomNum;
}

function sign1(randomNum, lastTwo, timestamp) {
    return randomNum.slice(0, lastTwo) + timestamp + randomNum.slice(lastTwo);
}

function sign2(sign, lastOne, mobileFragment) {
    return sign.slice(0, lastOne) + mobileFragment + sign.slice(lastOne);
}

export default {getSmsSign}