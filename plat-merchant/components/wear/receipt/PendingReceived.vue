<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="form.outStoreId">
                    <option value="">出货门店</option>
                    <option :value="item.id" v-for="item in stores">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="form.backStoreId">
                    <option value="">收货门店</option>
                    <option :value="item.id" v-for="item in stores">{{item.name}}</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3"><input type="text" class="form-control" v-model="query"  @keyup.enter="search()"/></div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search()">搜索</button>
            </div>
            <div class="col-md-1">
                <!--<ButtonWithModal-->
                    <!--:btnProps="{-->
                                <!--btnClasses: ['btn btn-w-m btn-info'],-->
                                <!--btnName: '收货'-->
                            <!--}"-->
                    <!--:modalProps="{-->
                                <!--CONST_CLOSE_MODAL: addModalName+'receive',-->
                                <!--CONST_CLICK_MODAL:CONST_CLICK_MODAL+'receive',-->
                                <!--titleName: '收货'-->
                            <!--}">-->
                    <!--<ReceiveRecord-->
                        <!--slot="main"-->
                        <!--:CONST_CLICK_MODAL="CONST_CLICK_MODAL+'receive'"-->
                        <!--:CONST_CLOSE_MODAL="addModalName+'receive'"-->
                        <!--:refreshTable="refreshTable"-->
                        <!--:tableList="getWearRecordBackShipping"-->
                    <!--&gt;-->
                    <!--</ReceiveRecord>-->
                <!--</ButtonWithModal>-->
            </div>
            <div class="col-md-7"></div>
        </div>
        <TableCpn
            :heads="[
                { propName: 'billNumber', name: '订单号' },
                { propName: 'createTime', name: '下单时间' },
                { propName: 'shipperNameBack', name: '快递公司' },
                { propName: 'logisticsCodeBack', name: '快递单号' },
                { propName: 'serial', name: '条码' },
                { propName: 'metalName', name: '金属'},
                { propName: 'gemName', name: '宝石' },
                { propName: 'categoryName', name: '品类' },
                { propName: 'storeName', name: '所属门店' },
                { propName: 'storeName', name: '应收门店' },
                { propName: 'depositPrice', name: '押金' },
                { propName: 'rentPrice', name: '租金' },
                { propName: 'leaseDays', name: '租期' },
                { name: '操作', tag: 'BUTTON' }
            ]"
            :items="getWearRecordBackShipping"
        >
            <div v-for="(item,index) in getWearRecordBackShipping" :slot="'BUTTON'+index">
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
                    >
                    </DeliverDetail>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '物流'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: addModalName+index,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+index+'express',
                                titleName: '查看物流'
                            }">
                    <LogisticsShipping
                        slot="main"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index+'express'"
                        :CONST_CLOSE_MODAL="addModalName+index"
                        :item="item"
                        :refreshTable="refreshTable"
                    >
                    </LogisticsShipping>
                </ButtonWithModal>
            </div>
        </TableCpn>
        <Pagination
            :total="total.backShipping"
            :limit="10"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>
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
    import DeliverDetail from './PendingReceiveModal/DeliverDetail';
    import ReceiveRecord from './PendingReceiveModal/ReceiveRecord';
    import LogisticsShipping from './PendingReceiveModal/LogisticsShipping';
    import {baseUtil} from '~/util'

    export default {
        components: {
            ButtonWithModal,
            ModalItem,
            DeliverDetail,
            ReceiveRecord,
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
                    backStoreId: '',
                    outStoreId: '',
                    status: 'BACK_SHIPPING'
                },
                query: ''
            }
        },
        computed: {
            ...mapGetters('wear/wearRecords', {
                getWearRecordBackShipping: 'getWearRecordBackShipping',
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
                    this.search(pager)
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
                    backStoreId: '',
                    outStoreId: '',
                    status: 'BACK_SHIPPING'
                };
                this.query = ''
            },
            refreshTable() {
                PaginationEvent.$emit(this.CONST_RESTORE)
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            this.initData()
            this.$on('init', () => {
                this.initData()
            });
            this.$watch('form', function () {
                this.search()
            }, {deep: true})
        }
    }
</script>
