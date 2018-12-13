<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <span class="titleNameSize">门店&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" @change="changeStore" :value="storeId">
                    <option value="">全部</option>
                    <option v-for="store in stores" :value="store.id">{{ store.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">仓库&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.wareHouseId">
                    <option value="">全部</option>
                    <option v-for="wareHouse in wareHouses" :value="wareHouse.id">{{ wareHouse.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">品类&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.categoryId">
                    <option value="">全部</option>
                    <option v-for="categoty in categories" :value="categoty.id">{{ categoty.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">宝石&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.gemId">
                    <option value="">全部</option>
                    <option v-for="gem in gems" :value="gem.id">{{ gem.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">金属&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.metalId">
                    <option value="">全部</option>
                    <option v-for="metal in metals" :value="metal.id">{{ metal.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">供货商&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.vendorId">
                    <option value="">全部</option>
                    <option v-for="vendor in vendors" :value="vendor.id">{{ vendor.name }}</option>
                </select>
            </div>
            <!--成本的计价方式-->
            <div class="form-group form-group-margin">
                <span class="titleNameSize">计价方式&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.priceType">
                    <option value="">全部</option>
                    <option v-for="priceType in priceTypes" :value="priceType.value">{{ priceType.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">买/借&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.stockType">
                    <option value="">全部</option>
                    <option v-for="stockType in stockTypes" :value="stockType.value">{{ stockType.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">入库单据类型&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.billType">
                    <option value="">全部</option>
                    <option v-for="billType in billTypes" :value="billType.id">{{ billType.name }}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">只看有货&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.hasStorage">
                    <option value="">全部</option>
                    <option :value="true">是</option>
                    <option :value="false">否</option>
                </select>
            </div>
        </div>
        <div class="form-inline">
            <div class="range_group">
                <div class="range_group">
                    <span class="titleNameSize">质量&nbsp;&nbsp;&nbsp;</span>
                    <div>
                        <input type="text" class="form-control" v-model="minWeight" placeholder="" style="max-width: 70px;"/>
                        <span class="" style="margin: auto 5px;">—</span>
                        <input type="text" class="form-control" v-model="maxWeight" placeholder="" style="max-width: 70px;"/>
                    </div>
                </div>

                <div class="range_group" style="margin: auto 20px;">
                    <span class="titleNameSize">价格&nbsp;&nbsp;&nbsp;</span>
                    <div>
                        <input type="text" class="form-control" v-model="minRegularPrice" placeholder="" style="max-width: 70px;"/>
                        <span class="" style="margin: auto 5px;">—</span>
                        <input type="text" class="form-control" v-model="maxRegularPrice" placeholder="" style="max-width: 70px;"/>
                    </div>
                </div>

                <div class="" style="margin-top:10px;">
                    <div class="form-group form-group-margin">
                        <input type="text" class="form-control" v-model="query" @keyup.enter="search()" ref="query"/>
                    </div>
                    <div class="form-group" style="margin-bottom: 10px">
                        <button type="button" class="btn btn-info" style="margin-right: 10px;" @click="search()">搜索</button>
                    </div>
                    <div class="form-group form-group-margin">
                        <button type="button" class="btn btn-warning" style="margin-right: 10px;" @click="restore">重置</button>
                    </div>
                </div>

            </div>
        </div>
        <TableCpn :heads="[
            {propName:'storeName',name:'门店'},
            {propName:'wareHouseName',name:'仓库'},
            {propName:'serial',name:'条码'},
            {propName:'amount',name:'数量'},
            {propName:'categoryName',name:'品类'},
            {propName:'gemName',name:'宝石'},
            {propName:'metalName',name:'金属'},
            {propName:'weight',name:'总质量', unit: 'g'},
            {propName:'retailPriceAlgorithmName',name:'计价方式'},
            {propName:'costPrice',name:'成本价', unit: '元'},
            {propName:'processingCharges',name:'工费', unit: '元/g'},
            {propName:'regularPrice',name:'零售价(原价)', unit: '元'},
            {propName:'retailPrice',name:'零售价(折后)', unit: '元'},
            {propName:'stockTypeName',name:'买/借'},
            {propName:'vendorName',name:'供货商'},
            {name:'操作',tag:'BUTTON'}
        ]" :items="getStockItems">
            <div v-for="(item,index) in getStockItems" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-default btn-sm'],
                                btnName: '详情'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'detail'+index,
                                titleName: '商品详情',
                                modalClasses: ['modal-lg']
                            }">
                    <stockItemsModify slot="main"
                                      :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                      :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'detail'+index"
                                      :item="item"
                                      :index="'stockItemParams'+index"
                                      :refreshTable="refreshTable"
                                      :pageReadOnly="true">
                    </stockItemsModify>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-default btn-sm'],
                                btnName: '流转记录'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'record'+index,
                                titleName: '流转记录',
                                modalClasses: ['modal-lg']
                            }">
                    <StorageTransRecord slot="main"
                                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'record'+index"
                                        :item="item">
                    </StorageTransRecord>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-default btn-sm'],
                                btnName: '标签打印'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'dayin'+index,
                                titleName: '标签打印'
                            }">
                </ButtonWithModal>
                <span v-if="authorizedAction">
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn btn-default btn-sm'],
                                btnName: '修改'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'modify'+index,
                                titleName: '商品详情',
                                modalClasses: ['modal-lg']
                            }">
                    <stockItemsModify slot="main"
                                      :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                      :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'modify'+index"
                                      :item="item"
                                      :index="'stockItemParams'+index"
                                      :refreshTable="refreshTable"
                                      :canChange="true">
                    </stockItemsModify>
                </ButtonWithModal>
                </span>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-default btn-sm'],
                                btnName: '修改记录'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'stockModifyHistory'+index,
                                titleName: '修改记录'
                            }">
                    <History slot="main"
                             :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                             :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'stockModifyHistory'+index"
                             :params="item">
                    </History>
                </ButtonWithModal>
            </div>
        </TableCpn>
        <Pagination
            :total="total"
            :limit="10"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        />
    </div>
</template>

<script>
    import TableCpn from '~/components/Table'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import {mapGetters, mapActions} from 'vuex'
    import {baseUtil, constUtil, authUtil} from '~/util'
    import uuid from 'uuid'
    import StockItemsParams from '~/components/storage/stock/StockItemsParams'
    import stockItemsModify from '~/components/storage/stock/stockItemsModify'
    import StorageTransRecord from '~/components/storage/stock/StorageTransRecord'
    import History from '~/components/storage/wareBaseInfo/History'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    // import {TabsEvent} from '~/components/TabsEvent'

    export default {
        components: {
            TableCpn,
            ButtonWithModal,
            StockItemsParams,
            stockItemsModify,
            StorageTransRecord,
            History,
            Pagination
        },
        data() {
            return {
                stores: [],
                wareHouses: [],
                categories: [],
                gems: [],
                metals: [],
                priceTypes: [],
                stockTypes: [],
                vendors: [],
                billTypes: [],
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_RESTORE: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                storeId: '',
                authorizedAction: false,
                form: {
                    wareHouseId: '',
                    metalId: '',
                    gemId: '',
                    categoryId: '',
                    craftId: '',
                    priceType: '',
                    stockType: '',
                    vendorId: '',
                    billType: '',
                    hasStorage: true
                },
                minWeight: '',
                maxWeight: '',
                minRegularPrice: '',
                maxRegularPrice: '',
                query: ''
            }
        },
        computed: {
            ...mapGetters('storage/stock/stockItemsMain', {
                total: 'getTotal',
                getStockItems: 'getStockItems'
            })
        },
        methods: {
            ...mapActions('storage/stock/stockItemsMain', {
                apiGetStockItem: 'apiGetStockItem'
            }),
            ...mapActions('storage/warebaseinfo/goldPriceItem', {
                getMetaData: 'getMetaData'
            }),
            changeStore(event) {
                this.storeId = event.target.value;
                this.wareHouses = baseUtil.getMetadataWareHouseByStoreId(this.storeId) || [];
                this.search();
            },
            search(page) {
                let params = {
                    ...this.form,
                    storeId: this.storeId,
                    limit: 10,
                    start: 0,
                    query: this.query,
                    minWeight: this.minWeight,
                    maxWeight: this.maxWeight,
                    minRegularPrice: this.minRegularPrice,
                    maxRegularPrice: this.maxRegularPrice
                }
                if (page) {
                    let {start, limit} = page
                    params.limit = limit;
                    params.start = start;
                }
                this.apiGetStockItem(params)
                this.$refs.query.select()
            },
            init() {
                this.stores = baseUtil.getMetadataStore()
                this.wareHouses = baseUtil.getMetadataWareHouseByStoreId(this.stores[0].id);
                this.categories = baseUtil.getMetadataCategory()
                this.gems = baseUtil.getMetadataGem()
                this.metals = baseUtil.getMetadataMetal()
                this.vendors = baseUtil.getMetadataVendors()
                this.priceTypes = constUtil._CONST_RETAIL_PRICE
                this.stockTypes = constUtil._CONST_WARE_GETTYPE
                this.billTypes = baseUtil.getEnumsByKey('goodsBillType');
                // 刷新metaData
                this.getMetaData()
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.search(params)
                })
            },
            refreshTable() {
                PaginationEvent.$emit(this.CONST_RESTORE)
            },
            restore() {
                this.storeId = '';
                this.form = {
                    wareHouseId: '',
                    metalId: '',
                    gemId: '',
                    categoryId: '',
                    craftId: '',
                    priceType: '',
                    stockType: '',
                    vendorId: '',
                    billType: '',
                    hasStorage: true
                }
                this.query = '';
                this.minWeight = '';
                this.maxWeight = '';
                this.minRegularPrice = '';
                this.maxRegularPrice = '';
            }
        },
        beforeMount() {
            console.log('beforeMount');
            this.registerPaginationEvent()
            this.init()
        },
        mounted() {
            this.authorizedAction = authUtil.judgeAuthorizedAction('stockItems_modifyParams') && authUtil.judgeAuthorizedAction('stockItems_modifyStock');
            this.$on('init', () => {
                this.restore();
            });
            this.$watch('form', function () {
                this.search()
            }, {deep: true});
        }
    }
</script>

<style scoped>
    .range_group{
        display: flex;
        align-items: center;
    }
</style>
