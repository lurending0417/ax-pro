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
                    <strong>收货仓库&nbsp;&nbsp;&nbsp;</strong>
                    <select v-if="getCanChange" class="form-control" v-model="wareHouseId$">
                        <option v-for="recyclerWareHouse in rejectWareHouse" :value="recyclerWareHouse.id">
                            {{ recyclerWareHouse.name }}
                        </option>
                    </select>
                    <span v-else>{{ getRejectDetailInfo.wareHouseName }}</span>
                </div>
                <div class="form-group form-group-margin" v-if="getCanChange">
                    <strong>退货员&nbsp;&nbsp;&nbsp;</strong>
                    <span v-for="item in rejectManArr">
                        <select class="form-control" v-model="item.id"  name="rejectMan" style="margin-left: 15px">
                            <option value=""></option>
                            <option v-for="staff in staffs" :value="staff.id">{{ staff.nickName }}</option>
                        </select>
                    </span>
                    <i class="fa fa-plus" style="color: green; cursor: pointer;margin-left: 15px;" @click="clickPlus"></i>
                </div>
                <div class="form-group form-group-margin" v-else>
                    <strong>退货员&nbsp;&nbsp;&nbsp;</strong>{{ getRejectDetailInfo.salesmanName }}
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
                    <button type="button" class="btn btn-sm btn-primary" data-dismiss="modal"
                            @click="print(getRejectDetailInfo, getRejectWares)">打印票据</button>
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
        <script>
            window.requireFFI = window.require;
        </script>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex'
    import TableCpn from '~/components/Table'
    import { baseUtil, dateUtil, calculateUtil } from '~/util'
    import RejectBillMain from '~/components/retail/offlineRetail/RejectBillMain'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import PrintTemplate from '~/components/storage/stock/PrintTemplate'
    import {ChangeTabEvent} from '~/components/ChangeTabEvent'
    import uuid from 'uuid'
    function TEcoding(str) {
        let iconv = require('iconv-lite')
        return iconv.encode(Buffer.from(str), 'gbk')
    }
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
                staffs: [],
                rejectWareHouse: [],
                rejectManArr: [{id: ''}],
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
            print (wareBill, item) {
                console.log('-------------------')
                console.log(wareBill)
                // this.getTotalPrice.totalRetailPrice
                console.log('打印标签ing:', item)
                // 打印标签
                let templates = baseUtil.getTemplates()
                let printTemplateChecked = 'REJECT'
                if (templates[printTemplateChecked]) {
                    console.log('=====')
                    var ffi = requireFFI('ffi')
                    var ref = requireFFI('ref')
                    var intP = ref.refType('int');
                    var DLL = ffi.Library('./TLXLabelPaint', {
                        'TLXOpenDocumentA': ['int', ['string', intP]],
                        'TLXSetNamedVariableA': ['int', ['int', 'string', 'string']],
                        'TLXSetNamedVariableW': ['int', ['int', 'string', 'string']],
                        'TLXOutputLabel': ['int', ['int', 'int', 'int']],
                        'TLXOutputDocument': ['int', ['int', 'int', 'int', 'int']],
                        'TLXOpenDocumentXMLA': ['int', ['string', intP, 'bool']],
                        'TLXOpenDocumentXMLW': ['int', ['string', intP, 'bool']],
                        'TLXNamedVarsAddVarDataA': ['int', ['int', 'int', 'string', 'string']],
                        'TLXEditTemplateXMLA': ['int', ['string', intP]],
                        'TLXCloseDocument': ['int', ['int']]
                    })
                    var buffer = Buffer.alloc(32)
                    DLL.TLXOpenDocumentXMLA(TEcoding(templates[printTemplateChecked]), buffer, false);
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('门店'), TEcoding('门店：' + wareBill.storeName));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('柜组'), TEcoding('柜组：' + wareBill.wareHouseName));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('单号'), TEcoding('单号：' + wareBill.billNumber));
                    var totalHeight = 0;
                    item.map((subItem) => {
                        totalHeight += subItem.weight
                    })
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('合计'), TEcoding('合计：共' + item.length + '件， 重量：' + totalHeight.toString() + item[0].weightUnit));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('退款金额'), TEcoding('退款金额：' + this.getRejectDetailInfo.refundCost.toString()));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('单号条码'), TEcoding(wareBill.billNumber));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('营业员'), TEcoding('营业员：' + wareBill.salesmanName));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('日期'), TEcoding('日期：' + dateUtil.pattern(new Date(), 'yyyy-MM-dd HH:mm:ss')));
                    var fff = DLL.TLXOutputLabel(buffer.readInt32LE(0), 1, 0)
                    // var fff =  DLL.TLXOutputDocument(1, 1, 1, 0)`
                    console.log(fff)
                    var out = DLL.TLXCloseDocument(buffer.readInt32LE(0))
                } else {
                    alert('未能成功匹配模板，请上传相应的打印模板')
                }
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
                            ChangeTabEvent.$emit('JUMP_TO_PAYMENT', data.result.billNumber)
                        }
                    })
                } else {
                    ChangeTabEvent.$emit('JUMP_TO_PAYMENT', this.getRejectDetailInfo.billNumber)
                }
            },
            clickPlus() {
                if (this.rejectManArr.length === this.staffs.length) {
                    alert('退货员人数不能超过当前门店员工人数')
                    return
                }
                this.rejectManArr.push({id: ''});
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
                let salesmanId = this.rejectManArr.map(item => item.id).filter(ele => ele);
                if (salesmanId.length === 0) {
                    alert('请选择退货员')
                    return
                }
                let customer = this.getCustomer();
                this.apiAddRejectBill({
                    params: {
                        ...customer,
                        wareHouseId: this.wareHouseId$,
                        salesmanId: salesmanId.join(),
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
                if (this.getCanChange) {
                    this.wareHouseId$ = this.rejectWareHouse[0].id
                }
                this.salesmanId$ = this.staffs[0].id;
                this.rejectWares = this.getRejectWares
            }
        },
        beforeMount() {
            this.rejectWareHouse = baseUtil.getMetadataRejectWareHouse({enabled: true})
            this.staffs = baseUtil.getMetadataStaffByStoreId({atWork: true})
            this.initData()
        }
    }
</script>

<style>

</style>
