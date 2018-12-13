<template>
    <div>
        <div style="overflow-x: scroll; width: 100%;">
            <Table :heads="heads" :items="historyItemsView"></Table>
        </div>
        <Pagination
            :total="total"
            :limit="20"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        />
    </div>
</template>

<script>
    import uuid from 'uuid'
    import Table from '~/components/Table'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'params'],
        components: {
            Table,
            Pagination,
            ButtonWithModal
        },
        data() {
            return {
                heads: [
                    {propName: 'createTime', name: '修改时间'},
                    {propName: 'fieldName', name: '修改数据类型'},
                    {propName: 'oldValue', name: '原数据'},
                    {propName: 'newValue', name: '修改后数据'},
                    {propName: 'creatorName', name: '操作人'}
                ],
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid()
            }
        },
        computed: {
            ...mapState('storage/warebaseinfo/history', {
                total: state => state.total
            }),
            ...mapGetters('storage/warebaseinfo/history', {
                historyItemsView: 'historyItemsView'
            })
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/history', {
                resetEntityId: 'resetEntityId',
                resetStartYmd: 'resetStartYmd',
                resetEndYmd: 'resetEndYmd'
            }),
            ...mapActions('storage/warebaseinfo/history', {
                getHistoryItems: 'getHistoryItems'
            }),
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.getHistoryItems(params)
                })
            },
            refreshTable() {
                PaginationEvent.$emit(this.CONST_RESTORE)
            }
        },
        beforeMount() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                console.log(this.params)
                this.resetEntityId(this.params.id)
                this.getHistoryItems({start: 0, limit: 10})
                this.registerPaginationEvent()
            })
        }
    }
</script>

<style>

</style>
