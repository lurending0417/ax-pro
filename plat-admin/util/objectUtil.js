export default {
    /**
     * 将replaceObj中所有和targetObj字段相同的属性的值，设置为targetObj表单字段的属性值
     * @param targetObj 目标obj
     * @param replaceObj 需要替换的obj
     */
    replaceSameFieldsValue(targetObj, replaceObj) {
        for (let key in replaceObj) {
            replaceObj[key] = targetObj[key]
        }
    },
    /**
     * 将replaceObj中所有和targetObj字段相同的表单属性的值（默认以$符号结尾的属性是表单字段），设置为targetObj表单字段的属性值
     * @param targetObj 目标obj
     * @param replaceObj 需要替换的obj
     */
    replaceFormFieldsValue(targetObj, replaceObj) {
        for (let key in replaceObj) {
            if (/.+\$$/.test(key))
                replaceObj[key] = targetObj[key]
        }
    },
    /**
     * 删除每个字段名的最后一个字符
     * @param obj
     */
    removeLastCharOfEveryFields(obj) {
        for (let key in obj) {
            obj[key.slice(0, -1)] = obj[key]
            delete obj[key]
        }
    },
    /**
     * 为form表单对象做过滤处理
     * @param form
     * @return {*}
     */
    formObjectTransformer(form) {
        let newObj = Object.assign({}, form)
        this.removeLastCharOfEveryFields(newObj)
        if (newObj.total === 0) {
            delete newObj.total
        }

        return newObj
    }
}
