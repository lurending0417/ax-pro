<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <div style="display: inline-block;">
                        <DatePicker
                            field="startDate"
                            placeholder="起始日期"
                            v-model="form.startYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false"
                        >
                        </DatePicker>
                    </div>
                    <span class="input-group-addon" style="display: inline-block">到</span>
                    <div style="display: inline-block">
                        <DatePicker
                            field="endDate"
                            placeholder="结束日期"
                            v-model="form.endYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false"
                        >
                        </DatePicker>
                    </div>
                </div>
            </div>
            <div class="form-group form-group-margin">
                <button class="btn btn-primary" @click="search()">统计</button>
            </div>
        </div>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th colspan="9">营销金日统计表</th>
            </tr>
            <tr>
                <th rowspan="2">日期</th>
                <th rowspan="2">期初余额</th>
                <th colspan="3">本期增加</th>
                <th colspan="3">本期减少</th>
                <th rowspan="2">期末余额</th>
            </tr>
            <tr>
                <th>买入</th>
                <th>鼓励金转入</th>
                <th>小计</th>
                <th>卖出</th>
                <th>零售赠金</th>
                <th>小计</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in tableView">
                <td>{{item.billYmd}}</td>
                <td>{{item.start}}</td>
                <td class="clickCls" @click="open('INVEST_BUY',item)">{{item.inByBuy}}</td>
                <td class="clickCls" @click="open('TRANSFER_IN',item)">{{item.inByEncourage }}</td>
                <td>{{item.inTotal }}</td>
                <td class="clickCls" @click="open('INVEST_SALE',item)">{{item.outBySale }}</td>
                <td class="clickCls" @click="open('PROMO_RETAIL,PROMO_RETAIL_CANCEL,PROMO_RETAIL_INVITE,PROMO_RETAIL_INVITE_CANCEL',item)">{{item.outByRetailPromo}}</td>
                <td>{{item.outTotal }}</td>
                <td>{{item.end}}</td>
            </tr>
            <tr>
                <td>合计</td>
                <td class="slashCls"></td>
                <td>{{sum.inByBuy}}</td>
                <td>{{sum.inByEncourage }}</td>
                <td>{{sum.inTotal}}</td>
                <td>{{sum.outBySale }}</td>
                <td>{{sum.outByRetailPromo}}</td>
                <td>{{sum.outTotal }}</td>
                <td class="slashCls"></td>
            </tr>
            </tbody>
        </table>
        <!--流水-->
        <ModalItem
            :modalProps="{
                    CONST_CLOSE_MODAL: this.CONST_CLOSE_MODAL,
                    CONST_CLICK_MODAL: this.CONST_CLICK_MODAL,
                    titleName: '流水'
                }">
            <DayAccount
                slot="main"
                :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                :accountType="'GOLD_MARKETING'"
                :CONST_CLICK_MODAL="CONST_CLICK_MODAL">
            </DayAccount>
        </ModalItem>
    </div>
</template>
<script>
    import DatePicker from '~/components/DatePicker'
    import ModalItem from '~/components/ModalItem'
    import DayAccount from './DayAccount'
    import {mapActions} from 'vuex'
    import uuid from 'uuid'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {dateUtil, componentUtil} from '~/util'

    const handleGold = componentUtil.handleGold;
    const DAY_ACCOUNT = [
        {type: 'INVEST_BUY', titleName: '买入'},
        {type: 'TRANSFER_IN', titleName: '鼓励金转入'},
        {type: 'INVEST_SALE', titleName: '卖出'},
        {type: 'PROMO_RETAIL,PROMO_RETAIL_CANCEL,PROMO_RETAIL_INVITE,PROMO_RETAIL_INVITE_CANCEL', titleName: '零售赠金'}
    ]

    export default {
        components: {
            DatePicker,
            DayAccount,
            ModalItem
        },
        data() {
            return {
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                type: '',
                typeName: '',
                tableView: [],
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-')
                },
                sum: {
                    inByBuy: '',
                    inByEncourage: '',
                    inTotal: '',
                    outBySale: '',
                    outByRetailPromo: '',
                    outTotal: ''
                }
            }
        },
        methods: {
            ...mapActions('account/statement', {
                getGoldDailyReport: 'getGoldDailyReport'
            }),
            search() {
                this.getGoldDailyReport({
                    params: {...this.form},
                    callback: (data) => {
                        this.tableView = data.rows.map(item => {
                            item.start = handleGold(item.start)
                            item.end = handleGold(item.end)
                            item.inByBuy = handleGold(item.inByBuy)
                            item.inByEncourage = handleGold(item.inByEncourage)
                            item.inTotal = handleGold(item.inTotal)
                            item.outBySale = handleGold(item.outBySale)
                            item.outByRetailPromo = handleGold(item.outByRetailPromo)
                            item.outTotal = handleGold(item.outTotal)
                            return item
                        })
                        for (let key in data.sum.total) {
                            data.sum.total[key] = handleGold(data.sum.total[key])
                        }
                        this.sum = data.sum.total
                    }
                })
            },
            open(symbol, item) {
                let parentParams = DAY_ACCOUNT.filter(item => item.type === symbol)[0];
                parentParams.item = item
                ButtonWithModalEvent.$emit(this.CONST_CLICK_MODAL, parentParams)
            }
        }
    }
</script>
<style>
    tr:hover .clickCls {
        /*background-color: rgba(170, 210, 255, 0.58);*/
        cursor: pointer;
    }
</style>
