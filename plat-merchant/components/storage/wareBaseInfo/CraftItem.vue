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
            <div class="col-md-3"><input type="text" class="form-control" placeholder="" @change="changeQuery">
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;"
                        @click="getCraftItems({start:0,limit:10})">搜索
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
                                titleName: '新增工艺'
                            }"
                >
                    <CraftItemAdd slot="main"
                                  :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                  :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'add'"
                                  :refreshTable="refreshTable"></CraftItemAdd>
                </ButtonWithModal>
            </div>
        </div>

        <Table :heads="heads" :items="getCraftItemsView">
            <div v-for="(item,index) in getCraftItemsView" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-warning btn-sm'],
                                btnName: '修改'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'modify'+index,
                                titleName: '编辑工艺'
                            }">
                    <CraftItemModify slot="main"
                                     :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                     :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'modify'+index"
                                     :params="item"
                                     :refreshTable="refreshTable"></CraftItemModify>
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
            :CONST_RESTORE="CONST_RESTORE">
        </Pagination>

    </div>
</template>

<script>
    // import { TabsEvent } from '~/components/TabsEvent'
    import Table from '~/components/Table'
    import Pagination from '~/components/Pagination'
    import { PaginationEvent } from '~/components/PaginationEvent'
    import TableInput from '~/components/TableInput'
    import TableButton from '~/components/TableButton'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import uuid from 'uuid'
    import { TableEvent } from '../../../components/TableEvent'
    import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
    import CraftItemAdd from '~/components/storage/wareBaseInfo/CraftItemAdd'
    import Params from '~/components/storage/wareBaseInfo/Params'
    import CraftItemModify from '~/components/storage/wareBaseInfo/CraftItemModify'
    import History from '~/components/storage/wareBaseInfo/History'

    export default {
        components: {
            Table,
            Pagination,
            TableInput,
            TableButton,
            TableEvent,
            ButtonWithModal,
            CraftItemAdd,
            Params,
            CraftItemModify,
            History
        },
        data () {
            return {
                heads: [
                    {propName: 'name', name: '名称'},
                    {propName: 'pinyinCode', name: '拼音码'},
                    {propName: 'enabled', name: '状态'},
                    {name: '操作', tag: 'BUTTON'}
                ],
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid()
            }
        },
        computed: {
            ...mapState('storage/warebaseinfo/craftItem', {
                total: state => state.total
            }),
            ...mapGetters('storage/warebaseinfo/craftItem', {
                getCraftItemsView: 'getCraftItemsView'
            })
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/craftItem', {
                resetCraftItems: 'resetCraftItems',
                resetEnabled: 'resetEnabled',
                resetQuery: 'resetQuery'
            }),
            ...mapActions('storage/warebaseinfo/craftItem', {
                getCraftItems: 'getCraftItems'
            }),
            changeEnabled (event) {
                this.resetEnabled(event.target.value)
                this.getCraftItems()
            },
            changeQuery (event) {
                this.resetQuery(event.target.value)
            },
            registerPaginationEvent () {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.getCraftItems(params)
                })
            },
            refreshTable () {
                PaginationEvent.$emit(this.CONST_RESTORE)
            }
        },
        beforeMount () {
            // TabsEvent.$on('craft', () => {
            this.registerPaginationEvent()
            // this.getCraftItems({start: 0, limit: 10})
            // })
        }
    }
</script>

<style>

</style>
