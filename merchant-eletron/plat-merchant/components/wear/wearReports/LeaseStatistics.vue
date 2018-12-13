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
        </div>

        <table class="table table-bordered table-cls">
            <thead>
            <tr>
                <th rowspan="2">日期</th>
                <th colspan="9">订单操作</th>
                <th colspan="7">订单状态</th>
            </tr>
            <tr>
                <th>新增订单</th>
                <th>取消订单</th>
                <th>商户发货</th>
                <th>用户收货</th>
                <th>用户还货</th>
                <th>商户收货</th>
                <th>有损还货</th>
                <th>无损还货</th>
                <th>转买</th>
                <th>待发货</th>
                <th>在途</th>
                <th>试戴中</th>
                <th>逾期试戴中</th>
                <th>还货中</th>
                <th>待质检</th>
                <th>有损待确认</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in tableView">
                <td>{{item.billYmd }}</td>
                <td>{{item.newLeaseRecord }}</td>
                <td>{{item.newCancel }}</td>
                <td>{{item.newShippingOut }}</td>
                <td>{{item.newUserAccept }}</td>
                <td>{{item.newUserReturnBack }}</td>
                <td>{{item.newMerchantAccept }}</td>
                <td>{{item.newQcFail }}</td>
                <td>{{item.newQcOk }}</td>
                <td>{{item.newLeaseBuy }}</td>
                <td>{{item.toShippingOut }}</td>
                <td>{{item.shippingOut }}</td>
                <td>{{item.leasingNormal }}</td>
                <td>{{item.leasingTimeOuted }}</td>
                <td>{{item.shippingBack }}</td>
                <td>{{item.toQc }}</td>
                <td>{{item.toConfirmQc }}</td>
            </tr>
            <tr>
                <td>合计</td>
                <td>{{sum.newLeaseRecord }}</td>
                <td>{{sum.newCancel }}</td>
                <td>{{sum.newShippingOut }}</td>
                <td>{{sum.newUserAccept }}</td>
                <td>{{sum.newUserReturnBack }}</td>
                <td>{{sum.newMerchantAccept }}</td>
                <td>{{sum.newQcFail }}</td>
                <td>{{sum.newQcOk }}</td>
                <td>{{sum.newLeaseBuy }}</td>
                <td class="slashCls" colspan="7"></td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import DatePicker from '~/components/DatePicker'
    import api from '~/api'
    import {dateUtil} from '~/util'

    export default {
        components: {
            DatePicker
        },
        data() {
            return {
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-')
                },
                tableView: [],
                sum: {
                    newLeaseRecord: 0,
                    newCancel: 0,
                    newShippingOut: 0,
                    newUserAccept: 0,
                    newUserReturnBack: 0,
                    newMerchantAccept: 0,
                    newQcFail: 0,
                    newQcOk: 0,
                    newLeaseBuy: 0
                }
            }
        },
        watch: {
            'form': {
                handler() {
                    this.search()
                },
                deep: true
            }
        },
        methods: {
            getData(params) {
                api.request({
                    url: api.consts._REPORT_LEASE_STAT,
                    params,
                    success: (data) => {
                        this.tableView = data.rows;
                        this.sum = data.sum.total;
                    }
                })
            },
            search() {
                this.getData(this.form)
            }
        },
        mounted() {
            this.$on('init', () => {
                this.search()
            })
        }
    }
</script>

<style scoped>
    /*td:hover{*/
    /*cursor: pointer;*/
    /*background-color: #00afb517;*/
    /*}*/
</style>
