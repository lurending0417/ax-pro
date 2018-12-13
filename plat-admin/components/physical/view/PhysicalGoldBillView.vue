<template>
    <el-dialog
        title="查看提金订单"
        width="60%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        append-to-body
        :before-close="close">
        <UserProfile :user-id="json.bill.creatorId"></UserProfile>
        <el-card class="box-card m-t">
            <table class="table" style="width:100%;">
                <tr>
                    <td><b>单号：</b>{{json.bill.billNumber}}</td>
                    <td><b>重量：</b>{{json.bill.totalWeight}}g</td>
                    <td><b>工费：</b>{{renderMoney(json.bill.processingCharges)}}</td>
                    <td><b>手续费：</b>{{renderMoney(json.bill.tradeCharges)}}</td>
                    <td><b>快递费：</b>{{renderMoney(json.bill.shipperCost)}}</td>
                    <td><b>总金额：</b>{{renderMoney(json.bill.totalCost)}}</td>
                </tr>
                <tr>
                    <td colspan="5"><b>收货地址：</b>{{renderAddress(json.rxAddress)}}</td>
                    <td>
                        <el-tag :type="getLabelType(json.bill.status)" size="small">当前状态：{{renderStatus(json.bill.status)}}</el-tag>
                    </td>
                </tr>
            </table>
            <el-table :data="json.items" stripe border class="m-t">
                <el-table-column prop="gold.name" label="名称"></el-table-column>
                <el-table-column prop="item.singleWeight" label="重量" :formatter="renderWeight"></el-table-column>
                <el-table-column prop="item.singleProcessingCharges" label="工费" :formatter="renderSingleProcessingCharges"></el-table-column>
                <el-table-column prop="gold.purity" label="纯度"></el-table-column>
                <el-table-column prop="gold.dimension" label="尺寸"></el-table-column>
                <el-table-column prop="item.amount" label="数量" align="center"></el-table-column>
                <el-table-column label="总重量" :formatter="renderTotalWeight"></el-table-column>
                <el-table-column label="总工费" :formatter="renderTotalProcessingCharges"></el-table-column>
            </el-table>

            <template v-if="json.bill.status=='WAIT_SHIPPING'">
                <el-form inline class="m-t" style="float:right;">
                    <el-form-item>
                        <EnumSelect :params="shipping" field="shipper" enum="shipper" placeholder="请选择物流"></EnumSelect>
                    </el-form-item>
                    <el-form-item>
                        <el-input placeholder="快递单号" v-model="shipping.logisticsCode"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button native-type="button" type="primary" @click="shippingOut">确认发货</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </el-card>

        <template v-if="json.shipping && json.shipping.id">
            <el-card class="box-card m-t">
                <table class="table">
                    <tr>
                        <td><b>快递公司：</b> {{renderShipper(json.shipping.shippingRecord.shipper)}}</td>
                        <td><b>快递单号：</b>{{json.shipping.shippingRecord.logisticsCode}}</td>
                        <td><b>发货时间：</b>{{renderTime(json.shipping.shippingRecord.createTime)}}</td>
                        <td><b>快递状态：</b>{{renderShippingStatus(json.shipping.shippingRecord.status)}}</td>
                    </tr>
                </table>
                <template v-if="json.shipping.traceRecords.length">
                    <table class="table" style="width:auto;">
                        <tr>
                            <th>时间</th>
                            <th>状态</th>
                            <th>备注</th>
                        </tr>
                        <tr v-for="record in json.shipping.traceRecords" :key="record.id">
                            <td>{{renderTime(record.createTime)}}</td>
                            <td>{{record.description}}</td>
                            <td>{{record.remark}}</td>
                        </tr>
                    </table>
                </template>
                <template v-else>
                    <el-tag type="info" size="small">暂时没有物流跟踪记录...</el-tag>
                </template>
            </el-card>
        </template>

    </el-dialog>
</template>


<script>

    import api from "~/api"

    import {baseUtil, renderUtil} from "~/util"


    export default {
        props: ['options'],
        data() {
            return {
                easyClose: true,
                json: {
                    bill: {}
                },
                shipping: {
                    shipper: '',
                    logisticsCode: ''
                }
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    if (this.options.json) {
                        this.json = this.options.json;
                        this.options.billId = this.json.bill.id;
                    } else if (this.options.billId) {
                        this.fetch();
                    } else {
                        throw Error('缺少提金订单ID');
                    }
                } else {
                    this.shipping = {
                        shipper: '',
                        logisticsCode: ''
                    }
                }
            }
        },
        methods: {
            getLabelType(status) {
                switch (status) {
                    case 'WAIT_PAY':
                    case 'CANCELED_BY_USER':
                    case 'CANCELED_BY_SYS': {
                        return 'info';
                    }
                    case 'WAIT_SHIPPING': {
                        return 'danger';
                    }
                    case 'SHIPPING': {
                        return 'warning';
                    }
                    case 'ACCEPTED': {
                        return 'success';
                    }
                }
            },
            renderMoney(value) {
                return renderUtil.renderMoney(value);
            },
            renderTime(value) {
                return renderUtil.renderTime(value);
            },
            renderShipper(shipper) {
                if (shipper) {
                    return renderUtil.renderEnum('shipper', shipper);
                }
            },
            renderShippingStatus(status) {
                if (status) {
                    return renderUtil.renderEnum('shippingStatus', status);
                }
            },
            renderStatus(status) {
                if (status) {
                    return renderUtil.renderEnum('physicalGoldBillStatus', status);
                }
            },
            renderTotalWeight: (row) => {
                return baseUtil.round(row.item.singleWeight * row.item.amount, 2) + "g";
            },
            renderTotalProcessingCharges: (row) => {
                return "¥" + baseUtil.round(row.item.singleWeight * row.item.amount * row.item.singleProcessingCharges);
            },
            renderWeight: (row, cell, value) => {
                return (value ? value : '0') + 'g';
            },
            renderSingleProcessingCharges: (row, cell, value) => {
                return '¥' + (value ? value : '0') + '/g';
            },
            renderAddress(json) {
                if (!json) {
                    return '';
                }
                return json.name + '，' + json.telephone + '，' + json.districtName + ' ' + json.street;
            },
            close() {
                this.$emit("close");
            },
            fetch() {
                this.params.billId = this.options.billId;
                api.request({
                    url: api.url.physical.gold.bill.get,
                    params: {
                        billId: this.options.billId
                    },
                    success: (json) => {
                        this.json = json.result;
                    }
                });
            },
            shippingOut() {
                this.$confirm('您确定要提交发货吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.physical.gold.bill.shippingOut,
                        params: {
                            billId: this.json.bill.id,
                            shipper: this.shipping.shipper,
                            logisticsCode: this.shipping.logisticsCode
                        },
                        success: () => {
                            this.$message.success('发货成功！');
                            this.fetch();
                        }
                    });
                }).catch(() => {
                })
            }
        }

    }

</script>
