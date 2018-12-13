<template>
    <div class="form-group">
        <div class="select_item">
            <label class="control-label">仓库&nbsp;&nbsp;&nbsp;</label>
            <select class="form-control" ref="warehouse" style="width: 80%;" @change="changeWareHouse" :value="wareHouses[0].id">
                <option v-for="wareHouse in wareHouses" :value="wareHouse.id">{{wareHouse.name}}</option>
            </select>
        </div>
        <div style="text-align: center">
            <button  class="btn btn-danger" @click="clickAsure">确定</button>
        </div>
    </div>
</template>


<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import InventoryBillItem from '~/components/storage/stock/InventoryBillItem'
    import {mapActions, mapState} from 'vuex'
    import { TableEvent } from '~/components/TableEvent'

    export default {
        props: ['CONST_CLICK_MODAL', 'wareHouses', 'passed'],
        data() {
            return {
                wareHouseItem: {},
                CONST_ADD: 'CONST_ADD'
            }
        },
        computed: {
            ...mapState('storage/stock/inventoryBillMain', {
                addInventoryBillItem: state => state.addInventoryBillItem
            })
        },
        methods: {
            ...mapActions('storage/stock/inventoryBillMain', {
                addInventoryBills: 'addInventoryBills'
            }),
            clickAsure() {
                this.passed.changeCurrCpn(InventoryBillItem);
                this.addInventoryBills({
                    params: this.wareHouseItem,
                    callback: () => {
                        TableEvent.$emit('inventoryBillItem') // CLICK_ADD_InventoryBillItem:等待InventoryBillItem页面接受
                    }
                });
            },
            changeWareHouse() {
                let warehouse = this.$refs.warehouse;
                let index = warehouse.selectedIndex;
                this.wareHouseItem['id'] = warehouse.value;
                this.wareHouseItem['value'] = warehouse.options[index].innerText;
            }
        },
        beforeMount() {
            let vm = this;
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                vm.wareHouseItem = vm.wareHouses[0];
            })
        }
    }
</script>

<style scoped>
    .select_item {
        width: 50%;
        margin: 50px auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
