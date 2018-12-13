<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="myDate1"
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
                            field="myDate2"
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
                <span class="titleNameSize">调出门店&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="sourceStoreId">
                    <option value="">全部</option>
                    <option v-for="store in sourceStores" :value="store.id">{{store.name}}</option>
                </select>
            </div>
            <!--<div class="form-group form-group-margin">-->
                <!--<span class="titleNameSize">调出仓库&nbsp;&nbsp;&nbsp;</span>-->
                <!--<span v-if="sourceWareHouses && sourceWareHouses.length">-->
                    <!--<select class="form-control" v-model="form.sourceWareHouseId">-->
                        <!--<option value="" class="$outStore">全部</option>-->
                        <!--<option v-for="wareHouse in sourceWareHouses" :value="wareHouse.id">{{wareHouse.name}}</option>-->
                    <!--</select>-->
                <!--</span>-->
                <!--<span v-else>-->
                    <!--<select class="form-control" disabled>-->
                        <!--<option value="">全部</option>-->
                    <!--</select>-->
                <!--</span>-->
            <!--</div>-->
            <div class="form-group form-group-margin">
                <span class="titleNameSize">发货人&nbsp;&nbsp;&nbsp;</span>
                <span v-if="allocatedStaffs && allocatedStaffs.length > 0">
                    <select class="form-control" v-model="form.allocatedById">
                        <option value="" class="$outStore">全部</option>
                        <option v-for="staff in allocatedStaffs" :value="staff.id">{{staff.nickName}}</option>
                    </select>
                </span>
                <span v-else>
                    <select class="form-control" disabled>
                        <option value="">全部</option>
                    </select>
                </span>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">调入门店&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="targetStoreId">
                    <option value="" class="$inStore">全部</option>
                    <option v-for="store in targetStores" :value="store.id">
                        {{store.name}}
                    </option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">调入仓库&nbsp;&nbsp;&nbsp;</span>
                <span v-if="targetWareHouses && targetWareHouses.length">
                    <select class="form-control" v-model="form.targetWareHouseId">
                        <option value="" class="$inStore">全部</option>
                        <option v-for="wareHouse in targetWareHouses" :value="wareHouse.id">{{wareHouse.name}}</option>
                    </select>
                </span>
                <span v-else>
                    <select class="form-control" disabled>
                        <option value="">全部</option>
                    </select>
                </span>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">收货人&nbsp;&nbsp;&nbsp;</span>
                <span v-if="acceptedStaffs && acceptedStaffs.length>0">
                    <select class="form-control" v-model="form.acceptedById">
                        <option value="">全部</option>
                        <option v-for="staff in acceptedStaffs" :value="staff.id">{{staff.nickName}}</option>
                    </select>
                </span>
                <span v-else>
                    <select class="form-control" disabled>
                        <option value="">全部</option>
                    </select>
                </span>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">状态&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.status">
                    <option value="" name="restoreStatu">全部</option>
                    <option v-for="item in allocateBillStatus" :value="item.id">{{item.name}}</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3">
                <input type="text" class="form-control" placeholder="单号、件数" ref="query"
                       v-model="query" @keyup.enter="search()"/>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search()">搜索
                </button>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-warning" style="min-width: 80px;" @click="restore()">重置</button>
            </div>
            <div class="col-md-5"></div>
            <div class="col-md-2" style="text-align: right">
                <button class="btn btn-danger" style="minWidth:80px" @click="add()"><i class="fa fa-plus-square">&nbsp;&nbsp;新增</i>
                </button>
            </div>
        </div>

        <TableCpn :heads="[
                    {propName: 'billNumber', name: '调拨单号'},
                    {propName: 'createTime', name: '创建时间'},
                    {propName: 'creatorName', name: '创建人'},
                    {propName: 'storeName', name: '调出门店'},
                    // {propName: 'wareHouseId', name: '调出仓库'},
                    {propName: 'allocatedByName', name: '发货人'},
                    {propName: 'targetStoreName', name: '调入门店'},
                    {propName: 'targetWareHouseName', name: '调入仓库'},
                    {propName: 'acceptedByName', name: '收货人'},
                    {propName: 'totalAmount', name: '件数'},
                    {propName: 'totalRegularPrice', name: '原价', unit: '元'},
                    {propName: 'totalRetailPrice', name: '折后价', unit: '元'},
                    {propName: 'totalProcessingCharges', name: '工费', unit: '元'},
                    {propName: 'status', name: '状态'},
                    {tag:'BUTTON',name: '操作'}
                ]"
                  :items="getAllocateBillsView">
            <div v-for="(item,index) in getAllocateBillsView" :slot="'BUTTON'+index">
                <TableButton
                    :btnProps="{
                                btnClasses: ['btn btn-sm btn-info'],
                                btnStyle: { width: 50 + 'px' },
                                btnName: '详情'
                            }"
                    :item=item
                    :clickCallback="clickDetailAllocateBill"/>
                <TableButton
                    v-if="item.status === '待发货'"
                    :btnProps="{
                                btnClasses: ['btn btn-danger btn-sm'],
                                btnStyle: { width: 50 + 'px' },
                                btnName: '删除'
                            }"
                    :item=item
                    :clickCallback="clickDeleteAllocateBill"/>
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
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import DatePicker from '~/components/DatePicker'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import AllocateBillAdd from '~/components/storage/stock/AllocateBillAdd'
    import AllocateBillDetail from '~/components/storage/stock/AllocateBillDetail'
    import dateUtil from '~/util/dateUtil'
    import TableCpn from '~/components/Table'
    import uuid from 'uuid'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import TableButton from '~/components/TableButton'
    import {baseUtil} from '~/util'

    export default {
        components: {
            DatePicker,
            ButtonWithModal,
            AllocateBillAdd,
            AllocateBillDetail,
            TableCpn,
            Pagination,
            TableButton
        },
        props: ['passed'],
        data() {
            return {
                allocateBillStatus: [],
                // 调出门店，仓库，员工
                sourceStores: [],
                sourceWareHouses: [],
                allocatedStaffs: [],
                // 调入门店，仓库，员工
                targetStores: [],
                targetWareHouses: [],
                acceptedStaffs: [],
                sourceStoreId: '',
                targetStoreId: '',
                form: {
                    sourceWareHouseId: '',
                    targetWareHouseId: '',
                    allocatedById: '',
                    acceptedById: '',
                    status: '',
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-')
                },
                query: '',
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid()
            }
        },
        computed: {
            ...mapGetters('storage/stock/allocateBillMain', {
                getSearchInfo: 'getSearchInfo',
                total: 'getTotal',
                getAllocateBillsView: 'getAllocateBillsView'
            }),
            ...mapGetters('storage/stock/allocateBillDetail', {
                getStaffStoreId: 'getStaffStoreId'
            })
        },
        methods: {
            ...mapMutations('storage/stock/allocateBillMain', {
                resetDeleteAllocateBillId: 'resetDeleteAllocateBillId',
                resetAllocateBillItems: 'resetAllocateBillItems',
                resetAllocateBillItemsTotal: 'resetAllocateBillItemsTotal',
                resetNewAllocateBill: 'resetNewAllocateBill',
                resetAddPageCanChange: 'resetAddPageCanChange'
            }),
            ...mapMutations('storage/stock/allocateBillDetail', {
                resetAllocateBill: 'resetAllocateBill'
            }),
            ...mapActions('storage/stock/allocateBillMain', {
                getAllocateBills: 'getAllocateBills',
                addAllocateBill: 'addAllocateBill',
                deleteAllocateBill: 'deleteAllocateBill',
                getAllocateBillItems: 'getAllocateBillItems'
            }),
            restore() {
                this.initData();
            },
            add() {
                this.addAllocateBill(() => {
                    this.resetAllocateBillItems([])
                    this.resetAddPageCanChange(false)
                    this.passed.changeCurrCpn(AllocateBillAdd)
                })
            },
            clickDetailAllocateBill(event, item) {
                console.log('发货人：', item.allocatedById)
                console.log('创建人：', item.allocatedById)
                let curStaffId = baseUtil.getStaff().id; // 当前登录的员工id
                // 当未发货并且当前员工为创建人(creatorId)，跳转到(添加调拨详情页面)
                // 当拒绝收货并且当前员工为发货人(allocatedById)，跳转到(添加调拨详情页面)
                let bool1 = item.status === '待发货' && curStaffId === item.creatorId;
                let bool2 = item.status === '拒收(待确认)' && curStaffId === item.allocatedById;
                console.log('bool1, bool2', bool1, bool2);
                if (bool1 || bool2) {
                    this.resetNewAllocateBill(item)
                    this.resetAddPageCanChange(bool2)
                    this.resetAllocateBill(item)
                    this.getAllocateBillItems(() => {
                        this.passed.changeCurrCpn(AllocateBillAdd)
                    })
                } else {
                    // 跳到调拨详情页面
                    this.resetAllocateBill(item)
                    this.passed.changeCurrCpn(AllocateBillDetail)
                }
            },
            clickDeleteAllocateBill(event, item) {
                this.resetDeleteAllocateBillId(item.id)
                this.deleteAllocateBill(() => {
                    this.search()
                })
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.search(params)
                })
            },
            initArr() {
                this.allocateBillStatus = baseUtil.getEnumsByKey('allocateBillStatus');
                let stores = baseUtil.getMetadataStore() // 当前商户的所有门店
                this.sourceStores = stores
                this.targetStores = stores
            },
            initData() {
                this.form = {
                    sourceWareHouseId: '',
                    targetWareHouseId: '',
                    allocatedById: '',
                    acceptedById: '',
                    status: '',
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-')
                };
                this.query = '';
                this.sourceStoreId = '';
                this.targetStoreId = '';
                this.sourceWareHouses = [];
                this.allocatedStaffs = [];
                this.targetWareHouses = [];
                this.acceptedStaffs = [];
            },
            search(page) {
                let params = {
                    ...this.form,
                    limit: 20,
                    start: 0,
                    query: this.query,
                    sourceStoreId: this.sourceStoreId,
                    targetStoreId: this.targetStoreId
                }
                if (page) {
                    params.limit = page.limit;
                    params.start = page.start;
                }
                this.getAllocateBills(params);
                this.$refs.query.select()
            },
            watchFunc() {
                this.$watch('form', function () {
                    this.search()
                }, {deep: true});
                this.$watch('sourceStoreId', function (storeId) {
                    this.changeStoreId({
                        storeId: storeId,
                        type: 'sourceStore'
                    })
                });
                this.$watch('targetStoreId', function (storeId) {
                    this.changeStoreId({
                        storeId: storeId,
                        type: 'targetStore'
                    })
                });
            },
            changeStoreId(params) {
                let staffs = baseUtil.getMetadataStaffByStoreId({storeId: params.storeId})
                let warehouses = baseUtil.getMetadataWareHouseByStoreId({storeId: params.storeId})
                if (params.type === 'sourceStore') {
                    this.sourceWareHouses = warehouses
                    this.allocatedStaffs = staffs;
                } else if (params.type === 'targetStore') {
                    this.targetWareHouses = warehouses
                    this.acceptedStaffs = staffs;
                }
                this.search()
            }
        },
        mounted() {
            this.initArr();
            this.initData();
            this.$on('init', () => {
                this.initData();
            });
            this.watchFunc();
        },
        beforeMount() {
            this.registerPaginationEvent()
        }
    }
</script>
