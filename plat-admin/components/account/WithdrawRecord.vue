<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="24">
                <el-form inline>
                    <el-form-item>
                        <DateRange :params="params"></DateRange>
                    </el-form-item>
                    <el-form-item>
                        <EnumSelect :params="params" field="status" clearable enum="withdrawRecordStatus" placeholder="请选择状态"></EnumSelect>
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
            <el-table-column prop="createTime" label="提现时间" width="180" :formatter="renderTime"></el-table-column>
            <el-table-column prop="ownerName" label="用户"></el-table-column>
            <el-table-column prop="ownerType" label="类型" width="70" :formatter="renderUserType"></el-table-column>
            <el-table-column prop="withdrawAmount" label="提现金额" :formatter="renderMoney"></el-table-column>
            <el-table-column prop="tradeCharges" label="手续费" :formatter="renderMoney"></el-table-column>
            <el-table-column prop="totalCost" label="总金额" :formatter="renderMoney"></el-table-column>
            <el-table-column prop="status" label="状态" width="70" :formatter="renderStatus"></el-table-column>
            <el-table-column prop="type" label="拨付方式" width="80" :formatter="renderType"></el-table-column>
            <el-table-column prop="gateway" label="代付网关" width="80" :formatter="renderGateway"></el-table-column>
            <el-table-column prop="realName" label="户名"></el-table-column>
            <el-table-column prop="bankAccount" label="账号"></el-table-column>
            <el-table-column label="操作" width="170" align="left">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button size="mini" type="primary" @click="showTran(scope.row)">流转记录</el-button>
                        <el-button v-if="scope.row.status=='WAIT_AUDIT'" size="mini" type="danger" @click="audit(scope.row)">审核</el-button>
                        <el-button v-if="scope.row.status=='AUDITED' && scope.row.type=='TRANSFER'" size="mini" type="warning" @click="transfer(scope.row)">转账</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

        <WithdrawTran :options="tranModal" @close="closeTran"></WithdrawTran>

        <WithdrawTransfer :options="transferModal" @close="closeTransfer"></WithdrawTransfer>

    </div>

</template>


<script>

    import api from "~/api"

    import {renderUtil} from "~/util"

    export default {
        data() {
            return {
                params: {
                    sent: '',
                    query: ''
                },
                rows: [],
                total: 0,
                tranModal: {
                    visible: false,
                    recordId: ''
                },
                transferModal: {
                    visible: false
                }
            }
        },
        mounted() {
            this.$on("init", () => {
                this.list();
            });
        },
        methods: {
            renderStatus(row, cell, value) {
                return value ? renderUtil.renderEnum('withdrawRecordStatus', value) : '';
            },
            renderUserType(row, cell, value) {
                switch (value) {
                    case 'USER': {
                        return '用户';
                    }
                    case 'MERCHANT': {
                        return '商户';
                    }
                    default: {
                        return value;
                    }
                }
            },
            renderType(row, cell, value) {
                return value ? renderUtil.renderEnum('withdrawRecordType', value) : '';
            },
            renderGateway(row, cell, value) {
                return value ? renderUtil.renderEnum('gateway', value) : '';
            },
            showTran(row) {
                this.tranModal = {
                    visible: true,
                    recordId: row.id
                }
            },
            closeTran() {
                this.tranModal = {}
            },
            audit(row) {
                this.$confirm('您确定要审核通过这个提现记录吗？', '请确认', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.account.withdraw.approve,
                        params: {
                            recordId: row.id
                        },
                        success: () => {
                            this.$message.success('审核成功！');
                            this.list();
                        }
                    });
                }).catch(() => {
                })
            },
            transfer(row) {
                this.transferModal = {
                    visible: true,
                    json: row
                }
            },
            closeTransfer(updated) {
                this.transferModal = {
                    visible: false,
                    json: {}
                };
                updated === true && this.list();
            },
            list() {
                api.request({
                    url: api.url.account.withdraw.list,
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
