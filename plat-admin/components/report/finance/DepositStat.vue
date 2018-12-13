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
            <el-table-column align="center" prop="growingUp" label="新增押金" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="refundOut" label="退还押金" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="closing" label="发生净额" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="total" label="押金余额" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="advancedQuota" label="预支额度" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="advancedAmount" label="已预支" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="advancedAvailable" label="可预支" :formatter="renderNumber"></el-table-column>
            <el-table-column align="center" prop="advancedOverflow" label="超额预支" :formatter="renderNumber"></el-table-column>
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
                    url: api.url.report.finance.deposit.stat,
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
