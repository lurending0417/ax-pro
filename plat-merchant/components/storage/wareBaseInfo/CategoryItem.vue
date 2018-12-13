<template>
    <div>
        <div class="row">
            <div class="col-md-2">
                <select class="form-control m-b" @change="changeEnabled">
                    <option value="">状态</option>
                    <option value="true">启用</option>
                    <option value="false">禁用</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-md-3"><input type="text" class="form-control" placeholder="" @change="changeSearchField">
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="clickSearch">搜索
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
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'add',
                                titleName: '新增品类'
                            }"
                >
                    <CategoryItemAdd slot="main"
                                     :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                     :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'add'"
                                     :refreshTable="refreshTable"></CategoryItemAdd>
                </ButtonWithModal>
            </div>
        </div>

        <Table :heads="[
                    {name: '', tag: 'CheckBox'},
                    {propName: 'name', name: '名称'},
                    {propName: 'pinyinCode', name: '拼音码'},
                    {propName: 'enabled', name: '状态'},
                    {name: '操作', tag: 'Button'}
                ]"
               :items="items"
               :hasLeft="true"
        >
            <div v-for="(item,index) in items" :slot="'CheckBox'+index">
                <input type="checkbox"/>
            </div>
            <div v-for="(item,index) in items" :slot="'Button'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-primary btn-sm'],
                                btnName: '参数'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'params'+index,
                                modalClasses: ['modal-lg'],
                                titleName: '品类参数'
                            }">
                    <Params slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'params'+index"
                            :params="items[index]"
                            :from="'品类'"></Params>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-warning btn-sm'],
                                btnName: '修改'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'modify'+index,
                                titleName: '修改品类'
                            }">
                    <CategotyItemModify slot="main"
                                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'modify'+index"
                                        :params="items[index]"
                                        :refreshTable="refreshTable"></CategotyItemModify>
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
    import uuid from 'uuid'
    import Table from '~/components/Table'
    import Pagination from '~/components/Pagination'
    import { PaginationEvent } from '~/components/PaginationEvent'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import CategoryItemAdd from '~/components/storage/wareBaseInfo/CategoryItemAdd'
    import CategotyItemModify from '~/components/storage/wareBaseInfo/CategoryItemModify'
    import History from '~/components/storage/wareBaseInfo/History'
    import Params from '~/components/storage/wareBaseInfo/Params'
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    // import { TabsEvent } from '~/components/TabsEvent'

    export default {
        components: {
            Table,
            Pagination,
            ButtonWithModal,
            CategoryItemAdd,
            CategotyItemModify,
            History,
            Params
        },
        data () {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_RESTORE: uuid(),
                CONST_CHANGE_PAGE: uuid()
            }
        },
        computed: {
            ...mapState('storage/warebaseinfo/categoryItem', {
                total: state => state.total
            }),
            ...mapGetters('storage/warebaseinfo/categoryItem', {
                items: 'categoryItemsView'
            })
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/categoryItem', {
                resetCategoryItems: 'resetCategoryItems',
                resetSearchField: 'resetSearchField',
                resetChangeEnable: 'resetChangeEnable',
                resetPagination: 'resetPagination'
            }),
            ...mapActions('storage/warebaseinfo/categoryItem', {
                getCategotyItems: 'getCategotyItems'
            }),
            setCategoryItems (items) {
                this.resetCategoryItems(items)
            },
            initPage () {
                this.resetPagination({start: 0, limit: 10})
            },
            clickSearch () {
                this.getCategotyItemsEventHandler({start: 0, limit: 10})
            },
            changeSearchField (event) {
                this.resetSearchField(event.target.value)
            },
            changeEnabled (event) {
                this.resetChangeEnable(event.target.value)
                this.getCategotyItemsEventHandler({start: 0, limit: 10})
            },
            getCategotyItemsEventHandler (params) {
                this.getCategotyItems(params)
            },
            registerPaginationEvent () {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.getCategotyItemsEventHandler(params)
                })
            },
            refreshTable () {
                PaginationEvent.$emit(this.CONST_RESTORE)
            }
        },
        beforeMount () {
            // TabsEvent.$on('category', () => {
            // this.getCategotyItems({start: 0, limit: 10})
            this.registerPaginationEvent()
            // })
        }
    }
</script>

<style>

</style>
