<template>
    <div style="padding:20px 10px">
        <div class="modal-body">
            <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
                <thead>
                <tr>
                    <th></th>
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
                    <td class="table-bordered">
                        <input type="checkbox" :ref="'check'+index" disabled
                               :checked="item.inputAmount>0"/>
                    </td>
                    <td class="table-bordered">{{ index + 1 }}</td>
                    <td class="table-bordered">{{ item.serial }}</td>
                    <td class="table-bordered"> {{item.inputAmount}}</td>
                    <td class="table-bordered">{{item.amount}}</td>
                    <td class="table-bordered">{{item.categoryName}}</td>
                    <td class="table-bordered">{{item.moralName}}</td>
                    <td class="table-bordered">{{item.modelCode}}</td>
                    <td class="table-bordered">{{item.gemName}}</td>
                    <td class="table-bordered">{{item.metalName}}</td>
                    <td class="table-bordered">{{item.craftId}}</td>
                    <td class="table-bordered">{{item.weight}}</td>
                    <td class="table-bordered">{{item.costPrice}}</td>
                    <td class="table-bordered">{{item.regularPrice}}</td>
                    <td class="table-bordered">{{item.retailPrice}}</td>
                    <td class="table-bordered">{{item.lossOrGain}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="row" style="margin: 20px auto">
            <div class="col-md-3">
                <label>&nbsp;&nbsp;&nbsp;&nbsp;盘盈件数：</label>
                <label>{{getLossOrGain.gainNum}}</label>
            </div>
            <div class="col-md-2"></div>
            <div class="col-md-3">
                <label>&nbsp;&nbsp;&nbsp;&nbsp;盘亏件数：</label>
                <label>{{getLossOrGain.lossNum}}</label>
            </div>
        </div>

        <div class="row modal-footer">
            <div class="col-md-12" style="text-align: center">
                <span>
                    <button type="button" class="btn btn-sm btn-default" @click="clickBack">保存并关闭</button>
                </span>
            </div>
        </div>
    </div>
</template>


<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'

    export default {
        props: ['passed', 'CONST_CLOSE_MODAL'],
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
        methods: {
            ...mapActions('storage/stock/inventoryBillMain', {
                getInventoryBillItems: 'getInventoryBillItems',
                updateInventoryItemNum: 'updateInventoryItemNum',
                addInventoryBillItemDetail: 'addInventoryBillItemDetail',
                delInventoryBillItemDetail: 'delInventoryBillItemDetail'
            }),
            ...mapMutations('storage/stock/inventoryBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            clickBack() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.getInventoryBillItems()
            }
        }
    }
</script>

<style scoped>

</style>
