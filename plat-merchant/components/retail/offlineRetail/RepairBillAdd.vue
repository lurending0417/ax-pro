<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <label class="titleNameSize">客户手机号&nbsp;&nbsp;&nbsp;</label>
                <input class="form-control" v-model="searchParams.telephone" @keyup.enter="enterToNext"/>
            </div>
            <div class="form-group form-group-margin">
                <label class="titleNameSize">收银单号&nbsp;&nbsp;&nbsp;</label>
                <input class="form-control" ref="payBillNumber" v-model="searchParams.payBillNumber" @keyup.enter="clickSearchPayment"/>
            </div>
            <div class="form-group form-group-margin">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="clickSearchPayment">
                    搜索
                </button>
            </div>
        </div>


        <fieldset style="padding: 10px">
            <legend>收银单查询信息</legend>
            <div v-for="(list,index) in paymentBillItems">
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
                        {propName:'categoryName',name:'品类'},
                        {propName:'gemName',name:'宝石'},
                        {propName:'metalName',name:'金属'},
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
                    <span v-for="(item,i) in list.items" :slot="'BUTTON'+i">
                        <ButtonWithModal
                            :btnProps="{
                                btnClasses: ['btn btn-sm btn-primary'],
                                btnName: '维修'
                            }"
                            :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'update'+item.id,
                                titleName: '维修',
                                modalClasses: ['modal-lg']
                            }">
                            <RepairDetailModal
                                slot="main"
                                :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'update'+item.id"
                                :list="list"
                                :item="item"
                                @getCurrentItem="getCurrentItem"
                                :searchParams="searchParams"
                            >
                            </RepairDetailModal>
                        </ButtonWithModal>
                    </span>
                </TableCpn>
            </div>
        </fieldset>

        <fieldset style="padding: 10px">
            <legend>维修商品</legend>
            <TableCpn
                :heads="[
                        {propName:'serial',name:'条码'},
                        {propName:'amount',name:'件数'},
                        {propName:'categoryName',name:'品类'},
                        {propName:'gemName',name:'宝石'},
                        {propName:'metalName',name:'金属'},
                        {propName:'repairDetail',name:'维修记录'}
                    ]"
                :items="repairRecords">
            </TableCpn>
        </fieldset>

        <div class="row" style="margin-bottom: 20px;margin-top: 20px">
            <div class="col-md-12" style="text-align: right">
                <span>
                    <button type="button" class="btn btn-primary" @click="add">保存并提交</button>
                </span>
                <span style="margin: 10px">
                    <button type="button" class="btn btn-default" @click="back">返回</button>
                </span>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import TableCpn from '~/components/Table'
    import {baseUtil, constUtil} from '~/util'
    import RepairBillMain from '~/components/retail/offlineRetail/RepairBillMain'
    import RepairDetailModal from '~/components/retail/offlineRetail/RepairDetailModal'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import uuid from 'uuid'

    export default {
        props: ['passed'],
        components: {
            TableCpn,
            ButtonWithModal,
            RepairDetailModal
        },
        data() {
            return {
                searchParams: {
                    telephone: '',
                    payBillNumber: ''
                },
                paymentBillItems: [],
                repairRecords: [],
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid()
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/rejectBillAdd', {
                getRejectWares: 'getRejectWares',
                getBill: 'getBill',
                getPaymentBills: 'getPaymentBills',
                getRejectDetailInfo: 'getRejectDetailInfo',
                getRejectWareHouse: 'getRejectWareHouse',
                getStaffs: 'getStaffs',
                getPayBillNumberObj: 'getPayBillNumberObj'
            })
        },
        methods: {
            ...mapActions('retail/offlineRetail/repairBillMain', {
                apiGetPaymentBill: 'apiGetPaymentBill',
                apiPostRepairBill: 'apiPostRepairBill'
            }),
            clickSearchPayment() {
                this.apiGetPaymentBill({
                    params: this.searchParams,
                    callback: (data) => {
                        let rows = data.rows.map((list) => {
                            list.items.map((item, index) => {
                                item.categoryName = baseUtil.getNameFromPropId('category', item.categoryId)
                                item.gemName = baseUtil.getNameFromPropId('gem', item.gemId)
                                item.metalName = baseUtil.getNameFromPropId('metal', item.metalId)
                                item.priceType && (item.priceType = constUtil._CONST_RETAIL_PRICE_TYPE.find(ele => ele.value === item.priceType).name)
                                item.weight && (item.weight = item.weight + item.weightUnit)
                                return item
                            })
                            return list
                        });
                        this.paymentBillItems = rows
                    }
                })
            },
            spellItemsJson() {
                // 拼装维修商品信息
                this.itemsJson$ = []
                this.repairRecords.forEach((item) => {
                    this.itemsJson$.push({
                        repairDetail: item.repairDetail,
                        retailItemId: item.id
                    })
                })
                return JSON.stringify(this.itemsJson$)
            },
            add() {
                if (this.repairRecords.length <= 0) {
                    alert('没有维修项')
                    return
                }
                this.apiPostRepairBill({
                    params: {
                        itemsJson: this.spellItemsJson()
                    },
                    callback: () => {
                        this.back()
                    }
                })
            },
            back() {
                this.passed.changeCurrCpn(RepairBillMain)
            },
            enterToNext() {
                this.$refs.payBillNumber.select()
            },
            initData() {
                // todo
            },
            getCurrentItem(repairItem) { // 获取当前某个商品的维修记录
                let isHas = false;
                this.repairRecords = this.repairRecords.map(item => {
                    if (item.id === repairItem.id) {
                        isHas = true
                        item = repairItem
                    }
                    return item
                })
                if (!isHas) {
                    this.repairRecords.push(repairItem);
                }
            }
        },
        mounted() {
        },
        beforeMount() {
            this.initData()
        }
    }
</script>

<style>

</style>
