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
            <el-table-column label="租金">
                <el-table-column align="center" prop="rentTotalCost" label="用户缴费"></el-table-column>
                <el-table-column align="center" prop="rentCharges" label="平台收款"></el-table-column>
                <el-table-column align="center" prop="rentToPay" label="商户收款"></el-table-column>
            </el-table-column>
            <el-table-column label="逾期扣款">
                <el-table-column align="center" prop="forfeitRentTotalCost" label="用户缴费"></el-table-column>
                <el-table-column align="center" prop="forfeitRentCharges" label="平台收款"></el-table-column>
                <el-table-column align="center" prop="forfeitRentToPay" label="商户收款"></el-table-column>
            </el-table-column>
            <el-table-column align="center" prop="forfeitBroken" label="损坏扣款"></el-table-column>
            <el-table-column label="转买">
                <el-table-column align="center" prop="buyTotalCost" label="用户缴费"></el-table-column>
                <el-table-column align="center" prop="buyCharges" label="平台收款"></el-table-column>
                <el-table-column align="center" prop="buyToPay" label="商户收款"></el-table-column>
            </el-table-column>
            <el-table-column label="小计">
                <el-table-column align="center" prop="closingTotalCost" label="用户缴费"></el-table-column>
                <el-table-column align="center" prop="closingCharges" label="平台收款"></el-table-column>
                <el-table-column align="center" prop="closingToPay" label="商户收款"></el-table-column>
            </el-table-column>
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
                    url: api.url.report.finance.lease.stat,
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
