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
        <el-table height="700" :data="rows" stripe border highlight-current-row header-cell-class-name="text-center" style="width:100%">
            <el-table-column width="120" align="center" prop="billYmd" label="日期" :formatter="renderYmd"></el-table-column>
            <el-table-column align="center" prop="start" label="期初余额" :formatter="renderNumber"></el-table-column>
            <el-table-column label="本期增加">
                <el-table-column align="center" prop="inGoldSale" label="卖出黄金" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inRecharge" label="充值" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inLeaseCoupon" label="现金券激活" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inLeaseRedPack" label="用户奖励（试戴）" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inInviteLeaseBuy" label="推荐者奖励（转买）" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inPaymentRefund" label="支付退款" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inTotal" label="小计" :formatter="renderNumber"></el-table-column>
            </el-table-column>
            <el-table-column label="本期减少">
                <el-table-column align="center" prop="outWithdraw" label="提现" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="outPayment" label="钱包支付" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="outTotal" label="小计" :formatter="renderNumber"></el-table-column>
            </el-table-column>
            <el-table-column align="center" prop="end" label="期末余额" :formatter="renderNumber"></el-table-column>
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
                    url: api.url.report.finance.wallet.user,
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
