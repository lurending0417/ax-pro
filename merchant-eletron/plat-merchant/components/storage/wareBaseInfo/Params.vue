<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <div class="col-md-1"></div>
            <div class="col-md-3"><input type="text" class="form-control" placeholder="" @change="changeSearchField">
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="initData">
                    搜索
                </button>
            </div>
            <div class="col-md-4"></div>
            <div class="col-md-2" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn-danger'],
                                btnStyle: { minWidth: 80 + 'px' },
                                btnName: '新增'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL_1+'add',
                                titleName: '新增'+this.from+'参数'
                            }">
                    <ParamsAdd slot="main"
                               :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                               :CONST_CLICK_MODAL_1="CONST_CLICK_MODAL_1+'add'"
                               :params="params"
                               :refreshTable="refreshTable_1"
                               :from="from"></ParamsAdd>
                </ButtonWithModal>
            </div>
        </div>

        <Table :heads="heads" :items="getCategotyParamsItems">
            <div v-for="(item,index) in getCategotyParamsItems" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-warning btn-sm'],
                                btnStyle: { width: 50 + 'px' },
                                btnName: '修改'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL_1+index,
                                titleName: '修改'+from+'参数'
                            }">
                    <ParamsModify slot="main"
                                  :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                  :CONST_CLICK_MODAL="CONST_CLICK_MODAL_1+index"
                                  :params="getCategotyParamsItems[index]"
                                  :refreshTable="refreshTable_1"
                                  :from="from"></ParamsModify>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-info btn-sm'],
                                btnStyle: { width: 50 + 'px' },
                                btnName: '历史'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL_1+index+'history',
                                titleName: from+'参数历史'
                            }">
                    <History slot="main"
                             :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                             :CONST_CLICK_MODAL="CONST_CLICK_MODAL_1+index+'history'"
                             :params="item">

                    </History>
                </ButtonWithModal>
                <TableButton
                    :btnProps="{
                                btnClasses: ['btn btn-danger btn-sm'],
                                btnStyle: { width: 50 + 'px' },
                                btnName: '删除'
                            }"
                    :item=item
                    :clickCallback="deleteCategoryParamItem"
                >
                </TableButton>
            </div>
        </Table>

        <Pagination
            :total="total"
            :limit="20"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        />

    </form>
</template>


<script>
    import Table from '~/components/Table'
    import TableButton from '~/components/TableButton'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import Pagination from '~/components/Pagination'
    import { PaginationEvent } from '~/components/PaginationEvent'
    import ParamsAdd from '~/components/storage/wareBaseInfo/ParamsAdd'
    import ParamsModify from '~/components/storage/wareBaseInfo/ParamsModify'
    import History from './History'
    import { mapMutations, mapActions, mapGetters, mapState } from 'vuex'
    import uuid from 'uuid'

    export default {
        props: ['CONST_CLICK_MODAL', 'refreshTable', 'params', 'from'],
        components: {
            Table,
            TableButton,
            ButtonWithModal,
            ParamsAdd,
            ParamsModify,
            Pagination,
            History
        },
        data () {
            return {
                heads: [
                    {propName: 'name', name: '名称'},
                    {propName: 'inputType', name: '类型'},
                    {propName: 'preValues', name: '可选值'},
                    {propName: 'required', name: '必填'},
                    {propName: 'enabled', name: '状态'},
                    {name: '操作', tag: 'BUTTON'}
                ],
                CONST_RESTORE: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_CLICK_MODAL_1: uuid()
            }
        },
        computed: {
            ...mapState('storage/warebaseinfo/params', {
                total: state => state.total
            }),
            ...mapGetters('storage/warebaseinfo/params', {
                getCategotyParamsItems: 'getCategotyParamsItems'
            })
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/params', {
                resetCategotyParamItems: 'resetCategotyParamItems',
                resetType: 'resetType',
                resetTargetId: 'resetTargetId',
                resetEnabled: 'resetEnabled',
                resetQuery: 'resetQuery',
                resetPagination: 'resetPagination',
                resetDeleteFieldId: 'resetDeleteFieldId'
            }),
            ...mapActions('storage/warebaseinfo/params', {
                getParams: 'getParams',
                deleteParam: 'deleteParam'
            }),
            changeSearchField (event) {
                this.resetQuery(event.target.value)
            },
            closeModal (name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                this.refreshTable()
            },
            deleteCategoryParamItem (event, item) {
                this.resetDeleteFieldId(item.id)
                this.deleteParam(() => {
                    this.initData()
                })
            },
            initData () {
                this.getParams({start: 0, limit: 20})
            },
            registerPaginationEvent () {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.getParams(params)
                })
            },
            refreshTable_1 () {
                PaginationEvent.$emit(this.CONST_RESTORE)
            }
        },
        mounted () {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                console.log('2222');
                if (this.from === '品类') {
                    this.resetType('CATEGORY')
                } else if (this.from === '宝石') {
                    this.resetType('GEM')
                } else if (this.from === '金属') {
                    this.resetType('METAL')
                }
                this.resetTargetId(this.params.id)
                this.initData()
                this.registerPaginationEvent()
            })
        }
    }
</script>

<style>
</style>
