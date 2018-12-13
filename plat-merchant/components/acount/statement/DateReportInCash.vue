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
                <th colspan="17">钱包日统计表</th>
            </tr>
            <tr>
                <th rowspan="2">日期</th>
                <th rowspan="2">期初余额</th>
                <th colspan="9">本期增加</th>
                <th colspan="5">本期减少</th>
                <th rowspan="2">期末余额</th>
            </tr>
            <tr>
                <th>充值</th>
                <th>预支款转入</th>
                <th>卖出黄金</th>
                <th>试戴费</th>
                <th>试戴补贴</th>
                <th>逾期试戴费</th>
                <th>有损扣款</th>
                <th>转买</th>
                <th>小计</th>
                <th>提现</th>
                <th>归还预支款</th>
                <th>买入黄金</th>
                <th>快递费</th>
                <th>小计</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in tableView">
                <td>{{item.billYmd}}</td>
                <td>{{item.start}}</td>
                <td class="clickCls" @click="open('RECHARGE_OFFLINE',item)">{{item.inByRecharge}}</td>
                <td class="clickCls" @click="open('ADVANCED',item)">{{item.inByAdvanced }}</td>
                <td class="clickCls" @click="open('INVEST_SALE',item)">{{item.inByGoldSale }}</td>
                <td class="clickCls" @click="open('LEASE_RECORD_RENT',item)">{{item.inByRent }}</td>
                <td class="clickCls" @click="open('LEASE_RECORD_ENCOURAGE',item)">{{item.inByLeaseEncourage }}</td>
                <td class="clickCls" @click="open('LEASE_RECORD_FORFEIT_RENT',item)">{{item.inByRentForfeit }}</td>
                <td class="clickCls" @click="open('LEASE_RECORD_FORFEIT_BROKEN',item)">{{item.inByLeaseForfeit }}</td>
                <td class="clickCls" @click="open('LEASE_RECORD_BUY',item)">{{item.inByLeaseBuy }}</td>
                <td>{{item.inTotal}}</td>
                <td class="clickCls" @click="open('WITHDRAW',item)">{{item.outByWithdraw }}</td>
                <td class="clickCls" @click="open('REPAY',item)">{{item.outByRepay }}</td>
                <td class="clickCls" @click="open('INVEST_BUY',item)">{{item.outByGoldBuy }}</td>
                <td class="clickCls" @click="open('REPAY_SHIPPING',item)">{{item.outByShippingFee }}</td>
                <td>{{item.outTotal }}</td>
                <td>{{item.end}}</td>
            </tr>
            <tr>
                <td>合计</td>
                <td class="slashCls"></td>
                <td>{{sum.inByRecharge}}</td>
                <td>{{sum.inByAdvanced }}</td>
                <td>{{sum.inByGoldSale }}</td>
                <td>{{sum.inByRent }}</td>
                <td>{{sum.inByLeaseEncourage }}</td>
                <td>{{sum.inByRentForfeit }}</td>
                <td>{{sum.inByLeaseForfeit }}</td>
                <td>{{sum.inByLeaseBuy }}</td>
                <td>{{sum.inTotal}}</td>
                <td>{{sum.outByWithdraw }}</td>
                <td>{{sum.outByRepay }}</td>
                <td>{{sum.outByGoldBuy }}</td>
                <td>{{sum.outByShippingFee }}</td>
                <td>{{sum.outTotal }}</td>
                <td class="slashCls"></td>
            </tr>
            </tbody>
        </table>
        <ModalItem
            :modalProps="{
                    CONST_CLOSE_MODAL: this.CONST_CLOSE_MODAL,
                    CONST_CLICK_MODAL: this.CONST_CLICK_MODAL,
                    titleName: '流水'
                }">
            <DayAccount
                slot="main"
                :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                :page="'cash'"
                :accountType="'CASH_WALLET'"
                :CONST_CLICK_MODAL="CONST_CLICK_MODAL">
            </DayAccount>
        </ModalItem>
    </div>
</template>
<script>
    import DatePicker from '~/components/DatePicker'
    import ModalItem from '~/components/ModalItem'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import DayAccount from './DayAccount'
    import uuid from 'uuid'
    import {dateUtil} from '~/util'
    import {mapActions} from 'vuex'

    const DAY_ACCOUNT = [
        {type: 'RECHARGE_OFFLINE', titleName: '充值'},
        {type: 'ADVANCED', titleName: '预支款转入'},
        {type: 'INVEST_SALE', titleName: '卖出黄金'},
        {type: 'LEASE_RECORD_RENT', titleName: '试戴费'},
        {type: 'LEASE_RECORD_ENCOURAGE', titleName: '试戴补贴'},
        {type: 'LEASE_RECORD_FORFEIT_RENT', titleName: '逾期试戴费'},
        {type: 'LEASE_RECORD_FORFEIT_BROKEN', titleName: '有损扣款'},
        {type: 'LEASE_RECORD_BUY', titleName: '转买'},
        {type: 'WITHDRAW', titleName: '提现'},
        {type: 'REPAY', titleName: '归还预支款'},
        {type: 'INVEST_BUY', titleName: '买入黄金'},
        {type: 'REPAY_SHIPPING', titleName: '快递费'}
    ]

    export default {
        components: {
            DatePicker,
            DayAccount,
            ModalItem
        },
        data() {
            return {
                tableView: [],
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-')
                },
                sum: {
                    inByRecharge: '',
                    inByAdvanced: '',
                    inByGoldSale: '',
                    inByRent: '',
                    inByLeaseEncourage: '',
                    inByRentForfeit: '',
                    inByLeaseForfeit: '',
                    inByLeaseBuy: '',
                    inTotal: '',
                    outByWithdraw: '',
                    outByRepay: '',
                    outByGoldBuy: '',
                    outByShippingFee: '',
                    outTotal: ''
                }
            }
        },
        methods: {
            ...mapActions('account/statement', {
                getWalletDailyReport: 'getWalletDailyReport'
            }),
            search() {
                this.getWalletDailyReport({
                    params: {...this.form},
                    callback: (data) => {
                        this.tableView = data.rows
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
    .slashCls {
        position: relative;
        background: url("../../../assets/slash.png") no-repeat;
        background-size: 100% 100%;
    }
</style>
