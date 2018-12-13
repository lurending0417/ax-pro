<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <span class="titleNameSize">仓库&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="wareHouseId">
                    <option :value="item.id" v-for="item in wareHouse">{{item.name}}</option>
                </select>
            </div>
        </div>

        <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
            <thead>
            <tr>
                <th>序号</th>
                <th>条码</th>
                <th>数量</th>
                <th>品类</th>
                <th>金属</th>
                <th>工艺</th>
                <th>宝石</th>
                <th>寓意名</th>
                <th>版号</th>
                <th>宝石质量</th>
                <th>宝石数量</th>
                <th>总质量</th>
                <th>价格</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in leaseStorageAdd">
                <td class="table-bordered">{{ index + 1 }}</td>
                <td class="table-bordered">
                    <input
                        type="text"
                        style="max-width: 100px"
                        @keyup.enter="enterPress(`amount${index}`)"
                        :ref="'serial' + index"
                        v-model="item.serial"
                    />
                </td>
                <td class="table-bordered">
                    <span>{{item.amount}}</span>
                </td>
                <td class="table-bordered">
                    <select style="max-width: 100px" :ref="'categoryId' + index" v-model="item.categoryId">
                        <option value=""></option>
                        <option v-for="category in getCategoryArr" :value="category.id">{{category.name}}</option>
                    </select>
                </td>
                <td class="table-bordered">
                    <select style="max-width: 100px" :ref="'metalId' + index" v-model="item.metalId">
                        <option value=""></option>
                        <option v-for="metal in getMetalArr" :value="metal.id">{{metal.name}}</option>
                    </select>
                </td>
                <td class="table-bordered">
                    <select style="max-width: 100px" :ref="'craftId' + index" v-model="item.craftId">
                        <option value=""></option>
                        <option v-for="craft in getCraftArr" :value="craft.id">{{craft.name}}</option>
                    </select>
                </td>
                <td class="table-bordered">
                    <select style="max-width: 100px" :ref="'gemId' + index" v-model="item.gemId">
                        <option value=""></option>
                        <option v-for="gem in getGemArr" :value="gem.id">{{gem.name}}</option>
                    </select>
                </td>
                <td class="table-bordered">
                    <input
                        type="text"
                        style="max-width: 100px"
                        @keyup.enter="enterPress(`moralCode${index}`)"
                        :ref="'moralName' + index"
                        v-model="item.moralName"
                    />
                </td>
                <td class="table-bordered">
                    <input
                        type="text"
                        style="max-width: 100px"
                        @keyup.enter="enterPress(`mainGemWeight${index}`)"
                        :ref="'moralCode' + index"
                        v-model="item.moralCode"
                    />
                </td>
                <td class="table-bordered">
                    <input
                        type="text"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`mainGemAmount${index}`)"
                        :ref="'mainGemWeight' + index"
                        v-model.number="item.mainGemWeight"
                    />
                </td>
                <td class="table-bordered">
                    <input
                        type="text"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`acturePay${index}`)"
                        :ref="'mainGemAmount' + index"
                        v-model.number="item.mainGemAmount"
                    />
                </td>
                <td class="table-bordered">
                    <input
                        type="text"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`acturePay${index}`)"
                        :ref="'weight' + index"
                        v-model.number="item.weight"
                    />
                </td>
                <td class="table-bordered">
                    <input
                        type="text"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`remark${index}`)"
                        :ref="'retailPrice' + index"
                        v-model.number="item.retailPrice"
                    />
                </td>
                <td class="table-bordered">
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '参数'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL+index,
                                modalClasses: ['modal-lg'],
                                titleName: '参数'
                            }">
                        <leaseStorageParams
                            slot="main"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :params="item"
                            :index="'propcurement'+index">
                        </leaseStorageParams>
                    </ButtonWithModal>
                    <button class="btn btn-danger btn-sm" @click="clickDelete(index)">删除</button>
                </td>
            </tr>
            <tr>
                <td class="table-bordered">
                    <i class="fa fa-plus" style="color: green; cursor: pointer" @click="clickPlus"></i>
                </td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
                <td class="table-bordered"></td>
            </tr>
            </tbody>
        </table>

        <div class="row">
            <div class="col-md-2">
                <label>&nbsp;&nbsp;总件数：</label>
                <label>{{computedAmount}}</label>
            </div>
            <div class="col-md-2">
                <label>&nbsp;&nbsp;总质量：</label>
                <label>{{computedWeight}}</label>
            </div>
            <div class="col-md-2">
                <label>&nbsp;&nbsp;总价格：</label>
                <label>{{computedPrice}}</label>
            </div>
            <div class="col-md-3"></div>
            <div class="col-md-3" style="text-align: right">
                <button type="button" class="btn btn-w-m btn-info" style="min-width: 80px;" @click="clickBack">保存并返回
                </button>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import LeaseManageMain from '~/components/storage/wearGoods/LeaseManageMain';
    import leaseStorageParams from '~/components/storage/wearGoods/leaseStorageParams';
    import ButtonWithModal from '~/components/ButtonWithModal'
    import {baseUtil} from '~/util';
    import uuid from 'uuid'
    // import { TableEvent } from '~/components/TableEvent';

    export default {
        props: ['passed', 'refresh'],
        components: {
            LeaseManageMain,
            ButtonWithModal,
            leaseStorageParams
        },
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_RESTORE: uuid(),
                wareHouseId: '',
                getCategoryArr: [],
                getMetalArr: [],
                getGemArr: [],
                getCraftArr: [],
                wareHouse: [],
                leaseStorageAdd: [] // 新增的leaseStorage
            }
        },
        computed: {
            computedAmount() {
                return this.computedFunc('amount')
            },
            computedWeight() {
                return this.computedFunc('weight')
            },
            computedPrice() {
                return this.computedFunc('price')
            }
        },
        methods: {
            ...mapActions('storage/wearStorage/leaseManageMain', {
                apiPostLeaseStorage: 'apiPostLeaseStorage'
            }),
            computedFunc(tag) {
                let amount = 0;
                let weight = 0;
                let price = 0;
                for (let i = 0, j = this.leaseStorageAdd.length; i < j; i++) {
                    let item = this.leaseStorageAdd[i]
                    switch (tag) {
                        case 'amount':
                        {
                            amount += item.amount;
                            if (i === j - 1) {
                                return amount;
                            }
                            break
                        }
                        case 'weight':
                        {
                            weight += item.weight;
                            if (i === j - 1) {
                                return weight
                            }
                            break
                        }
                        case 'price':
                        {
                            price += item.retailPrice;
                            if (i === j - 1) {
                                return price
                            }
                            break
                        }
                    }
                }
            },
            clickPlus () {
                this.operateLeaseStorageAdd({
                    data: { // 新增某一行的数据
                        serial: '',
                        amount: 1,
                        categoryId: '',
                        metalId: '',
                        craftId: '',
                        gemId: '',
                        moralName: '',
                        moralCode: '',
                        mainGemWeight: 0,
                        mainGemAmount: 0,
                        weight: 0,
                        retailPrice: 0,
                        props: []
                    }
                });
            },
            clickDelete(index) { // 点击删除当前行
                this.operateLeaseStorageAdd({index});
            },
            operateLeaseStorageAdd(obj) {
                if (obj.data) { // 新增
                    this.leaseStorageAdd.push(obj.data);
                }
                if (obj.index) { // 删除
                    this.leaseStorageAdd.splice(obj.index, 1)
                }
            },
            initData() {
                this.wareHouse = baseUtil.getWarehouseByStoreId()
                this.getCategoryArr = baseUtil.getMetadataCategory()
                this.getMetalArr = baseUtil.getMetadataMetal()
                this.getGemArr = baseUtil.getMetadataGem()
                this.getCraftArr = baseUtil.getMetadataCraft()
                if (this.wareHouse.length > 0) {
                    this.wareHouseId = this.wareHouse[0].id;
                }
            },
            resetData() {
                this.wareHouseId = '';
                this.wareHouse = []
                this.getCategoryArr = []
                this.getMetalArr = []
                this.getGemArr = []
                this.getCraftArr = []
            },
            clickBack() {
                console.log('clickBack', this.leaseStorageAdd);
                let params = {
                    wareHouseId: this.wareHouseId,
                    itemsJson: JSON.stringify(this.leaseStorageAdd)
                }
                console.log('params', params);
                this.apiPostLeaseStorage({
                    params,
                    callBack: (data) => {
                        this.passed.changeCurrCpn(LeaseManageMain);
                    }
                })
            }
        },
        beforeMount() {
            console.log('import beforeMount');
        },
        mounted() {
            // // 初始化可选数据
            console.log('import mounted');
            this.resetData();
            this.initData();
        }
    }
</script>

<style>

</style>
