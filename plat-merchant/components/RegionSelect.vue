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
                console.log('proObj.proCode', val);
                this.proObj.proIndex = this.findIndxByValue(val, this.proObj.proArr);
                this.cityObj.cityIndex = 0;
                this.areaObj.areaIndex = 0;
                this.initObj('city', 'pro');
                this.initObj('area', 'city');
                this.$emit('getCode', this.areaObj.areaCode)
            },
            watchCityObj(val) {
                console.log('cityObj.cityCode', val);
                this.cityObj.cityIndex = this.findIndxByValue(val, this.cityObj.cityArr);
                this.initObj('area', 'city');
                this.$emit('getCode', this.areaObj.areaCode)
            },
            watchAreaObj(val) {
                console.log('areaObj.areaCode', val)
                // if (val === this.defaultValue) {
                //     this.initStatus = true;
                // }
                this.$emit('getCode', this.areaObj.areaCode)
            },
            findIndxByValue(val, arr) {
                for (let i = 0, j = arr.length; i < j; i++) {
                    if (arr[i].value === val) {
                        return i
                    }
                }
            },
            initObj(type, aim) {
                if (type === 'pro') {
                    this.proObj.proArr = this.params.data;
                    this.proObj.proCode = this.proObj.proArr[this.proObj.proIndex].value
                } else {
                    let aimIndex = this[aim + 'Obj'][aim + 'Index'];
                    let typeIndex = this[type + 'Obj'][type + 'Index'];
                    this[type + 'Obj'][type + 'Arr'] = this[aim + 'Obj'][aim + 'Arr'][aimIndex].children;
                    this[type + 'Obj'][type + 'Code'] = this[type + 'Obj'][type + 'Arr'][typeIndex].value;
                }
                // this.areaObj.areaArr = this.cityObj.cityArr[this.cityObj.cityIndex].children;
                // this.areaObj.areaCode = this.areaObj.areaArr[this.areaObj.areaIndex].value;
            },
            setObj(defaultValue) {
                let proCode = defaultValue.slice(0, 2) + '0000';
                let cityCode = defaultValue.slice(0, 4) + '00';
                this.proObj = {
                    proCode: proCode,
                    proIndex: this.findIndxByValue(proCode, this.params.data),
                    proArr: this.params.data
                };
                this.cityObj = {
                    cityCode: cityCode,
                    cityIndex: this.findIndxByValue(cityCode, this.proObj.proArr[this.proObj.proIndex].children),
                    cityArr: this.proObj.proArr[this.proObj.proIndex].children
                };
                this.areaObj = {
                    areaCode: defaultValue,
                    areaIndex: this.findIndxByValue(defaultValue, this.cityObj.cityArr[this.cityObj.cityIndex].children),
                    areaArr: this.cityObj.cityArr[this.cityObj.cityIndex].children
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
