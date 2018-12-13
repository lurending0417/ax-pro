<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <strong>门店&nbsp;&nbsp;&nbsp;</strong>
                <select class="form-control" @change="changeStore" :value="storeId">
                    <option value="">全部</option>
                    <option :value="item.id" v-for="item in selectList.stores">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <strong>仓库&nbsp;&nbsp;&nbsp;</strong>
                <select class="form-control" v-model="form.wareHouseId">
                    <option value="">全部</option>
                    <option :value="item.id" v-for="item in selectList.wareHouse">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <strong>金属&nbsp;&nbsp;&nbsp;</strong>
                <select class="form-control" v-model="form.metalIds">
                    <option value="">全部</option>
                    <option :value="item.id" v-for="item in selectList.metal">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <strong>宝石&nbsp;&nbsp;&nbsp;</strong>
                <select class="form-control" v-model="form.gemIds">
                    <option value="">全部</option>
                    <option :value="item.id" v-for="item in selectList.gem">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <strong>上架状态&nbsp;&nbsp;&nbsp;</strong>
                <select class="form-control" v-model="form.status">
                    <option value="">全部</option>
                    <option :value="item.id" v-for="item in selectList.shelfStatus">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <strong>品类&nbsp;&nbsp;&nbsp;</strong>
                <select class="form-control" v-model="form.categoryIds">
                    <option value="">全部</option>
                    <option :value="item.id" v-for="item in selectList.category">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <strong>库存状态&nbsp;&nbsp;&nbsp;</strong>
                <select class="form-control" v-model="form.hasStorage">
                    <option value="">全部</option>
                    <option :value="true">有库存</option>
                    <option :value="false">无库存</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <strong>是否有图片&nbsp;&nbsp;&nbsp;</strong>
                <select class="form-control" v-model="form.hasImage">
                    <option value="">全部</option>
                    <option :value="true">是</option>
                    <option :value="false">否</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3"><input type="text" class="form-control" placeholder="" ref="query"
                                         v-model="query" @keyup.enter="search()">
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search()">搜索</button>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-warning" style="min-width: 80px;" @click="restore">重置</button>
            </div>
            <div class="col-lg-7" style="text-align: right;">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-success'],
                                btnName: '小美编辑下载'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+'download',
                                titleName: '小美编辑下载'
                            }">
                    <DownLoadModal
                        slot="main"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'download'"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                    >
                    </DownLoadModal>
                </ButtonWithModal>
            </div>
        </div>

        <div class="row" style="margin-top: 20px;">
            <div class="col-md-4">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;margin-right: 20px;"
                        @click="checkAll">
                    {{getItemsCheckedStatus?'取消全选':'全选'}}
                </button>
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;margin-right: 20px;"
                        @click="Shelf('ON')">上架
                </button>
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="Shelf('OFF')">下架
                </button>
            </div>
            <div class="col-md-4"></div>
            <div class="col-md-4" style="text-align: right">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;margin-left: 15px"
                        @click="clickImport">批量导入
                </button>
            </div>
        </div>

        <TableCpn
            :heads="[
                { name: '', tag: 'CheckBox'},
                { propName: 'storeName', name: '门店' },
                { propName: 'wareHouseName', name: '仓库' },
                { propName: 'serial', name: '条码' },
                { propName: 'amount', name: '数量' },
                { propName: 'lockedStorage', name: '锁定数量' },
                { propName: 'metalName', name: '金属' },
                { propName: 'gemName', name: '宝石' },
                { propName: 'categoryName', name: '品类' },
                { propName: 'retailPrice', name: '零售价', unit: '元'},
                { propName: 'depositPrice', name: '押金' , unit: '元'},
                { propName: 'rentPrice', name: '日租金' , unit: '元'},
                { propName: 'leaseDays', name: '起租天数' },
                { propName: 'storageStatus', name: '库存状态' },
                { propName: 'statusName', name: '上架状态' },
                { propName: 'imageCount', name: '图片数量' },
                { name: '操作', tag: 'BUTTON' }
            ]"
            :items="getWearGoodsList"
            :hasLeft="true"
        >
            <div v-for="(item,index) in getWearGoodsList" :slot="'CheckBox'+index">
                <input type="checkbox" @click="clickCheckBox(item,index)" :checked="item.isChecked"/>
            </div>
            <div v-for="(item,index) in getWearGoodsList" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '上传图片'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: addModalName+index,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+index+'upload',
                                modalClasses: ['modal-lg'],
                                titleName: '上传图片'
                            }">
                    <ImgUpload
                        slot="main"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index+'upload'"
                        :CONST_CLOSE_MODAL="addModalName+index"
                        :item="item"
                        :refreshTable="refreshTable"
                    >
                    </ImgUpload>
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
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '预览'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: addModalName+index,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+index+'preview',
                                modalClasses: ['modal-lg'],
                                titleName: '预览'
                            }">
                    <WearGoodsListPreview
                        slot="main"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index+'preview'"
                        :CONST_CLOSE_MODAL="addModalName+index"
                        :storageId="item.id"
                        :refreshTable="refreshTable"
                    >
                    </WearGoodsListPreview>
                </ButtonWithModal>
                <!--<ButtonWithModal-->
                    <!--:btnProps="{-->
                                <!--btnClasses: ['btn btn-sm btn-default'],-->
                                <!--btnName: '金额修改'-->
                            <!--}"-->
                    <!--:modalProps="{-->
                                <!--CONST_CLOSE_MODAL: addModalName+index,-->
                                <!--CONST_CLICK_MODAL:CONST_CLICK_MODAL+index+'update',-->
                                <!--titleName: '金额修改'-->
                            <!--}">-->
                    <!--<WearGoodsListModify-->
                        <!--slot="main"-->
                        <!--:CONST_CLICK_MODAL="CONST_CLICK_MODAL+index+'update'"-->
                        <!--:CONST_CLOSE_MODAL="addModalName+index"-->
                        <!--:item="item"-->
                        <!--:refreshTable="refreshTable"-->
                    <!--&gt;-->
                    <!--</WearGoodsListModify>-->
                <!--</ButtonWithModal>-->
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
    import ButtonWithModal from '~/components/ButtonWithModal'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import WearGoodsListImport from '~/components/storage/wearGoods/WearGoodsListImport'
    import WearGoodsListModify from '~/components/storage/wearGoods/WearGoodsListModify'
    import WearGoodsListPreview from '~/components/storage/wearGoods/WearGoodsListPreview'
    import DownLoadModal from '~/components/storage/wearGoods/DownLoadModal'
    import StorageTransRecord from '~/components/storage/stock/StorageTransRecord'
    import ImgUpload from '~/components/storage/wearGoods/ImgUpload'
    import uuid from 'uuid'
    import TableCpn from '~/components/Table'
    import {baseUtil, constUtil} from '~/util'

    export default {
        props: ['passed'],
        components: {
            DownLoadModal,
            ButtonWithModal,
            Pagination,
            WearGoodsListImport,
            WearGoodsListPreview,
            StorageTransRecord,
            WearGoodsListModify,
            ImgUpload,
            TableCpn
        },
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                CONST_CLICK_MODAL: uuid(),
                addModalName: uuid(),
                form: {
                    wareHouseId: '',
                    metalIds: '',
                    gemIds: '',
                    status: '',
                    hasStorage: '',
                    hasImage: '',
                    categoryIds: ''
                },
                query: '',
                storeId: '',
                selectList: { // 下拉选项
                    stores: [],
                    wareHouse: [],
                    metal: [],
                    gem: [],
                    category: [],
                    storeStatus: []
                }
            }
        },
        computed: {
            ...mapGetters('storage/wearStorage/wearGoodsMain', {
                getWearGoodsList: 'getWearGoodsList',
                getItemsCheckedStatus: 'getItemsCheckedStatus',
                total: 'getTotal'
            })
        },
        methods: {
            ...mapActions('storage/wearStorage/wearGoodsMain', {
                apiGetWearGoodsList: 'apiGetWearGoodsList',
                apiLeaseConfigModify: 'apiLeaseConfigModify'
            }),
            ...mapMutations('storage/wearStorage/wearGoodsMain', {
                resetTotal: 'resetTotal',
                resetWearGoodsList: 'resetWearGoodsList',
                resetSearchParams: 'resetSearchParams'
            }),
            changeStore(event) {
                this.storeId = event.target.value;
                this.selectList.wareHouse = baseUtil.getMetadataWareHouseByStoreId({enabled: true, storeId: this.storeId}) || [];
                this.search();
            },
            search(page) {
                let params = {...this.form, limit: 20, start: 0, query: this.query, storeId: this.storeId}
                if (page) {
                    params.limit = page.limit;
                    params.start = page.start;
                }
                this.apiGetWearGoodsList(params)
                this.$refs.query.select()
            },
            restore() {
                this.storeId = ''
                this.form = {
                    wareHouseId: '',
                    metalIds: '',
                    gemIds: '',
                    hasStorage: '',
                    hasImage: '',
                    status: '',
                    categoryIds: ''
                }
                this.query = ''
            },
            getCheckedItem() {
                let temp = '';
                this.getWearGoodsList.forEach((item) => {
                    if (item.isChecked) {
                        temp += item.storageId + ','
                    }
                })
                // 删掉字符串最后一个逗号
                temp = temp.substring(0, temp.length - 1)
                return temp;
            },
            Shelf(status) { // 上/下架
                let vm = this;
                this.apiLeaseConfigModify({
                    params: {
                        status: status,
                        storageIds: this.getCheckedItem()
                    },
                    callBack() {
                        vm.refreshTable()
                    }
                })
            },
            clickCheckBox(item, index) { // 点击选择
                console.log('点击选择', item, index);
                this.resetWearGoodsList({index, isChecked: !item.isChecked})
            },
            checkAll() { // 全选
                this.resetWearGoodsList({
                    isCheckedAll: this.getItemsCheckedStatus,
                    tag: '全选'
                })
            },
            clickImport() { // 批量导入
                this.passed.changeCurrCpn(WearGoodsListImport)
            },
            initData() {
                let obj = baseUtil.getMetadata();
                this.selectList.stores = obj.stores
                if (obj.stores && obj.stores.length > 0) {
                    this.selectList.wareHouse = baseUtil.getMetadataWareHouseByStoreId({enabled: true, storeId: obj.stores[0].id})
                }
                this.selectList.metal = obj.metal
                this.selectList.gem = obj.gem
                this.selectList.category = obj.category;
                this.selectList.shelfStatus = constUtil._CONST_LEASE_STATUS;
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.search(params);
                })
            },
            refreshTable() {
                PaginationEvent.$emit(this.CONST_RESTORE)
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            console.log('试戴主页 mounted');
            this.initData()
            this.$on('init', () => {
                this.restore()
            })
            this.$watch('form', function () {
                this.search()
            }, {deep: true});
        }
    }
</script>
