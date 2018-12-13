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
                    <el-form-item v-if="ownerType">
                        <el-button v-if="ownerType=='USER'" icon="el-icon-date" @click="rechargeView">&nbsp;充值记录</el-button>
                        <el-button v-if="ownerType=='MERCHANT'" icon="el-icon-date" @click="rechargeOfflineView">&nbsp;充值记录</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="text" class="m-l" @click="queryBalance()"><span class="text-muted">账户余额：</span><span class="text-danger">{{renderBalance()}}</span></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center">
            <el-table-column prop="createTime" label="发生时间" width="180" :formatter="renderTime"></el-table-column>
            <el-table-column prop="billType" label="业务类型" :formatter="renderBillType"></el-table-column>
            <el-table-column prop="amount" label="发生金额" :formatter="renderMoney"></el-table-column>
            <el-table-column prop="balance" label="账户余额" :formatter="renderMoney"></el-table-column>
            <el-table-column prop="message" label="摘要备注"></el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

        <RechargeWalletDialog :options="rechargeModal" @close="closeRecharge"></RechargeWalletDialog>

        <RechargeWalletOfflineDialog :options="rechargeOfflineModal" @close="closeRechargeOffline"></RechargeWalletOfflineDialog>

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
                    accountType: 'CASH_WALLET'
                },
                rows: [],
                total: 0,
                balance: 'loading...',
                ownerType: '',
                rechargeModal: {
                    visible: false,
                    ownerId: ''
                },
                rechargeOfflineModal: {
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
                this.ownerType = '';
            });
        },
        methods: {
            renderBalance() {
                return renderUtil.detectors.isString(this.balance) ? this.balance : (this.balance ? renderUtil.renderMoney(this.balance) : '¥ 0');
            },
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
                        accountType: 'CASH_WALLET'
                    },
                    success: (json) => {
                        this.balance = json.result.balance;
                        this.ownerType = json.result.ownerType;
                    }
                });
            },
            rechargeView() {
                this.rechargeModal = {
                    visible: true,
                    ownerId: this.params.ownerId
                }
            },
            closeRecharge() {
                this.rechargeModal = {
                    visible: false
                }
            },
            rechargeOfflineView() {
                this.rechargeOfflineModal = {
                    visible: true,
                    ownerId: this.params.ownerId
                }
            },
            closeRechargeOffline() {
                this.rechargeOfflineModal = {
                    visible: false
                }
            }
        }
    }

</script>
