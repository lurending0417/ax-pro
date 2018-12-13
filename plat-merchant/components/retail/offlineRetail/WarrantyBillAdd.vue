<template>
    <div>
        <fieldset>
            <legend>客户信息</legend>
            <div class="row">
                <div class="col-lg-4">
                    <div class="form-inline">
                        <div class="form-group form-group-margin">
                            <label style="padding:15px;">客户手机号</label>
                            <input type="text" class="form-control" style="display: inline-block; max-width: 150px"
                                   placeholder="必填项"
                                   v-model="telephone" @keyup.enter="searchUsers">
                            <button class="btn btn-info" style="margin: 0 10px 3px" @click="searchUsers">搜索</button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="form-inline">
                        <div class="form-group form-group-margin" style="margin-top:10px;">
                            <label>操作员&nbsp;&nbsp;&nbsp;</label>
                            <select class="form-control" style="margin-left: 15px" v-model="salesmanId">
                                <option v-for="staff in staffs" :value="staff.id">{{ staff.nickName }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div v-show="showUserIsMember" class="form-inline" style="margin-bottom: 15px">
                <label class="label label-default m-l-xs" style="margin: 15px">客户昵称：{{ getUserInfo.nickName }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">手机号码：{{ getUserInfo.telephone }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">注册日期：{{ getUserInfo.createTime }}</label>
            </div>
            <div v-show="showUserCreateMember" class="form-inline">
                <label style="padding:15px;"><i class="fa fa-star text-danger">新客户档案</i></label>
                <label style="padding:15px;">姓名</label>
                <input v-model="nickName" type="text" class="form-control"
                       style="display: inline-block; max-width: 150px">
                <label style="padding:15px;">性别</label>
                <select class="form-control" v-model="gender">
                    <option value="FEMALE">女</option>
                    <option value="MALE">男</option>
                </select>
            </div>
        </fieldset>

        <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
            <thead>
            <tr>
                <th>序号</th>
                <th>条码</th>
                <th>件数</th>
                <th>品类</th>
                <th>宝石</th>
                <th>金属</th>
                <th>总质量</th>
                <th>实收金额</th>
                <th>备注</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in warrantyBillAdd">
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
                    <input
                        type="number"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`categoryId${index}`)"
                        :ref="'amount' + index"
                        v-model.number="item.amount"
                    />
                </td>
                <td class="table-bordered">
                    <select style="max-width: 100px" :ref="'categoryId' + index" v-model="item.categoryId" @keydown.enter="enterPress(`gemId${index}`)">
                        <option value=""></option>
                        <option v-for="category in getCategoryArr" :value="category.id">{{category.name}}</option>
                    </select>
                </td>
                <td class="table-bordered">
                    <select style="max-width: 100px" :ref="'gemId' + index" v-model="item.gemId" @keydown.enter="enterPress(`metalId${index}`)">
                        <option value=""></option>
                        <option v-for="gem in getGemArr" :value="gem.id">{{gem.name}}</option>
                    </select>
                </td>
                <td class="table-bordered">
                    <select style="max-width: 100px" :ref="'metalId' + index" v-model="item.metalId" @keydown.enter="enterPress(`weight${index}`)">
                        <option value=""></option>
                        <option v-for="metal in getMetalArr" :value="metal.id">{{metal.name}}</option>
                    </select>
                </td>
                <td class="table-bordered">
                    <input
                        type="text"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`totalCost${index}`)"
                        :ref="'weight' + index"
                        v-model.number="item.weight"
                    />
                </td>
                <td class="table-bordered">
                    <input
                        type="text"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`remark${index}`)"
                        :ref="'totalCost' + index"
                        v-model.number="item.totalCost"
                    />
                </td>
                <td class="table-bordered">
                    <input
                        type="text"
                        style="max-width: 100px"
                        :ref="'remark' + index"
                        v-model="item.remark"
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
            </tr>
            </tbody>
        </table>

        <div class="row">
            <div class="col-md-2">
                <label>&nbsp;&nbsp;件数：</label>
                <label>{{computedAmount}}</label>
            </div>
            <div class="col-md-2">
                <label>&nbsp;&nbsp;总质量：</label>
                <label>{{computedWeight}}</label>
            </div>
            <div class="col-md-2">
                <label>&nbsp;&nbsp;实收金额：</label>
                <label>{{computedPay}}</label>
            </div>
            <div class="col-md-3" style=""></div>
            <div class="col-md-3" style="display: flex;justify-content: space-around">
                <span>
                    <button type="button" class="btn btn-sm btn-default" @click="clickSubmit">保存并提交</button>
                </span>
                <span>
                    <button type="button" class="btn btn-sm btn-default" @click="clickBack">返回</button>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import {baseUtil} from '~/util';
    import TableCpn from '~/components/Table';
    import leaseStorageParams from '~/components/storage/wearGoods/leaseStorageParams';
    import uuid from 'uuid';
    import WarrantyBillMain from '~/components/retail/offlineRetail/WarrantyBillMain';
    import ButtonWithModal from '~/components/ButtonWithModal';

    export default {
        props: ['passed'],
        components: {
            TableCpn,
            leaseStorageParams,
            ButtonWithModal
        },
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                showUserIsMember: false,
                showUserCreateMember: false,
                hasSearched: false,
                telephone: '',
                gender: 'FEMALE',
                nickName: '',
                salesmanId: '',
                staffs: [],
                getCategoryArr: [],
                getMetalArr: [],
                getGemArr: [],
                warrantyBillAdd: [] // 新增的对象数组
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/retailBillAdd', {
                getUserInfo: 'getUserInfo'
            }),
            computedAmount() {
                return this.computedFunc('amount')
            },
            computedWeight() {
                return this.computedFunc('weight')
            },
            computedPay() {
                return this.computedFunc('pay')
            }
        },
        methods: {
            ...mapActions('retail/offlineRetail/retailBillAdd', {
                apiGetUser: 'apiGetUser'
            }),
            ...mapActions('retail/offlineRetail/warrantyBillMain', {
                apiPostWarrantyBill: 'apiPostWarrantyBill'
            }),
            enterPress(ref) { // item上的回车
                console.log('event', event);
                this.$refs[ref][0].focus()
            },
            computedFunc(tag) {
                let amount = 0;
                let weight = 0;
                let pay = 0;
                for (let i = 0, j = this.warrantyBillAdd.length; i < j; i++) {
                    let item = this.warrantyBillAdd[i]
                    switch (tag) {
                        case 'amount': {
                            amount += item.amount;
                            if (i === j - 1) {
                                return amount;
                            }
                            break
                        }
                        case 'weight': {
                            weight += item.weight;
                            if (i === j - 1) {
                                return weight
                            }
                            break
                        }
                        case 'pay': {
                            pay += item.totalCost;
                            if (i === j - 1) {
                                return pay
                            }
                            break
                        }
                    }
                }
            },
            clickDelete(index) { // 点击删除当前行
                this.operateWarrantyBillAdd({index});
            },
            clickPlus() { // 点击添加一行
                this.operateWarrantyBillAdd({
                    data: { // 新增某一行的数据
                        serial: '',
                        amount: 1,
                        categoryId: '',
                        metalId: '',
                        gemId: '',
                        weight: 0,
                        totalCost: 0,
                        remark: '',
                        props: []
                    }
                });
            },
            operateWarrantyBillAdd(obj) {
                if (obj.data) { // 新增
                    this.warrantyBillAdd.push(obj.data);
                }
                if (obj.index) { // 删除
                    this.warrantyBillAdd.splice(obj.index, 1)
                }
            },
            searchUsers() { // 搜索用户信息
                this.apiGetUser({
                    params: {
                        telephone: this.telephone
                    },
                    callback: (data) => {
                        this.hasSearched = true
                        if (data.status === 200) {
                            this.showUserIsMember = true
                            this.showUserCreateMember = false
                        } else {
                            this.showUserIsMember = false
                            this.showUserCreateMember = true
                        }
                    }
                })
            },
            clickBack() {
                this.passed.changeCurrCpn(WarrantyBillMain)
            },
            clickSubmit() {
                // 判断是否输入用户信息（必填项）
                if (!this.hasSearched) {
                    alert('客户信息不完整');
                    return
                }
                let items = JSON.stringify(this.warrantyBillAdd);
                let params = {
                    salesmanId: this.salesmanId || '',
                    customerId: '',
                    telephone: this.telephone || '',
                    nickName: this.nickName || '',
                    gender: this.gender || '',
                    remark: '',
                    itemsJson: items
                }
                if (this.getUserInfo.customerId) {
                    console.log('getUserInfo', this.getUserInfo);
                    params.customerId = this.getUserInfo.id
                    params.telephone = this.getUserInfo.telephone
                    params.nickName = this.getUserInfo.nickName
                    params.gender = this.getUserInfo.gender || ''
                }
                this.apiPostWarrantyBill({
                    params,
                    callBack: () => {
                        this.clickBack()
                    }
                })
            },
            initData() {
                this.salesmanId = this.staffs[0].id
            },
            initArr() {
                this.staffs = baseUtil.getStaffsInDesignStoreByStoreId()
                this.getCategoryArr = baseUtil.getMetadataCategory()
                this.getMetalArr = baseUtil.getMetadataMetal()
                this.getGemArr = baseUtil.getMetadataGem()
            }
        },
        mounted() {
            if (this.gettedWarrantyBillAdd && this.gettedWarrantyBillAdd.length > 0) {
                this.warrantyBillAdd = this.gettedWarrantyBillAdd
            }
            this.initArr()
            this.initData()
        }
    }
</script>

<style scoped>
    .red {
        background: #ec475873;
    }
</style>
