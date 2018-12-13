<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="reject_start_date"
                            placeholder="起始日期"
                            format="yyyy-mm-dd"
                            v-model="form.startYmd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                    <span class="input-group-addon" style="display: inline-block">到</span>
                    <span>
                        <DatePicker
                            field="reject_end_date"
                            placeholder="结束日期"
                            format="yyyy-mm-dd"
                            v-model="form.endYmd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                </div>
            </div>
            <div class="form-group form-group-margin">
                <label>付款状态</label>
                <select class="form-control" ref="paid" style="margin-left: 15px" v-model="form.paid"
                        data-symbol="paid">
                    <option value="" class="$inStore">全部</option>
                    <option v-for="status in paid" :value="status.value">{{status.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <label>回收人</label>
                <span>
                    <select class="form-control" style="margin-left: 15px" ref="creatorId" data-symbol="creatorId"
                            v-model="form.creatorId">
                        <option value="" class="$inStore">全部</option>
                        <option v-for="creator in creators" :value="creator.id">{{creator.nickName}}</option>
                    </select>
                </span>
            </div>
            <div class="form-group form-group-margin">
                <label>收货仓库</label>
                <select class="form-control" style="margin-left: 15px" ref="wareHouseId" v-model="form.wareHouseId"
                        data-symbol="wareHouseId">
                    <option value="">全部</option>
                    <option v-for="wareHouse in getRrecyclerWareHouse" :value="wareHouse.id">{{wareHouse.name}}</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <input type="text" class="form-control" style="display: inline-block; max-width: 150px" @keyup.enter="search()"
                       placeholder="单号" ref="query" v-model="query">
                <button class="btn btn-info" style="margin: 0 10px 3px" @click="search()">搜索</button>
            </div>
            <div class="col-md-8" style="text-align: right">
                <button type="button" class="btn btn-danger" @click="add"><i
                    class="fa fa-plus-square">&nbsp;&nbsp;新增</i></button>
            </div>
        </div>

        <TableCpn :heads="[
                    {propName: 'billNumber', name: '回收单号'},
                    {propName: 'createTime', name: '回收时间'},
                    {propName: 'amount', name: '商品数量'},
                    {propName: 'totalCost', name: '回收金额'},
                    {propName: 'paid', name: '付款状态'},
                    {propName: 'wareHouseId', name: '收货仓库'},
                    {propName: 'creatorId', name: '回收员工'},
                    {tag:'BUTTON',name: '操作'}
                ]"
                  :items="getRetailRecycleBillsView">
            <div v-for="(item,index) in getRetailRecycleBillsView" :slot="'BUTTON'+index">
                <TableButton
                    :btnProps="{
                                btnClasses: ['btn btn-sm'],
                                btnStyle: { width: 50 + 'px' },
                                btnName: '详情'
                            }"
                    :item=item
                    :clickCallback="clickRetailRecycleBillDetail"
                />
                <button v-if="item.paid === '未付款'" type="button" :value="item.id" class="btn btn-sm btn-default"
                        @click="jump2payment(item.billNumber)">收银
                </button>
                <TableButton
                    :btnProps="{
                                btnClasses: ['btn btn-danger btn-sm'],
                                btnStyle: { width: 50 + 'px' },
                                btnName: '删除'
                            }"
                    :item=item
                    :clickCallback="clickDeleteRetailRecycleBill"
                />
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
    import {mapActions, mapGetters, mapMutations} from 'vuex'
    import TableCpn from '~/components/Table'
    import uuid from 'uuid'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import DatePicker from '~/components/DatePicker'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import TableButton from '~/components/TableButton'
    import RetailRecycleBillAdd from '~/components/retail/offlineRetail/RetailRecycleBillAdd'
    import RetailRecycleBillDetail from '~/components/retail/offlineRetail/RetailRecycleBillDetail'
    import {ChangeTabEvent} from '~/components/ChangeTabEvent'
    import {dateUtil, constUtil, baseUtil} from '~/util'
    // import {TabsEvent} from '~/components/TabsEvent'

    export default {
        components: {
            DatePicker,
            TableCpn,
            Pagination,
            ButtonWithModal,
            TableButton
        },
        props: ['passed'],
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_RESTORE: uuid(),
                creators: [],
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    paid: '',
                    wareHouseId: '',
                    storeId: '',
                    creatorId: ''
                },
                paid: constUtil._CONST_PAID_TYPE,
                query: ''
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/retailRecycleBillMain', {
                getRetailRecycleBillsView: 'getRetailRecycleBillsView',
                total: 'getTotal'
            }),
            ...mapGetters('retail/offlineRetail/retailRecycleBillAdd', {
                getRrecyclerWareHouse: 'getRrecyclerWareHouse'
            })
        },
        methods: {
            ...mapActions('retail/offlineRetail/retailRecycleBillMain', {
                getRetailRecycleBills: 'getRetailRecycleBills', // 获取或筛选所有回收单
                delRetailRecycleBill: 'delRetailRecycleBill', // 删除回收单
                getRetailRecycleBillDetail: 'getRetailRecycleBillDetail' // 获取回收单详情
            }),
            ...mapActions('retail/offlineRetail/retailRecycleBillAdd', {
                getMetalPriceByMetal: 'getMetalPriceByMetal'
            }),
            ...mapMutations('retail/offlineRetail/retailRecycleBillMain', {
                resetMainPageParams: 'resetMainPageParams',
                resetRetailRecycleBills: 'resetRetailRecycleBills',
                resetRetailRecycleBillItem: 'resetRetailRecycleBillItem'
            }),
            jump2payment(billId) {
                // 跳转到收银页面，进行收银操作
                ChangeTabEvent.$emit('JUMP_TO_PAYMENT', billId)
            },
            clickRetailRecycleBillDetail(event, item) { // 跳转到详情页面
                let that = this;
                this.resetRetailRecycleBillItem(item);
                this.getRetailRecycleBillDetail({
                    billId: item.id,
                    callback: () => {
                        that.passed.changeCurrCpn(RetailRecycleBillDetail)
                    }
                })
            },
            clickDeleteRetailRecycleBill(event, item) { // 删除
                this.delRetailRecycleBill({
                    billId: item.id,
                    callback: () => {
                        this.getRetailRecycleBills()
                    }
                })
            },
            add() {
                this.passed.changeCurrCpn(RetailRecycleBillAdd);
                this.getMetalPriceByMetal()
            },
            registerPaginationEvent() {
                PaginationEvent.$off(this.CONST_CHANGE_PAGE);
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    console.log('回收单 change page');
                    this.search(params)
                })
            },
            search(page) {
                let params = {
                    ...this.form,
                    query: this.query,
                    start: 0,
                    limit: 10
                };
                if (page) {
                    params.limit = page.limit;
                    params.start = page.start;
                }
                console.log('search params', params);
                this.resetMainPageParams(params);
                this.getRetailRecycleBills()
                this.$refs.query.select()
            }
        },
        mounted() {
            console.log('回收单上层组件  mounted');
            this.creators = baseUtil.getMetadata().staffs;
            this.$on('retailRecycleBill', () => {
                console.log('回收单 点击tab');
                this.form.startYmd = dateUtil.formatDateToYYYYMMDD(new Date(), '-');
                this.form.endYmd = dateUtil.formatDateToYYYYMMDD(new Date(), '-');
                this.search({start: 0, limit: 10})
            });
            this.$watch('form', function () {
                this.search()
            }, {deep: true});
        },
        beforeMount() {
            this.registerPaginationEvent()
        }
    }
</script>

<style>

</style>
