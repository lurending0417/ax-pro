<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <span class="titleNameSize">单号&nbsp;&nbsp;&nbsp;</span>
                <input type="text" class="form-control" placeholder="" readonly
                       :value="getAddInventoryBillItem.billNumber"/>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">仓库&nbsp;&nbsp;&nbsp;</span>
                <input type="text" class="form-control" placeholder="" readonly :value="getAddInventoryBillItem.wareHouseId"/>
            </div>
        </div>
        <div class="row">
            <div class="col-md-3" v-if="inventoryBillStatus">
                <input type="text" ref="serialBox" class="form-control" @keyup.enter="inputSerial()" placeholder="输入商品条码"/>
            </div>
            <div class="col-md-1" v-if="inventoryBillStatus">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="clickInvent">盘点</button>
            </div>

            <div class="col-md-4" v-else>
            </div>
            <div class="col-md-8" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-success'],
                                btnStyle: {marginRight: '10px'},
                                btnName: '查看差异'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'viewDifference',
                                titleName: '查看差异',
                                modalClasses: ['modal-lg']
                            }">
                    <InventoryItemDifference slot="main"
                              :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                              :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'viewDifference'"
                    ></InventoryItemDifference>
                </ButtonWithModal>
                <button type="button" class="btn btn-warning" style="margin-right: 10px;">导出成EXCEL</button>
                <button type="button" class="btn btn-warning" style="margin-right: 10px;">批量导入</button>
                <button type="button" class="btn btn-warning" style="margin-right: 10px;">批量打印标签</button>
            </div>
        </div>

        <div class="row" style="margin-top:20px;">
            <div class="col-md-2">
                <label>&nbsp;&nbsp;&nbsp;&nbsp;账面：&nbsp;&nbsp;总件数：</label>
                <label>{{statistics.totalNums}}</label>
            </div>
            <div class="col-md-2">
                <label>总质量（按重）：</label>
                <label>{{statistics.totalWeight}}</label>
            </div>
            <div class="col-md-2">
                <label>工费：</label>
                <label>{{statistics.processingCharges}}</label>
            </div>
            <div class="col-md-2">
                <label>总零售价（原价）：</label>
                <label>{{statistics.totalRegularPrice}}</label>
            </div>
            <div class="col-md-2">
                <label>总零售价（折后）：</label>
                <label>{{statistics.totalRetailPrice}}</label>
            </div>
        </div>
        <div class="row">
            <div class="col-md-2">
                <label>&nbsp;&nbsp;&nbsp;&nbsp;实盘：&nbsp;&nbsp;总件数：</label>
                <label>{{inputAmountStatistics.totalNums}}</label>
            </div>
            <div class="col-md-2">
                <label>总质量（按重）：</label>
                <label>{{inputAmountStatistics.totalWeight}}</label>
            </div>
            <div class="col-md-2">
                <label>工费：</label>
                <label>{{inputAmountStatistics.processingCharges}}</label>
            </div>
            <div class="col-md-2">
                <label>总零售价（原价）：</label>
                <label>{{inputAmountStatistics.totalRegularPrice}}</label>
            </div>
            <div class="col-md-2">
                <label>总零售价（折后）：</label>
                <label>{{inputAmountStatistics.totalRetailPrice}}</label>
            </div>
        </div>

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
                <th>工费</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in getInventoryBillItemsView" :style="{backgroundColor: item.amount===0?'#ec475873':''}">
                <td class="table-bordered">
                    <input type="checkbox" :ref="'check'+index" @click="clickCheck(item, index)" :checked="item.inputAmount>0"
                           :disabled="!inventoryBillStatus"/>
                </td>
                <td class="table-bordered">{{ index + 1 }}</td>
                <td class="table-bordered">{{ item.serial }}</td>
                <td class="table-bordered">
                    <input v-if="inventoryBillStatus"
                        type="number"
                        style="max-width: 50px"
                        :value="item.inputAmount"
                        @keyup.enter="enterInputAmount(item, index)"
                        @input="enterInputAmount(item, index)"
                    />
                    <span v-else>{{item.inputAmount}}</span>
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
                <td class="table-bordered">{{handleItemUnit(item.computedProcessingCharges, '元/件')}}</td>
            </tr>
            </tbody>
        </table>

        <div class="row">
            <div class="col-md-12" style="text-align: right"
                 v-if="inventoryBillStatus">
                <span style="margin-right: 15px;">
                    <button type="button" class="btn btn-primary" @click="clickSubmit">提交</button>
                </span>
                <span>
                    <button type="button" class="btn btn-info" @click="clickBack">保存并返回</button>
                </span>
            </div>
            <div class="col-md-12" style="text-align: right" v-else>
                <span>
                    <button type="button" class="btn btn-info" @click="clickBack">返回</button>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import {TableEvent} from '~/components/TableEvent';
    // import {baseUtil} from '~/util';
    import Pagination from '~/components/Pagination';
    import TableCpn from '~/components/Table';
    import uuid from 'uuid';
    import InventoryBillMain from '~/components/storage/stock/InventoryBillMain';
    import InventoryItemDifference from '~/components/storage/stock/InventoryItemDifference';
    import ButtonWithModal from '~/components/ButtonWithModal';

    export default {
        components: {
            TableCpn,
            Pagination,
            ButtonWithModal,
            InventoryItemDifference
        },
        data() {
            return {
                test: {},
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid()
            }
        },
        computed: {
            ...mapGetters('storage/stock/inventoryBillMain', {
                getTest: 'getTest',
                inventoryBillStatus: 'getInventoryBillStatus',
                getAddInventoryBillItem: 'getAddInventoryBillItem',
                getInventoryBillItemsView: 'getInventoryBillItemsView',
                total: 'getInventoryBillItemsTotal',
                statistics: 'getInventoryBillItemsStatistics', // 账面数据统计
                inputAmountStatistics: 'getInputAmountStatistics' // 实盘数据统计
            })
        },
        methods: {
            ...mapActions('storage/stock/inventoryBillMain', {
                getInventoryBillItems: 'getInventoryBillItems',
                updateInventoryItemNum: 'updateInventoryItemNum',
                submitInventoryBill: 'submitInventoryBill',
                addInventoryBillItemDetail: 'addInventoryBillItemDetail',
                delInventoryBillItemDetail: 'delInventoryBillItemDetail'
            }),
            ...mapMutations('storage/stock/inventoryBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            ...mapMutations('storage/stock/inventoryBillMain', {
                resetInventoryBillDetailItems: 'resetInventoryBillDetailItems',
                resetStatic: 'resetStatic'
            }),
            ...mapMutations('storage/stock/inventoryBillMain', {
                resetInventoryBillItem: 'resetInventoryBillItem'
            }),
            clickBack () {
                this.resetCurrCpn(InventoryBillMain);
                this.resetInventoryBillItem({item: {}}); // 重置新增盘点单
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
                        callback: ({item, inputed, system}) => {
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
                        callback: ({item, inputed, system}) => {
                        }
                    });
                }
            },
            inputSerial(serialValue) { // 输入条码
                console.log('条码', event.target.value);
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
                        callback: ({item, inputed, system}) => {
                        }
                    });
                } else {
                    let amount = temp[index].inputAmount + 1;
                    this.updateInventoryItemNum({ // 修改盘点明细的盘点数量
                        amount,
                        index,
                        itemId: temp[index].id,
                        callback: (data) => {
                        }
                    });
                }
                this.$refs.serialBox.select()
            },
            clickInvent() {
                this.inputSerial(this.$refs.serialBox.value);
            },
            enterInputAmount(item, index) { // 用户手动输入盘点数量(在表格中输入)
                let inputValue = parseInt(event.target.value);
                if (inputValue >= 0) {
                    this.updateInventoryItemNum({ // 修改盘点明细的盘点数量
                        amount: inputValue,
                        index,
                        itemId: item.id,
                        callback: (data) => {
                        }
                    });
                } else {
                    alert('盘点数量不能小于0');
                }
            },
            initialCurPage() {
                let {id} = this.getAddInventoryBillItem;
                console.log('当前盘点单详情', this.getAddInventoryBillItem);
                this.getInventoryBillItems(id); // 发送action获取当前仓库的所有货物
            },
            clickSubmit() { // 提交审核
                let flag = confirm('提交之后不能更改，你确定需要提交吗？')
                if (flag) {
                    this.submitInventoryBill({
                        callback: () => {
                            this.resetCurrCpn(InventoryBillMain);
                            this.resetInventoryBillItem({item: {}}); // 重置新增盘点单
                        }
                    });
                }
            }
        },
        beforeMount() {
            TableEvent.$off('inventoryBillItem')
            TableEvent.$on('inventoryBillItem', () => {
                console.log('触发on');
                this.initialCurPage();
            })
        }
    }
</script>

<style scoped>
    .red{
        background: #ec475873;
    }
</style>
