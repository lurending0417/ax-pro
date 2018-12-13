<template>
    <div>
        <fieldset>
            <legend>试戴单基本信息</legend>
            <div class=" line-cls">
                <KeyValueCom :title="'定单号：'" :value="deliverDetailItem.leaseRecord.billNumber"></KeyValueCom>
                <KeyValueCom :title="'下单时间：'" :value="deliverDetailItem.leaseRecord.createTime"></KeyValueCom>
                <KeyValueCom :title="'试戴期限：'" :value="deliverDetailItem.leaseRecord.leaseDays+'天'"></KeyValueCom>
                <KeyValueCom :title="'状态：'" :value="deliverDetailItem.statusName+isConfirmText"></KeyValueCom>
            </div>
            <div class=" line-cls">
                <KeyValueCom :title="'买家留言：'" :value="deliverDetailItem.leaseRecord.buyerMemo || '买家未留言'"></KeyValueCom>
            </div>
            <div class="statusWrap" v-if="deliverDetailItem.traces && deliverDetailItem.traces.length > 0">
                <div class="flex-cls">
                    <div class="status-items-cls">
                        <div class="back-line-cls" style="width: 50%;"></div>
                        <i class="fa fa-circle icon-cls" aria-hidden="true"></i>
                        <p class="name-cls">{{deliverDetailItem.traces[0].status}}</p>
                        <p>{{deliverDetailItem.traces[0].createTime}}</p>
                    </div>
                    <div v-for="(item, index) in deliverDetailItem.traces" class="status-items-cls" v-if="index>0">
                        <div class="back-line-cls"></div>
                        <i class="fa fa-circle icon-cls" aria-hidden="true"></i>
                        <p class="name-cls">{{item.status}}</p>
                        <p>{{item.createTime}}</p>
                    </div>
                </div>
            </div>
        </fieldset>
        <fieldset>
            <legend>商品信息</legend>
            <div class=" line-cls">
                <KeyValueCom :title="'所属门店：'" :value="deliverDetailItem.leaseStorage.storageView.storage.storeName"></KeyValueCom>
                <KeyValueCom :title="'所属仓库：'" :value="deliverDetailItem.leaseStorage.storageView.storage.wareHouseName"></KeyValueCom>
            </div>
            <div class=" line-cls">
                <KeyValueCom :title="'条码：'" :value="deliverDetailItem.leaseStorage.storageView.storage.serial"></KeyValueCom>
                <KeyValueCom :title="'品名：'" :value="deliverDetailItem.leaseStorage.storageView.storage.categoryName"></KeyValueCom>
                <KeyValueCom :title="'重量：'" :value="deliverDetailItem.leaseStorage.storageView.storage.weight+ 'g'"></KeyValueCom>
                <KeyValueCom :title="'价格：'" :value="deliverDetailItem.leaseStorage.storageView.storage.retailPrice+ '元'"></KeyValueCom>
                <span v-if="deliverDetailItem.leaseStorage.storageView.props.length>0">
                        <span v-for="item in deliverDetailItem.leaseStorage.storageView.props">
                            <KeyValueCom :title="item.fieldName+'：'" :value="item.fieldValue"></KeyValueCom>
                        </span>
                    </span>
            </div>
            <div class="flex_layout">
                <div v-if="deliverDetailItem.leaseStorage.mainImage">
                    <ImgScrollModal :modalId="modalId"
                                    :src="imgUrl+deliverDetailItem.leaseStorage.mainImage.path"></ImgScrollModal>
                </div>
                <div v-if="obj.path" v-for="obj in deliverDetailItem.leaseStorage.slideImages">
                    <ImgScrollModal :src="imgUrl+obj.path" :modalId="modalId"></ImgScrollModal>
                </div>
                <div v-if="obj.path" v-for="obj in deliverDetailItem.leaseStorage.detailImages">
                    <ImgScrollModal :src="imgUrl+obj.path" :modalId="modalId"></ImgScrollModal>
                </div>
            </div>
        </fieldset>
        <fieldset>
            <legend>发货快递信息</legend>
            <div class="line-cls" v-if="JSON.stringify(deliverDetailItem.leaseShippingRecord) !== '{}'">
                <KeyValueCom :title="'快递公司：'" :value="deliverDetailItem.leaseShippingRecord.shippingRecord.shipperName"></KeyValueCom>
                <KeyValueCom :title="'快递单号：'" :value="deliverDetailItem.leaseShippingRecord.shippingRecord.logisticsCode"></KeyValueCom>
            </div>
            <div class="line-cls">
                <KeyValueCom :title="'下单人昵称：'" :value="deliverDetailItem.buyer.nickName || ''"></KeyValueCom>
                <KeyValueCom :title="'联系电话：'" :value="deliverDetailItem.buyer.telephone"></KeyValueCom>
            </div>
            <div class="line-cls">
                <KeyValueCom :title="'收货人姓名：'" :value="deliverDetailItem.rxAddress.name"></KeyValueCom>
                <KeyValueCom :title="'收货地址：'" :value="deliverDetailItem.rxAddress.districtName+'  '+deliverDetailItem.rxAddress.street"></KeyValueCom>
                <KeyValueCom :title="'联系电话：'" :value="deliverDetailItem.rxAddress.telephone"></KeyValueCom>
            </div>
            <div  v-if="deliverDetailItem.leaseShippingRecord.traceRecords && deliverDetailItem.leaseShippingRecord.traceRecords.length>0">
                <div class="traceRecord-cls" v-if="deliverDetailItem.leaseShippingRecord.traceRecords[0].opRemark">
                    <div class="traceRecord-back-line-cls" style="height: 50%;"></div>
                    <span>{{deliverDetailItem.leaseShippingRecord.traceRecords[0].opTime}}</span>
                    <i class="fa fa-circle traceRecord-icon-cls icon-cls" aria-hidden="true"></i>
                    <span class="remark-cls">{{deliverDetailItem.leaseShippingRecord.traceRecords[0].opRemark}}</span>
                </div>
                <div class="traceRecord-cls" v-for="(item,index) in deliverDetailItem.leaseShippingRecord.traceRecords" v-if="index > 0 && item.opRemark">
                    <div class="traceRecord-back-line-cls"></div>
                    <span>{{item.opTime}}</span>
                    <i class="fa fa-circle traceRecord-icon-cls icon-cls" aria-hidden="true"></i>
                    <span class="remark-cls">{{item.opRemark}}</span>
                </div>
            </div>
        </fieldset>
        <fieldset v-if="JSON.stringify(deliverDetailItem.backShippingRecord) !== '{}'">
            <legend>还货快递信息</legend>
            <div class="line-cls">
                <KeyValueCom :title="'快递公司：'" :value="deliverDetailItem.backShippingRecord.shippingRecord.shipperName"></KeyValueCom>
                <KeyValueCom :title="'快递单号：'" :value="deliverDetailItem.backShippingRecord.shippingRecord.logisticsCode"></KeyValueCom>
            </div>
            <div class="line-cls" v-if="deliverDetailItem.backShippingRecord.txAddress">
                <KeyValueCom :title="'发货人姓名：'" :value="deliverDetailItem.backShippingRecord.txAddress.name || ''"></KeyValueCom>
                <KeyValueCom :title="'发货地址：'" :value="deliverDetailItem.backShippingRecord.txAddress.districtName+'  '+deliverDetailItem.backShippingRecord.txAddress.street"></KeyValueCom>
                <KeyValueCom :title="'联系电话：'" :value="deliverDetailItem.backShippingRecord.txAddress.telephone"></KeyValueCom>
            </div>
            <div class="line-cls">
                <KeyValueCom :title="'收货人姓名：'" :value="deliverDetailItem.backShippingRecord.rxAddress.name  || ''"></KeyValueCom>
                <KeyValueCom :title="'收货地址：'" :value="deliverDetailItem.backShippingRecord.rxAddress.districtName+'  '+deliverDetailItem.backShippingRecord.rxAddress.street"></KeyValueCom>
                <KeyValueCom :title="'联系电话：'" :value="deliverDetailItem.backShippingRecord.rxAddress.telephone"></KeyValueCom>
            </div>
            <div v-if="deliverDetailItem.backShippingRecord.traceRecords && deliverDetailItem.backShippingRecord.traceRecords.length>0">
                <div class="traceRecord-cls" v-if="deliverDetailItem.backShippingRecord.traceRecords[0].opRemark">
                    <div class="traceRecord-back-line-cls" style="height: 50%;"></div>
                    <span>{{deliverDetailItem.backShippingRecord.traceRecords[0].opTime}}</span>
                    <i class="fa fa-circle traceRecord-icon-cls icon-cls" aria-hidden="true"></i>
                    <span class="remark-cls"> {{deliverDetailItem.backShippingRecord.traceRecords[0].opRemark}}</span>
                </div>
                <div class="traceRecord-cls" v-for="(item,index) in deliverDetailItem.backShippingRecord.traceRecords" v-if="index > 0 && item.opRemark">
                    <div class="traceRecord-back-line-cls"></div>
                    <span>{{item.opTime}}</span>
                    <i class="fa fa-circle traceRecord-icon-cls icon-cls" aria-hidden="true"></i>
                    <span class="remark-cls">{{item.opRemark}}</span>
                </div>
            </div>
        </fieldset>
        <fieldset v-if="deliverDetailItem.leaseQcs && deliverDetailItem.isShowLeaseQcs">
            <legend>损坏情况</legend>
            <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
                <thead>
                <tr>
                    <th>损坏说明</th>
                    <th>扣款情况</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in deliverDetailItem.leaseQcs">
                    <td class="table-bordered">{{item.remark}}</td>
                    <td class="table-bordered">{{item.forfeit}}</td>
                </tr>
                </tbody>
            </table>
        </fieldset>
        <fieldset>
            <legend>用户支付信息</legend>
            <div class="pay-info line-cls">
                <div>
                    <KeyValueCom :title="deliverDetailItem.startTime" :value="''"></KeyValueCom>
                    <KeyValueCom :title="'押金：'" :value="deliverDetailItem.leaseRecord.depositCost"></KeyValueCom>
                    <KeyValueCom :title="'试戴费：'" :value="deliverDetailItem.leaseRecord.rentCost"></KeyValueCom>
                </div>
                <div>
                    <KeyValueCom :title="'试戴下单付款：'" :value="deliverDetailItem.leaseRecord.totalCost"></KeyValueCom>
                </div>
            </div>
            <div class="pay-info line-cls" v-if="deliverDetailItem.isEnd">
                <div>
                    <KeyValueCom :title="deliverDetailItem.doneTime" :value="''"></KeyValueCom>
                    <KeyValueCom :title="'退押金：'" :value="'-'+deliverDetailItem.leaseRecord.depositCost"></KeyValueCom>
                    <KeyValueCom :title="'逾期试戴费：'" :value="deliverDetailItem.leaseRecord.forfeitOfRent||0"></KeyValueCom>
                    <KeyValueCom :title="'有损扣款：'" :value="deliverDetailItem.leaseRecord.forfeitOfBroken||0"></KeyValueCom>
                </div>
                <div>
                    <KeyValueCom :title="'还货退款结算：'" :value="-deliverDetailItem.leaseRecord.refundCost"></KeyValueCom>
                </div>
            </div>
            <div class="hr-line-dashed" v-if="deliverDetailItem.isEnd"></div>
            <div style="text-align: right" v-if="deliverDetailItem.isEnd">
                <KeyValueCom :title="'收入合计：'" :value="deliverDetailItem.leaseRecord.lastCost"></KeyValueCom>
            </div>
        </fieldset>
    </div>
</template>

<script>
    import {TableEvent} from '~/components/TableEvent'
    import {dateUtil, baseUtil, calculateUtil, constUtil} from '~/util';
    import KeyValueCom from '~/components/KeyValueCom'
    import ImgScrollModal from '~/components/ImgScrollModal'

    export default {
        components: {
            KeyValueCom,
            ImgScrollModal
        },
        props: {
            modalId: {
                type: String // 用于查看大图
            },
            params: {
                type: Object // 用于传递数据（reginData,PAGE_OPEN）
            }
        },
        data() {
            return {
                imgUrl: process.env.imgBaseUrl,
                deliverDetailItem: {
                    leaseQcs: [],
                    statusName: '',
                    buyer: {
                        nickName: '',
                        telephone: ''
                    },
                    leaseRecord: {
                        lastCost: '' // 收入合计
                    },
                    storeBackRxAddress: {}, // 换货时商户门店的收货地址
                    rxAddress: {}, // 收货地址
                    leaseShippingRecord: {},
                    backShippingRecord: {
                        shippingRecord: {
                            shipperName: ''
                        },
                        txAddress: {
                            name: ''
                        },
                        rxAddress: {
                            name: ''
                        },
                        traceRecords: []
                    },
                    leaseStorage: {
                        detailImages: [],
                        mainImage: null,
                        slideImages: [],
                        lease: {},
                        storageView: {
                            props: [],
                            storage: {}
                        }
                    },
                    traces: [], // 订单状态
                    isEnd: false,
                    isShowLeaseQcs: false, // 是否显示质检记录
                    startTime: '',
                    doneTime: ''
                }
            }
        },
        computed: {
            isConfirmText() {
                if (this.deliverDetailItem.status === 'WAIT_QC_CONFIRM') {
                    return '（待确认）'
                } else if (this.deliverDetailItem.status === 'DONE_QC_FAIL') {
                    return '（已确认）'
                } else {
                    return ''
                }
            }
        },
        methods: {
            handleData(data) {
                if (data.leaseQcs && data.leaseQcs.filter(item => !item.passed).length > 0) {
                    data.isShowLeaseQcs = true
                } else {
                    data.isShowLeaseQcs = false
                }
                data.statusName = baseUtil.getEnumNameById(data.status, baseUtil.getEnumsByKey('leaseRecordStatus'))
                data.leaseRecord.createTime = dateUtil.pattern(new Date(data.leaseRecord.createTime), 'yyyy-MM-dd HH:mm:ss')
                if (JSON.stringify(data.leaseShippingRecord) !== '{}') {
                    if (constUtil._CONST_SHIPPER.find(ele => ele.id === data.leaseShippingRecord.shippingRecord.shipper)) {
                        data.leaseShippingRecord.shippingRecord.shipperName = constUtil._CONST_SHIPPER.find(ele => ele.id === data.leaseShippingRecord.shippingRecord.shipper).name;
                    }
                    data.leaseShippingRecord.traceRecords.map(item => {
                        item.opTime = dateUtil.pattern(new Date(item.opTime), 'yyyy-MM-dd HH:mm:ss')
                        return item
                    })
                }
                if (JSON.stringify(data.backShippingRecord) !== '{}') {
                    if (constUtil._CONST_SHIPPER.find(ele => ele.id === data.backShippingRecord.shippingRecord.shipper)) {
                        data.backShippingRecord.shippingRecord.shipperName = constUtil._CONST_SHIPPER.find(ele => ele.id === data.backShippingRecord.shippingRecord.shipper).name;
                    }
                    data.backShippingRecord.traceRecords.map(item => {
                        item.opTime = dateUtil.pattern(new Date(item.opTime), 'yyyy-MM-dd HH:mm:ss')
                        return item
                    })
                }
                if (!data.leaseRecord.refundCost) {
                    data.leaseRecord.refundCost = 0
                }
                if (data.leaseRecord.totalCost && (data.leaseRecord.refundCost || data.leaseRecord.refundCost === 0)) {
                    data.leaseRecord.lastCost = calculateUtil.subtract(data.leaseRecord.totalCost, data.leaseRecord.refundCost)
                }
                let tracesLen = data.traces.length;
                data.traces.map((item, index) => {
                    item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                    if (item.status === '待发货') {
                        data.startTime = item.createTime
                    }
                    if ((index === tracesLen - 1) && (item.status === '无损还货' || item.status === '有损还货' || item.status === '已转买')) {
                        data.isEnd = true
                        data.doneTime = item.createTime
                    }
                    return item
                })
                return data
            }
        },
        mounted() {
            let vm = this;
            TableEvent.$on(this.params.PAGE_OPEN, (data) => {
                vm.deliverDetailItem = this.handleData(data)
            });
        }
    }
</script>

<style scoped>
    .statusWrap{
        width: 100%;
    }
    .status-items-cls{
        position: relative;
        width: 135px;
        text-align: center;
    }
    .back-line-cls{
        width:100%;
        height: 1px;
        position: absolute;
        right:0;
        top: 8px;
        background-color: #00cccc;
    }
    .icon-cls{
        position: relative;
        z-index: 2;
        color:#00cccc;
    }
    .name-cls{
        padding-bottom:4px;
    }
    .flex-cls{
        display: flex;
    }
    .traceRecord-cls{
        padding: 5px 0;
        position: relative;
        display: flex;
        align-items: center;
    }
    .traceRecord-back-line-cls{
        position: absolute;
        bottom: 0px;
        left: 136px;
        width: 1px;
        height: 100%;
        background-color: #00cccc;
    }
    .traceRecord-icon-cls{
        margin: auto 10px;
        color: #00cccc;
    }
    .pay-info{
        display: flex;
        justify-content: space-between;
    }
    .remark-cls {
        display: block;
        width: 80%;
        word-wrap: break-word;
        text-align: left;
    }
</style>
