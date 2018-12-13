<template>
    <el-dialog
        title="查看试戴详情"
        width="70%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        append-to-body
        :before-close="close">
        <UserProfile :user="json.buyer"></UserProfile>
        <el-card class="box-card m-t">
            <table class="table" style="width:100%;">
                <tr>
                    <td>
                        <span><b>商户：</b>{{json.leaseRecord && json.leaseRecord.merchantName}}</span>
                    </td>
                    <td>
                        <span><b>门店：</b>{{json.leaseRecord && json.leaseRecord.storeName}}</span>
                    </td>
                    <td>
                        <span><b>单号：</b>{{json.leaseRecord && json.leaseRecord.billNumber}}</span>
                    </td>
                    <td>
                        <span><b>下单时间：</b>{{json.leaseRecord && renderTime(json.leaseRecord.createTime)}}</span>
                    </td>
                    <td>
                        <span><b>状态：</b>{{json.leaseRecord && renderLeaseStatus(json.leaseRecord.status)}}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="100">
                        <span><b>收货地址：</b>{{json.rxAddress && (json.rxAddress.name + '，' + json.rxAddress.telephone + '，' + json.rxAddress.districtName + json.rxAddress.street)}}</span>
                    </td>
                </tr>
            </table>
        </el-card>
        <el-card class="box-card m-t">
            <table class="table" style="width:100%;">
                <tr>
                    <td>
                        <span><b>品名：</b>{{json.leaseStorage && json.leaseStorage.storageView.storageName}}</span>
                    </td>
                    <td>
                        <span><b>学名：</b>{{json.leaseStorage && json.leaseStorage.storageView.scientificName}}</span>
                    </td>
                    <td>
                        <span><b>总质量：</b>{{json.leaseStorage && (json.leaseStorage.storageView.storage.weight + json.leaseStorage.storageView.storage.weightUnit + ( json.leaseStorage.storageView.storage.weightRemark||'') )}}</span>
                    </td>
                    <td>
                        <span><b>条形码：</b>{{json.leaseStorage && json.leaseStorage.storageView.storage.serial}}</span>
                    </td>
                    <td>
                        <span><b>押金：</b>{{json.leaseRecord && renderMoney(json.leaseRecord.depositCost)}}</span>
                    </td>
                    <td>
                        <span><b>租金：</b>{{json.leaseRecord && ((json.leaseRecord.rentPrice || '') + ' * ' + (json.leaseRecord.leaseDays || 0) + ' = ' + (json.leaseRecord.rentCost || 0))}}</span>
                    </td>
                    <td>
                        <span><b>合计金额：</b>{{json.leaseRecord && renderMoney(json.leaseRecord.totalCost)}}</span>
                    </td>
                </tr>
            </table>
        </el-card>
    </el-dialog>
</template>

<script>

    import api from "~/api"

    import {renderUtil} from "~/util"

    export default {
        props: ["options"],
        data() {
            return {
                easyClose: true,
                leaseRecordId: this.options ? this.options.leaseRecordId : '',
                json: {
                    buyer: {}
                }
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    this.init();
                }
            },
            'options.leaseRecordId': function () {
                this.init();
            },
        },
        methods: {
            renderLeaseStatus(status) {
                return status ? renderUtil.renderEnum('leaseRecordStatus', status) : '';
            },
            init() {
                if (this.options.visible === true) {
                    if (this.options.json) {
                        this.json = this.options.json;
                    } else {
                        this.leaseRecordId = this.options.leaseRecordId;
                        this.json = {
                            buyer: {}
                        };
                        this.fetch();
                    }
                }
            },
            fetch() {
                api.request({
                    url: api.url.lease.record.get,
                    params: {
                        recordId: this.leaseRecordId
                    },
                    success: (json) => {
                        this.json = json.result;
                    }
                });
            },
            close() {
                this.$emit("close");
            },
        }
    }
</script>
