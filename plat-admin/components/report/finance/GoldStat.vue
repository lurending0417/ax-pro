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
            <el-table-column label="黄金账户增加">
                <el-table-column align="center" prop="inTotal" label="发生额" :formatter="renderGold"></el-table-column>
                <el-table-column align="center" prop="inByMerchant" label="商户黄金" :formatter="renderGold"></el-table-column>
                <el-table-column align="center" prop="inByUser" label="用户黄金" :formatter="renderGold"></el-table-column>
            </el-table-column>
            <el-table-column label="黄金账户减少">
                <el-table-column align="center" prop="outTotal" label="发生额" :formatter="renderGold"></el-table-column>
                <el-table-column align="center" prop="outByMerchant" label="商户黄金" :formatter="renderGold"></el-table-column>
                <el-table-column align="center" prop="outByUser" label="用户黄金" :formatter="renderGold"></el-table-column>
            </el-table-column>
            <el-table-column label="账户净额">
                <el-table-column align="center" prop="closingTotal" label="小计" :formatter="renderGold"></el-table-column>
                <el-table-column align="center" prop="closingByMerchant" label="商户黄金" :formatter="renderGold"></el-table-column>
                <el-table-column align="center" prop="closingByUser" label="用户黄金" :formatter="renderGold"></el-table-column>
            </el-table-column>
            <el-table-column label="账户余额">
                <el-table-column align="center" prop="balanceTotal" label="小计" :formatter="renderGold"></el-table-column>
                <el-table-column align="center" prop="balanceByMerchant" label="商户黄金" :formatter="renderGold"></el-table-column>
                <el-table-column align="center" prop="balanceByUser" label="用户黄金" :formatter="renderGold"></el-table-column>
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
                    url: api.url.report.finance.gold.stat,
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
