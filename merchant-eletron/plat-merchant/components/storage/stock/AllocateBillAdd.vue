<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="form-group form-group-margin">
                    <span class="titleNameSize">单号&nbsp;&nbsp;&nbsp;</span>
                    <span>{{this.getNewAllocateBill.billNumber}}</span>
                </div>
            </div>

            <div v-if="getAddPageCanChange" class="form-group form-group-margin">
                <div class="form-group form-group-margin">
                    <span class="titleNameSize">调入门店&nbsp;&nbsp;&nbsp;</span>
                    <select class="form-control" v-model="storeId" disabled>
                        <option value="">全部</option>
                        <option v-for="store in stores" :value="store.id">{{store.name}}</option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <span class="titleNameSize">调入仓库&nbsp;&nbsp;&nbsp;</span>
                    <select v-model="wareHouseId" class="form-control" disabled>
                        <option v-for="wareHouse in wareHouses" :value="wareHouse.id">{{wareHouse.name}}</option>
                    </select>
                </div>
            </div>

            <div  class="form-group form-group-margin" v-else>
                <div class="form-group form-group-margin">
                    <span class="titleNameSize">调入门店&nbsp;&nbsp;&nbsp;</span>
                    <select class="form-control" @change="changeStore" >
                        <option value="">全部</option>
                        <option v-for="store in stores" :value="store.id">{{store.name}}</option>
                    </select>
                </div>
                <div class="form-group form-group-margin">
                    <span class="titleNameSize">调入仓库&nbsp;&nbsp;&nbsp;</span>
                    <select v-if="wareCanChoose" class="form-control" @change="changeWareHouse">
                        <option v-for="wareHouse in wareHouses" :value="wareHouse.id">{{wareHouse.name}}</option>
                    </select>
                    <select v-else class="form-control" disabled>
                        <option value=""></option>
                    </select>
                </div>
            </div>

        </div>
        <div class="row">
            <div class="col-md-3">
                <input type="text" class="form-control" placeholder="" ref="serial"
                       @change="changeSerial" @keyup.enter="search"/>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="search">搜索
                </button>
            </div>
            <div class="col-md-8" style="text-align: right">
                <button type="button" class="btn btn-success" style="margin-right: 10px;">导入入库单</button>
                <!--<ButtonWithModal-->
                <!--:btnProps="{-->
                <!--btnClasses: ['btn btn-success'],-->
                <!--btnName: '测试'-->
                <!--}"-->
                <!--:modalProps="{-->
                <!--CONST_CLOSE_MODAL: addModalName,-->
                <!--CONST_CLICK_MODAL: CONST_CLICK_MODAL+'detail',-->
                <!--titleName: '导入入库单',-->
                <!--modalClasses: ['modal-lg']-->
                <!--}">-->
                <!--<ExportOrImportExcel slot="main"-->
                <!--:CONST_CLOSE_MODAL="addModalName"-->
                <!--:CONST_CLICK_MODAL="CONST_CLICK_MODAL+'detail'"-->
                <!--&gt;-->
                <!--</ExportOrImportExcel>-->
                <!--</ButtonWithModal>-->
                <button type="button" class="btn btn-warning" style="margin-right: 10px;">导出成EXCEL</button>
            </div>
        </div>

        <div class="row" style="margin-top: 20px;">
            <div class="col-md-2">
                <label>总件数：</label>
                <label>{{getPropsCount.amount}}</label>
            </div>
            <div class="col-md-2">
                <label>总质量：</label>
                <label>{{getPropsCount.weight}}g</label>
            </div>
            <!--<div class="col-md-2">-->
            <!--<label>总成本：</label>-->
            <!--<label>{{getPropsCount.costPrice}}</label>-->
            <!--</div>-->
            <div class="col-md-2">
                <label>总零售价（原价）：</label>
                <label>{{getPropsCount.regularPrice}}元</label>
            </div>
            <div class="col-md-2">
                <label>总零售价（折后）：</label>
                <label>{{getPropsCount.retailPrice}}元</label>
            </div>
            <div class="col-md-2">
                <label>工费：</label>
                <label>{{getPropsCount.processingCharges}}元</label>
            </div>
        </div>

        <table class="table table-striped">
            <tbody>
            <tr style="background-color: rgb(221, 221, 221)">
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
                <th class="table-bordered">操作</th>
            </tr>
            <tr v-for="(item,index) in getAllocateBillItems">
                <td class="table-bordered">{{item.vendorId}}</td>
                <td class="table-bordered">{{item.serial}}</td>
                <td class="table-bordered" v-if="item.skuType === 'SINGLE'">{{item.amount}}</td>
                <td class="table-bordered" v-else>
                    <input type="number" style="max-width: 50px; text-align: center" :value="item.amount"
                           @change="changeAmount($event,item)">
                </td>
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
                <td class="table-bordered">
                    <button type="button" class="btn btn-danger btn-sm" @click="delAllocateDetial(item)">删除</button>
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn-info btn-sm'],
                                btnName: '详情'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: addModalName,
                                titleName: '商品详情'
                            }">
                    </ButtonWithModal>
                </td>
            </tr>
            </tbody>
        </table>

        <div class="row">
            <div class="col-md-12" style="text-align: right">
                <span v-if="showRejectBtn" style="margin-right:15px;">
                    <button type="button" class="btn btn-warning" @click="clickConfirmReject">拒收确认</button>
                </span>
                <span style="margin-right:15px" v-if="!showRejectBtn">
                    <button type="button" class="btn btn-primary" @click="clickOutAllocateBill">发货并出库</button>
                </span>
                <span><button type="button" class="btn btn-success" @click="clickBack">保存并返回</button></span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import AllocateBillMain from '~/components/storage/stock/AllocateBillMain'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import ExportOrImportExcel from '~/components/ExportOrImportExcel'
    import {baseUtil} from '~/util'
    import uuid from 'uuid'

    export default {
        props: ['passed'],
        components: {
            ButtonWithModal,
            ExportOrImportExcel
        },
        data() {
            return {
                storeId: '',
                wareHouseId: '',
                stores: [],
                wareHouses: [],
                wareCanChoose: false,
                showRejectBtn: false,
                addModalName: uuid(),
                CONST_CLICK_MODAL: uuid()
            }
        },
        computed: {
            ...mapGetters('storage/stock/allocateBillMain', {
                getNewAllocateBill: 'getNewAllocateBill',
                getStores: 'getStores',
                getAllocateBillItems: 'getAllocateBillItems',
                getAddPageCanChange: 'getAddPageCanChange',
                getPropsCount: 'getPropsCount'
            }),
            ...mapGetters('storage/stock/allocateBillDetail', {
                getAllocateBill: 'getAllocateBill'
            })
        },
        methods: {
            ...mapMutations('storage/stock/allocateBillMain', {
                resetStores: 'resetStores',
                resetModifyTargetStoreId: 'resetModifyTargetStoreId',
                resetModifyTargetWareHouseId: 'resetModifyTargetWareHouseId',
                resetSerial: 'resetSerial',
                resetAllocateBillItemsTotal: 'resetAllocateBillItemsTotal',
                resetModifyAllocateBillItem: 'resetModifyAllocateBillItem'
            }),
            ...mapActions('storage/stock/allocateBillMain', {
                modifyAllocateBill: 'modifyAllocateBill',
                getAllocateBillItemsAction: 'getAllocateBillItems',
                addAllocateBillItems: 'addAllocateBillItems',
                outAllocateBill: 'outAllocateBill',
                modifyAllocateBillItemAmount: 'modifyAllocateBillItemAmount',
                deleteAllocateBillItem: 'deleteAllocateBillItem'
            }),
            ...mapActions('storage/stock/allocateBillDetail', {
                apiAllocateBillConfirmReject: 'apiAllocateBillConfirmReject'
            }),
            changeStore(event) {
                this.wareHouses = ''
                this.setWareHouse(this.stores, event.target.value);
                // 设置收货门店
                this.resetModifyTargetStoreId(event.target.value)
                if (event.target.value !== '') {
                    this.wareCanChoose = true
                    if (this.wareHouses.length > 0) {
                        this.resetModifyTargetWareHouseId(this.wareHouses[0].id)
                    }
                } else {
                    this.wareCanChoose = false
                }
                this.modifyAllocateBill(() => {
                })
            },
            changeWareHouse(event) {
                // 设置收货仓库
                this.resetModifyTargetWareHouseId(event.target.value)
                this.modifyAllocateBill(() => {
                })
            },
            changeSerial(event) {
                this.resetSerial(event.target.value)
            },
            changeAmount(event, item) {
                if (event.target.value <= 0) {
                    event.target.value = 1
                    return
                }
                var billObj = {
                    billId: item.billId,
                    itemId: item.id,
                    amount: event.target.value
                }
                this.resetModifyAllocateBillItem(billObj)
                this.modifyAllocateBillItemAmount(() => {
                })
            },
            delAllocateDetial(item) {
                let vm = this;
                this.deleteAllocateBillItem({
                    sendParams: {
                        billId: item.billId,
                        itemId: item.id
                    },
                    callBack: () => {
                        vm.refreshTable()
                    }
                });
            },
            refreshTable() {
                this.getAllocateBillItemsAction(() => {
                });
            },
            search() {
                this.$refs.serial.select()
                this.addAllocateBillItems((data) => {
                })
            },
            clickOutAllocateBill() {
                this.outAllocateBill(() => {
                    this.passed.changeCurrCpn(AllocateBillMain)
                })
            },
            clickBack() {
                this.passed.changeCurrCpn(AllocateBillMain)
            },
            clickConfirmReject() {
                this.apiAllocateBillConfirmReject(() => {
                    this.clickBack()
                })
            },
            setWareHouse(stores, storeId) {
                stores.forEach(store => {
                    if (store.id === storeId) {
                        this.wareHouses = store.wareHouses
                    }
                })
            },
            initData() {
                this.resetStores();
                this.stores = this.getStores;
                let allocatedById = this.getAllocateBill.allocatedById; // 发货人id
                let curStaffId = baseUtil.getStaff().id; // 当前登录的员工id
                this.showRejectBtn = curStaffId === allocatedById
                this.setWareHouse(this.stores, this.getNewAllocateBill.targetStoreId);
                this.storeId = this.getNewAllocateBill.targetStoreId
                this.wareHouseId = this.getAllocateBill.targetWareHouseId
            }
        },
        mounted() {
            this.initData()
        }
    }
</script>

<style>

</style>
