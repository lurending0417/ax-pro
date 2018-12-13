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
                        @click="getGemstoneItems({start:0,limit:10})">搜索
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
                                titleName: '新增宝石'
                            }"
                >
                    <GemstoneItemAdd slot="main"
                                     :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                     :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'add'"
                                     :refreshTable="refreshTable">
                    </GemstoneItemAdd>
                </ButtonWithModal>
            </div>
        </div>

        <Table :heads="heads" :items="getGemstoneItemsView">
            <div v-for="(item,index) in getGemstoneItemsView" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-primary btn-sm'],
                                btnName: '参数'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'params'+index,
                                modalClasses: ['modal-lg'],
                                titleName: '宝石参数'
                            }">
                    <Params slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'params'+index"
                            :params="item"
                            :from="'宝石'"></Params>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-warning btn-sm'],
                                btnName: '修改'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'modify'+index,
                                titleName: '编辑宝石'
                            }">
                    <GemstoneItemModify slot="main"
                                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'modify'+index"
                                        :params="item"
                                        :refreshTable="refreshTable"></GemstoneItemModify>
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
    import GemstoneItemAdd from '~/components/storage/wareBaseInfo/GemstoneItemAdd'
    import Params from '~/components/storage/wareBaseInfo/Params'
    import GemstoneItemModify from '~/components/storage/wareBaseInfo/GemstoneItemModify'
    import History from '~/components/storage/wareBaseInfo/History'

    export default {
        components: {
            Table,
            Pagination,
            TableInput,
            TableButton,
            TableEvent,
            ButtonWithModal,
            GemstoneItemAdd,
            Params,
            GemstoneItemModify,
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
            ...mapState('storage/warebaseinfo/gemstoneItem', {
                total: state => state.total
            }),
            ...mapGetters('storage/warebaseinfo/gemstoneItem', {
                getGemstoneItemsView: 'getGemstoneItemsView'
            })
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/gemstoneItem', {
                resetGemstoneItems: 'resetGemstoneItems',
                resetEnabled: 'resetEnabled',
                resetQuery: 'resetQuery'
            }),
            ...mapActions('storage/warebaseinfo/gemstoneItem', {
                getGemstoneItems: 'getGemstoneItems'
            }),
            changeEnabled (event) {
                this.resetEnabled(event.target.value)
                this.getGemstoneItems()
            },
            changeQuery (event) {
                this.resetQuery(event.target.value)
            },
            registerPaginationEvent () {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.getGemstoneItems(params)
                })
            },
            refreshTable () {
                PaginationEvent.$emit(this.CONST_RESTORE)
            }
        },
        beforeMount () {
            // TabsEvent.$on('gemstone', () => {
            this.registerPaginationEvent()
            // this.getGemstoneItems({start: 0, limit: 10})
            // })
        }
    }
</script>

<style>

</style>
