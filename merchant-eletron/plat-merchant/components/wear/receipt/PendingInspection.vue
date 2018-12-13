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
            <div class="col-md-3"><input type="text" class="form-control" v-model="query" @keyup.enter="search()"></div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search()">搜索</button>
            </div>
            <div class="col-md-8"></div>
        </div>
        <TableCpn
            :heads="[
                { propName: 'billNumber', name: '订单号' },
                { propName: 'createTime', name: '下单时间' },
                { propName: 'createTime', name: '收货时间' },
                { propName: 'serial', name: '条码' },
                { propName: 'amount', name: '数量' },
                { propName: 'metalName', name: '金属' },
                { propName: 'gemName', name: '宝石' },
                { propName: 'categoryName', name: '品类' },
                { propName: 'storeName', name: '当前门店' },
                { propName: 'outStoreName', name: '发货门店' },
                { propName: 'depositPrice', name: '押金',unit: '元' },
                { propName: 'rentPrice', name: '租金' ,unit: '元'},
                { propName: 'leaseDays', name: '租期' },
                { name: '操作', tag: 'BUTTON' }
            ]"
            :items="getWearRecordWaitRejectQc"
        >
            <div v-for="(item,index) in getWearRecordWaitRejectQc" :slot="'BUTTON'+index">
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
                        :validateParams="validateParams"
                    >
                    </DeliverDetail>
                </ButtonWithModal>
            </div>
        </TableCpn>
        <Pagination
            :total="total.waitRejectQc"
            :limit="20"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>

        <!--质检未通过说明-->
        <ModalItem
            :modalProps="{
                CONST_CLOSE_MODAL: validateParams.CONST_CLOSE_MODAL,
                CONST_CLICK_MODAL: validateParams.CONST_CLICK_MODAL,
                titleName: '未通过'
            }">
            <RejectInspection slot="main" :validateParams="validateParams" :refreshTable="refreshTable"></RejectInspection>
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
    import DeliverDetail from './PendingInspectionModal/DeliverDetail';
    import RejectInspection from './PendingInspectionModal/RejectInspection';
    // import { constUtil, baseUtil, dateUtil } from '~/util'
    import {baseUtil} from '~/util'

    export default {
        components: {
            ButtonWithModal,
            ModalItem,
            DeliverDetail,
            RejectInspection,
            Pagination,
            TableCpn
        },
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                addModalName: uuid(),
                CONST_RESTORE: uuid(),
                validateParams: {
                    CONST_CLOSE_MODAL: uuid(),
                    CONST_CLICK_MODAL: uuid()
                },
                stores: [],
                form: {
                    backStoreId: '',
                    outStoreId: '',
                    status: 'WAIT_REJECT_QC,WAIT_BACK_QC'
                },
                query: '',
                initStatus: true
            }
        },
        computed: {
            ...mapGetters('wear/wearRecords', {
                getWearRecordWaitRejectQc: 'getWearRecordWaitRejectQc',
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
                    this.search({limit: 20, start: 0})
                })
            },
            search(page) {
                let params = {
                    ...this.form,
                    start: 0,
                    limit: 20,
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
                    status: 'WAIT_REJECT_QC,WAIT_BACK_QC'
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
//            this.$on('init', () => {
//                this.initData()
//            });
            this.$watch('form', function () {
                this.search()
            }, {deep: true})
        }
    }
</script>
