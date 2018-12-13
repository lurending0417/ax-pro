<template>
    <div style="">
        <div class="modal-body" style="height: 300px;">
            <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>条码</th>
                    <th>实盘数量</th>
                    <th>账面数量</th>
                    <th>品类</th>
                    <th>寓意名</th>
                    <th>版号</th>
                    <th>宝石</th>
                    <th>金属</th>
                    <th>工艺</th>
                    <th>总质量</th>
                    <th>成本价</th>
                    <th>零售价（原价）</th>
                    <th>零售价（折后）</th>
                    <th>盈亏</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in getInventoryBillItemsView"
                    :style="{backgroundColor: item.amount===0?'#ec475873':''}"
                    v-if="item.lossOrGain !== '正常'">
                    <td class="table-bordered">{{ index + 1 }}</td>
                    <td class="table-bordered">{{ item.serial }}</td>
                    <td class="table-bordered">{{item.inputAmount}}</td>
                    <td class="table-bordered">{{item.amount}}</td>
                    <td class="table-bordered">{{item.categoryName}}</td>
                    <td class="table-bordered">{{item.moralName}}</td>
                    <td class="table-bordered">{{item.modelCode}}</td>
                    <td class="table-bordered">{{item.gemName}}</td>
                    <td class="table-bordered">{{item.metalName}}</td>
                    <td class="table-bordered">{{item.craftName}}</td>
                    <td class="table-bordered">{{handleItemUnit(item.weight, 'g')}}</td>
                    <td class="table-bordered">{{handleItemUnit(item.costPrice, '元')}}</td>
                    <td class="table-bordered">{{handleItemUnit(item.regularPrice, '元')}}</td>
                    <td class="table-bordered">{{handleItemUnit(item.retailPrice, '元')}}</td>
                    <td class="table-bordered">{{item.lossOrGain}}</td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="form-inline text-center" style="margin-top: 10px;">
            <div class="form-group-margin form-group">
                <strong>盘盈件数：{{getLossOrGain.gainNum}}</strong>
            </div>
            <div class="form-group-margin form-group">
                <strong>盘亏件数：{{getLossOrGain.lossNum}}</strong>
            </div>
            <div class="form-group-margin form-group">
                <strong>小计：{{getLossOrGain.lossNum + getLossOrGain.gainNum}}</strong>
            </div>
        </div>

        <div class="form-inline text-center">
            <div class="form-group-margin form-group">
                <strong>盘盈价格：{{getLossOrGain.gainPrice}}</strong>
            </div>
            <div class="form-group-margin form-group">
                <strong>盘亏价格：{{getLossOrGain.lossPrice}}</strong>
            </div>
            <div class="form-group-margin form-group">
                <strong>小计：{{getLossOrGain.gainPrice + getLossOrGain.lossPrice}}</strong>
            </div>
        </div>

        <div class="modal-footer text-center">
            <button type="button" class="btn btn-primary" @click="clickBack">关闭</button>
        </div>
    </div>
</template>


<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'

    export default {
        props: ['passed', 'CONST_CLOSE_MODAL', 'billItem', 'CONST_CLICK_MODAL'],
        data() {
            return {}
        },
        computed: {
            ...mapGetters('storage/stock/inventoryBillMain', {
                getInventoryBillItemsView: 'getInventoryBillItemsView',
                inputAmountStatistics: 'getInputAmountStatistics', // 实盘数据统计
                getLossOrGain: 'getLossOrGain' // 盘点盈亏数量统计
            })
        },
        filters: {
            joinUnit: function (value) {
                if (!value) return ''
                value = value.toString()
                return value.charAt(0).toUpperCase() + value.slice(1)
            }
        },
        methods: {
            ...mapActions('storage/stock/inventoryBillMain', {
                getInventoryBillItems: 'getInventoryBillItems'
            }),
            ...mapMutations('storage/stock/inventoryBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            ...mapMutations('storage/stock/inventoryBillMain', {
                resetInventoryBillItem: 'resetInventoryBillItem'
            }),
            clickBack() {
                console.log('保存并返回');
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.getInventoryBillItems(this.billItem.id);
            })
        },
        beforeMount() {

        }
    }
</script>

<style scoped>

</style>
