<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="form.outStoreId">
                    <option value="">出货门店</option>
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
                { propName: 'serial', name: '条码' },
                { propName: 'amount', name: '数量' },
                { propName: 'metalName', name: '金属' },
                { propName: 'gemName', name: '宝石' },
                { propName: 'categoryName', name: '品类' },
                { propName: 'storeName', name: '所属门店' },
                { propName: 'depositPrice', name: '押金' },
                { propName: 'rentPrice', name: '租金' },
                { propName: 'leaseDays', name: '租期' },
                { name: '操作', tag: 'BUTTON' }
            ]"
            :items="getWearRecordWaitShipping"
        >
            <div v-for="(item,index) in getWearRecordWaitShipping" :slot="'BUTTON'+index" style="position: relative;">
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
                        :id="item.id"
                        :item="item"
                        :refreshTable="refreshTable"
                        :validateParams="validateParams"
                    >
                    </DeliverDetail>
                </ButtonWithModal>
            </div>
        </TableCpn>
        <Pagination
            :total="total.waitShipping"
            :limit="10"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>

        <!--发货-->
        <ModalItem
            :modalProps="{
                CONST_CLOSE_MODAL: validateParams.CONST_CLOSE_MODAL,
                CONST_CLICK_MODAL: validateParams.CONST_CLICK_MODAL,
                titleName: '条码验证'
            }">
            <DeliverValidate slot="main" :validateParams="validateParams"
                             :chooseSendParams="chooseSendParams"></DeliverValidate>
        </ModalItem>

        <!--选择发货方式-->
        <ModalItem
            :modalProps="{
                CONST_CLOSE_MODAL: chooseSendParams.CONST_CLOSE_MODAL,
                CONST_CLICK_MODAL: chooseSendParams.CONST_CLICK_MODAL,
                titleName: '发货'
            }">
            <DeliverChooseSend slot="main" :chooseSendParams="chooseSendParams"></DeliverChooseSend>
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
    import DeliverDetail from './PendingDeliverModal/DeliverDetail';
    import DeliverValidate from './PendingDeliverModal/DeliverValidate' // 发货验证
    import DeliverChooseSend from './PendingDeliverModal/DeliverChooseSend' // 发货方式选择
    import {baseUtil} from '~/util'

    export default {
        components: {
            ButtonWithModal,
            ModalItem,
            DeliverDetail,
            DeliverValidate,
            DeliverChooseSend,
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
                validateParams: {
                    CONST_CLOSE_MODAL: uuid(),
                    CONST_CLICK_MODAL: uuid()
                },
                chooseSendParams: {
                    CONST_CLOSE_MODAL: uuid() + 'chooseSend',
                    CONST_CLICK_MODAL: uuid() + 'chooseSend'
                },
                stores: [],
                form: {
                    outStoreId: '',
                    status: 'WAIT_SHIPPING'
                },
                query: '',
                initStatus: true
            }
        },
        computed: {
            ...mapGetters('wear/wearRecords', {
                getWearRecordWaitShipping: 'getWearRecordWaitShipping',
                total: 'getTotal'
            })
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiGetWearRecordsList: 'apiGetWearRecordsList'
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
                    outStoreId: '',
                    status: 'WAIT_SHIPPING'
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
            this.$on('init', () => {
                // 每次点击选项卡的时候，初始化搜索条件
                this.initData()
            });
            this.watchFun();
        }
    }
</script>
