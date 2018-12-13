<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="myDate1"
                            placeholder="起始日期"
                            v-model="startYmd$"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                    <span class="input-group-addon" style="display: inline-block">到</span>
                    <span>
                        <DatePicker
                            field="myDate2"
                            placeholder="结束日期"
                            v-model="endYmd$"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                </div>
            </div>
            <div class="form-group form-group-margin">
                <label class="titleNameSize">付款状态&nbsp;&nbsp;&nbsp;</label>
                <select class="form-control" v-model="paid$">
                    <option value="">全部</option>
                    <option value="true">已付款</option>
                    <option value="false">未付款</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <label class="titleNameSize">回收人&nbsp;&nbsp;&nbsp;</label>
                <select class="form-control" v-model="creatorId$">
                    <option value="">全部</option>
                    <option v-for="staff in staffs" :value="staff.id">{{ staff.nickName }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <label class="titleNameSize">收货仓库&nbsp;&nbsp;&nbsp;</label>
                <select class="form-control" v-model="wareHouseId$">
                    <option value="">全部</option>
                    <option v-for="wareHouse in rejectWareHouse" :value="wareHouse.id">{{ wareHouse.name }}</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3">
                <input type="text" class="form-control" ref="query"
                       placeholder="单号" v-model="query$" @keyup.enter="search()"></div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search()">搜索</button>
            </div>
            <div class="col-md-6"></div>
            <div class="col-md-2" style="text-align: right">
                <button class="btn btn-danger" style="minWidth:80px" @click="add">
                    <i class="fa fa-plus-square">&nbsp;&nbsp;新增</i>
                </button>
            </div>
        </div>

        <TableCpn
            :heads="[
                {propName:'billNumber',name:'置换单号'},
                {propName:'createTime',name:'创建时间'},
                {propName:'',name:'金属'},
                {propName:'netWeight',name:'来料净重'},
                {propName:'roughWeight',name:'售货重量'},
                {propName:'',name:'抵扣后重量'},
                {propName:'',name:'金价'},
                {propName:'totalCost',name:'应收金额'},
                {propName:'paid',name:'付款状态'},
                {propName:'creatorId',name:'收料员工'},
                {propName:'',name:'销售员工'},
                {tag:'BUTTON',name:'操作'}
            ]"
            :items="getExchangeBills">
            <div v-for="(item,index) in getExchangeBills" :slot="'BUTTON'+index">
                <button class="btn btn-sm btn-default" @click="clickDetail(item)">详情</button>
                <button class="btn btn-sm btn-default" @click="clickDelete(item)">删除</button>
            </div>
        </TableCpn>

        <Pagination
            :total="total"
            :limit="10"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex'
    import DatePicker from '~/components/DatePicker'
    import dateUtil from '~/util/dateUtil'
    import TableCpn from '~/components/Table'
    import uuid from 'uuid'
    import Pagination from '~/components/Pagination'
    import { PaginationEvent } from '~/components/PaginationEvent'
    import ExchangeBillAdd from '~/components/retail/offlineRetail/ExchangeBillAdd'
    import baseUtil from '../../../util/baseUtil'
    // import { TabsEvent } from '~/components/TabsEvent'

    export default {
        components: {
            DatePicker,
            TableCpn,
            Pagination
        },
        props: ['passed'],
        data () {
            return {
                startYmd$: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                endYmd$: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                storeId$: '',
                wareHouseId$: '',
                creatorId$: '',
                paid$: '',
                query$: '',
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                rejectWareHouse: [],
                staffs: []
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/exchangeBillMain', {
                total: 'getTotal',
                getExchangeBills: 'getExchangeBills'
            })
        },
        watch: {
            startYmd$ () {
                this.search()
            },
            endYmd$ () {
                this.search()
            },
            paid$ () {
                this.search()
            },
            wareHouseId$ () {
                this.search()
            },
            creatorId$ () {
                this.search()
            }
        },
        methods: {
            ...mapMutations('retail/offlineRetail/exchangeBillAdd', {
                resetCanChange: 'resetCanChange'
            }),
            ...mapActions('retail/offlineRetail/exchangeBillMain', {
                apiGetExchangeBill: 'apiGetExchangeBill',
                apiDeleteExchangeBill: 'apiDeleteExchangeBill'
            }),
            ...mapActions('retail/offlineRetail/exchangeBillAdd', {
                apiGetExchangeBillDetail: 'apiGetExchangeBillDetail'
            }),
            add () {
                this.resetCanChange(true)
                this.passed.changeCurrCpn(ExchangeBillAdd)
            },
            clickDetail (item) {
                this.apiGetExchangeBillDetail({
                    params: {
                        billId: item.id
                    },
                    callback: () => {
                        this.resetCanChange(false)
                        this.passed.item = item
                        this.passed.changeCurrCpn(ExchangeBillAdd)
                    }
                })
            },
            clickDelete (item) {
                this.apiDeleteExchangeBill({
                    params: {
                        billId: item.id
                    },
                    callback: () => {
                        this.search()
                    }
                })
            },
            search (page) {
                let params = {
                    startYmd: this.startYmd$,
                    endYmd: this.endYmd$,
                    storeId: this.storeId$,
                    wareHouseId: this.wareHouseId$,
                    creatorId: this.creatorId$,
                    paid: this.paid$,
                    query: this.query$
                }
                let obj = {
                    params
                }
                if (page) {
                    obj.page = page
                }
                this.apiGetExchangeBill(obj)
                this.$refs.query.select()
            },
            registerPaginationEvent () {
                PaginationEvent.$off(this.CONST_CHANGE_PAGE)
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.search(params)
                })
            }
        },
        mounted () {
            this.rejectWareHouse = baseUtil.getMetadataRejectWareHouse()
            this.staffs = baseUtil.getStaffsInDesignStoreByStoreId(baseUtil.getStore().id) // 获取当前店铺的所有员工
            this.$on('exchangeBill', () => {
                this.search({start: 0, limit: 10})
            });
        },
        beforeMount () {
            this.registerPaginationEvent()
        }
    }
</script>
<style>
    .titleNameSize {
        font-size: 14px;
    }
</style>
