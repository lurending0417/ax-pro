<template>
    <div>
        <div class="row">
            <div class="col-md-4">
                <input type="text" class="form-control" style="display: inline-block; max-width: 150px" ref="query">
                <button class="btn btn-info" style="margin: 0 10px 3px" @click="search()">搜索</button>
            </div>
            <div class="col-md-7" style="text-align: right">
            </div>
            <div class="col-md-1" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-danger'],
                                btnName: '新增'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'add',
                                titleName: '新增门店',
                                modalClasses: ['modal-lg']
                            }"
                >
                    <StoreManageAdd slot="main"
                                    :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                    :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'add'"
                                    :refreshTable="refreshTable"
                    >
                    </StoreManageAdd>
                </ButtonWithModal>
            </div>
        </div>

        <TableCpn :heads="[
                    {propName: 'name', name: '门店名称'},
                    {propName: 'address', name: '门店地址'},
                    {propName: 'enabledStatus', name: '状态'},
                    {propName: 'servicePhone', name: '联系方式'},
                    {tag:'BUTTON',name: '操作'}
                ]"
                  :items="getStoreListView">
            <div v-for="(item,index) in getStoreListView" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                        btnClasses: ['btn btn-primary btn-sm'],
                        btnName: '修改'
                    }"
                    :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL + index,
                        titleName: '修改门店',
                        modalClasses: ['modal-lg']
                    }"
                >
                    <StoreManageUpdate
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL + index"
                        :refreshTable="refreshTable"
                        :item="item"
                    >
                    </StoreManageUpdate>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                        btnClasses: ['btn btn-primary btn-sm'],
                        btnName: '详情'
                    }"
                    :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL +'detail'+ index,
                        titleName: '详情',
                        modalClasses: ['modal-lg']
                    }"
                >
                    <StoreManageDetail
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL +'detail'+ index"
                        :item="item"
                    >
                    </StoreManageDetail>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-info btn-sm'],
                                btnName: '历史'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'history'+index,
                                titleName: '历史',
                                modalClasses: ['modal-lg']
                            }">
                    <History slot="main"
                             :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                             :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'history'+index"
                             :params="item"></History>
                </ButtonWithModal>
            </div>
        </TableCpn>

        <Pagination
            :total="total"
            :limit="20"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>

        <!--<plainAlertBox :propParams="{defineStyle:{top:'190px'},msg: '管理人员错误'}"/>-->
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import TableCpn from '~/components/Table';
    import uuid from 'uuid';
    import Pagination from '~/components/Pagination';
    import {PaginationEvent} from '~/components/PaginationEvent';
    import ButtonWithModal from '~/components/ButtonWithModal';
    import TableButton from '~/components/TableButton';
    import StoreManageAdd from '~/components/merchant/StoreManageAdd';
    import StoreManageUpdate from '~/components/merchant/StoreManageUpdate';
    import StoreManageDetail from '~/components/merchant/StoreManageDetail';
    import History from '~/components/storage/wareBaseInfo/History'

    export default {
        components: {
            TableCpn,
            Pagination,
            ButtonWithModal,
            TableButton,
            StoreManageAdd,
            StoreManageUpdate,
            StoreManageDetail,
            History
        },
        props: ['passed'],
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_RESTORE: uuid()
            }
        },
        computed: {
            ...mapGetters('merchant/storeManageMain', {
                getStoreListView: 'getStoreListView',
                reginData: 'reginData',
                total: 'getTotal'
            })
        },
        methods: {
            ...mapActions('merchant/storeManageMain', {
                getStoreByStoreId: 'getStoreByStoreId' // 获取门店
            }),
            ...mapActions('storage/warebaseinfo/goldPriceItem', { // 刷新metaData
                getMetaData: 'getMetaData'
            }),
            search(page) {
                let params = {
                    query: this.$refs.query.value,
                    limit: 20,
                    start: 0
                }
                if (page) {
                    params.limit = page.limit;
                    params.start = page.start;
                }
                this.getStoreByStoreId(params);
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
            // 刷新metaData
            this.getMetaData()
        }
    }
</script>

<style>

</style>
