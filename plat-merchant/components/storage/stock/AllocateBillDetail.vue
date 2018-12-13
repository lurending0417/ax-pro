<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <label >创建时间：</label>
                <span class="titleNameSize">{{getAllocateBill.createTime}}</span>
            </div>
            <div class="form-group form-group-margin">
                <label >调出门店：</label>
                <span class="titleNameSize">{{getAllocateBill.storeName}}</span>
            </div>
            <div class="form-group form-group-margin" v-if="getAllocateBill.wareHouseId">
                <label >调出仓库：</label>
                <span class="titleNameSize">{{getAllocateBill.wareHouseName}}</span>
            </div>
            <div class="form-group form-group-margin">
                <label >调入门店：</label>
                <span class="titleNameSize">{{getAllocateBill.targetStoreName}}</span>
            </div>
            <div class="form-group form-group-margin">
                <label >调入仓库：</label>
                <span class="titleNameSize">{{getAllocateBill.targetWareHouseName}}</span>
            </div>
            <div class="form-group form-group-margin">
                <label >发货人：</label>
                <span class="titleNameSize">{{getAllocateBill.allocatedByName}}</span>
            </div>
            <div class="form-group form-group-margin" v-if="getAllocateBill.acceptedById">
                <label >收货人/拒收人：</label>
                <span class="titleNameSize">{{getAllocateBill.acceptedByName}}</span>
            </div>
            <div class="form-group form-group-margin">
                <label >状态：</label>
                <span class="titleNameSize">{{getAllocateBill.status}}</span>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3" v-if="showSearchBtn">
                <input type="text" class="form-control" placeholder="条码" ref="serial" @keyup.enter="InputSerial"/>
            </div>
            <div class="col-md-1" v-if="showSearchBtn">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="searchSerial">搜索
                </button>
            </div>
            <div class="col-md-5"></div>
            <div class="col-md-1" style="text-align: right"
                 v-if="showSearchBtn && getAllocateBill.status === '待收货'">
                <button class="btn btn-primary" style="minWidth:80px" @click="clickAccept">整单收货</button>
            </div>
            <div class="col-md-1" style="text-align: right"
                 v-if="showSearchBtn && getAllocateBill.status === '待收货'">
                <button class="btn btn-danger" style="minWidth:80px" @click="clickReject">整单拒收</button>
            </div>
        </div>

        <div class="row">
            <div class="col-md-2">
                <label>&nbsp;&nbsp;&nbsp;&nbsp;应收：&nbsp;&nbsp;总件数：</label>
                <label>{{getAllocateBill.totalAmount}}</label>
            </div>
            <div class="col-md-2">
                <label>总质量：</label>
                <label>{{getAllocateBill.totalWeight}}</label>
            </div>
            <!--<div class="col-md-2">-->
            <!--<label>总成本：</label>-->
            <!--<label>{{getAllocateBill.totalCostPrice}}</label>-->
            <!--</div>-->
            <div class="col-md-2">
                <label>总零售价（原价）：</label>
                <label>{{getAllocateBill.totalRegularPrice}}</label>
            </div>
            <div class="col-md-2">
                <label>总零售价（折后）：</label>
                <label>{{getAllocateBill.totalRetailPrice}}</label>
            </div>
            <div class="col-md-2">
                <label>总工费：</label>
                <label>{{getAllocateBill.totalProcessingCharges}}</label>
            </div>
        </div>
        <div class="row" v-if="showSearchBtn">
            <div class="col-md-2">
                <label>已标记：&nbsp;&nbsp;总件数：{{getTotalMarkData.nums}}</label>
                <label></label>
            </div>
            <div class="col-md-2">
                <label>总质量：{{getTotalMarkData.weight}}</label>
                <label></label>
            </div>
            <!--<div class="col-md-2">-->
            <!--<label>总成本：{{getTotalMarkData.costPrice}}</label>-->
            <!--<label></label>-->
            <!--</div>-->
            <div class="col-md-2">
                <label>总零售价（原价）：{{getTotalMarkData.regularPrice}}</label>
                <label></label>
            </div>
            <div class="col-md-2">
                <label>总零售价（折后）：{{getTotalMarkData.retailPrice}}</label>
                <label></label>
            </div>
            <div class="col-md-2">
                <label>总工费：{{getTotalMarkData.extra}}</label>
                <label></label>
            </div>
        </div>

        <table class="table table-striped">
            <tbody>
            <tr style="background-color: rgb(221, 221, 221)">
                <th class="table-bordered" v-if="showSearchBtn"></th>
                <th class="table-bordered">序号</th>
                <th class="table-bordered">供货商</th>
                <th class="table-bordered">条码</th>
                <th class="table-bordered">数量</th>
                <th class="table-bordered">品类</th>
                <th class="table-bordered">寓意名</th>
                <th class="table-bordered">版号</th>
                <th class="table-bordered">宝石</th>
                <th class="table-bordered">金属</th>
                <th class="table-bordered">工艺</th>
                <th class="table-bordered">总质量</th>
                <th class="table-bordered">成本价</th>
                <th class="table-bordered">零售价(原价)</th>
                <th class="table-bordered">零售价(折后)</th>
                <th class="table-bordered">工费</th>
            </tr>
            <tr v-for="(item,index) in getAllocateBillsDetail">
                <td class="table-bordered" v-if="showSearchBtn">
                    <input type="checkbox" :checked="item.isChecked" @click="checkItem(item)"/>
                </td>
                <td class="table-bordered">{{index+1}}</td>
                <td class="table-bordered">{{item.vendorId}}</td>
                <td class="table-bordered">{{item.serial}}</td>
                <td class="table-bordered">{{item.amount}}</td>
                <td class="table-bordered">{{item.categoryId}}</td>
                <td class="table-bordered">{{item.moralName}}</td>
                <td class="table-bordered">{{item.modelCode}}</td>
                <td class="table-bordered">{{item.gemId}}</td>
                <td class="table-bordered">{{item.metalId}}</td>
                <td class="table-bordered">{{item.craftId}}</td>
                <td class="table-bordered">{{handleItemUnit(item.weight, 'g')}}</td>
                <td class="table-bordered">{{handleItemUnit(item.costPrice, '元')}}</td>
                <td class="table-bordered">{{handleItemUnit(item.regularPrice, '元')}}</td>
                <td class="table-bordered">{{handleItemUnit(item.retailPrice, '元')}}</td>
                <td class="table-bordered">{{handleItemUnit(item.computedProcessingCharges, '元/件')}}</td>
            </tr>
            </tbody>
        </table>

        <div class="row">
            <div class="col-md-12" style="text-align: right">
                <!--<span v-if="showRejectBtn" style="margin-right:15px;">-->
                    <!--<button type="button" class="btn btn-sm btn-default" @click="clickConfirmReject">拒收确认</button>-->
                <!--</span>-->
                <span><button type="button" class="btn btn-success" @click="clickBack">返回</button></span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import AllocateBillMain from '~/components/storage/stock/AllocateBillMain'
    import TableCpn from '~/components/Table'
    import DatePicker from '~/components/DatePicker'
    import {baseUtil} from '~/util'

    export default {
        props: ['passed'],
        components: {
            TableCpn,
            DatePicker
        },
        data() {
            return {
                stores: [],
                wareHouses: [],
                wareCanChoose: false,
                showSearchBtn: false,
                showAddBtn: false
            }
        },
        computed: {
            ...mapGetters('storage/stock/allocateBillDetail', {
                getAllocateBillsDetail: 'getAllocateBillsDetail',
                getTotalMarkData: 'getTotalMarkData',
                getAllocateBill: 'getAllocateBill',
                getShowSearch: 'getShowSearch',
                getStaffStoreId: 'getStaffStoreId'
            })
        },
        methods: {
            ...mapMutations('storage/stock/allocateBillDetail', {
                resetAllocateBillsDetail: 'resetAllocateBillsDetail'
            }),
            ...mapActions('storage/stock/allocateBillDetail', {
                apiAllocateBillsDetail: 'apiAllocateBillsDetail',
                apiAllocateBillsAccept: 'apiAllocateBillsAccept',
                apiAllocateBillsReject: 'apiAllocateBillsReject',
                apiAllocateBillConfirmReject: 'apiAllocateBillConfirmReject'
            }),
            checkItem(item) {
                item.isChecked = !item.isChecked
            },
            InputSerial() {
                let value = event.target.value;
                this.changeCheckedValue(value);
            },
            changeCheckedValue(value) {
                this.$refs.serial.select()
                let temp = this.getAllocateBillsDetail.filter(item => item.serial === value && item.isChecked);
                if (temp.length > 0) {
                    alert('该条码已被标记！')
                } else {
                    let arr = this.getAllocateBillsDetail;
                    for (let i = 0, j = arr.length; i < j; i++) {
                        if (arr[i].serial === value) {
                            arr[i].isChecked = true
                            break
                        }
                    }
                    this.resetAllocateBillsDetail(arr)
                }
            },
            searchSerial() {
                let value = this.$refs.serial.value;
                this.changeCheckedValue(value);
            },
            clickAccept() {
                this.apiAllocateBillsAccept(() => {
                    this.clickBack()
                })
            },
            clickReject() {
                this.apiAllocateBillsReject(() => {
                    this.clickBack()
                })
            },
            clickConfirmReject() {
                this.apiAllocateBillConfirmReject(() => {
                    this.clickBack()
                })
            },
            clickBack() {
                this.passed.changeCurrCpn(AllocateBillMain)
            },
            initData() {
                // 所有人都可以查看此页面
                // showSearchBtn 当前登录的人是收货门店的员工，并且不是发货人 展示搜索框，搜索框的作用为标记，有单选框
                // showRejectBtn 当前登录的人是发货人时显示
                // getAllocateBill=== 当前调拨单
                let targetStoreId = this.getAllocateBill.targetStoreId; // 收货门店id
                let allocatedById = this.getAllocateBill.allocatedById; // 发货人id
                let curStaffId = baseUtil.getUser().id; // 当前登录的员工id
                let curStaffs = baseUtil.getStaffsInDesignStoreByStoreId(targetStoreId); // 收货门店的所有员工数组
                if (curStaffs.length > 0) {
                    this.showSearchBtn = curStaffs.find(item => item.id === curStaffId) && curStaffId !== allocatedById // 当前登录的人是收货门店的员工，并且不是发货人
                }
            }
        },
        mounted() {
            this.apiAllocateBillsDetail(() => {
            })
            this.initData()
        }
    }
</script>

<style>
</style>
