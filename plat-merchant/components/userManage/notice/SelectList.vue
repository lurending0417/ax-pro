<template>
    <div>
        <div class="panel panel-default" style="text-align: left;">
            <div class="panel-body">
                <div class="form-inline">
                    <label class="control-label form-group-margin">按注册日期</label>
                    <div class="input-daterange input-group form-group-margin">
                    <span>
                        <DatePicker
                            field="myDate1"
                            placeholder="起始日期"
                            format="yyyy-mm-dd"
                            v-model="form.regDateStart"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                        <span class="input-group-addon" style="display: inline-block">到</span>
                        <span>
                        <DatePicker
                            field="myDate2"
                            placeholder="结束日期"
                            format="yyyy-mm-dd"
                            v-model="form.regDateEnd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                    </div>
                </div>

                <div class="form-inline" style="margin-bottom: 10px;">
                    <label class="control-label form-group-margin">消费金额：</label>
                    <span class="input-daterange form-group-margin">
                        <input type="text" class="form-control" v-model="form.consumeStartMoney" placeholder=""
                               style="max-width: 70px;"/>
                        <span class="form-group-margin" style="margin: auto 5px;">—</span>
                        <input type="text" class="form-control" v-model="form.consumeEndMoney" placeholder=""
                               style="max-width: 70px;"/>
                    </span>
                </div>

                <div class="form-inline" style="margin-bottom: 10px;">
                    <label class="control-label form-group-margin">年龄：</label>
                    <span class="input-daterange form-group-margin">
                        <input type="text" class="form-control" v-model="form.ageStart" placeholder=""
                               style="max-width: 70px;"/>
                        <span class="form-group-margin" style="margin: auto 5px;">—</span>
                        <input type="text" class="form-control" v-model="form.ageEnd" placeholder=""
                               style="max-width: 70px;"/>
                    </span>

                    <label class="control-label form-group-margin">生日：</label>
                    <span class="input-daterange form-group-margin">
                    <span>
                        <MonthDayModal v-model="form.startBirth" ref="monthDayModal_1"></MonthDayModal>
                    </span>
                        <span class="input-group-addon" style="display: inline-block">到</span>
                    <span>
                        <MonthDayModal v-model="form.endBirth" ref="monthDayModal_2"></MonthDayModal>
                    </span>
                    </span>

                    <label class="control-label form-group-margin">性别：</label>
                    <div class="input-daterange input-group form-group-margin">
                        <label class="checkbox-inline" v-for="item in gender">
                            <input type="checkbox" name="gender" :value="item.value"
                                   v-model="form.gender">{{item.name}}</label>
                    </div>
                </div>

                <div class="form-inline">
                    <label class="control-label form-group-margin">所属门店：</label>
                    <div class="input-daterange input-group form-group-margin">
                        <label class="checkbox-inline" v-for="item in stores">
                            <input type="checkbox" name="store" :value="item.id"
                                   v-model="form.storeId">{{item.name}}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {constUtil, baseUtil} from '~/util'
    import DatePicker from '~/components/DatePicker';
    import MonthDayModal from './MonthDayModal'

    export default {
        components: {
            DatePicker,
            MonthDayModal
        },
        data() {
            return {
                form: {
                    regDateStart: '',
                    regDateEnd: '',
                    consumeStartMoney: '',
                    consumeEndMoney: '',
                    ageStart: '',
                    ageEnd: '',
                    startBirth: '',
                    endBirth: '',
                    gender: [],
                    storeId: []
                },
                gender: [],
                stores: []
            }
        },
        watch: {
            'form': {
                handler(val) {
                    this.$emit('getForm', val)
                },
                deep: true
            }
        },
        methods: {
            initData() {
                this.gender = constUtil._CONST_USER_GENDER
                this.stores = baseUtil.getMetadataStore()
            }
        },
        mounted() {
            this.initData()
            this.$on('init', () => {
                this.form = {
                    regDateStart: '',
                    regDateEnd: '',
                    consumeStartMoney: '',
                    consumeEndMoney: '',
                    ageStart: '',
                    ageEnd: '',
                    startBirth: '',
                    endBirth: '',
                    gender: [],
                    storeId: []
                }
                this.$refs.monthDayModal_1.$emit('initMonthDayModal')
                this.$refs.monthDayModal_2.$emit('initMonthDayModal')
            })
        }
    }
</script>

<style>

</style>
