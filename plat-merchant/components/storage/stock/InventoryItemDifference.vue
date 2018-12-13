<template>
    <div style="padding:20px 10px">
        <div class="row" style="margin: auto auto 20px 10px">
            <div class="col-md-3"><input type="text" ref="serialBox" class="form-control" placeholder="输入商品条码"
                                         @keyup.enter="inputSerial()"/>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="clickInvent">盘点
                </button>
            </div>
            <div class="col-md-8">
            </div>
        </div>

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
                        <input type="checkbox" :ref="'check'+index" @click="clickCheck(item, index)"
                               :checked="item.inputAmount>0"/>
                    </td>
                    <td class="table-bordered">{{ index + 1 }}</td>
                    <td class="table-bordered">{{ item.serial }}</td>
                    <td class="table-bordered">
                        <input type="number"
                               style="max-width: 50px"
                               :value="item.inputAmount"
                               @keyup.enter="enterInputAmount(item, index)"
                               @input="enterInputAmount(item, index)"
                        />
                    </td>
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
        props: ['passed', 'CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL'],
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
            ...mapMutations('storage/stock/inventoryBillMain', {
                resetInventoryBillDetailItems: 'resetInventoryBillDetailItems'
            }),
            ...mapMutations('storage/stock/inventoryBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            enterInputAmount(item, index) { // 用户手动输入盘点数量(在表格中输入)
                let inputValue = parseInt(event.target.value);
                if (inputValue >= 0) {
                    this.updateInventoryItemNum({ // 修改盘点明细的盘点数量
                        amount: inputValue,
                        index,
                        itemId: item.id,
                        callback: (data) => {
//                            this.getInventoryBillItems(); // 修改之后刷新页面
//                            this.resetInventoryBillDetailItems({data, type: 'modify', index})
                        }
                    });
                } else {
                    alert('盘点数量不能小于0');
                }
            },
            clickBack() {
                console.log('保存并返回');
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.getInventoryBillItems()
            },
            clickCheck(item, index) { // 单击复选框
                let amount = 0;
                if (event.target.checked) { // 勾选了复选框
                    this.inputAmountStatistics.totalNums += 1;
                    amount = 1;
                    if (item.priceType === 'WEIGHTED') {
                        this.inputAmountStatistics.totalWeight += item.weight;
                    } else {
                        this.inputAmountStatistics.totalRetailPrice += item.retailPrice;
                        this.inputAmountStatistics.totalRegularPrice += item.regularPrice;
                    }
                    this.addInventoryBillItemDetail({ // 添加盘点明细的盘点数量
                        amount,
                        index,
                        serial: item.serial,
                        callback: (data) => {
//                             this.getInventoryBillItems(); // 添加之后刷新页面
//                            this.resetInventoryBillDetailItems({data, type: 'modify', index})
                        }
                    });
                } else { // 取消勾选复选框
                    this.inputAmountStatistics.totalNums = 0;
                    if (item.priceType === 'WEIGHTED') {
                        this.inputAmountStatistics.totalWeight = 0;
                    } else {
                        this.inputAmountStatistics.totalRetailPrice = 0;
                        this.inputAmountStatistics.totalRegularPrice = 0;
                    }
                    this.delInventoryBillItemDetail({ // 删除盘点明细的盘点数量
                        itemId: item.id,
                        index,
                        callback: (data) => {
//                             this.getInventoryBillItems(); // 删除之后刷新页面
//                            this.resetInventoryBillDetailItems({data, type: 'modify', index})
                        }
                    });
                }
            },
            inputSerial(serialValue) { // 输入条码
                console.log('123123', event.target.value);
                let serial = serialValue || event.target.value;
                let temp = this.getInventoryBillItemsView;
                let tempLen = temp.length;
                let index = 0;
                let flag = true;
                for (let i = 0; i < tempLen; i++) {
                    if (serial === temp[i].serial) {
                        index = i;
                        flag = false;
                        break;
                    }
                }
                if (flag) { // 当前仓库没有这个条码的商品
                    this.addInventoryBillItemDetail({ // 添加盘点明细的盘点数量
                        serial,
                        index,
                        callback: (data) => {
//                             this.getInventoryBillItems(); // 添加之后刷新页面
//                            this.resetInventoryBillDetailItems({data, type: 'modify', index})
                        }
                    });
                } else {
                    let amount = temp[index].inputAmount + 1;
                    this.updateInventoryItemNum({ // 修改盘点明细的盘点数量
                        amount,
                        index,
                        itemId: temp[index].id,
                        callback: (data) => {
//                             this.getInventoryBillItems(); // 修改之后刷新页面
//                            this.resetInventoryBillDetailItems({data, type: 'modify', index})
                        }
                    });
                }
                this.$refs.serialBox.select()
            },
            clickInvent() {
                this.inputSerial(this.$refs.serialBox.value);
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.getInventoryBillItems()
            })
        },
        beforeMount() {
        }
    }
</script>

<style scoped>

</style>
