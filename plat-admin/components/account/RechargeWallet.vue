<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="24">
                <el-form inline>
                    <el-form-item>
                        <DateRange :params="params"></DateRange>
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
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center">
            <el-table-column prop="createTime" label="充值时间" :formatter="renderTime"></el-table-column>
            <el-table-column prop="amount" label="充值金额" :formatter="renderMoney"></el-table-column>
            <el-table-column prop="gateway" label="充值网关" :formatter="renderGateway"></el-table-column>
            <el-table-column prop="tradeNo" label="交易单号"></el-table-column>
            <el-table-column prop="paid" label="付款状态">
                <template slot-scope="scope">
                    <span v-if="!scope.row.paid" class="text-danger">未付款</span>
                    <span v-else class="el-icon-check">&nbsp;已付款</span>
                </template>
            </el-table-column>
            <el-table-column prop="transactionId" label="付款流水号"></el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>
    </div>

</template>


<script>

    import api from "~/api"
    import {renderUtil} from "~/util";

    export default {
        props: ['options'],
        data() {
            return {
                params: {
                    ownerId: this.options ? this.options.ownerId : ''
                },
                rows: [],
                total: 0
            }
        },
        watch: {
            'options.ownerId': function (value) {
                this.params.ownerId = value;
            }
        },
        mounted() {
            this.$on("init", () => {
                this.list();
            });
            this.$on("reset", () => {
                this.rows = [];
                this.total = 0;
            });
        },
        methods: {
            renderGateway(row, cell, value) {
                return value ? renderUtil.renderEnum('gateway', value) : '';
            },
            list() {
                api.request({
                    url: api.url.account.cash.recharge.list,
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
