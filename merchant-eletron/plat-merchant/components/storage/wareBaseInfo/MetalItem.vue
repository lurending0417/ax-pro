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
                        @click="getMetalItems({start:0,limit:20})">搜索
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
                                titleName: '新增金属'
                            }"
                >
                    <MetalItemAdd slot="main"
                                  :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                  :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'add'"
                                  :refreshTable="refreshTable">
                    </MetalItemAdd>
                </ButtonWithModal>
            </div>
        </div>

        <Table :heads="heads" :items="getMetalItemsView">
            <div v-for="(item,index) in getMetalItemsView" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-primary btn-sm'],
                                btnName: '参数'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'params'+index,
                                modalClasses: ['modal-lg'],
                                titleName: '金属参数'
                            }">
                    <Params slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'params'+index"
                            :params="item"
                            :from="'金属'"></Params>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-warning btn-sm'],
                                btnName: '修改'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'modify'+index,
                                titleName: '编辑金属'
                            }">
                    <MetalItemModify slot="main"
                                     :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                     :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'modify'+index"
                                     :params="item"
                                     :refreshTable="refreshTable"></MetalItemModify>
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
            :limit="20"
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
    import MetalItemAdd from '~/components/storage/wareBaseInfo/MetalItemAdd'
    import Params from '~/components/storage/wareBaseInfo/Params'
    import MetalItemModify from '~/components/storage/wareBaseInfo/MetalItemModify'
    import History from '~/components/storage/wareBaseInfo/History'

    export default {
        components: {
            Table,
            Pagination,
            TableInput,
            TableButton,
            TableEvent,
            ButtonWithModal,
            MetalItemAdd,
            Params,
            MetalItemModify,
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
            ...mapState('storage/warebaseinfo/metalItem', {
                total: state => state.total
            }),
            ...mapGetters('storage/warebaseinfo/metalItem', {
                getMetalItemsView: 'getMetalItemsView'
            })
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/metalItem', {
                resetMetalItems: 'resetMetalItems',
                resetEnabled: 'resetEnabled',
                resetQuery: 'resetQuery'
            }),
            ...mapActions('storage/warebaseinfo/metalItem', {
                getMetalItems: 'getMetalItems'
            }),
            changeEnabled (event) {
                this.resetEnabled(event.target.value)
                this.getMetalItems()
            },
            changeQuery (event) {
                this.resetQuery(event.target.value)
            },
            registerPaginationEvent () {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.getMetalItems(params)
                })
            },
            refreshTable () {
                PaginationEvent.$emit(this.CONST_RESTORE)
            }
        },
        beforeMount () {
            // TabsEvent.$on('metal', () => {
            this.registerPaginationEvent()
            // this.getMetalItems({start: 0, limit: 20})
            // })
        }
    }
</script>

<style>

</style>
