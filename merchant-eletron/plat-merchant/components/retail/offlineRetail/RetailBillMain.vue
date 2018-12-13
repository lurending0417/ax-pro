<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="myDate5"
                            placeholder="起始日期"
                            v-model="form.startYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                    <span class="input-group-addon" style="display: inline-block">到</span>
                    <span>
                        <DatePicker
                            field="myDate6"
                            placeholder="结束日期"
                            v-model="form.endYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                </div>
            </div>
            <div class="form-group form-group-margin">
                <label class="titleNameSize">出货仓库</label>
                <select v-model="form.wareHouseId" class="form-control" style="margin-left: 15px">
                    <option value=""> 全部</option>
                    <option v-for="wareHouse in getWareHouse" :value="wareHouse.id">{{ wareHouse.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <label class="titleNameSize">付款状态</label>
                <select v-model="form.paid" class="form-control" style="margin-left: 15px">
                    <option value="">全部</option>
                    <option value="true">已付款</option>
                    <option value="false">未付款</option>
                </select>
            </div>

            <div class="form-group form-group-margin">
                <label class="titleNameSize">销售员工</label>
                <select v-model="form.salesmanId" class="form-control" style="margin-left: 15px">
                    <option value="">全部</option>
                    <option v-for="staff in getStaffs" :value="staff.id">{{ staff.nickName }}</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <input v-model="query" type="text" class="form-control" @keyup.enter="clickSearch()"
                       style="display: inline-block; max-width: 150px" ref="queryInput"
                       placeholder="单号">
                <button class="btn btn-info" style="margin: 0 10px 3px" @click="clickSearch()">搜索</button>
            </div>
            <div class="col-md-8" style="text-align: right">
                <button type="button" class="btn btn-danger" @click="add"><i
                    class="fa fa-plus-square">&nbsp;&nbsp;新增</i></button>
            </div>
        </div>
        <TableCpn
            :heads="[
                {propName:'billNumber',name:'零售单号'},
                {propName:'createTime',name:'创建时间'},
                {propName:'wareHouseId',name:'出货仓库'},
                {propName:'amount',name:'商品数量'},
                {propName:'totalCost',name:'金额', unit: '元'},
                {propName:'paid',name:'付款状态'},
                {propName:'salesmanName',name:'销售员工'},
                {name:'操作', tag:'BUTTON'}
            ]"
            :items="getRetailBills">
            <div v-for="(item,index) in getRetailBills" :slot="'BUTTON'+index">
                <button type="button" class="btn btn-sm btn-default" :value="item.id"
                        @click="clickDetailRetailBill(item)">详情
                </button>
                <button v-if="item.paid === '未付款'" type="button" :value="item.id" class="btn btn-sm btn-default"
                        @click="jump2payment(item.billNumber)">收银
                </button>

                <button v-if="item.paid === '未付款'" type="button" class="btn btn-sm btn-default" :value="item.id"
                        @click="clickDeleteRetailBill(item, index)">删除
                </button>
            </div>
        </TableCpn>
        <Pagination
            :total="total"
            :limit="20"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex'
    import RetailBillAdd from '~/components/retail/offlineRetail/RetailBillAdd'
    import TableCpn from '~/components/Table'
    import Pagination from '~/components/Pagination';
    import {PaginationEvent} from '~/components/PaginationEvent';
    import uuid from 'uuid'
    import DatePicker from '~/components/DatePicker'
    import {dateUtil, baseUtil} from '~/util'
    import {ChangeTabEvent} from '~/components/ChangeTabEvent'
    // import {TabsEvent} from '~/components/TabsEvent'

    export default {
        props: ['passed', 'changeWareBill'],
        components: {
            DatePicker,
            TableCpn,
            Pagination
        },
        data() {
            return {
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                getStaffs: [],
                getWareHouse: [],
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    wareHouseId: '',
                    paid: '',
                    salesmanId: ''
                },
                query: ''
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/retailBillMain', {
                getRetailBills: 'getRetailBills',
                total: 'getTotal'
            })
        },
        methods: {
            ...mapMutations('retail/offlineRetail/retailBillAdd', {
                resetCanChange: 'resetCanChange',
                resetAllWareItems: 'resetAllWareItems',
                resetUserInfo: 'resetUserInfo',
                resetExchangeBill: 'resetExchangeBill'
            }),
            ...mapMutations('retail/offlineRetail/retailBill', {
                resetBillNumber: 'resetBillNumber'
            }),
            ...mapMutations('retail/offlineRetail/retailBillMain', {
                resetExchangeBillByDetail: 'resetExchangeBill', // 通过点击详情按钮获取当前零售单和关联的置换单
                resetHasExchangeBill: 'resetHasExchangeBill',
                resetExchangeItems: 'resetExchangeItems'
            }),
            ...mapActions('retail/offlineRetail/retailBillMain', {
                apiGetRetailBill: 'apiGetRetailBill',
                apiDeleteRetailBill: 'apiDeleteRetailBill',
                apiGetRetailBillItem: 'apiGetRetailBillItem'
            }),
            jump2payment(billId) {
                // 跳转到收银页面，进行收银操作
                ChangeTabEvent.$emit('JUMP_TO_PAYMENT', billId)
            },
            add() {
                this.resetHasExchangeBill(false)
                this.resetCanChange(true)
                this.resetBillNumber('');
                this.passed.changeCurrCpn(RetailBillAdd)
            },
            clickDeleteRetailBill(item, index) {
                this.apiDeleteRetailBill({
                    params: {
                        billId: item.id
                    },
                    index,
                    callback: () => {
                    }
                })
            },
            clickDetailRetailBill(item) {
                this.apiGetRetailBillItem({
                    params: {
                        billId: item.id
                    },
                    callback: (data) => {
                        this.resetHasExchangeBill(false)
                        this.resetBillNumber('');
                        this.resetUserInfo({})
                        this.resetAllWareItems(data.result.retailItems) // 设置详情页面
                        if (data.result.exchangeBill) {
                            this.resetHasExchangeBill(true)
                            this.resetExchangeBillByDetail(data.result.exchangeBill)
                            this.resetExchangeItems(data.result.exchangeItems)
                        }
                        if (data.result.retailBill.customerId) {
                            this.resetUserInfo(data.result.retailBill.customer)
                        }
                        this.resetCanChange(false)
                        this.$emit('changeWareBill', item)
                        this.passed.changeCurrCpn(RetailBillAdd)
                    }
                })
            },
            registerPaginationEvent() {
                // PaginationEvent.$off(this.CONST_CHANGE_PAGE)
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    this.clickSearch(pager)
                })
            },
            clickSearch(page, initParams) {
                let params = {...this.form, limit: 20, start: 0, query: this.query}
                if (page) {
                    params.limit = page.limit
                    params.start = page.start
                }
                if (initParams) {
                    params = {...initParams}
                }
                this.apiGetRetailBill(params)
                this.$refs.queryInput.select()
            },
            initData() {
                this.form = {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    wareHouseId: '',
                    paid: '',
                    salesmanId: ''
                }
                this.query = ''
                this.getStaffs = baseUtil.getMetadataStaffs();
                this.getWareHouse = baseUtil.getMetadataWareHouseByStoreId();
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            this.initData();
            this.$on('retailBill', () => {
                console.log('点击零售单选项卡');
                this.clickSearch({
                    start: 0,
                    limit: 20
                })
            });
            this.$watch('form', function () {
                this.clickSearch()
            }, {deep: true})
        }
    }
</script>

<style>

</style>
