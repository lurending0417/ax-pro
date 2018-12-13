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
        <el-table :data="rows" height="700" stripe border highlight-current-row header-cell-class-name="text-center" style="width:100%">
            <el-table-column align="center" fixed prop="billYmd" width="120" label="日期" :formatter="renderYmd"></el-table-column>
            <el-table-column label="收款">
                <el-table-column label="微信">
                    <el-table-column align="center" prop="inWxDeposit" label="押金" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="inWxRent" label="租金" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="inWxUserRecharge" label="用户充值" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="inWxPhysicalCharges" label="提金手续费" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="inWxTotal" label="小计" :formatter="renderNumber"></el-table-column>
                </el-table-column>
                <el-table-column label="支付宝">
                    <el-table-column align="center" prop="inAlipayDeposit" label="押金" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="inAlipayRent" label="租金" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="inAlipayUserRecharge" label="用户充值" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="inAlipayPhysicalCharges" label="提金手续费" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="inAlipayTotal" label="小计" :formatter="renderNumber"></el-table-column>
                </el-table-column>
                <el-table-column label="对公账户">
                    <el-table-column align="center" prop="inBankMerchantRecharge" label="商户充值" :formatter="renderNumber"></el-table-column>
                </el-table-column>
                <el-table-column align="center" prop="inTotal" label="合计" :formatter="renderNumber"></el-table-column>
            </el-table-column>
            <el-table-column label="付款">
                <el-table-column label="微信">
                    <el-table-column align="center" prop="outWxDeposit" label="退押金" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="outWxRent" label="退租金" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="outWxUserWithdraw" label="用户提现" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="outWxTotal" label="小计" :formatter="renderNumber"></el-table-column>
                </el-table-column>
                <el-table-column label="支付宝">
                    <el-table-column align="center" prop="outAlipayDeposit" label="退押金" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="outAlipayRent" label="退租金" :formatter="renderNumber"></el-table-column>
                    <el-table-column align="center" prop="outAlipayTotal" label="小计" :formatter="renderNumber"></el-table-column>
                </el-table-column>
                <el-table-column label="对公账户">
                    <el-table-column align="center" prop="outBankMerchantWithdraw" label="商户提现" :formatter="renderNumber"></el-table-column>
                </el-table-column>
                <el-table-column align="center" prop="outTotal" label="合计" :formatter="renderNumber"></el-table-column>
            </el-table-column>
            <el-table-column align="center" fixed="right" prop="closing" label="发生净额" :formatter="renderNumber"></el-table-column>
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
                sum: {},
                total: 0
            }
        },
        mounted() {
            this.$on("init", () => {
            })
        },
        methods: {
            list() {
                api.request({
                    url: api.url.report.finance.cash.daily,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                        if (json.sum && json.sum.total) {
                            let total = json.sum.total;
                            total.billYmd = '合计';
                            this.rows.push(total);
                        }
                    }
                });
            }
        }
    }

</script>
