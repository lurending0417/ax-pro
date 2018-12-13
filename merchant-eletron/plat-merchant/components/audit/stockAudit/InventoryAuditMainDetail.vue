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
                <input type="text" class="form-control" placeholder="" readonly
                       :value="getAddInventoryBillItem.wareHouseId"/>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12" style="text-align: right">
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
                    <InventoryAuditItemDifference slot="main"
                                             :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                             :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'viewDifference'"
                    >
                    </InventoryAuditItemDifference>
                </ButtonWithModal>
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
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in getInventoryBillItemsView"
                :style="{backgroundColor: item.amount===0?'#ec475873':''}">
                <td class="table-bordered">
                    <input type="checkbox" :ref="'check'+index" :checked="item.inputAmount>0" disabled/>
                </td>
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
            </tr>
            </tbody>
        </table>

        <div class="row">
            <div class="col-md-2">
                <label>&nbsp;&nbsp;&nbsp;&nbsp;账面：&nbsp;&nbsp;总件数：</label>
                <label>{{statistics.totalNums}}</label>
            </div>
            <div class="col-md-2">
                <label>总质量（按重）：</label>
                <label>{{statistics.totalWeight}}</label>
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
                <label>总零售价（原价）：</label>
                <label>{{inputAmountStatistics.totalRegularPrice}}</label>
            </div>
            <div class="col-md-2">
                <label>总零售价（折后）：</label>
                <label>{{inputAmountStatistics.totalRetailPrice}}</label>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12" style="text-align: right">
                <span style="margin-right: 20px" v-if="getStockAuditDetail.unFinished">
                    <button type="button" class="btn btn-sm btn-default" @click="clickApprove">通过</button>
                </span>
                <span style="margin-right: 20px" v-if="getStockAuditDetail.unFinished">
                    <button type="button" class="btn btn-sm btn-default" @click="clickDecline">驳回</button>
                </span>
                <span>
                    <button type="button" class="btn btn-sm btn-default" @click="clickBack">返回</button>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    // import {TableEvent} from '~/components/TableEvent';
    // import {baseUtil} from '~/util';
    import Pagination from '~/components/Pagination';
    import TableCpn from '~/components/Table';
    import uuid from 'uuid';
    import InventoryAuditMain from '~/components/audit/stockAudit/InventoryAuditMain';
    import InventoryAuditItemDifference from '~/components/audit/stockAudit/InventoryAuditItemDifference';
    import ButtonWithModal from '~/components/ButtonWithModal';

    export default {
        props: ['passed'],
        components: {
            TableCpn,
            Pagination,
            ButtonWithModal,
            InventoryAuditItemDifference
        },
        data() {
            return {
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid()
            }
        },
        computed: {
            ...mapGetters('audit/stockAudit/stockAuditBillMain', {
                getStockAuditDetail: 'getStockAuditDetail'
            }),
            ...mapGetters('storage/stock/inventoryBillMain', {
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
            ...mapActions('audit/stockAudit/stockAuditBillMain', {
                auditApprove: 'auditApprove',
                auditDecline: 'auditDecline'
            }),
            ...mapMutations('storage/stock/inventoryBillMain', {
                resetInventoryBillItem: 'resetInventoryBillItem'
            }),
            clickBack() {
                this.passed.changeCurrCpn(InventoryAuditMain);
                this.resetInventoryBillItem({item: {}}); // 重置新增盘点单
            },
            clickApprove() { // 点击通过
                console.log(this.getStockAuditDetail);
                this.auditApprove({
                    callback: () => {
                        this.passed.changeCurrCpn(InventoryAuditMain)
                    },
                    sendParams: this.getStockAuditDetail.recordId
                })
            },
            clickDecline() { // 点击驳回
                console.log('ddddddddddddd', this.getStockAuditDetail);
                this.auditDecline({
                    callback: () => {
                        this.passed.changeCurrCpn(InventoryAuditMain)
                    },
                    sendParams: this.getStockAuditDetail.recordId
                })
            }
        },
        mounted() {
        },
        beforeMount() {
            // TableEvent.$off('inventoryBillItem')
            // TableEvent.$on('inventoryBillItem', () => {
            //     console.log('触发on');
            //     this.initialCurPage();
            // })
        }
    }
</script>

<style scoped>
    .red {
        background: #ec475873;
    }
</style>
