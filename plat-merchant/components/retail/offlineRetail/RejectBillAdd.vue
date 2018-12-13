<template>
    <div>
        <div v-if="!getCanChange" class="form-inline">
            <div class="form-group form-group-margin">
                <label class="titleNameSize">退货单号&nbsp;&nbsp;&nbsp;</label>
                <span>{{ getRejectDetailInfo.billNumber }}</span>
            </div>
        </div>
        <div v-if="getCanChange" class="form-inline">
            <div class="form-group form-group-margin">
                <label class="titleNameSize">客户手机号&nbsp;&nbsp;&nbsp;</label>
                <input class="form-control" v-model="telephoneNumber$"/>
            </div>
            <div class="form-group form-group-margin">
                <label class="titleNameSize">收银单号&nbsp;&nbsp;&nbsp;</label>
                <input class="form-control" v-model="paymentBillNumber$"/>
            </div>
            <div class="form-group form-group-margin">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="clickSearchPayment">
                    搜索
                </button>
            </div>
        </div>


        <fieldset v-if="getCanChange" style="padding: 10px">
            <legend>收银单查询信息</legend>
            <div v-for="(list,index) in getPaymentBills">
                <div class="form-inline">
                    <div class="form-group form-group-margin">
                        <label>收银单号：</label>
                        <span>{{ list.payBillNumber}}</span>
                    </div>
                </div>
                <TableCpn
                    :heads="[
                        {propName:'serial',name:'条码'},
                        {propName:'amount',name:'件数'},
                        {propName:'categoryId',name:'品类'},
                        {propName:'gemId',name:'宝石'},
                        {propName:'metalId',name:'金属'},
                        {propName:'priceType',name:'计价方式'},
                        {propName:'weight',name:'总质量'},
                        {propName:'processingCharges',name:'工费'},
                        {propName:'metalPrice',name:'金价'},
                        {propName:'regularPrice',name:'原价金额'},
                        {propName:'discountRate',name:'折扣比例'},
                        {propName:'extraDiscount',name:'其他优惠'},
                        {propName:'totalCost',name:'实收金额'},
                        {tag:'BUTTON',name:'操作'}
                    ]"
                    :items="list.items">
                    <button v-for="(ite,inde) in list.items" v-if="ite.canReject" :disabled="ite.hasChoosed"
                            class="btn btn-sm btn-default"
                            :slot="'BUTTON'+inde" @click="clickChooseRejectWare(ite, inde, index)">选择
                    </button>
                </TableCpn>
                <!--<div class="form-inline">-->
                <!--<div class="form-group form-group-margin">-->
                <!--<label>赠送：黄金：151ml    50元抵扣券*1</label>-->
                <!--<span></span>-->
                <!--</div>-->
                <!--</div>-->
            </div>
        </fieldset>

        <fieldset style="padding: 10px">
            <legend>退货信息</legend>
            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <label class="titleNameSize">收货仓库&nbsp;&nbsp;&nbsp;</label>
                    <select v-if="getCanChange" class="form-control" v-model="wareHouseId$">
                        <option v-for="recyclerWareHouse in getRejectWareHouse" :value="recyclerWareHouse.id">
                            {{ recyclerWareHouse.name }}
                        </option>
                    </select>
                    <span v-else>{{ getRejectDetailInfo.wareHouseId }}</span>
                </div>
                <div class="form-group form-group-margin">
                    <label class="titleNameSize">退货员&nbsp;&nbsp;&nbsp;</label>
                    <select v-if="getCanChange" class="form-control" v-model="salesmanId$">
                        <option v-for="staff in getStaffs" :value="staff.id">{{ staff.nickName }}</option>
                    </select>
                    <span v-else>{{ getRejectDetailInfo.salesmanId }}</span>
                </div>
                <div v-if="!getCanChange" style="text-align: right">
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn btn-warning'],
                                btnStyle: {marginRight: 10 + 'px'},
                                btnName: '打印模板'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                modalClasses: [''],
                                titleName: '选择打印模板'
                            }">
                        <PrintTemplate slot="main"
                                       :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"></PrintTemplate>
                    </ButtonWithModal>
                </div>
            </div>

            <TableCpn
                :heads="[
                        {propName:'serial',name:'条码'},
                        {propName:'amount',name:'件数'},
                        {propName:'categoryId',name:'品类'},
                        {propName:'gemId',name:'宝石'},
                        {propName:'metalId',name:'金属'},
                        {propName:'priceType',name:'计价方式'},
                        {propName:'weight',name:'总质量'},
                        {propName:'totalCost',name:'原实收金额'},
                        {tag:'INPUT',name:'退款金额'},
                        {tag:'BUTTON',name:'操作'}
                    ]"
                :items="rejectWares">
                <input v-for="(item,index) in rejectWares" v-if="getCanChange" :slot="'INPUT'+index"
                       class="form-control rejectPrice" v-model.number="item.refundMoneyByInput"/>
                <span v-else :slot="'INPUT'+index">{{ item.refundCost}}</span>
                <button v-for="(item,index) in rejectWares" v-if="getCanChange" class="btn btn-sm btn-default"
                        :slot="'BUTTON'+index" @click="clickDeleteRejectWare(item, index)">删除
                </button>
                <button class="btn btn-sm btn-default" v-else :slot="'BUTTON'+index" disabled="disabled">删除</button>
            </TableCpn>

            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <label>退款金额：</label>
                    <span v-if="getCanChange">{{ rejectPrice }}</span>
                    <span v-else>{{ getRejectDetailInfo.refundCost }}</span>
                </div>
            </div>
        </fieldset>

        <div class="row" style="margin-bottom: 20px;margin-top: 20px">
            <div class="col-md-12" style="text-align: right">
                <span v-if="getCanChange">
                    <button type="button" class="btn btn-success" @click="add">保存并提交</button>
                </span>
                <span v-else style="margin: 10px">
                    <button type="button" class="btn btn-primary" data-dismiss="modal"
                            @click="print(getRejectWares)">打印票据</button>
                </span>
                <span v-if="getCanChange || getRejectDetailInfo.paid === '未退款'" style="margin: 10px">
                    <button type="button" class="btn btn-danger"
                            @click="jump2payment">前往收银</button>
                </span>
                <span style="margin: 10px">
                    <button type="button" class="btn btn-info" @click="back">返回</button>
                </span>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex'
    import TableCpn from '~/components/Table'
    import {calculateUtil} from '~/util'
    import RejectBillMain from '~/components/retail/offlineRetail/RejectBillMain'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import PrintTemplate from '~/components/storage/stock/PrintTemplate'
    import {ChangeTabEvent} from '~/components/ChangeTabEvent'
    import uuid from 'uuid'

    export default {
        props: ['passed'],
        components: {
            TableCpn,
            ButtonWithModal,
            PrintTemplate
        },
        data() {
            return {
                telephoneNumber$: '',
                paymentBillNumber$: '',
                rejectWares: [],
                rejectPrices: [],
                wareHouseId$: '',
                salesmanId$: '',
                customerId$: '',
                telephone$: '',
                nickName$: '',
                gender$: '',
                itemsJson$: '',
                CONST_CLOSE_MODAL: uuid()
            }
        },
        watch: {},
        computed: {
            ...mapGetters('retail/offlineRetail/rejectBillAdd', {
                getCanChange: 'getCanChange',
                getRejectWares: 'getRejectWares',
                getBill: 'getBill',
                getPaymentBills: 'getPaymentBills',
                getRejectDetailInfo: 'getRejectDetailInfo',
                getRejectWareHouse: 'getRejectWareHouse',
                getStaffs: 'getStaffs',
                getPayBillNumberObj: 'getPayBillNumberObj'
            }),
            rejectPrice() {
                console.log('this.rejectWares', this.rejectWares);
                let n = 0
                this.rejectWares.forEach(item => {
                    n += item.refundMoneyByInput
                })
                return n
            }
        },
        methods: {
            ...mapMutations('retail/offlineRetail/rejectBillAdd', {}),
            ...mapActions('retail/offlineRetail/rejectBillAdd', {
                apiGetPaymentBill: 'apiGetPaymentBill',
                apiAddRejectBill: 'apiAddRejectBill'
            }),
            // 打印标签
            print(item) {
                console.log('打印标签ing:', item)
                console.log('=====')
            },
            jump2payment() {
                // 跳转到收银页面，进行收银操作
                if (this.getCanChange) {
                    if (this.rejectWares.length <= 0) {
                        alert('请选择退货单')
                        return
                    }
                    let customer = this.getCustomer()
                    this.apiAddRejectBill({
                        params: {
                            ...customer,
                            wareHouseId: this.wareHouseId$,
                            salesmanId: this.salesmanId$,
                            itemsJson: this.spellItemsJson()
                        },
                        callback: (data) => {
                            console.log('lllllllll', data);
                            ChangeTabEvent.$emit('JUMP_TO_PAYMENT', data.result.billNumber)
                        }
                    })
                } else {
                    ChangeTabEvent.$emit('JUMP_TO_PAYMENT', this.getRejectDetailInfo.billNumber)
                }
            },
            clickSearchPayment() {
                this.apiGetPaymentBill({
                    params: {
                        telephone: this.telephoneNumber$,
                        payBillNumber: this.paymentBillNumber$
                    },
                    callback: () => {
                    }
                })
            },
            clickChooseRejectWare(item, index, parIndex) {
                let exist = false
                this.rejectWares.forEach(ware => {
                    if (ware.serial === item.serial) {
                        exist = true
                    }
                })
                if (exist === false) {
                    item.oldIndex = index
                    item.oldParIndex = parIndex
                    // item.refundMoneyByInput = ''; // 用户手输入的退款金额
                    this.rejectWares.push(item)
                    console.log('this.rejectWares', this.rejectWares)
                }
                item.hasChoosed = !item.hasChoosed
                console.log(this.rejectWares)
            },
            clickDeleteRejectWare(item, index) {
                this.rejectWares.splice(index, 1)
            },
            spellItemsJson() {
                // 拼装退货商品信息
                this.itemsJson$ = []
                this.rejectWares.forEach((ware, index) => {
                    this.itemsJson$.push({
                        forfeitCost: calculateUtil.subtract(ware.totalCost, ware.refundMoneyByInput),
                        refundCost: ware.refundMoneyByInput,
                        rejectAmount: ware.amount,
                        retailItemId: ware.id
                    })
                })
                return JSON.stringify(this.itemsJson$)
            },
            getCustomer() {
                let {customer} = this.getPaymentBills[0].bill
                if (!customer) {
                    customer = {
                        customerId: '',
                        telephone: '',
                        nickName: '',
                        gender: ''
                    }
                }
                return customer
            },
            add() {
                if (this.rejectWares.length <= 0) {
                    alert('请选择退货单')
                    return
                }
                let customer = this.getCustomer()
                this.apiAddRejectBill({
                    params: {
                        ...customer,
                        wareHouseId: this.wareHouseId$,
                        salesmanId: this.salesmanId$,
                        itemsJson: this.spellItemsJson()
                    },
                    callback: () => {
                        this.back()
                    }
                })
            },
            back() {
                this.passed.changeCurrCpn(RejectBillMain)
            },
            initData() {
                this.wareHouseId$ = this.getRejectWareHouse[0].id
                this.salesmanId$ = this.getStaffs[0].id
                this.rejectWares = this.getRejectWares
            }
        },
        mounted() {
            console.log('退货单详情 getRejectDetailInfo.paid', this.getRejectDetailInfo);
            console.log('退货单详情 getRejectDetailInfo.paid', this.getRejectDetailInfo.paid);
        },
        beforeMount() {
            this.initData()
        }
    }
</script>

<style>

</style>
