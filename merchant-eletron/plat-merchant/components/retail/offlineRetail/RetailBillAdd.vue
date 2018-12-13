<template>
    <div>
        <fieldset v-if="getCanChange">
            <legend>客户信息</legend>
            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <label style="padding:15px;">客户手机号</label>
                    <input type="text" class="form-control" style="display: inline-block; max-width: 150px"
                           v-model="telephone$" @keyup.enter="clickSearchUser">
                    <button class="btn btn-info" style="margin: 0 10px 3px" @click="clickSearchUser">搜索</button>
                </div>
            </div>
            <div v-show="showUserIsMember" class="form-inline" style="margin-bottom: 15px">
                <label class="label label-default m-l-xs" style="margin: 15px">客户昵称：{{ getUserInfo.nickName }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">手机号码：{{ getUserInfo.telephone }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">注册日期：{{ getUserInfo.createTime }}</label>
            </div>
            <div v-show="showUserCreateMember" class="form-inline">
                <label style="padding:15px;"><i class="fa fa-star text-danger">新客户档案</i></label>
                <label style="padding:15px;">姓名</label>
                <input v-model="nickName$" type="text" class="form-control"
                       style="display: inline-block; max-width: 150px">
                <label style="padding:15px;">性别</label>
                <select class="form-control" v-model="gender$">
                    <option value="FEMALE">女</option>
                    <option value="MALE">男</option>
                </select>
            </div>
        </fieldset>
        <div v-else-if="getUserInfo.telephone">
            <fieldset style="padding: 10px">
                <legend>客户资料</legend>
                <label class="label label-default m-l-xs" style="margin: 15px">客户昵称：{{ getUserInfo.nickName }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">性别：{{ getUserInfo.gender }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">手机号码：{{ getUserInfo.telephone }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">注册日期：{{ getUserInfo.createTime}}</label>
            </fieldset>
        </div>

        <fieldset v-if="getCanChange">
            <legend>关联单据</legend>
            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <label style="padding:15px;">单据编号</label>
                    <input v-model="exchangeBillNumber" type="text" class="form-control" @keyup.enter="clickGetExchangeBill"
                           style="display: inline-block; max-width: 150px">
                    <button class="btn btn-info" style="margin: 0 10px 3px" @click="clickGetExchangeBill">关联</button>
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
                    :items="getExchangeBill.tranItems">

                </TableCpn>
            </div>
        </fieldset>

        <div v-if="getCanChange" class="row" style="margin-top: 15px;margin-left: 4px">
            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <label>出货仓库</label>
                    <select v-model="wareHouseId$" class="form-control" style="margin-left: 15px" :disabled="getWareItems.length>=1">
                        <option v-for="wareHouse in wareHouses" :value="wareHouse.id">{{ wareHouse.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <input v-model="serial$" type="text" class="form-control" ref="serial" @focus="selectSerial"
                           style="display: inline-block; max-width: 200px" placeholder="扫描、输入商品条码" @keyup.enter="clickSearchWare">
                    <button class="btn btn-info" style="margin: 0 10px 3px" @click="clickSearchWare">搜索</button>
                </div>
                <div class="form-group form-group-margin" v-for="person in staffArr">
                    <label>销售员</label>
                    <select v-model="person.staffId" class="form-control" style="margin-left: 15px">
                        <option v-for="staff in staffs" :value="staff.id">{{ staff.nickName }}
                        </option>
                    </select>
                </div>
                <i class="fa fa-plus" style="color: green; cursor: pointer;" @click="clickPlus"></i>
            </div>
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

        <fieldset v-if="getHasExchangeBill">
            <legend>关联单据编号：{{getExchangeBillByDetail.billNumber}}</legend>
            <div class="form-inline">
                <TableCpn
                    :heads="[
                        {propName:'metalName',name:'金属'},
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

        <TableCpn
            :heads="[
                {propName:'serial',name:'条码'},
                {name:'数量',tag:'INPUT4'},
                {propName:'categoryName',name:'品类'},
                {propName:'gemName',name:'宝石'},
                {propName:'metalName',name:'金属'},
                {propName:'priceType',name:'计价方式'},
                {propName:'weight',name:'总质量'},
                {propName:'computedProcessingCharges',name:'工费'},
                {propName:'metalPrice',name:'金价'},
                {propName:'regularPrice',name:'原价金额'},
                {propName:'retailPrice',name:'零售金额'},
                {name:'折扣比例',tag:'INPUT1'},
                {name:'其他优惠',tag:'INPUT2'},
                {name:'实收金额',tag:'INPUT3'},
                {name:'操作',tag:'BUTTON'}
            ]"
            :items="getWareItems"
        >
            <input v-for="(item,index) in getWareItems" v-if="getCanChange && item.skuType === 'MULTI'"
                   :slot="'INPUT4'+index" class="form-control"
                   type="text" :value="item.amount" style="max-width: 60px;height: 28px;"
                   @blur="reCountPrice('amount',item, index)"/>
            <span v-else :slot="'INPUT4'+index">{{item.amount}}</span>
            <input v-for="(item,index) in getWareItems" v-if="getCanChange" :slot="'INPUT1'+index" class="form-control"
                   type="text" :value="item.ratio" style="max-width: 60px;height: 28px;"
                   @blur="reCountPrice('ratio',item, index)"/>
            <span v-else :slot="'INPUT1'+index">{{item.discountRate}}</span>
            <input v-for="(item,index) in getWareItems" v-if="getCanChange" :slot="'INPUT2'+index" class="form-control"
                   type="text" :value="item.youhui" style="max-width: 60px;height: 28px;"
                   @blur="reCountPrice('youhui',item)"/>
            <span v-else :slot="'INPUT2'+index">{{item.extraDiscount}}</span>
            <input v-for="(item,index) in getWareItems" v-if="getCanChange" :slot="'INPUT3'+index" class="form-control"
                   type="text" :value="item.price" style="max-width: 60px;height: 28px;"
                   @blur="reCountPrice('price',item)"/>
            <span v-else :slot="'INPUT3'+index">{{item.totalCost}}</span>
            <button v-for="(item,index) in getWareItems" v-if="getCanChange" :slot="'BUTTON'+index"
                    class="btn btn-sm btn-default" @click="clickDelete(index)">
                删除
            </button>
            <div v-for="(item,index) in getWareItems" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-default btn-sm'],
                                btnName: '备注'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'remark'+index,
                                titleName: '备注'
                            }">
                    <InputRemark slot="main"
                                 :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                 :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'remark'+index"
                                 :item="item"
                                 :getCanChange="getCanChange"
                    >
                    </InputRemark>
                </ButtonWithModal>
            </div>
        </TableCpn>
        <div class="row" v-if="getCanChange">
            <label class="col-md-2">零售金额：{{getTotalPrice.totalRetailPrice}}</label>
            <label class="col-md-2">减免金额：{{getTotalPrice.totalDiscountPrice}}</label>
            <label class="col-md-2">实收金额：{{getTotalPrice.totalActualPrice}}</label>
        </div>
        <div class="row" v-else>
            <label class="col-md-2">零售金额：{{passed.wareBill.originalCost}}</label>
            <label class="col-md-2">减免金额：{{passed.wareBill.discountCost}}</label>
            <label class="col-md-2">实收金额：{{passed.wareBill.totalCost}}</label>
        </div>

        <div class="row" style="margin-bottom: 20px">
            <div class="col-md-12" style="text-align: right">
                <span v-if="getCanChange">
                    <button type="button" class="btn btn-success" @click="clickAddRetailBill">保存并提交</button>
                    <button type="button" style="margin: 10px" class="btn btn-primary"
                            @click="jump2payment">前往收银</button>
                </span>
                <span v-else>
                    <button type="button" style="margin: 10px" class="btn btn-success" data-dismiss="modal"
                            @click="print(passed.wareBill,getWareItems)">打印票据</button>
                    <button v-if="passed.wareBill.paid === '未付款'" type="button" style="margin-right: 10px"
                            class="btn btn-primary"
                            @click="jump2paymentByDetail">前往收银</button>
                </span>
                <span>
                    <button type="button" class="btn btn-default" @click="back">返回</button>
                </span>
            </div>
        </div>
        <script>
            window.requireFFI = window.require;
        </script>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex'
    import { baseUtil, dateUtil, numberUtil } from '~/util'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import InputRemark from '~/components/retail/offlineRetail/InputRemark'
    import uuid from 'uuid'
    import TableCpn from '~/components/Table'
    import RetailBillMain from '~/components/retail/offlineRetail/RetailBillMain'
    import PrintTemplate from '~/components/storage/stock/PrintTemplate'
    import { ChangeTabEvent } from '~/components/ChangeTabEvent'
    function TEcoding(str) {
        var iconv = require('iconv-lite')
        return iconv.encode(Buffer.from(str), 'gbk')
    }

    export default {
        props: ['passed'],
        components: {
            TableCpn,
            ButtonWithModal,
            InputRemark,
            PrintTemplate
        },
        data() {
            return {
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                showUserIsMember: false,
                showUserCreateMember: false,
                showExchange: false,
                telephone$: '',
                serial$: '',
                wareHouseId$: '',
                staffId$: '',
                nickName$: '',
                gender$: '',
                exchangeBillId$: '',
                exchangeBillNumber: '',
                staffArr: [{
                    id: 0,
                    staffId: ''
                }],
                wareHouses: [],
                staffs: []
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/retailBillAdd', {
                getCanChange: 'getCanChange',
                getUserInfo: 'getUserInfo',
                getWareItems: 'getWareItems',
                getTotalPrice: 'getTotalPrice',
                getExchangeBill: 'getExchangeBill'
            }),
            ...mapGetters('retail/offlineRetail/retailBillMain', {
                getHasExchangeBill: 'getHasExchangeBill',
                getExchangeBillItems: 'getExchangeBillItems',
                getExchangeBillByDetail: 'getExchangeBill'
            }),
            ...mapGetters('retail/offlineRetail/retailBill', {
                getBillNumber: 'getBillNumber'
            })
        },
        methods: {
            ...mapMutations('retail/offlineRetail/retailBillAdd', {
                deleteWareItem: 'deleteWareItem',
                clearWareItems: 'clearWareItems',
                resetExchangeBill: 'resetExchangeBill',
                resetWareItems: 'resetWareItems'
            }),
            ...mapMutations('retail/offlineRetail/retailBill', {
                resetIsFromExchange: 'resetIsFromExchange'
            }),
            ...mapActions('retail/offlineRetail/retailBillAdd', {
                apiGetUser: 'apiGetUser',
                apiGetWareBySerial: 'apiGetWareBySerial',
                apiGetMetalPrice: 'apiGetMetalPrice',
                apiAddRetailBill: 'apiAddRetailBill',
                apiGetExchangeBillToBind: 'apiGetExchangeBillToBind'
            }),
            // 打印标签
            print (wareBill, item) {
                console.log('-------------------')
                console.log(wareBill)
                // this.getTotalPrice.totalRetailPrice
                console.log('打印标签ing:', item)
                // 打印标签
                let templates = baseUtil.getTemplates()
                let printTemplateChecked = ''
                if (wareBill.exchangeCost && wareBill.exchangeCost > 0) {
                    printTemplateChecked = 'RETAIL_EXCHANGED'
                } else {
                    printTemplateChecked = 'RETAIL_NORMAL'
                }
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
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('门店'), TEcoding('门店：' + wareBill.storeId));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('柜组'), TEcoding('柜组：' + wareBill.wareHouseId));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('单号'), TEcoding('单号：' + wareBill.billNumber));
                    var totalHeight = 0;
                    item.map((subItem) => {
                        totalHeight += subItem.weight
                    })
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('合计'), TEcoding('合计：共' + item.length + '件， 重量：' + totalHeight.toString() + item[0].weightUnit));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('原价金额'), TEcoding('原价金额：' + wareBill.originalCost));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('优惠金额'), TEcoding('优惠金额：' + wareBill.discountCost));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('兑换金额'), TEcoding('兑换金额：' + wareBill.exchangeCost));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('实收金额'), TEcoding('实收金额：' + wareBill.totalCost));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('单号条码'), TEcoding(wareBill.billNumber));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('营业员'), TEcoding('营业员：' + wareBill.salesmanName));
                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('日期'), TEcoding('日期：' + dateUtil.pattern(new Date(), 'yyyy-MM-dd HH:mm:ss')));
                    var fff = DLL.TLXOutputLabel(buffer.readInt32LE(0), 1, 0)
                    console.log(fff)
                    // var fff =  DLL.TLXOutputDocument(1, 1, 1, 0)`
                    var out = DLL.TLXCloseDocument(buffer.readInt32LE(0))
                } else {
                    alert('未能成功匹配模板，请上传相应的打印模板')
                }
            },
            jump2payment() {
                this.apiAddRetailBill({
                    params: {
                        wareHouseId: this.wareHouseId$ || '',
                        salesmanId: this.splitStaff(),
                        customerId: '',
                        telephone: this.telephone$ || '',
                        nickName: this.nickName$ || '',
                        gender: this.gender$ || '',
                        exchangeBillId: this.exchangeBillId$ || '',
                        itemsJson: this.getSpellItemsJson()
                    },
                    callback: (data) => {
                        ChangeTabEvent.$emit('JUMP_TO_PAYMENT', data.result.billNumber)
                    }
                })
            },
            jump2paymentByDetail() {
                console.log('跳转收银');
                ChangeTabEvent.$emit('JUMP_TO_PAYMENT', this.passed.wareBill.billNumber)
            },
            clickSearchUser() {
                this.apiGetUser({
                    params: {
                        telephone: this.telephone$
                    },
                    callback: (data) => {
                        console.log(data)
                        if (data.status === 200) {
                            this.showUserIsMember = true
                            this.showUserCreateMember = false
                            this.nickName$ = data.result.nickName
                            this.gender$ = data.result.gender
                        } else {
                            this.showUserIsMember = false
                            this.showUserCreateMember = true
                        }
                    }
                })
            },
            clickSearchWare() {
                if (this.serial$ === '' || this.wareHouseId$ === '') {
                    alert('请扫描、输入商品条码')
                    return
                }
                if (this.getWareItems.find(item => item.serial === this.serial$)) {
                    alert('该条码已经存在')
                    return
                }
                this.apiGetWareBySerial({
                    params: {
                        wareHouseId: this.wareHouseId$,
                        serial: this.serial$
                    },
                    callback: (data) => {
                    }
                })
                this.$refs.serial.select()
            },
            selectSerial() {
                this.$refs.serial.select()
            },
            clickDelete(index) {
                this.deleteWareItem(index)
            },
            delLastCommaInStr(str) {
                if (/,$/.test(str)) {
                    str = str.substring(0, str.length - 1)
                    return this.delLastCommaInStr(str)
                } else {
                    return str
                }
            },
            splitStaff() {
//                let staffIds = []
//                this.staffArr.forEach((item) => {
//                    staffIds.push(item.staffId);
//                })
//                return this.delLastCommaInStr(staffIds.join())
                return this.staffArr.map(item => item.staffId).filter(ele => ele)
            },
            clickAddRetailBill() {
                this.apiAddRetailBill({
                    params: {
                        wareHouseId: this.wareHouseId$ || '',
                        salesmanId: this.splitStaff(),
                        customerId: '',
                        telephone: this.telephone$ || '',
                        nickName: this.nickName$ || '',
                        gender: this.gender$ || '',
                        exchangeBillId: this.exchangeBillId$ || '',
                        itemsJson: this.getSpellItemsJson()
                    },
                    callback: () => {
                        this.back()
                    }
                })
            },
            back() {
                this.clearWareItems()
                this.passed.changeCurrCpn(RetailBillMain)
            },
            reCountPrice(name, item, index) {
                let value = numberUtil.toKeepTwoPlacesOfDecimalAndRound(parseFloat(event.target.value))
                if (name === 'ratio' && (value > 10 || value < 0)) {
                    alert('折扣比例在0-10之间');
                    return
                }
                console.log('value', value, item.originAmount);
                if (name === 'amount' && (value > item.originAmount || value < 0)) {
                    alert('数量有误,可选范围：0-' + item.originAmount);
                    return
                }
                if (!value) {
                    value = 0
                }
                this.resetWareItems({value, name, item, index})
            },
            getSpellItemsJson() {
                let itemsJson = []
                this.getWareItems.forEach(item => {
                    itemsJson.push({
                        amount: item.amount,
                        discountRate: item.ratio,
                        extraDiscount: item.youhui,
                        storageId: item.id,
                        totalCost: item.price,
                        remark: item.remark,
                        retailPrice: item.retailPrice,
                        regularPrice: item.regularPrice,
                        metalPrice: item.metalPrice || ''
                    })
                })
                return JSON.stringify(itemsJson)
            },
            clickGetExchangeBill() {
                if (this.exchangeBillNumber === '') {
                    alert('请填写单号')
                    return
                }
                this.apiGetExchangeBillToBind({
                    params: {
                        billNumber: this.exchangeBillNumber
                    },
                    callback: (data) => {
                        if (data.status === 200) {
                            this.exchangeBillId$ = data.result.tranBill.id
                        } else {
                            this.exchangeBillNumber = ''
                        }
                    }
                })
            },
            clickPlus() {
                let len = this.staffArr.length
                if (len < this.staffs.length) {
                    this.staffArr.push({
                        id: this.staffArr.length
                    })
                } else {
                    alert('销售人员数量不能超出店内员工数！')
                }
            },
            initData() {
                this.apiGetMetalPrice() // 重置所有金价
                this.wareHouseId$ = this.wareHouses[0].id
//                this.staffArr[0].staffId = this.staffs[0].id
                if (this.getCanChange) {
                    this.clearWareItems() // 重置所有收银单详情
                    this.resetExchangeBill({}) // 重置所有关联的置换单详情
                }
                this.telephone$ = '';
                this.serial$ = '';
            },
            initExchangeData() {
                if (this.getBillNumber) {
                    console.log('change', this.getBillNumber);
                    this.exchangeBillNumber = this.getBillNumber
                    this.clickGetExchangeBill()
                    this.resetIsFromExchange(false)
                }
            }
        },
        mounted() {
            this.staffs = baseUtil.getMetadataStaffByStoreId({atWork: true});
            this.wareHouses = baseUtil.getMetadataWareHouseByStoreId({enabled: true}).filter(item => !item.recycle)
            this.initData()
            this.initExchangeData()
        }
    }
</script>

<style>
    .retail-line-height {
        line-height: 34px;
    }
</style>
