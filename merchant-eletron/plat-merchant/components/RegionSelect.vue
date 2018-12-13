<template>
    <div class="form-group">
        <label class="col-sm-2 control-label">{{params.title}}</label>
        <div class="col-sm-10 selectWrap" style="text-align: left">
            <select class="form-control" v-model="proObj.proCode" :disabled="params.disabled">
                <option v-for="item in proObj.proArr" :value="item.value">{{item.label}}</option>
            </select>
            <select class="form-control" v-model="cityObj.cityCode" :disabled="params.disabled">
                <option v-for="item in cityObj.cityArr" :value="item.value">{{item.label}}</option>
            </select>
            <select class="form-control" v-model="areaObj.areaCode" :disabled="params.disabled">
                <option v-for="item in areaObj.areaArr" :value="item.value">{{item.label}}</option>
            </select>
        </div>
    </div>
</template>

<script>
    import {TableEvent} from '~/components/TableEvent'

    export default {
        props: ['params'],
        data() {
            return {
                proObj: {
                    proCode: '',
                    proIndex: 0,
                    proArr: []
                },
                cityObj: {
                    cityCode: '',
                    cityIndex: 0,
                    cityArr: []
                },
                areaObj: {
                    areaCode: '',
                    areaIndex: 0,
                    areaArr: []
                },
                defaultValue: ''
            }
        },
        methods: {
            watchProObj(val) {
                this.proObj.proIndex = this.findIndexByValue(val, this.proObj.proArr);
                if (this.proObj.proCode === '710000') {
                    this.handleTaiWan()
                } else {
                    this.cityObj.cityIndex = 0;
                    this.areaObj.areaIndex = 0;
                    this.initObj('city', 'pro');
                    this.initObj('area', 'city');
                    this.$emit('getCode', this.areaObj.areaCode)
                }
            },
            watchCityObj(val) {
                if (this.proObj.proCode === '710000') {
                    this.areaObj = {
                        areaCode: '',
                        areaIndex: 0,
                        areaArr: []
                    };
                    this.$emit('getCode', this.proObj.proCode)
                } else if (this.cityObj.cityCode.slice(2, 4) === '00') { // 港澳
                    this.cityObj.cityIndex = this.findIndexByValue(val, this.cityObj.cityArr);
                    this.areaObj = {
                        areaCode: '',
                        areaIndex: 0,
                        areaArr: []
                    };
                    this.$emit('getCode', this.cityObj.cityCode)
                } else {
                    this.cityObj.cityIndex = this.findIndexByValue(val, this.cityObj.cityArr);
                    this.initObj('area', 'city');
                    this.$emit('getCode', this.areaObj.areaCode)
                }
            },
            watchAreaObj(val) {
                if (this.proObj.proCode === '710000') {
                    this.$emit('getCode', this.proObj.proCode)
                } else if (this.cityObj.cityCode.slice(2, 4) === '00') {
                    this.$emit('getCode', this.cityObj.cityCode)
                } else {
                    this.$emit('getCode', this.areaObj.areaCode)
                }
            },
            handleTaiWan() {
                this.cityObj = {
                    cityCode: '',
                    cityIndex: 0,
                    cityArr: []
                };
                this.areaObj = {
                    areaCode: '',
                    areaIndex: 0,
                    areaArr: []
                };
                this.$emit('getCode', this.proObj.proCode)
            },
            findIndexByValue(val, arr) {
                for (let i = 0, j = arr.length; i < j; i++) {
                    if (arr[i].value === val) {
                        return i
                    }
                }
                return 0;
            },
            initObj(type, aim) {
                // type: city, area
                // aim: pro, city
                if (type === 'pro') {
                    this.proObj.proArr = this.params.data;
                    this.proObj.proCode = this.proObj.proArr[this.proObj.proIndex].value
                } else {
                    let aimIndex = this[aim + 'Obj'][aim + 'Index'];
                    let typeIndex = this[type + 'Obj'][type + 'Index'];
                    if (this[aim + 'Obj'][aim + 'Arr'] && this[aim + 'Obj'][aim + 'Arr'].length > 0) {
                        this[type + 'Obj'][type + 'Arr'] = this[aim + 'Obj'][aim + 'Arr'][aimIndex].children || [];
                    }
                    if (this[type + 'Obj'][type + 'Arr'] && this[type + 'Obj'][type + 'Arr'].length > 0) {
                        this[type + 'Obj'][type + 'Code'] = this[type + 'Obj'][type + 'Arr'][typeIndex].value;
                    }
                }
            },
            setObj(defaultValue) {
                let pre = defaultValue.slice(0, 2);
                let center = defaultValue.slice(0, 4);
                let proCode = pre + '0000';
                let cityCode = center + '00';
                this.proObj = {
                    proCode: proCode,
                    proIndex: this.findIndexByValue(proCode, this.params.data),
                    proArr: this.params.data
                };

                if (pre === '81' || pre === '82') {
                    // 香港特别行政区, 澳门特别行政区
                    this.cityObj = {
                        cityCode: defaultValue,
                        cityIndex: this.findIndexByValue(cityCode, this.proObj.proArr[this.proObj.proIndex].children),
                        cityArr: this.proObj.proArr[this.proObj.proIndex].children
                    };
                    this.areaObj = {
                        areaCode: '',
                        areaIndex: 0,
                        areaArr: []
                    }
                } else if (pre !== '71') {
                    this.cityObj = {
                        cityCode: cityCode,
                        cityIndex: this.findIndexByValue(cityCode, this.proObj.proArr[this.proObj.proIndex].children),
                        cityArr: this.proObj.proArr[this.proObj.proIndex].children
                    };
                    this.areaObj = {
                        areaCode: defaultValue,
                        areaIndex: this.findIndexByValue(defaultValue, this.cityObj.cityArr[this.cityObj.cityIndex].children),
                        areaArr: this.cityObj.cityArr[this.cityObj.cityIndex].children
                    }
                }
            },
            watchFun() {
                this.$watch('proObj.proCode', function (val) {
                    this.watchProObj(val)
                })
                this.$watch('cityObj.cityCode', function (val) {
                    this.watchCityObj(val)
                })
                this.$watch('areaObj.areaCode', function (val) {
                    this.watchAreaObj(val)
                })
            }
        },
        mounted() {
            TableEvent.$on(this.params.PAGE_OPEN, (defaultValue) => {
//                console.log('this.params.data', this.params.data)
                let value = '';
                if (!defaultValue) {
                    value = '110101';
                } else {
                    value = defaultValue
                }
                this.setObj(value)
                this.defaultValue = value
                this.$emit('getCode', value)
                this.watchFun()
            })
        }
    }
</script>

<style scoped>
    .selectWrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .selectWrap select {
        max-width: 150px;
        min-width: 50px;
    }

</style>
