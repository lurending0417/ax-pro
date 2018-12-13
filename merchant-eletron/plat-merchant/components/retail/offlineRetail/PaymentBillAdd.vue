<template>
    <div>
        <div v-if="(!getCanChange)&&getUserInfo.telephone">
            <fieldset style="padding: 10px;margin-bottom: 20px;">
                <legend>客户资料</legend>
                <label class="label label-default m-l-xs" style="margin: 15px">客户昵称：{{ getUserInfo.nickName }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">性别：{{ getUserInfo.gender }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">手机号码：{{ getUserInfo.telephone }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">注册日期：{{ getUserInfo.createTime}}</label>
            </fieldset>
        </div>
        <div v-if="!getCanChange" class="form-inline">
            <div class="form-group form-group-margin">
                <label class="titleNameSize">单号&nbsp;&nbsp;&nbsp;</label>
                <span>{{ getPaymentBillDetail.billNumber }}</span>
            </div>
        </div>
        <div class="row" v-if="getCanChange">
            <div class="col-md-3">
                <input v-model="billNumber$" type="text" class="form-control" placeholder="关联单号" name="restoreQuery"
                       @keyup.enter="clickSearchBill">
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="clickSearchBill">
                    搜索关联单号
                </button>
            </div>
        </div>
        <div class="row" style="margin-top: 10px">
            <div class="col-md-4">
                <div class="form-inline">
                    <div class="form-group form-group-margin">
                        <label class="titleNameSize">关联单号&nbsp;&nbsp;&nbsp;</label>
                        <span>{{ getBill.billNumber }}</span>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-inline">
                    <div class="form-group form-group-margin">
                        <label class="titleNameSize">出货仓库&nbsp;&nbsp;&nbsp;</label>
                        <span>{{ getBill.wareHouseId }}</span>
                    </div>
                    <div class="form-group form-group-margin">
                        <label class="titleNameSize">销售员&nbsp;&nbsp;&nbsp;</label>
                        <span>{{ getBill.salesmanId }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!--关联置换单-->
        <div class="row">
            <fieldset v-if="hasExchangeBill || getHasExchangeBill">
                <legend>关联置换单</legend>
                <div class="form-inline">
                    <div class="form-group form-group-margin">
                        <label style="padding:15px;">单据编号</label>
                        <span>{{getExchangeBill.billNumber}}</span>
                    </div>
                    <TableCpn
                        :heads="[
                        {propName:'metalId',name:'金属'},
                        {propName:'priceType',name:'计价方式'},
                        {propName:'roughWeight',name:'毛重'},
                        {propName:'depreciationRate',name:'折旧率'},
                        {propName:'netWeight',name:'净重'},
                        {propName:'processingCharges',name:'工费'},
                        {propName:'metalPrice',name:'金价'},
                        {propName:'originalPrice',name:'原价金额'},
                        {propName:'forfeit',name:'其他扣除'},
                        {propName:'totalCost',name:'实付金额'}
                    ]"
                        :items="getExchangeBillItems">
                    </TableCpn>
                </div>
            </fieldset>
        </div>
        <div v-if="getBillType === 'RETAIL_OUT'">
            <!--零售单-->
            <TableCpn :heads="[
              {propName:'serial',name:'条码'},
              {propName:'categoryId',name:'品类'},
              {propName:'gemId',name:'宝石'},
              {propName:'metalId',name:'金属'},
              {propName:'priceType',name:'计价方式'},
              {propName:'weight',name:'总质量'},
              {propName:'computedProcessingCharges',name:'工费'},
              {propName:'metalPrice',name:'金价'},
              {propName:'retailPrice',name:'原价金额'},
              {propName:'discountRate',name:'折扣比例'},
              {propName:'extraDiscount',name:'其他优惠'},
              {propName:'totalCost',name:'实收金额'},
          ]" :items="getItems">
            </TableCpn>
        </div>
        <div v-else-if="getBillType === 'RECYCLE_IN'">
            <!--回收单-->
            <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>金属</th>
                    <th>计价方式</th>
                    <th>毛重</th>
                    <th>折旧率</th>
                    <th>净重</th>
                    <th>工费（元/克）</th>
                    <th>金价（元/克）</th>
                    <th>其他扣除</th>
                    <th>回收金额</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in getItems">
                    <td class="table-bordered">{{ index + 1 }}</td>
                    <td class="table-bordered">{{item.metalId}}</td>
                    <td class="table-bordered">{{item.priceType}}</td>
                    <td class="table-bordered">{{item.roughWeight}}</td>
                    <td class="table-bordered">
                        {{item.netWeight / item.roughWeight ? item.netWeight / item.roughWeight : 0}}
                    </td>
                    <td class="table-bordered">{{item.netWeight}}</td>
                    <td class="table-bordered">{{item.processingCharges}}</td>
                    <td class="table-bordered">{{item.metalPrice}}</td>
                    <td class="table-bordered">{{item.forfeit}}</td>
                    <td class="table-bordered">{{item.totalCost}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="getBillType === 'RETAIL_REJECT'">
            <!--退货单-->
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
                        {propName:'refundCost',name:'退款金额'}
                    ]"
                :items="getItems">
            </TableCpn>
        </div>

        <div class="row" style="margin-top: 10px">
            <div class="col-md-3" v-if="getBillType === 'RETAIL_OUT'">
                <label class="titleNameSize">原价金额&nbsp;&nbsp;&nbsp;</label>
                <span>{{ getBill.originalCost}}</span>
            </div>
            <div class="col-md-3" v-if="getBillType === 'RETAIL_OUT'">
                <label class="titleNameSize">减免金额&nbsp;&nbsp;&nbsp;</label>
                <span>{{ getBill.discountCost }}</span>
            </div>
            <div class="col-md-3">
                <label class="titleNameSize">{{payMoneyText}}&nbsp;&nbsp;&nbsp;</label>
                <span>{{ lastPrice}}</span>
            </div>
        </div>

        <fieldset style="padding-left: 20px">
            <legend>{{getBillType === 'RETAIL_OUT' ? '实收' : '实付'}}</legend>
            <!--<form class="form-inline" style="margin-top: 20px">-->
            <!--<div class="form-group form-group-margin">-->
            <!--<label class="titleNameSize">黄金&nbsp;&nbsp;&nbsp;</label>-->
            <!--<input class="form-control" style="max-width: 60px"/>mg-->
            <!--</div>-->
            <!--<div class="form-group form-group-margin">-->
            <!--<span v-if="getCanChange">xxx元/g</span>-->
            <!--<span v-else>{{ getPaymentBillDetail.realTimeGoldPrice }}元/g</span>-->
            <!--</div>-->
            <!--<div class="form-group form-group-margin">-->
            <!--<span v-if="getCanChange">xxx元</span>-->
            <!--<span v-else>{{ getPaymentBillDetail.paymentOfGold }}</span>-->
            <!--</div>-->
            <!--</form>-->
            <!--<form class="form-inline" style="margin-top: 20px">-->
            <!--<div class="form-group form-group-margin">-->
            <!--<label class="titleNameSize">钱包账户&nbsp;&nbsp;&nbsp;</label>-->
            <!--<input class="form-control" style="max-width: 60px" v-model="walletPay"-->
            <!--:value="getPaymentBillDetail.paymentOfWallet"/>-->
            <!--</div>-->
            <!--</form>-->
            <form class="form-inline" style="margin-top: 20px" v-if="getCanChange">
                <div class="form-group form-group-margin">
                    <div class="input-group">
                        <span class="input-group-addon font-bold">现金</span>
                        <input type="text" name="paymentOfCash" class="form-control normal posCashierInput text-navy"
                               style="max-width: 100px" v-model="cashPay">
                        <span class="input-group-btn">
                        <button type="button" class="btn btn-white h40 all" @click="clickSetPayPrice('cashPay')">
                        <i class="fa fa-align-left"></i>
                        </button>
                    </span>
                    </div>
                </div>
                <div class="form-group form-group-margin">
                    <div class="input-group">
                        <span class="input-group-addon font-bold">POS</span>
                        <input type="text" name="paymentOfCash" class="form-control normal posCashierInput text-navy"
                               style="max-width: 100px" v-model="posPay">
                        <span class="input-group-btn">
                        <button type="button" class="btn btn-white h40 all" @click="clickSetPayPrice('posPay')">
                        <i class="fa fa-align-left"></i>
                        </button>
                    </span>
                    </div>
                </div>
                <div class="form-group form-group-margin">
                    <div class="input-group">
                        <span class="input-group-addon font-bold">支付宝</span>
                        <input type="text" name="paymentOfCash" class="form-control normal posCashierInput text-navy"
                               style="max-width: 100px" v-model="aliPay">
                        <span class="input-group-btn">
                        <button type="button" class="btn btn-white h40 all" @click="clickSetPayPrice('aliPay')">
                        <i class="fa fa-align-left"></i>
                        </button>
                    </span>
                    </div>
                </div>
                <div class="form-group form-group-margin">
                    <div class="input-group">
                        <span class="input-group-addon font-bold">微信</span>
                        <input type="text" name="paymentOfCash" class="form-control normal posCashierInput text-navy"
                               style="max-width: 100px" v-model="wxPay">
                        <span class="input-group-btn">
                        <button type="button" class="btn btn-white h40 all" @click="clickSetPayPrice('wxPay')">
                        <i class="fa fa-align-left"></i>
                        </button>
                    </span>
                    </div>
                </div>
            </form>

            <form class="form-inline" style="margin-top: 20px" v-else>
                <div class="form-group form-group-margin">
                    <div class="input-group">
                        <span class="input-group-addon font-bold">现金</span>
                        <input type="text" name="paymentOfCash" class="form-control normal posCashierInput text-navy"
                               style="max-width: 100px" disabled :value="getPaymentBillDetail.paymentOfCash">
                        <span class="input-group-btn">
                        <button type="button" class="btn btn-white h40 all" disabled>
                        <i class="fa fa-align-left"></i>
                        </button>
                    </span>
                    </div>
                </div>
                <div class="form-group form-group-margin">
                    <div class="input-group">
                        <span class="input-group-addon font-bold">POS</span>
                        <input type="text" name="paymentOfCash" class="form-control normal posCashierInput text-navy"
                               style="max-width: 100px" disabled :value="getPaymentBillDetail.paymentOfPos">
                        <span class="input-group-btn">
                        <button type="button" class="btn btn-white h40 all" disabled>
                        <i class="fa fa-align-left"></i>
                        </button>
                    </span>
                    </div>
                </div>
                <div class="form-group form-group-margin">
                    <div class="input-group">
                        <span class="input-group-addon font-bold">支付宝</span>
                        <input type="text" name="paymentOfCash" class="form-control normal posCashierInput text-navy"
                               style="max-width: 100px" disabled :value="getPaymentBillDetail.paymentOfAlipay">
                        <span class="input-group-btn">
                        <button type="button" class="btn btn-white h40 all" disabled>
                        <i class="fa fa-align-left"></i>
                        </button>
                    </span>
                    </div>
                </div>
                <div class="form-group form-group-margin">
                    <div class="input-group">
                        <span class="input-group-addon font-bold">微信</span>
                        <input type="text" name="paymentOfCash" class="form-control normal posCashierInput text-navy"
                               style="max-width: 100px" disabled :value="getPaymentBillDetail.paymentOfWeixin">
                        <span class="input-group-btn">
                        <button type="button" class="btn btn-white h40 all" disabled>
                        <i class="fa fa-align-left"></i>
                        </button>
                    </span>
                    </div>
                </div>
            </form>
        </fieldset>
        <div class="modal-footer">
            <slot name="btn"></slot>
            <button v-if="getCanChange" type="button" class="btn btn-primary" data-dismiss="modal"
                    @click="clickSavePaymentBill">
                保存并打印
            </button>
            <button v-else type="button" style="margin: 10px" class="btn btn-sm btn-primary" data-dismiss="modal"
                    @click="print(getAllBill)">
                打印票据
            </button>
            <button type="button" class="btn btn-success" @click="back">返回并关闭</button>
        </div>
        <script>
            window.requireFFI = window.require;
        </script>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import TableCpn from '~/components/Table'
    import PaymentBillMain from '~/components/retail/offlineRetail/PaymentBillMain'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import PrintTemplate from '~/components/storage/stock/PrintTemplate'
    import {ChangeTabEvent} from '~/components/ChangeTabEvent'
    import uuid from 'uuid'

    /**
     * 获取lodop打印服务
     */
    function loadLodop() {
        var ele = document.createElement('script');
        ele.src = 'http://127.0.0.1:8000/CLodopfuncs.js';
        if (window.LODOP != null) {
            return window.LODOP;
        } else {
            window.LODOP = false;
        }
        var ajax = new XMLHttpRequest();
        ajax.open('get', 'http://127.0.0.1:8000/CLodopfuncs.js');
        ajax.setRequestHeader('dataType', 'script')
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                console.log('================')
                // console.log(ajax.response)
                eval(ajax.response)
                console.log(window.LODOP)
                window.LODOP.SET_LICENSES('成都泰林科贸有限公司', '649686669748688748719056235623', '', '');
            } else {
                window.LODOP = null;
            }
        }
        ajax.send()
        console.log('dddddddd')
        console.log(window.LODOP)
        return window.LODOP;
    }

    function printRetailPay(allBill) {
        var printerIndex = 0;
        var lodop = loadLodop()
        var dot = requireFFI('dot')
        var fs = requireFFI('fs');
        fs.readFile('printModel.txt', 'utf-8', function (err, data) {
            if (err) {
                console.error(err);
            }
            else {
                console.log(data);
                var tpl = dot.template(data), htpl = tpl(allBill);

                lodop.PRINT_INIT(new Date().getTime() + '');
                lodop.SET_PRINTER_INDEX(printerIndex);
                lodop.SET_PRINT_PAGESIZE(1, '215mm', '93mm', '');

                var top = '8.3mm'
                var left = '15mm'
                var width = '180mm'
                var height = '100%';
                lodop.ADD_PRINT_HTM(top, left, width, height, htpl);
                lodop.PRINT();
                console.log('sss')
            }
        });


    }

    export default {
        components: {
            TableCpn,
            ButtonWithModal,
            PrintTemplate
        },
        props: ['passed'],
        data() {
            return {
                billNumber$: '',
                hasExchangeBill: false,
                walletPay: 0,
                cashPay: 0,
                posPay: 0,
                aliPay: 0,
                wxPay: 0,
                CONST_CLOSE_MODAL: uuid()
            }
        },
        watch: {
            cashPay(newValue, oldValue) {
                if (newValue === this.lastPrice) {
                    this.posPay = 0
                    this.aliPay = 0
                    this.wxPay = 0
                }
            },
            posPay(newValue, oldValue) {
                if (newValue === this.lastPrice) {
                    this.cashPay = 0
                    this.aliPay = 0
                    this.wxPay = 0
                }
            },
            aliPay(newValue, oldValue) {
                if (newValue === this.lastPrice) {
                    this.posPay = 0
                    this.cashPay = 0
                    this.wxPay = 0
                }
            },
            wxPay(newValue, oldValue) {
                if (newValue === this.lastPrice) {
                    this.posPay = 0
                    this.aliPay = 0
                    this.cashPay = 0
                }
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/paymentBillAdd', {
                getCanChange: 'getCanChange',
                getUserInfo: 'getUserInfo',
                getBill: 'getBill',
                getBillType: 'getBillType',
                getItems: 'getItems',
                getExchangeBillItems: 'getExchangeBillItems',
                getExchangeBill: 'getExchangeBill',
                getPaymentBillDetail: 'getPaymentBillDetail',
                getAllBill: 'getAllBill',
                getHasExchangeBill: 'getHasExchangeBill'
            }),
            payMoneyText() {
                switch (this.getBillType) {
                    case 'RETAIL_OUT' :
                        return '应收金额'
                    case 'RETAIL_REJECT' :
                        return '退款金额'
                    case 'RECYCLE_IN' :
                        return '回收金额'
                }
            },
            lastPrice() {
                switch (this.getBillType) {
                    case 'RETAIL_OUT' :
                        return this.getBill.totalCost
                    case 'RETAIL_REJECT' :
                        return this.getBill.refundCost
                    case 'RECYCLE_IN' :
                        return this.getBill.totalCost
                }
            }
        },
        methods: {
            ...mapMutations('retail/offlineRetail/paymentBillAdd', {
                clearData: 'clearData',
                resetCanChange: 'resetCanChange'
            }),
            ...mapActions('retail/offlineRetail/paymentBillAdd', {
                apiGetToPay: 'apiGetToPay',
                apiAddPaymentBill: 'apiAddPaymentBill'
            }),
            // 打印标签
            print(allBill) {
                console.log('打印标签ing:', allBill)
                // 获取打印参数
                var printBill = allBill
                var isProcess = 0
                var isMetailPrice = 0
                var isAmount = 0
                var isMainGem = 0
                var isColor = 0
                var isPure = 0
                var isCert = 0
                var isBargain = 0
                allBill.tranItems.map((item, index) => {
                    if (item.processingCharges > 0) {
                        isProcess += 1
                    }
                    if (item.priceType === '按重计算') {
                        isMetailPrice += 1
                    }
                    if (item.amount > 1) {
                        isAmount += 1
                    }
                    if (item.mainGemAmount > 0 || item.mainGemWeight > 0) {
                        isMainGem += 1
                    }
                    if (item.props) {
                        item.props.forEach((prop) => {
                            if (prop.fieldName === '色级' && prop.fieldValue.length > 0) {
                                isColor += 1
                            }
                            if (prop.fieldName === '净度' && prop.fieldValue.length > 0) {
                                isPure += 1
                            }
                            if (prop.fieldName === '证书' && prop.fieldValue.length > 0) {
                                isCert += 1
                            }
                        })
                    }
                    if (item.bargainPrice) {
                        isBargain += 1
                    }
                    return item
                })
                printBill['isProcess'] = isProcess
                printBill['isMetailPrice'] = isMetailPrice
                printBill['isAmount'] = isAmount
                printBill['isMainGem'] = isMainGem
                printBill['isColor'] = isColor
                printBill['isPure'] = isPure
                printBill['isCert'] = isCert
                printBill['isBargain'] = isBargain
                printBill.tranItems.map((item, index) => {
                    if (item.props) {
                        item.props.forEach((prop) => {
                            if (isColor > 0 && prop.fieldName === '色级') {
                                item['propColor'] = prop.fieldValue
                            }
                            if (isPure > 0 && prop.fieldName === '净度') {
                                item['propPure'] = prop.fieldValue
                            }
                            if (isCert > 0 && prop.fieldName === '证书') {
                                item['propCert'] = prop.fieldValue
                            }
                        })
                    }
                    return item
                })
                console.log('-----------------')
                console.log(printBill)
                printRetailPay(printBill)
            },
            clickSearchBill() {
                this.apiGetToPay({
                    params: {
                        billNumber: this.billNumber$
                    },
                    callback: (data) => {
                        if (data.result.tranBill.exchangeBillId) { // 销售单如果关联了置换单
                            this.hasExchangeBill = true
                        }
                        this.resetCanChange(true)
                    }
                })
            },
            clickSetPayPrice(type) {
                this[type] = this.lastPrice
            },
            clickSavePaymentBill() {
                this.apiAddPaymentBill({
                    params: {
                        tranType: this.getBillType,
                        tranId: this.getBill.id,
                        paymentOfCash: this.cashPay,
                        paymentOfPos: this.posPay,
                        paymentOfWeixin: this.wxPay,
                        weixinPayCode: '',
                        paymentOfAlipay: this.aliPay,
                        alipayPayCode: '',
                        paymentOfWallet: '',
                        paymentOfGold: '',
                        realTimeGoldPrice: '',
                        realTimeGoldPriceId: '',
                        usageOfGold: '',
                        paymentOfCoupon: '',
                        couponId: '',
                        cashOddChange: ''
                    },
                    callback: () => {
                        this.back()
                    }
                })
            },
            back() {
                this.initData()
                this.passed.changeCurrCpn(PaymentBillMain)
            },
            initData() {
                this.billNumber$ = ''
                this.cashPay = 0
                this.posPay = 0
                this.aliPay = 0
                this.wxPay = 0
                this.clearData()
                this.resetCanChange(true)
            }
        },
        mounted() {
            // 当第一次从其他页面点击按钮进入时 因为$on还未执行 所以手动执行一次 查询其他页面需要的收银信息
            if (this.passed.isFirst && this.passed.billId) {
                this.initData()
                this.billNumber$ = this.passed.billId
                this.clickSearchBill()
                this.passed.isFirst = false
            }
            // 监听其他页面点击按钮进入 新增收银页面 并查询其他页面需要的收银信息
            console.log('@@@ PaymentBillAdd mounted');
            ChangeTabEvent.$off('JUMP_TO_PAYMENT_ADD_SEARCH')
            ChangeTabEvent.$on('JUMP_TO_PAYMENT_ADD_SEARCH', (billId) => {
                console.log('跳转收银，JUMP_TO_PAYMENT_ADD_SEARCH', billId)
                this.initData()
                this.billNumber$ = billId
                this.clickSearchBill()
            })
            loadLodop()
        },
        beforeMount() {
            if (!this.getCanChange) {
                this.walletPay = this.getPaymentBillDetail.paymentOfWallet
                this.cashPay = this.getPaymentBillDetail.paymentOfCash
                this.posPay = this.getPaymentBillDetail.paymentOfPos
                this.aliPay = this.getPaymentBillDetail.paymentOfAlipay
                this.wxPay = this.getPaymentBillDetail.paymentOfWeixin
            }
        }
    }
</script>
