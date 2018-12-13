<template>
    <div>
        <div class="row">
            <div class="col-md-2">
                <select class="form-control m-b" v-model="enabled" @change="changeState">
                    <option value="">状态</option>
                    <option value="true">启用</option>
                    <option value="false">禁用</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-md-3">
                <input type="text" class="form-control" ref="searchField" @input="inputSearchFieldEventHandler"
                       placeholder="" name="searchText" @keyup.enter="searchEventHandler"></div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="searchEventHandler">
                    搜索
                </button>
            </div>
            <div class="col-md-6"></div>
            <div class="col-md-2" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn-danger'],
                                btnStyle: { minWidth: 80 + 'px' },
                                btnName: '新增'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '新增供货商'
                            }"
                >
                    <SupplierItemAdd slot="main"
                                     :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                     :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                                     :refreshTable="refreshTable"></SupplierItemAdd>
                </ButtonWithModal>
            </div>
        </div>

        <Table :heads="heads" :items="supplierItemsView">
            <div v-for="(item,index) in supplierItemsView" :slot="'BUTTON1'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-primary btn-sm'],
                                btnName: '详情'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'detial'+index,
                                titleName: '供货商详情'
                            }">
                    <SupplierItemDetail slot="main"
                                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'detial'+index"
                                        :params="index"></SupplierItemDetail>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-warning btn-sm'],
                                btnName: '修改'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'modify'+index,
                                titleName: '修改供货商'
                            }">
                    <SupplierItemModify slot="main"
                                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'modify'+index"
                                        :params="supplierItemsView[index]"
                                        :refreshTable="refreshTable"></SupplierItemModify>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-info btn-sm'],
                                btnName: '历史'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'history'+index,
                                titleName: item.name+'操作记录',
                                modalClasses: ['modal-lg']
                            }">
                    <History slot="main"
                             :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                             :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'history'+index"
                             :params="item"></History>
                </ButtonWithModal>
            </div>

            <!--<div v-for="(item,index) in supplierItemsView" :slot="'INPUT1'+index">
                <TableInput
                    :btnProps="{
                    }"
                    :item=item
                    :inputCallback="inputCompleted"
                ></TableInput>
            </div>
            <div v-for="(item,index) in supplierItemsView" :slot="'INPUT2'+index">
                <TableInput
                    :btnProps="{
                    }"
                    :item=item
                    :inputCallback="inputCompleted"
                ></TableInput>
            </div>-->
        </Table>
        <Pagination
            :total="total"
            :limit="10"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        />
    </div>
</template>

<script>
    import Table from '~/components/Table'
    import Pagination from '~/components/Pagination'
    import { PaginationEvent } from '~/components/PaginationEvent'
    import TableInput from '~/components/TableInput'
    import TableButton from '~/components/TableButton'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import SupplierItemAdd from '~/components/storage/wareBaseInfo/SupplierItemAdd'
    import SupplierItemDetail from '~/components/storage/wareBaseInfo/SupplierItemDetail'
    import SupplierItemModify from '~/components/storage/wareBaseInfo/SupplierItemModify'
    import History from '~/components/storage/wareBaseInfo/History'
    import uuid from 'uuid'
    import { TableEvent } from '~/components/TableEvent'
    // import { TabsEvent } from '~/components/TabsEvent'
    import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
    import baseUtil from '~/util/baseUtil'

    export default {
        components: {
            Table,
            Pagination,
            TableInput,
            TableButton,
            TableEvent,
            ButtonWithModal,
            SupplierItemAdd,
            SupplierItemDetail,
            SupplierItemModify,
            History
        },
        data () {
            return {
                heads: [
                    {propName: 'name', name: '名称'},
                    {propName: 'pinyinCode', name: '拼音码'},
                    {propName: 'enabled', name: '状态'},
                    {name: '操作', tag: 'BUTTON1'}
                ],
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                enabled: '',
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid()
            }
        },
        computed: {
            ...mapState('storage/warebaseinfo/supplierItem', {
                supplierEnabled: 'enabled',
                total: state => state.total
            }),
            ...mapGetters('storage/warebaseinfo/supplierItem', {
                supplierItemsView: 'supplierItemsView'
            })
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/supplierItem', {
                resetMerchantId: 'resetMerchantId',
                resetChangeEnable: 'resetChangeEnable'
            }),
            ...mapActions('storage/warebaseinfo/supplierItem', {
                getSupplierItems: 'getSupplierItems',
                inputSearchField: 'inputSearchField'
            }),
            initMerchantIdEventHandler (merchantId) {
                this.resetMerchantId(merchantId)
            },
            inputSearchFieldEventHandler () {
                this.inputSearchField(this.$refs.searchField.value)
            },
            changeState () {
                this.resetChangeEnable(this.enabled)
                this.initData({start: 0, limit: 10})
            },
            searchEventHandler () {
                this.initData({start: 0, limit: 10})
                this.$refs.searchField.select()
            },
            initData (params) {
                this.getSupplierItems(params)
            },
            registerPaginationEvent () {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.initData(params)
                })
            },
            refreshTable () {
                PaginationEvent.$emit(this.CONST_RESTORE)
            }
        },
        beforeMount () {
            this.enabled = this.supplierEnabled;
            this.initMerchantIdEventHandler(baseUtil.getMerchantId())
            this.registerPaginationEvent()
        }
    }
</script>

<style>

</style>
