<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="form.outStoreId">
                    <option value="">所在门店</option>
                    <option :value="item.id" v-for="item in stores">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <select class="form-control" v-model="form.express">
                    <option value="">快递公司</option>
                    <option value="SF">顺丰</option>
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
                { propName: 'shipperName', name: '快递公司' },
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
            :items="getWearRecordShippingRequested"
        >
            <div v-for="(item,index) in getWearRecordShippingRequested" :slot="'BUTTON'+index">
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
                <!--<button type="button" class="btn btn-sm btn-default">输入快递单号</button>-->
            </div>
        </TableCpn>
        <Pagination
            :total="total.shippingRequested"
            :limit="10"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>

        <!--输入快递单号-->
        <ModalItem
            :modalProps="{
                CONST_CLOSE_MODAL: validateParams.CONST_CLOSE_MODAL,
                CONST_CLICK_MODAL: validateParams.CONST_CLICK_MODAL,
                titleName: '快递单号'
            }">
            <InputExpressNo slot="main" :validateParams="validateParams"/>
        </ModalItem>

    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import ModalItem from '~/components/ModalItem'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import uuid from 'uuid'
    import TableCpn from '~/components/Table'
    import Test from '~/components/Test'
    import DeliverDetail from './PendingTokenModel/DeliverDetail';
    import InputExpressNo from './PendingTokenModel/InputExpressNo' // 输入验证码
    import {baseUtil} from '~/util'

    export default {
        components: {
            ModalItem,
            ButtonWithModal,
            DeliverDetail,
            InputExpressNo,
            Pagination,
            Test,
            TableCpn
        },
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                addModalName: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                validateParams: {
                    CONST_CLOSE_MODAL: uuid(),
                    CONST_CLICK_MODAL: uuid()
                },
                stores: [],
                form: {
                    outStoreId: '',
                    status: 'SHIPPING_REQUESTED',
                    express: ''
                },
                query: ''
            }
        },
        computed: {
            ...mapGetters('wear/wearRecords', {
                getWearRecordShippingRequested: 'getWearRecordShippingRequested',
                total: 'getTotal'
            })
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiGetWearRecordsList: 'apiGetWearRecordsList'
            }),
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
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    this.search(pager)
                })
            },
            refreshTable() {
                PaginationEvent.$emit(this.CONST_RESTORE)
            },
            initData() {
                this.stores = baseUtil.getMetadata().stores
                this.form = {
                    outStoreId: '',
                    status: 'SHIPPING_REQUESTED',
                    express: ''
                };
                this.query = ''
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
                this.initData()
            });
            this.watchFun();
        }
    }
</script>
