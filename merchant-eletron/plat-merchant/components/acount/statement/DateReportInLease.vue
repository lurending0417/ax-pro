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
                <th colspan="7">试戴收入日账单</th>
            </tr>
            <tr>
                <th>日期</th>
                <th>试戴费</th>
                <th>试戴补贴</th>
                <th>逾期试戴费</th>
                <th>有损扣款</th>
                <th>转买</th>
                <th>小计</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in tableView">
                <td>{{item.billYmd}}</td>
                <td class="clickCls" @click="open('LEASE_RECORD_RENT',item)">{{item.rent}}</td>
                <td class="clickCls" @click="open('LEASE_RECORD_ENCOURAGE',item)">{{item.rentEncourage}}</td>
                <td class="clickCls" @click="open('LEASE_RECORD_FORFEIT_RENT',item)">{{item.rentForfeit}}</td>
                <td class="clickCls" @click="open('LEASE_RECORD_FORFEIT_BROKEN',item)">{{item.leaseForfeit }}</td>
                <td class="clickCls" @click="open('LEASE_RECORD_BUY',item)">{{item.leaseBuy }}</td>
                <td>{{item.total}}</td>
            </tr>
            <tr>
                <td>合计</td>
                <td>{{sum.rent}}</td>
                <td>{{sum.rentEncourage}}</td>
                <td>{{sum.rentForfeit}}</td>
                <td>{{sum.leaseForfeit }}</td>
                <td>{{sum.leaseBuy }}</td>
                <td>{{sum.total}}</td>
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
                :accountType="'CASH_WALLET'"
                :page="'lease'"
                :CONST_CLICK_MODAL="CONST_CLICK_MODAL">
            </DayAccount>
        </ModalItem>
    </div>
</template>
<script>
    import DatePicker from '~/components/DatePicker'
    import ModalItem from '~/components/ModalItem'
    import DayAccount from './DayAccount'
    import uuid from 'uuid'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {dateUtil} from '~/util'
    import {mapActions} from 'vuex'

    const DAY_ACCOUNT = [
        {type: 'LEASE_RECORD_RENT', titleName: '试戴费'},
        {type: 'LEASE_RECORD_ENCOURAGE', titleName: '试戴补贴'},
        {type: 'LEASE_RECORD_FORFEIT_RENT', titleName: '逾期试戴费'},
        {type: 'LEASE_RECORD_FORFEIT_BROKEN', titleName: '有损扣款'},
        {type: 'LEASE_RECORD_BUY', titleName: '转买'}
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
                    rent: 0,
                    rentEncourage: 0,
                    rentForfeit: 0,
                    leaseForfeit: 0,
                    leaseBuy: 0,
                    total: 0
                }
            }
        },
        methods: {
            ...mapActions('account/statement', {
                getLeaseDailyReport: 'getLeaseDailyReport'
            }),
            search() {
                this.getLeaseDailyReport({
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
