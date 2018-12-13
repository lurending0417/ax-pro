<template>
    <el-dialog
        title="订单日报表"
        width="80%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center" style="width:100%">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="orderTime" label="下单时间" :formatter="renderTime"></el-table-column>
            <el-table-column prop="billNumber" label="订单号"></el-table-column>
            <el-table-column prop="merchantName" label="商户名"></el-table-column>
            <el-table-column prop="merchantCode" label="商户号"></el-table-column>
            <el-table-column label="租金">
                <el-table-column prop="rentTotalCost" label="用户缴费" :formatter="renderNumber"></el-table-column>
                <el-table-column prop="rentCharges" label="平台费用" :formatter="renderNumber"></el-table-column>
                <el-table-column prop="rentToPay" label="应付金额" :formatter="renderNumber"></el-table-column>
            </el-table-column>
            <el-table-column label="逾期扣款">
                <el-table-column prop="forfeitRentTotalCost" label="用户缴费" :formatter="renderNumber"></el-table-column>
                <el-table-column prop="forfeitRentCharges" label="平台费用" :formatter="renderNumber"></el-table-column>
                <el-table-column prop="forfeitRentToPay" label="应付金额" :formatter="renderNumber"></el-table-column>
            </el-table-column>
            <el-table-column prop="forfeitBroken" label="损坏扣款" :formatter="renderNumber"></el-table-column>
            <el-table-column label="转买">
                <el-table-column prop="buyTotalCost" label="用户缴费" :formatter="renderNumber"></el-table-column>
                <el-table-column prop="buyCharges" label="平台费用" :formatter="renderNumber"></el-table-column>
                <el-table-column prop="buyToPay" label="应付金额" :formatter="renderNumber"></el-table-column>
            </el-table-column>
            <el-table-column prop="closing" label="小计" :formatter="renderNumber"></el-table-column>
        </el-table>
    </el-dialog>
</template>


<script>


    import api from "~/api"

    export default {
        props: ["options"],
        data() {
            return {
                params: {},
                easyClose: true
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    this.params = {
                        startYmd: this.options.startYmd,
                        endYmd: this.options.endYmd
                    };
                    this.list();
                }
            }
        },
        methods: {
            list() {
                api.request({
                    url: api.url.report.finance.lease.detail,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            }
        }
    }
</script>
