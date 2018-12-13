<template>
    <div>
        <div class="row">
            <div class="col-md-8">
                <div class="form-inline">
                    <div class="form-group form-group-margin">
                        <select class="form-control" v-model="form.storeId">
                            <option value="">门店</option>
                            <option v-for="store in stores" :value="store.id">{{ store.name }}</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <select class="form-control" v-model="form.managerId">
                            <option value="">负责人</option>
                            <option v-for="staff in staffs" :value="staff.id">{{ staff.nickName }}</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <select class="form-control" v-model="form.enabled">
                            <option value="">状态</option>
                            <option :value="true">启用</option>
                            <option :value="false">停用</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <input type="text" class="form-control" style="width: 150px" ref="query"
                               v-model="query" @keyup.enter="search()">
                    </div>
                    <div class="form-group form-group-margin">
                        <button type="button" class="btn btn-info" @click="search()">搜索</button>
                    </div>
                </div>
            </div>
            <div class="col-md-4" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn-danger'],
                                btnStyle: { minWidth: 80 + 'px' },
                                btnName: '新增'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: addModalName,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'ADD',
                                titleName: '新增库房'
                            }"
                >
                    <WareHouseItemsAdd
                        slot="main"
                        :CONST_CLOSE_MODAL="addModalName"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'ADD'"
                        :refreshTable="refreshTable"
                    >
                    </WareHouseItemsAdd>
                </ButtonWithModal>
            </div>
        </div>

        <TableCpn
            :heads="[
                { propName: 'storeName', name: '门店' },
                { propName: 'name', name: '仓库' },
                { propName: 'recycleDetial', name: '仓库性质' },
                { propName: 'managerName', name: '负责人' },
                { propName: 'statusDetial', name: '状态' },
                { name: '操作', tag: 'BUTTON' }
            ]"
            :items="warehouseItemsView"
        >
            <div v-for="(item, index) in warehouseItemsView" :slot="'BUTTON' + index">
                <ButtonWithModal
                    :btnProps="{
                        btnClasses: ['btn btn-primary btn-sm'],
                        btnName: '修改'
                    }"
                    :modalProps="{
                        CONST_CLOSE_MODAL: closeModifyModal,
                        CONST_CLICK_MODAL: clickModifyModal + index,
                        titleName: '修改库房'
                    }"
                >
                    <WareHouseItemsModify
                        slot="main"
                        :CONST_CLOSE_MODAL="closeModifyModal"
                        :CONST_CLICK_MODAL="clickModifyModal + index"
                        :warehouse="warehouseItemsView[index]"
                        :refreshTable="refreshTable"
                    >
                    </WareHouseItemsModify>
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
    </div>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex';
    import TableCpn from '~/components/Table';
    import Pagination from '~/components/Pagination';
    import {PaginationEvent} from '~/components/PaginationEvent';
    import TableButton from '~/components/TableButton';
    import uuid from 'uuid';
    import ButtonWithModal from '~/components/ButtonWithModal';
    import WareHouseItemsAdd from '~/components/storage/warehouse/WareHouseItemsAdd';
    import WareHouseItemsModify from '~/components/storage/warehouse/WareHouseItemsModify';
    import History from '~/components/storage/wareBaseInfo/History'

    export default {
        components: {
            TableCpn,
            Pagination,
            ButtonWithModal,
            TableButton,
            WareHouseItemsAdd,
            WareHouseItemsModify,
            History
        },
        data() {
            return {
                query: '',
                form: {
                    enabled: true,
                    managerId: '',
                    storeId: ''
                },
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                CONST_TABLE_CLICK: uuid(),
                closeModifyModal: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                clickModifyModal: uuid(),
                addModalName: uuid()
            }
        },
        watch: {
            form: {
                handler() {
                    this.search()
                },
                deep: true
            }
        },
        computed: {
            ...mapState('storage/warehouse/warehouseItemsMain', {
                total: state => state.total
            }),
            ...mapGetters('storage/warehouse/warehouseItemsMain', {
                warehouseItemsView: 'warehouseItemsView',
                stores: 'stores',
                staffs: 'staffs'
            })
        },
        methods: {
            ...mapActions('storage/warehouse/warehouseItemsMain', {
                getWareHouseItems: 'getWareHouseItems'
            }),
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, params => {
                    this.search(params)
                })
            },
            refreshTable() {
                PaginationEvent.$emit(this.CONST_RESTORE)
            },
            search(page) {
                let params = {...this.form, start: 0, limit: 20, query: this.query}
                if (page) {
                    params.limit = page.limit;
                    params.start = page.start;
                }
                this.getWareHouseItems(params);
                this.$refs.query.select()
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        }
    }
</script>

