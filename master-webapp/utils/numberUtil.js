/** 判断是否是数字 */
function isNumber(num) {
    return /^([1-9][0-9]+|[0-9])(\.[0-9]+)?$/.test(num + '');
}


/** 保留两位小数，并四舍五入 */
function toKeepTwoPlacesOfDecimalAndRound(num) {
    let roundingOffNum = num * 1000;


    if (roundingOffNum % 10 >= 5) roundingOffNum += 10;

    return parseInt(roundingOffNum / 10) / 100;
}

/** 保留两位小数，并四舍五入，不足补零 */
function toKeepTwoPlacesOfDecimalAndRoundSupplementZero(num) {
    let roundingOffNum = num * 1000;

    if (roundingOffNum % 10 >= 5) roundingOffNum += 10;

    let result = parseInt(roundingOffNum / 10) / 100;
    result += '';
    let fragments = result.split('.');
    if (fragments.length === 1) {
        result += '.00';
    } else if (fragments.length === 2 && fragments[1].length === 1) {
        result += '0';
    }

    return result;
}

/** 保留十位小数，并四舍五入 */
function toKeepTenPlacesOfDecimalAndRound(num) {
    let roundingOffNum = num * 100000000000;

    if (roundingOffNum % 10 >= 5) roundingOffNum += 10;

    return parseInt(roundingOffNum / 10) / 10000000000;
}

export default {
    isNumber,
    toKeepTwoPlacesOfDecimalAndRound,
    toKeepTwoPlacesOfDecimalAndRoundSupplementZero,
    toKeepTenPlacesOfDecimalAndRound
}
