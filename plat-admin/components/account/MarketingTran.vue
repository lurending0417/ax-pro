<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="24">
                <el-form inline>
                    <el-form-item>
                        <DateRange :params="params"></DateRange>
                    </el-form-item>
                    <el-form-item>
                        <EnumSelect :params="params" field="billType" clearable enum="accountBillType" placeholder="单据类型"></EnumSelect>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="params.query" clearable placeholder="关键字"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="list">&nbsp;搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-date" @click="buyGoldView">&nbsp;买入记录</el-button>
                        <el-button class="m-l" icon="el-icon-date" @click="sellGoldView">&nbsp;卖出记录</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="text" class="m-l" @click="queryBalance()"><span class="text-muted">账户余额：</span><span class="text-danger">{{renderGold(balance)}}</span></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center">
            <el-table-column prop="createTime" label="发生时间" width="180" :formatter="renderTime"></el-table-column>
            <el-table-column prop="billType" label="业务类型" :formatter="renderBillType"></el-table-column>
            <el-table-column prop="amount" label="发生金额" :formatter="renderGold"></el-table-column>
            <el-table-column prop="balance" label="账户余额" :formatter="renderGold"></el-table-column>
            <el-table-column prop="message" label="摘要备注"></el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

        <GoldBuyRecord :options="buyModal" @close="closeGoldBuyView"></GoldBuyRecord>

        <GoldSellRecord :options="sellModal" @close="closeSellGoldView"></GoldSellRecord>

    </div>
</template>


<script>

    import api from "~/api"

    import {renderUtil} from "~/util"

    export default {
        props: ['options'],
        data() {
            return {
                params: {
                    query: '',
                    ownerId: this.options ? this.options.merchantId || this.options.customerId || this.options.userId : '',
                    accountType: 'GOLD_MARKETING'
                },
                rows: [],
                total: 0,
                balance: 'loading...',
                buyModal: {
                    visible: false,
                    ownerId: ''
                },
                sellModal: {
                    visible: false,
                    ownerId: ''
                }
            }
        },
        watch: {
            'options.merchantId': function (value) {
                this.params.ownerId = value;
            },
            'options.customerId': function (value) {
                this.params.ownerId = value;
            },
            'options.userId': function (value) {
                this.params.ownerId = value;
            }
        },
        mounted() {
            this.$on("init", () => {
                this.list();
                this.queryBalance();
            });
            this.$on("reset", () => {
                this.rows = [];
                this.total = 0;
                this.balance = 'loading...';
            });
        },
        methods: {
            renderBillType(row, cell, value) {
                return value ? renderUtil.renderEnum('accountBillType', value) : '';
            },
            list() {
                api.request({
                    url: api.url.account.tran,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            queryBalance() {
                this.balance = 'loading...';
                api.request({
                    url: api.url.account.list,
                    params: {
                        ownerId: this.params.ownerId,
                        accountType: 'GOLD_MARKETING'
                    },
                    success: (json) => {
                        this.balance = json.result.balance;
                    }
                });
            },
            buyGoldView() {
                this.buyModal = {
                    visible: true,
                    ownerId: this.params.ownerId
                }
            },
            closeGoldBuyView() {
                this.buyModal = {
                    visible: false
                }
            },
            sellGoldView() {
                this.sellModal = {
                    visible: true,
                    ownerId: this.params.ownerId
                }
            },
            closeSellGoldView() {
                this.sellModal = {
                    visible: false
                }
            }
        }
    }

</script>
