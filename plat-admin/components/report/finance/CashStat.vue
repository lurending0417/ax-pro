<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="24">
                <el-form inline>
                    <el-form-item>
                        <DateRange :params="params"></DateRange>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="list">&nbsp;搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center" style="width:100%">
            <el-table-column align="center" prop="billYmd" label="日期" :formatter="renderYmd"></el-table-column>
            <el-table-column label="收款">
                <el-table-column align="center" prop="inTotal" label="小计" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inLeasePayment" label="试戴收款" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inMerchantRecharge" label="商户充值" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inUserRecharge" label="用户充值" :formatter="renderNumber"></el-table-column>
            </el-table-column>
            <el-table-column label="付款">
                <el-table-column align="center" prop="outTotal" label="小计" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="outRentRefund" label="租金退款" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="outDepositRefund" label="押金退款" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="outMerchantWithdraw" label="商户提现" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="outUserWithdraw" label="用户提现" :formatter="renderNumber"></el-table-column>
            </el-table-column>
            <el-table-column align="center" prop="closing" label="净额" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="balance" label="余额" :formatter="renderNumber"></el-table-column>
        </el-table>
    </div>
</template>


<script>

    import api from "~/api"

    export default {
        data() {
            return {
                params: {
                    startYmd: '',
                    endYmd: ''
                },
                rows: [],
                total: 0
            }
        },
        mounted() {
            this.$on("init", () => {
            });
        },
        methods: {
            list() {
                api.request({
                    url: api.url.report.finance.cash.stat,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                })
            }
        }
    }
</script>
