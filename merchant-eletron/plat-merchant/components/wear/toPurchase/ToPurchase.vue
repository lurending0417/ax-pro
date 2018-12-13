<template>
    <div>
        <div class="form-inline">
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
            <div class="col-md-8"></div>
        </div>
        <TableCpn
            :heads="[
                { propName: 'billNumber', name: '订单号' },
                { propName: 'createTime', name: '下单时间' },
                { propName: 'storeName', name: '所属门店' },
                { propName: 'depositCost', name: '已交押金',unit: '元' },
                { propName: 'rentCost', name: '已交租金' ,unit: '元'},
                { propName: 'retailPrice', name: '应收货款',unit: '元' },
                { propName: 'actualRentCost', name: '应收租金',unit: '元' },
                { propName: 'refundCost', name: '返回金额',unit: '元' },
                { propName: 'totalCost', name: '实收金额',unit: '元' },
                { name: '操作', tag: 'BUTTON' }
            ]"
            :items="getWearRecordDoneBuy"
        >
            <div v-for="(item,index) in getWearRecordDoneBuy" :slot="'BUTTON'+index">
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
            :total="total.doneBuy"
            :limit="20"
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
    import DeliverDetail from './DeliverDetail';
    // import { constUtil, baseUtil, dateUtil } from '~/util'
    import {baseUtil} from '~/util'

    export default {
        components: {
            ButtonWithModal,
            ModalItem,
            DeliverDetail,
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
                    status: 'DONE_BUY'
                },
                query: ''
            }
        },
        computed: {
            ...mapGetters('wear/wearRecords', {
                getWearRecordDoneBuy: 'getWearRecordDoneBuy',
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
                let obj = baseUtil.getMetadata();
                this.stores = obj.stores
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
                this.search()
            })
            this.$watch('form', function () {
                this.search()
            }, {deep: true})
        }
    }
</script>
