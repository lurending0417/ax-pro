// 加
function add (num1, num2) {
    var r1, r2, m
    try {
        r1 = num1.toString().split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = num2.toString().split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m
}

function adds (numArr) {
    let result = 0
    for (let i = 0; i < numArr.length; i++) {
        result = this.add(result, numArr[i])
    }
    return result
}

// 减
function subtract (num1, num2) {
    var r1, r2, m
    try {
        r1 = num1.toString().split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = num2.toString().split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    var n = (r1 >= r2) ? r1 : r2
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n)
}

// 乘
function multiply (num1, num2) {
    var m = 0
    var s1 = num1.toString()
    var s2 = num2.toString()
    try {
        m += s1.split('.')[1].length
    } catch (e) {
    }

    try {
        m += s2.split('.')[1].length
    } catch (e) {
    }

    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

// 除
function divide (num1, num2) {
    var t1, t2, r1, r2
    try {
        t1 = num1.toString().split('.')[1].length
    } catch (e) {
        t1 = 0
    }
    try {
        t2 = num2.toString().split('.')[1].length
    } catch (e) {
        t2 = 0
    }
    r1 = Number(num1.toString().replace('.', ''))
    r2 = Number(num2.toString().replace('.', ''))
    return (r1 / r2) * Math.pow(10, t2 - t1)
}

export default {add, adds, subtract, multiply, divide}