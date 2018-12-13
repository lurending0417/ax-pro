<template>
    <div>
        <Table :heads="heads" :items="getGoldPriceItemsView">
            <div v-for="(item,index) in getGoldPriceItemsView" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-warning btn-sm'],
                                btnName: '修改'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'modify'+index,
                                titleName: '修改金价'
                            }">
                    <GoldPriceItemModify slot="main"
                                         :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                         :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'modify'+index"
                                         :params="item"
                                         :refreshTable="refreshTable"></GoldPriceItemModify>
                </ButtonWithModal>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-info btn-sm'],
                                btnName: '历史'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'history'+index,
                                titleName: item.metalName+'操作记录',
                                modalClasses: ['modal-lg']
                            }">
                    <History slot="main"
                             :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                             :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'history'+index"
                             :params="item"></History>
                </ButtonWithModal>
            </div>
        </Table>
    </div>
</template>

<script>
    import {TabsEvent} from '~/components/TabsEvent'
    import Table from '~/components/Table'
    import TableInput from '~/components/TableInput'
    import TableButton from '~/components/TableButton'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import {TableEvent} from '../../../components/TableEvent'
    import {mapGetters, mapActions} from 'vuex'
    import CraftItemAdd from '~/components/storage/wareBaseInfo/CraftItemAdd'
    import Params from '~/components/storage/wareBaseInfo/Params'
    import GoldPriceItemModify from '~/components/storage/wareBaseInfo/GoldPriceItemModify'
    import History from '~/components/storage/wareBaseInfo/History'
    import uuid from 'uuid'

    export default {
        components: {
            Table,
            TableInput,
            TableButton,
            TableEvent,
            ButtonWithModal,
            CraftItemAdd,
            Params,
            GoldPriceItemModify,
            History
        },
        data() {
            return {
                heads: [
                    {propName: 'metalName', name: '金属'},
                    {propName: 'retailPrice', name: '价格(元/g)'},
                    {propName: 'operationPeople', name: '操作人'},
                    {name: '操作', tag: 'BUTTON'}
                ],
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid()
            }
        },
        computed: {
            ...mapGetters('storage/warebaseinfo/goldPriceItem', {
                getGoldPriceItemsView: 'getGoldPriceItemsView'
            })
        },
        methods: {
            ...mapActions('storage/warebaseinfo/goldPriceItem', {
                getGoldPriceItems: 'getGoldPriceItems',
                getMetaData: 'getMetaData'
            }),
            refreshTable() {
                this.getGoldPriceItems()
            }
        },
        beforeMount() {
            TabsEvent.$on('goldPrice', () => {
                this.getMetaData(() => {
                    this.getGoldPriceItems()
                })
            })
        }
    }
</script>

<style>

</style>
