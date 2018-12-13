<template>
    <div>
        <div class="modal-body">
            <TableCpn :heads="[
                {propName:'createTime',name:'时间'},
                {propName:'inOrOut',name:'出/入库'},
                {propName:'storeName',name:'门店'},
                {propName:'wareHouseName',name:'仓库'},
                {propName:'creatorName',name:'操作人'},
                {propName:'billTypeValue',name:'单据类型'},
                {propName:'billNumber',name:'关联单号'},
                {propName:'remark',name:'备注'}
            ]" :items="tableView">
            </TableCpn>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="closeModal">关闭</button>
        </div>
    </div>
</template>

<script>
    // import {mapMutations, mapActions, mapGetters} from 'vuex'
    import {mapActions} from 'vuex'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import TableCpn from '~/components/Table'
    import {dateUtil, baseUtil} from '~/util'

    export default {
        components: {TableCpn},
        props: ['item', 'CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'index', 'canChange'],
        data() {
            return {
                tableView: []
            }
        },
        methods: {
            ...mapActions('storage/stock/stockItemsMain', {
                apiGetStorageTransRecord: 'apiGetStorageTransRecord'
            }),
            closeModal() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            handleRows(rows) {
                return rows.map(item => {
                    item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                    item.wareHouseName = baseUtil.getNameFromPropId('wareHouse', item.wareHouseId);
                    item.storeName = baseUtil.getNameFromPropId('stores', item.storeId);
                    item.creatorName = baseUtil.getNameFromPropId('staffs', item.creatorId);
                    item.billTypeValue = baseUtil.getEnumsByKey('goodsBillType').find(ele => ele.id === item.billType).name;
                    if (item.billType === 'STOCK_IN' || item.billType === 'ALLOCATE_IN' || item.billType === 'ALLOCATE_REJECT_IN' || item.billType === 'INVENTORY_OVER_FLOW' ||
                        item.billType === 'RETAIL_REJECT' || item.billType === 'RECYCLE_IN' || item.billType === 'EXCHANGE_IN' || item.billType === 'LEASE_BACK' ||
                        item.billType === 'LEASE_REJECT_IN') {
                        item.inOrOut = '入库'
                    } else {
                        item.inOrOut = '出库'
                    }
                    return item
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                console.log('item', this.item);
                this.apiGetStorageTransRecord({
                    params: {
                        storageId: this.item.id
                    },
                    callback: (data) => {
                        this.tableView = this.handleRows(data.rows)
                    }
                })
            })
        }
    }
</script>
