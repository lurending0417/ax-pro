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
            <el-table-column align="center" prop="rentCharges" label="租金分成" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="buyCharges" label="转买分成"></el-table-column>
            <el-table-column align="center" prop="merchantWithdrawCharges" label="商户提现手续费" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="merchantForfeit" label="商户违约金" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="userWithdrawCharges" label="用户提现手续费" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="goldSellCharges" label="卖金手续费" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="physicalGoldCharges" label="提金手续费" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="closing" label="小计" :formatter="renderNumber"></el-table-column>
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
                this.list();
            });
        },
        methods: {
            list() {
                api.request({
                    url: api.url.report.finance.income.stat,
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
