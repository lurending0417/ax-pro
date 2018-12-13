<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="myDate1"
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
                            field="myDate2"
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
                <span class="titleNameSize">仓库&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.wareHouseId">
                    <option value="">全部</option>
                    <option v-for="wareHouse in wareHouses" :value="wareHouse.id">{{wareHouse.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">盈亏&nbsp;&nbsp;&nbsp;</span>
                <span>
                    <select class="form-control" v-model="form.normal">
                        <option value="">全部</option>
                        <option v-for="(item,index) in inventoryLossOrGainStatus" :value="item.value">{{item.name}}</option>
                    </select>
                </span>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">状态&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.status">
                    <option value="" class="$inStore">全部</option>
                    <option class="$inStore" v-for="(item,index) in inventoryStatus" :value="item.value">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">盘点人&nbsp;&nbsp;&nbsp;</span>
                <span>
                    <select class="form-control" v-model="form.creatorId">
                        <option value="" class="$inStore">全部</option>
                        <option v-for="(creator,index) in creators" :value="creator.id">{{creator.nickName}}</option>
                    </select>
                </span>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3">
                <input type="text" class="form-control" placeholder="单号、件数" ref="query"
                                         v-model="query" @keyup.enter="search()"/></div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search()">搜索
                </button>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-warning" style="min-width: 80px;" @click="restore()">重置</button>
            </div>
            <div class="col-md-5"></div>
            <div class="col-md-2" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-danger'],
                                btnName: '新增'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'add',
                                titleName: '新增盘点'
                            }">
                    <InventoryBillAdd slot="main"
                                      :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                      :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'add'"
                                      :passed="passed"
                                      :wareHouses="wareHouses"
                    ></InventoryBillAdd>
                </ButtonWithModal>
            </div>
        </div>


        <TableCpn :heads="[
                    {propName: 'billNumber', name: '盘点单号'},
                    {propName: 'createTime', name: '创建时间'},
                    {propName: 'wareHouseId', name: '仓库'},
                    {propName: 'sysAmount', name: '账面件数'},
                    {propName: 'inputAmount', name: '实盘件数'},
                    {propName: 'diffAmount', name: '差异件数'},
                    {propName: 'sysRegularPrice', name: '账面金额', unit: '元'},
                    {propName: 'inputRegularPrice', name: '实盘金额', unit: '元'},
                    {propName: 'diffRegularPrice', name: '差异金额', unit: '元'},
                    {propName: 'status', name: '状态'},
                    {propName: 'creatorId', name: '盘点人'},
                    {tag:'BUTTON',name: '操作'}
                ]"
                  :items="getInventoryBillsView">
            <div v-for="(item,index) in getInventoryBillsView" :slot="'BUTTON'+index">
                <TableButton
                    :btnProps="{
                                btnClasses: ['btn btn-sm'],
                                btnStyle: { width: 50 + 'px' },
                                btnName: '详情'
                            }"
                    :item=item
                    :clickCallback="clickDetailInventoryItem"
                />
                <TableButton
                    v-if="item.status==='未完成'"
                    :btnProps="{
                                btnClasses: ['btn btn-danger btn-sm'],
                                btnStyle: { width: 50 + 'px' },
                                btnName: '删除'
                            }"
                    :item=item
                    :clickCallback="clickDeleteInventoryBill"
                />
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-primary btn-sm'],
                                btnName: '查看差异'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'detial'+index,
                                titleName: '查看差异',
                                modalStyle: {width: '980px'}
                            }">
                    <InventoryBillDifference slot="main"
                                             :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                             :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'detial'+index"
                                             :params="index"
                                             :billItem="item"
                    ></InventoryBillDifference>
                </ButtonWithModal>
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
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import TableCpn from '~/components/Table';
    import uuid from 'uuid';
    import Pagination from '~/components/Pagination';
    import {PaginationEvent} from '~/components/PaginationEvent';
    import DatePicker from '~/components/DatePicker';
    import ButtonWithModal from '~/components/ButtonWithModal';
    import TableButton from '~/components/TableButton';
    import InventoryBillItem from '~/components/storage/stock/InventoryBillItem';
    import InventoryItemDifference from '~/components/storage/stock/InventoryItemDifference';
    import InventoryBillDifference from '~/components/storage/stock/InventoryBillDifference';
    import InventoryBillAdd from '~/components/storage/stock/InventoryBillAdd';
    import {constUtil, baseUtil, dateUtil} from '~/util';
    // import { TableEvent } from '~/components/TableEvent';

    export default {
        props: ['passed'],
        components: {
            DatePicker,
            ButtonWithModal,
            TableButton,
            Pagination,
            TableCpn,
            InventoryItemDifference,
            InventoryBillDifference,
            InventoryBillAdd
        },
        data() {
            return {
                wareHouses: [],
                creators: [],
                inventoryStatus: constUtil._CONST_INVENTORY_TYPE,
                inventoryLossOrGainStatus: constUtil._CONST_INVENTORY_LOSSORGAIN_TYPE,
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_RESTORE: uuid(),
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    storeId: '',
                    wareHouseId: '',
                    status: '',
                    creatorId: '',
                    normal: ''
                },
                query: '',
                start: 0,
                limit: 10
            }
        },
        computed: {
            ...mapGetters('storage/stock/inventoryBillMain', {
                total: 'getTotal',
                getInventoryBillsView: 'getInventoryBillsView'
            })
        },
        methods: {
            ...mapMutations('storage/stock/inventoryBillMain', {
                resetInventoryBillItem: 'resetInventoryBillItem'
            }),
            ...mapActions('storage/stock/inventoryBillMain', {
                getInventoryBills: 'getInventoryBills',
                getInventoryBillItems: 'getInventoryBillItems',
                deleteInventoryBill: 'deleteInventoryBill'
            }),
            clickDetailInventoryItem(e, item) { // 点击详情
                let that = this;
                this.resetInventoryBillItem({
                    item,
                    callback() {
                        that.getInventoryBillItems()
                        // TableEvent.$emit('inventoryBillItem') // CLICK_ADD_InventoryBillItem:等待InventoryBillItem页面接受
                        that.passed.changeCurrCpn(InventoryBillItem);
                    }
                });
            },
            search(page) {
                let params = {
                    ...this.form,
                    limit: 10,
                    start: 0,
                    query: this.query
                }
                if (page) {
                    params.limit = page.limit;
                    params.start = page.start;
                }
                this.getInventoryBills(params)
                this.$refs.query.select()
            },
            changeCurrCpn(cpn) {
                this.currCpn = cpn
            },
            restore() {
                this.initData()
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.search(params)
                })
            },
            initData() {
                this.form = {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    storeId: '',
                    wareHouseId: '',
                    status: '',
                    creatorId: '',
                    normal: ''
                }
                this.query = ''
            },
            initArr() {
                this.wareHouses = baseUtil.getWarehouseByStoreId(); // 获取当前门店的所有仓库
                this.creators = baseUtil.getMetadata().staffs;
            },
            clickDeleteInventoryBill(event, item) {
                let delObj = {
                    deleteInventoryBillId: item.id,
                    callback: () => {
                        this.getInventoryBills({start: 0, limit: 10})
                    }
                };
                this.deleteInventoryBill(delObj);
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
            this.initArr();
        },
        mounted() {
            // 初始化可选数据
            this.initData();
            this.$on('init', () => {
                this.initData();
            });
            this.$watch('form', function () {
                this.search()
            }, {deep: true})
        }
    }
</script>

<style>

</style>
