<template>
    <div>
        <p class="order_style">
            <span>订单号：</span><span>{{deliverDetailItem.leaseRecord.billNumber}}</span>
        </p>
        <slot name="express" class="order_style"></slot>
        <fieldset>
            <legend>商品详情</legend>
            <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
                <thead>
                <tr>
                    <th>条码</th>
                    <th>总质量</th>
                    <th>成本价</th>
                    <th>零售价（原价）</th>
                    <th>零售价（折后）</th>
                    <th>押金</th>
                    <th>租金</th>
                    <th>起租天数</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="table-bordered">{{deliverDetailItem.leaseStorage.storageView.storage.serial}}</td>
                    <td class="table-bordered">{{deliverDetailItem.leaseStorage.storageView.storage.weight}}</td>
                    <td class="table-bordered">{{deliverDetailItem.leaseStorage.storageView.storage.costPrice}}</td>
                    <td class="table-bordered">{{deliverDetailItem.leaseStorage.storageView.storage.regularPrice}}
                    </td>
                    <td class="table-bordered">{{deliverDetailItem.leaseStorage.storageView.storage.retailPrice}}
                    </td>
                    <td class="table-bordered">{{deliverDetailItem.leaseStorage.lease.depositPrice}}</td>
                    <td class="table-bordered">{{deliverDetailItem.leaseStorage.lease.rentPrice}}</td>
                    <td class="table-bordered">{{deliverDetailItem.leaseRecord.leaseDays}}</td>
                </tr>
                </tbody>
            </table>
        </fieldset>
        <fieldset>
            <legend>参数情况</legend>
            <div v-if="deliverDetailItem.leaseStorage.storageView.props.length>0">
                <p v-for="item in deliverDetailItem.leaseStorage.storageView.props">
                    {{item.fieldName}}:{{item.fieldValue}}</p>
            </div>
            <div v-else>
                <p>暂无任何参数信息</p>
            </div>
        </fieldset>
        <fieldset>
            <legend>支付情况</legend>
            <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
                <thead>
                <tr>
                    <th>付款结果</th>
                    <th>支付金额</th>
                    <th>支付方式</th>
                    <th>支付时间</th>
                </tr>
                </thead>
                <tbody v-if="deliverDetailItem.payments.length > 0">
                <tr v-for="item in deliverDetailItem.payments">
                    <td class="table-bordered">{{item.paid? '付款成功':'付款失败'}}</td>
                    <td class="table-bordered">{{item.gatewayAmount}}</td>
                    <td class="table-bordered">{{item.gateway }}</td>
                    <td class="table-bordered">{{item.createTime}}</td>
                </tr>
                </tbody>
            </table>
        </fieldset>
        <fieldset>
            <legend>下单人信息</legend>
            <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
                <thead>
                <tr>
                    <th>下单人昵称</th>
                    <th>联系电话</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="table-bordered">{{deliverDetailItem.buyer.nickName || ''}}</td>
                    <td class="table-bordered">{{deliverDetailItem.buyer.telephone}}</td>
                </tr>
                </tbody>
            </table>
        </fieldset>
        <fieldset>
            <legend>收货人信息</legend>
            <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
                <thead>
                <tr>
                    <th>收货人</th>
                    <th>联系电话</th>
                    <th>地址</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="table-bordered">{{deliverDetailItem.rxAddress.name}}</td>
                    <td class="table-bordered">{{deliverDetailItem.rxAddress.telephone}}</td>
                    <td class="table-bordered">{{deliverDetailItem.rxAddress.districtName}}&nbsp;&nbsp;{{deliverDetailItem.rxAddress.street}}</td>
                </tr>
                </tbody>
            </table>
        </fieldset>
        <fieldset>
            <legend>买家留言</legend>
            <p>{{deliverDetailItem.leaseRecord.buyerMemo}} </p>
        </fieldset>
    </div>
</template>

<script>
    import {TableEvent} from '~/components/TableEvent'
    import {dateUtil, baseUtil, regionUtil} from '~/util';

    export default {
        props: ['params'],
        data() {
            return {
                deliverDetailItem: {
                    buyer: {
                        nickName: '',
                        telephone: ''
                    },
                    payments: [],
                    leaseRecord: {},
                    rxAddress: {}, // 收货地址
                    backShippingRecord: {},
                    leaseStorage: {
                        lease: {},
                        storageView: {
                            props: [],
                            storage: {}
                        }
                    }
                }
            }
        },
        mounted() {
            let vm = this;
            TableEvent.$on(this.params.PAGE_OPEN, (data) => {
                data.rxAddress.districtName = regionUtil.getDetailAddress(data.rxAddress.districtCode, vm.params.reginData)
                data.payments = data.payments.map(item => {
                    item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                    if (item.gateway) {
                        item.gatewayName = baseUtil.getEnumsByKey('gateway').find(ele => ele.id === item.gateway).name
                    }
                    return item
                })
                vm.deliverDetailItem = data
            });
        }
    }
</script>

<style scoped>
    fieldset {
        padding: 10px 20px;
        text-align: center;
    }

    fieldset div {
        text-indent: 2em;
    }

    .footer_btn {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .order_style {
        text-align: left;
        font-weight: 700;
        font-size: inherit;
        color: #676a6c;
    }
</style>
