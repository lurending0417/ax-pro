<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="form.outStoreId">
                    <option value="">所在门店</option>
                    <option :value="item.id" v-for="item in stores">{{item.name}}</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3"><input type="text" class="form-control" v-model="query"  @keyup.enter="search()"></div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search()">搜索</button>
            </div>
            <div class="col-md-7"></div>
        </div>
        <TableCpn
            :heads="[
                { propName: 'billNumber', name: '订单号' },
                { propName: 'createTime', name: '下单时间' },
                { propName: 'shipperName', name: '快递公司' },
                { propName: 'logisticsCode', name: '快递单号' },
                { propName: 'serial', name: '条码' },
                { propName: 'metalName', name: '金属' },
                { propName: 'gemName', name: '宝石' },
                { propName: 'categoryName', name: '品类' },
                { propName: 'storeName', name: '所属门店' },
                { propName: 'depositPrice', name: '押金' },
                { propName: 'rentPrice', name: '租金' },
                { propName: 'leaseDays', name: '租期' },
                { propName: 'statusName', name: '状态' },
                { name: '操作', tag: 'BUTTON' }
            ]"
            :items="getWearRecordLeasingShipping"
        >
            <div v-for="(item,index) in getWearRecordLeasingShipping" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '详情'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: addModalName+index,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+index+'detail',
                                titleName: '详情',
                                modalClasses: ['modal-lg']
                            }">
                    <DeliverDetail
                        slot="main"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index+'detail'"
                        :CONST_CLOSE_MODAL="addModalName+index"
                        :item="item"
                        :refreshTable="refreshTable"
                        :modifyParams="modifyParams"
                        :viewShilpParams="viewShilpParams"
                    >
                    </DeliverDetail>
                </ButtonWithModal>
            </div>
        </TableCpn>
        <Pagination
            :total="total.leasingShipping"
            :limit="10"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>

        <!--修改快递单号-->
        <ModalItem
            :modalProps="{
                CONST_CLOSE_MODAL: modifyParams.CONST_CLOSE_MODAL,
                CONST_CLICK_MODAL: modifyParams.CONST_CLICK_MODAL,
                titleName: '修改快递单号'
            }">
            <ModifyExpressNO slot="main" :modifyParams="modifyParams"></ModifyExpressNO>
        </ModalItem>

        <!--查看物流-->
        <ModalItem
            :modalProps="{
                CONST_CLOSE_MODAL: viewShilpParams.CONST_CLOSE_MODAL,
                CONST_CLICK_MODAL: viewShilpParams.CONST_CLICK_MODAL,
                titleName: '物流信息'
            }">
            <LogisticsShipping slot="main" :viewShilpParams="viewShilpParams"></LogisticsShipping>
        </ModalItem>
    </div>
</template>

<script>
    // import { mapGetters, mapMutations, mapActions } from 'vuex'
    import {mapGetters, mapActions} from 'vuex'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import ModalItem from '~/components/ModalItem'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import uuid from 'uuid'
    import TableCpn from '~/components/Table'
    import Test from '~/components/Test'
    import DeliverDetail from './DeliveredModal/DeliverDetail';
    import ModifyExpressNO from './DeliveredModal/ModifyExpressNO' // 修改快递单号
    import LogisticsShipping from './DeliveredModal/LogisticsShipping' // 查看物流
    import {baseUtil} from '~/util'

    export default {
        components: {
            ButtonWithModal,
            ModalItem,
            DeliverDetail,
            ModifyExpressNO,
            LogisticsShipping,
            Pagination,
            Test,
            TableCpn
        },
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                addModalName: uuid(),
                CONST_RESTORE: uuid(),
                modifyParams: {
                    CONST_CLOSE_MODAL: uuid(),
                    CONST_CLICK_MODAL: uuid()
                },
                viewShilpParams: {
                    CONST_CLOSE_MODAL: uuid() + 'chooseSend',
                    CONST_CLICK_MODAL: uuid() + 'chooseSend'
                },
                stores: [],
                form: {
                    outStoreId: '',
                    status: 'LEASE_SHIPPING'
                },
                query: '',
                initStatus: true
            }
        },
        computed: {
            ...mapGetters('wear/wearRecords', {
                getWearRecordLeasingShipping: 'getWearRecordLeasingShipping',
                total: 'getTotal'
            })
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiGetWearRecordsList: 'apiGetWearRecordsList',
                apiLeaseRecordAccept: 'apiLeaseRecordAccept'
            }),
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    if (!this.initStatus) {
                        this.search(pager)
                    }
                })
                this.$on('init', () => {
                    this.initStatus && (this.initStatus = false);
                    this.search({limit: 10, start: 0})
                })
            },
            search(page) {
                let params = {
                    ...this.form,
                    start: 0,
                    limit: 10,
                    query: this.query
                }
                if (page) {
                    params.limit = page.limit;
                    params.start = page.start;
                }
                this.apiGetWearRecordsList(params)
            },
            initData() {
                this.stores = baseUtil.getMetadata().stores
                this.form = {
                    outStoreId: '',
                    status: 'LEASE_SHIPPING'
                };
                this.query = ''
            },
            refreshTable() {
                PaginationEvent.$emit(this.CONST_RESTORE)
            },
            watchFun() {
                this.$watch('form', function () {
                    this.search()
                }, {deep: true})
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            this.initData()
//            this.$on('init', () => {
//                this.initData()
//            });
            this.watchFun();
        }
    }
</script>
