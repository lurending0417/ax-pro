<template>
    <div>
        <div class="modal-body">
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">基本信息</div>
                <div class="panel-body">
                    <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
                        <thead>
                        <tr>
                            <th>条码</th>
                            <th>总质量</th>
                            <th>零售价（原价）</th>
                            <th>零售价（折后）</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td class="table-bordered">{{item.serial}}</td>
                            <td class="table-bordered">{{item.weight}}</td>
                            <td class="table-bordered">{{item.regularPrice}}</td>
                            <td class="table-bordered">{{item.retailPrice}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">品类信息</div>
                <div class="panel-body">
                    <div v-if="paramsObj.category.length>0">
                        <p v-for="item in paramsObj.category">
                            <span class="titleNameSize">{{item.fieldName}}</span>:
                            <span>{{item.fieldValue}}</span>
                        </p>
                    </div>
                    <p v-else>暂无数据</p>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">宝石</div>
                <div class="panel-body">
                    <div v-if="paramsObj.gem.length>0">
                        <p v-for="item in paramsObj.gem">
                            <span class="titleNameSize">{{item.fieldName}}</span>:
                            <span>{{item.fieldValue}}</span>
                        </p>
                    </div>
                    <p v-else>暂无数据</p>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">金属</div>
                <div class="panel-body">
                    <div v-if="paramsObj.metal.length>0">
                        <p v-for="item in paramsObj.metal">
                            <span class="titleNameSize">{{item.fieldName}}</span>:
                            <span>{{item.fieldValue}}</span>
                        </p>
                    </div>
                    <p v-else>暂无数据</p>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">历史维修记录</div>
                <div class="panel-body">
                    <div v-if="getRepairBills.length>0">
                        <TableCpn
                            :heads="[
                                {propName:'createTime',name:'日期'},
                                {propName:'telephone',name:'用户手机号'},
                                {propName:'billNumber',name:'维修单号'},
                                {propName:'serial',name:'商品条码'},
                                {propName:'repairDetail',name:'维修详情'},
                            ]"
                            :items="getRepairBills">
                        </TableCpn>
                    </div>
                    <p v-else>暂无数据</p>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">新增维修记录</div>
                <div class="panel-body">
                    <textarea class="form-control" v-model="repairDetail">{{repairDetail}}</textarea>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="close">关闭
            </button>
            <button type="button" class="btn btn-primary" @click="add">确定</button>
        </div>
    </div>
</template>

<script>
    import TableCpn from '~/components/Table'
    import {mapActions} from 'vuex'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import {baseUtil, dateUtil} from '../../../util';

    export default {
        components: {
            TableCpn
        },
        props: ['list', 'CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'searchParams', 'item'],
        data() {
            return {
                getRepairBills: [], // 获取当前商品的所有维修记录
                paramsObj: {
                    metal: [],
                    category: [],
                    gem: []
                },
                repairDetail: ''
            }
        },
        methods: {
            ...mapActions('storage/stock/stockItemsParams', {
                apiGetStockItemParams_1: 'apiGetStockItemParams_1'
            }),
            ...mapActions('retail/offlineRetail/repairBillMain', {
                apiGetRepairBill: 'apiGetRepairBill'
            }),
            initData() {},
            getPropsByStorageId() {
                this.apiGetStockItemParams_1({
                    storageId: this.item.storageId,
                    callBack: (data) => {
                        this.paramsObj = baseUtil.splitProps(data.rows)
                    }
                })
            },
            getRepairRecord() {
                let customerId = '';
                if (this.searchParams.telephone) {
                    customerId = this.list.bill.customerId
                }
                this.apiGetRepairBill({
                    params: {
                        storageId: this.item.storageId,
                        customerId
                    },
                    callBack: (data) => {
                        let rows = data.rows.map(item => {
                            item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                            return item
                        })
                        this.getRepairBills = rows
                    }
                })
            },
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            add() {
                let item = {
                    ...this.item,
                    repairDetail: this.repairDetail
                }
                this.$emit('getCurrentItem', item);
                this.close()
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.initData()
                // 通过items的storageId获取商品的参数信息
                this.getPropsByStorageId()
                // 通过items的customerId和storageId获取商品的维修记录
                this.getRepairRecord()
            })
        }
    }
</script>
