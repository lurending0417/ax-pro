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
                <el-table-column align="center" prop="inRechargeOffline" label="充值" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inAdvanced" label="预支款转入" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inGoldSale" label="卖出黄金" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inLeaseRent" label="试戴费" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inLeaseEncourage" label="试戴补贴" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inLeaseForfeitRent" label="逾期试戴费" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inLeaseBrokenForfeit" label="有损扣款" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inLeaseBuy" label="转买" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="inTotal" label="小计" :formatter="renderNumber"></el-table-column>
            </el-table-column>
            <el-table-column label="本期减少">
                <el-table-column align="center" prop="outWithdraw" label="提现" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="outRepayAdvanced" label="归还预支款" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="outGoldBuy" label="买入黄金" :formatter="renderNumber"></el-table-column>
                <el-table-column align="center" prop="outRepayShipping" label="快递费" :formatter="renderNumber"></el-table-column>
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
                    url: api.url.report.finance.wallet.merchant,
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
