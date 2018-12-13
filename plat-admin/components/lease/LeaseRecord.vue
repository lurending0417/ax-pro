<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="24">
                <el-form inline>
                    <el-form-item>
                        <DateRange :params="params"></DateRange>
                    </el-form-item>
                    <el-form-item>
                        <EnumSelect enum="leaseRecordStatus" clearable multiple collapse-tags placeholder="订单状态" :params="params" field="status"></EnumSelect>
                    </el-form-item>
                    <el-form-item>
                        <EnumSelect enum="leaseRefundStatus" clearable multiple collapse-tags placeholder="退款状态" :params="params" field="refundStatus"></EnumSelect>
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
        <el-table :data="rows" stripe border highlight-current-row>
            <el-table-column v-if="!(options && options.merchantId)" label="商户">
                <template slot-scope="scope">
                    <el-button type="text" @click="viewMerchant(scope.row.leaseRecord.merchantId)">{{scope.row.leaseRecord.merchantName}}</el-button>
                </template>
            </el-table-column>
            <el-table-column v-if="!(options && options.customerId)" label="用户">
                <template slot-scope="scope">
                    <el-button type="text" @click="viewUser(scope.row.leaseRecord.creatorId)">{{scope.row.leaseRecord.creatorName}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="leaseRecord.createTime" label="下单时间" align="center" width="180" :formatter="renderTime"></el-table-column>
            <el-table-column label="订单编号" align="center" width="150">
                <template slot-scope="scope">
                    <el-button type="text" @click="viewLeaseRecord(scope.row)">{{scope.row.leaseRecord.billNumber}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="leaseStorage.storageView.storage.metalName" label="金属"></el-table-column>
            <el-table-column prop="leaseStorage.storageView.storage.gemName" label="宝石"></el-table-column>
            <el-table-column prop="leaseStorage.storageView.storage.categoryName" label="品类"></el-table-column>
            <el-table-column prop="leaseRecord.depositCost" label="押金"></el-table-column>
            <el-table-column prop="leaseRecord.rentPrice" label="租金" :formatter="renderRent"></el-table-column>
            <el-table-column prop="leaseRecord.totalCost" label="总金额"></el-table-column>
            <el-table-column prop="leaseStorage.storageView.storage.serial" label="条码"></el-table-column>
            <el-table-column prop="leaseRecord.status" label="试戴状态">
                <template slot-scope="scope">
                    <div>{{renderLeaseStatus(scope.row.status)}}</div>
                    <div v-if="scope.row.refundCost">
                        退款：{{renderMoney(scope.row.refundCost)}}，{{renderRefundStatus(scope.row.refundStatus)}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <div v-if="scope.row.leaseRecord.status=='LEASE_SHIPPING'">
                        <el-button size="mini" @click="startLeasing(scope.row)" icon="el-icon-circle-check">开始试戴</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

        <MerchantView :options="merchantModal" @close="closeMerchantView"></MerchantView>
        <UserView :options="userModal" @close="closeUserView"></UserView>
        <LeaseRecordView :options="leaseRecordModal" @close="closeLeaseRecordView"></LeaseRecordView>
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
                    merchantId: this.options ? this.options.merchantId : '',
                    customerId: this.options ? this.options.customerId : ''
                },
                rows: [],
                total: 0,
                merchantModal: {
                    visible: false,
                    merchantId: ''
                },
                userModal: {
                    visible: false,
                    userId: ''
                },
                leaseRecordModal: {
                    visible: false,
                    leaseRecordId: ''
                }
            }
        },
        watch: {
            'options.merchantId': function (value) {
                this.params.merchantId = value;
            },
            'options.customerId': function (value) {
                this.params.customerId = value;
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
            renderRent(row) {
                let record = row.leaseRecord;
                return (record.rentPrice || '') + ' * ' + (record.leaseDays || 0) + ' = ' + (record.rentCost || 0);
            },
            renderLeaseStatus(status) {
                return status ? renderUtil.renderEnum('leaseRecordStatus', status) : '';
            },
            renderRefundStatus(status) {
                return status ? renderUtil.renderEnum('leaseRefundStatus', status) : '';
            },
            viewMerchant(merchantId) {
                this.merchantModal = {
                    visible: true,
                    merchantId: merchantId
                }
            },
            closeMerchantView() {
                this.merchantModal = {
                    visible: false,
                }
            },
            viewUser(userId) {
                this.userModal = {
                    visible: true,
                    userId: userId
                }
            },
            closeUserView() {
                this.userModal = {
                    visible: false
                }
            },
            viewLeaseRecord(row) {
                this.leaseRecordModal = {
                    visible: true,
                    leaseRecordId: row.leaseRecord.id,
                    json: row
                }
            },
            closeLeaseRecordView() {
                this.leaseRecordModal = {
                    visible: false
                }
            },
            startLeasing(row) {
                this.$confirm('您确定这个订单要开始试戴吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.lease.record.leasing,
                        params: {
                            leaseRecordId: row.leaseRecord.id
                        },
                        success: () => {
                            this.$message.success('试戴成功！');
                            this.list();
                        }
                    });
                }).catch(() => {
                })
            },
            list() {
                api.request({
                    url: api.url.lease.record.list,
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
