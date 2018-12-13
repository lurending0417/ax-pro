<template>
    <div class="form-group">
        <div class="select_item">
            <label class="control-label">仓库&nbsp;&nbsp;&nbsp;</label>
            <select class="form-control" ref="warehouse" style="width: 80%;" @change="changeWareHouse">
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
    import {mapActions} from 'vuex'

    export default {
        props: ['CONST_CLOSE_MODAL', 'wareHouses'],
        data() {
            return {
                wareHouseId: '',
                CONST_ADD: 'CONST_ADD'
            }
        },
        methods: {
            ...mapActions('retail/offlineRetail/handoverBill', {
                addHandoverBill: 'addHandoverBill',
                getHandoverBills: 'getHandoverBills'
            }),
            clickAsure() {
                // ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                let that = this
                this.addHandoverBill({
                    callback: () => {
                        ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                        this.getHandoverBills({});
                    },
                    wareHouseId: that.$refs.warehouse.value
                });
            },
            changeWareHouse(e) {
                this.wareHouseId = e.target.value;
            }
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
