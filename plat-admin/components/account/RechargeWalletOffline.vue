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
            <el-table-column v-if="!params.ownerId" label="商户名称">
                <template slot-scope="scope">
                    <el-button type="text" @click="viewMerchant(scope.row.record.ownerId)">{{scope.row.record.ownerName}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="record.createTime" label="充值时间" :formatter="renderTime"></el-table-column>
            <el-table-column prop="record.amount" label="充值金额" :formatter="renderMoney"></el-table-column>
            <el-table-column prop="record.transactionId" label="银行流水号"></el-table-column>
            <el-table-column prop="record.attachments" label="凭证">
                <template slot-scope="scope">
                    <span v-for="at in scope.row.attachments" :key="at">
                        <a :href="at" target="_blank"><img class="r64 m-r" :src="at"/></a>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="record.confirmTime" label="确认时间" :formatter="renderTime"></el-table-column>
            <el-table-column label="确认人">
                <template slot-scope="scope">
                    {{scope.row.record.confirmedByName}}
                    <el-button v-if="!scope.row.record.confirmed" size="small" type="danger" icon="el-icon-circle-check" @click="confirm(scope.row)">&nbsp;确认到账</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

        <MerchantView :options="merchantModal" @close="closeMerchant"></MerchantView>

    </div>

</template>


<script>

    import api from "~/api"

    export default {
        props: ['options'],
        data() {
            return {
                params: {
                    ownerId: this.options ? this.options.ownerId : ''
                },
                rows: [],
                total: 0,
                merchantModal: {
                    visible: false,
                    merchantId: ''
                }
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
            list() {
                api.request({
                    url: api.url.account.cash.recharge.offline.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            viewMerchant(ownerId) {
                this.merchantModal = {
                    visible: true,
                    merchantId: ownerId
                }
            },
            closeMerchant() {
                this.merchantModal = {
                    visible: false,
                    merchantId: ''
                }
            },
            confirm(row) {
                this.$confirm('您确定款项已经到账吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.account.cash.recharge.offline.confirm,
                        params: {
                            recordId: row.record.id
                        },
                        success: () => {
                            this.$message.success('确认成功！');
                            this.list();
                        }
                    });
                }).catch(() => {
                })
            }
        }
    }

</script>
