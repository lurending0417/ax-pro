<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <span class="titleNameSize">门店&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="storeId">
                    <option value="">全部</option>
                    <option :value="item.id" v-for="item in selectList.stores">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">仓库&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.wareHouseId">
                    <option value="">全部</option>
                    <option :value="item.id" v-for="item in selectList.wareHouse">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">金属&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.metalId">
                    <option value="">全部</option>
                    <option :value="item.id" v-for="item in selectList.metal">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">宝石&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.gemId">
                    <option value="">全部</option>
                    <option :value="item.id" v-for="item in selectList.gem">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">品类&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.categoryId">
                    <option value="">全部</option>
                    <option :value="item.id" v-for="item in selectList.category">{{item.name}}</option>
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

        <div class="row">
            <div class="col-md-3">
                <input type="text" class="form-control" v-model="query" @keyup.enter="search()"/></div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search()">搜索
                </button>
            </div>
            <div class="col-md-8"></div>
        </div>

        <TableCpn :heads="[
            {name: '', tag: 'CheckBox'},
            {propName: 'storeName', name: '门店'},
            {propName: 'wareHouseName', name: '仓库'},
            {propName: 'serial', name: '条码'},
            {propName: 'amount', name: '数量'},
            {propName: 'metalName', name: '金属'},
            {propName: 'gemName', name: '宝石'},
            {propName: 'categoryName', name: '品类'},
            {propName: 'retailPrice', name: '零售价', unit: '元'}
        ]"
                  :items="getStockItems"
                  :hasLeft="true"
        >
            <div v-for="(item,index) in getStockItems" :slot="'CheckBox'+index">
                <input type="checkbox" @click="clickCheckBox(item,index)" :checked="item.isChecked"/>
            </div>
        </TableCpn>

        <Pagination
            :total="total"
            :limit="10"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>

        <div class="row">
            <div class="col-md-9"></div>
            <div class="col-md-3" style="text-align: right">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;margin-right: 10px;"
                        @click="clickAll">{{getItemsCheckedStatus?'取消全选':'全选'}}
                </button>
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;margin-right:10px;"
                        @click="clickImport">导入
                </button>
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="clickBack">返回
                </button>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import TableCpn from '~/components/Table';
    import uuid from 'uuid';
    import Pagination from '~/components/Pagination';
    import {PaginationEvent} from '~/components/PaginationEvent';
    import WearGoodsListMain from '~/components/storage/wearGoods/WearGoodsListMain';
    import {baseUtil} from '~/util';
    // import { TableEvent } from '~/components/TableEvent';

    export default {
        props: ['passed', 'refresh'],
        components: {
            Pagination,
            WearGoodsListMain,
            TableCpn
        },
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_RESTORE: uuid(),
                form: {
                    wareHouseId: '',
                    metalId: '',
                    gemId: '',
                    categoryId: '',
                    craftId: '',
                    hasStorage: ''
                },
                query: '',
                storeId: '',
                selectList: { // 下拉选项
                    stores: [],
                    wareHouse: [],
                    metal: [],
                    gem: [],
                    category: [],
                    storeStatus: [],
                    isBroken: []
                }
            }
        },
        computed: {
            ...mapGetters('storage/wearStorage/stockItems', {
                total: 'getTotal',
                getItemsCheckedStatus: 'getItemsCheckedStatus',
                getStockItems: 'getStockItems'
            })
        },
        watch: {
            storeId: function (val) {
                this.form.storeId = val;
                if (val) {
                    this.selectList.wareHouse = baseUtil.getMetadataWareHouseByStoreId(val)
                    this.form.wareHouseId = this.selectList.wareHouse[0].id;
                } else {
                    this.selectList.wareHouse = baseUtil.getMetadataWareHouseByStoreId(baseUtil.getMetadata().stores[0].id)
                    this.form.wareHouseId = this.selectList.wareHouse[0].id;
                }
                // this.apiGetStockItem(this.form)
            },
            form: {
                handler(val) {
                    // val.storeId = this.storeId;
                    this.search()
                },
                deep: true
            }
        },
        methods: {
            ...mapMutations('storage/wearStorage/stockItems', {
                resetTotal: 'resetTotal',
                resetStockItems: 'resetStockItems',
                resetSeachParams: 'resetSeachParams'
            }),
            ...mapActions('storage/wearStorage/stockItems', {
                apiGetStockItem: 'apiGetStockItem',
                apiAddWearGoodsList: 'apiAddWearGoodsList'
            }),
            search() {
                this.apiGetStockItem({...this.form, start: 0, limit: 10, query: this.query})
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.form.limit = params.limit;
                    this.form.start = params.start;
                    this.form.leaseAble = false;
                    this.form.storeId = this.storeId
                    this.apiGetStockItem(this.form)
                })
            },
            initData() {
                let obj = baseUtil.getMetadata();
                this.selectList.stores = obj.stores
                this.selectList.wareHouse = baseUtil.getMetadataWareHouseByStoreId(obj.stores[0].id)
                this.selectList.metal = obj.metal
                this.selectList.gem = obj.gem
                this.selectList.category = obj.category
                // this.form.wareHouseId = this.selectList.wareHouse[0].id
            },
            resetData() {
                this.form = {
                    wareHouseId: '',
                    metalId: '',
                    gemId: '',
                    categoryId: '',
                    craftId: '',
                    hasStorage: ''
                };
                this.query = '';
                this.storeId = '';
                this.selectList = { // 下拉选项
                    stores: [],
                    wareHouse: [],
                    metal: [],
                    gem: [],
                    category: [],
                    storeStatus: [],
                    isBroken: []
                }
            },
            clickImport() { // 导入
                let temp = '';
                this.getStockItems.forEach((item) => {
                    if (item.isChecked) {
                        temp += item.id + ','
                    }
                })
                if (temp.length === 0) {
                    alert('没有选择任何商品');
                    return
                }
                // 删掉字符串最后一个逗号
                temp = temp.substring(0, temp.length - 1)
                this.apiAddWearGoodsList({
                    callBack: () => {
                        this.clickBack()
                    },
                    storageIds: temp
                });
            },
            clickBack() {
                console.log('clickBack');
                this.passed.changeCurrCpn(WearGoodsListMain);
                this.resetData()
            },
            clickAll() { // 全选
                if (this.getItemsCheckedStatus) {
                    this.getStockItems.forEach((item) => {
                        item.isChecked = false
                    })
                } else {
                    this.getStockItems.forEach((item) => {
                        item.isChecked = true
                    })
                }
                this.resetStockItems({
                    stockItems: this.getStockItems
                })
            },
            clickCheckBox(item, index) { // 点击选择
                item.isChecked = !item.isChecked;
            }
        },
        beforeMount() {
            console.log('import beforeMount');
            this.registerPaginationEvent()
        },
        mounted() {
            // // 初始化可选数据
            console.log('import mounted');
            this.initData();
        }
    }
</script>

<style>

</style>
