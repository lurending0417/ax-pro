<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="24">
                <el-form inline>
                    <el-form-item>
                        <EnumSelect :params="params" field="status" clearable enum="physicalGoldBillStatus" placeholder="请选择状态"></EnumSelect>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="params.query" clearable placeholder="关键字"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="list">&nbsp;搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-table
            :data="rows"
            stripe
            border
            style="width:100%">
            <el-table-column align="center" prop="bill.billNumber" label="订单编号" width="150">
                <template slot-scope="scope">
                    <el-button @click="view(scope.row)" type="text">{{scope.row.bill.billNumber}}</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="bill.totalWeight" label="提金重量" :formatter="renderWeight"></el-table-column>
            <el-table-column align="center" prop="bill.processingCharges" label="工费" :formatter="renderMoney"></el-table-column>
            <el-table-column align="center" prop="bill.shipperCost" label="快递费" :formatter="renderMoney"></el-table-column>
            <el-table-column align="center" prop="bill.tradeCharges" label="手续费" :formatter="renderMoney"></el-table-column>
            <el-table-column align="center" prop="bill.totalCost" label="总金额" :formatter="renderMoney"></el-table-column>
            <el-table-column align="center" prop="bill.status" label="订单状态" :formatter="renderBillStatus"></el-table-column>
            <el-table-column prop="bill.creatorName" label="下单人"></el-table-column>
            <el-table-column prop="bill.createTime" width="170" label="下单时间" align="center" :formatter="renderTime"></el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>
        <PhysicalGoldBillView :options="viewModal" @close="closeView"></PhysicalGoldBillView>
    </div>
</template>


<script>

    import api from "~/api"

    import {baseUtil} from "~/util"

    export default {
        data() {
            return {
                params: {
                    query: ''
                },
                rows: [],
                total: 0,
                viewModal: {}
            }
        },
        mounted() {
            this.$on("init", () => {
                this.list();
            });
        },
        methods: {
            renderWeight: (row, cell, value) => {
                return value ? value + 'g' : '';
            },
            renderBillStatus: (row, cell, value) => {
                return baseUtil.getEnum('physicalGoldBillStatus', value);
            },
            list() {
                api.request({
                    url: api.url.physical.gold.bill.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            view(row) {
                this.viewModal = {
                    visible: true,
                    json: row
                }
            },
            closeView() {
                this.viewModal = {};
            }
        }

    }

</script>
