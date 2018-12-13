<template>
    <div>
        <fieldset>
            <legend>客户信息</legend>
            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <label style="padding:15px;">客户手机号</label>
                    <input type="text" class="form-control" style="display: inline-block; max-width: 150px"
                           v-model="telephone$" @keyup.enter="clickSearchUser">
                    <button class="btn btn-info" style="margin: 0 10px 3px" @click="clickSearchUser">搜索</button>
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
                <input v-model="nickName$" type="text" class="form-control"
                       style="display: inline-block; max-width: 150px">
                <label style="padding:15px;">性别</label>
                <select class="form-control" v-model="gender$">
                    <option value="FEMALE">女</option>
                    <option value="MALE">男</option>
                </select>
            </div>
        </fieldset>

        <div class="form-inline" style="margin-top: 20px">
            <div class="form-group form-group-margin">
                <label>仓库&nbsp;&nbsp;&nbsp;</label>
                <select class="form-control" style="margin-left: 15px" @change="chooseWareHouse" v-model="wareHouseId$">
                    <option v-for="wareHouse in getRrecyclerWareHouse" :value="wareHouse.id">{{ wareHouse.name }}
                    </option>
                </select>
            </div>
        </div>

        <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
            <thead>
            <tr>
                <th>序号</th>
                <th>金属</th>
                <th>计价方式</th>
                <th>毛重</th>
                <th>折旧率</th>
                <th>净重</th>
                <th>工费（元/克）</th>
                <th>金价（元/克）</th>
                <th>其他扣除</th>
                <th>回收金额</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in retailRecycleBillAdd">
                <td class="table-bordered">{{ index + 1 }}</td>
                <td class="table-bordered">
                    <select style="max-width: 100px" :ref="'metalId' + index" @change="changeMetal" :data-index="index">
                        <option v-for="metal in getMetalPriceArr" :value="metal.metalId">{{metal.name}}</option>
                    </select>
                </td>
                <td class="table-bordered">
                    <select style="max-width: 100px" :ref="'priceType' + index">
                        <option :value="item.priceType">按重计价</option>
                    </select>
                </td>
                <td class="table-bordered">
                    <input
                        type="number"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`depreciationRate$${index}`)"
                        @input="modifyItemHandler($event, index, 'roughWeight')"
                        :ref="'roughWeight' + index"
                        :value="item.roughWeight"
                    />
                </td>
                <td class="table-bordered">
                    <input
                        type="text"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`netWeight${index}`)"
                        @input="modifyItemHandler($event, index, 'depreciationRate$')"
                        :ref="'depreciationRate$' + index"
                        :value="item.depreciationRate$"
                    />
                </td>
                <td class="table-bordered">
                    <input
                        type="number"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`processingCharges${index}`)"
                        @input="modifyItemHandler($event, index, 'netWeight')"
                        :ref="'netWeight' + index"
                        :value="item.netWeight"
                    />
                </td>
                <td class="table-bordered">
                    <input
                        type="number"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`metalPrice${index}`)"
                        @input="modifyItemHandler($event, index, 'processingCharges')"
                        :ref="'processingCharges' + index"
                        :value="item.processingCharges"
                    />
                </td>
                <td class="table-bordered">
                    <input
                        type="number"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`forfeit${index}`)"
                        @input="modifyItemHandler($event, index, 'metalPrice')"
                        :ref="'metalPrice' + index"
                        :value="item.metalPrice"
                    />
                </td>
                <td class="table-bordered">
                    <input
                        type="number"
                        style="max-width: 50px"
                        @keyup.enter="enterPress(`acturePrice$${index}`)"
                        @input="modifyItemHandler($event, index, 'forfeit')"
                        :ref="'forfeit' + index"
                        :value="item.forfeit"
                    />
                </td>
                <td class="table-bordered">
                    <span>{{item.acturePay}}</span>
                </td>
                <td class="table-bordered">
                    <button class="btn btn-info" @click="clickDelete" :data-index="index">删除</button>
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
            </tr>
            </tbody>
        </table>

        <div class="row">
            <div class="col-md-2">
                <label>&nbsp;&nbsp;回收金额：</label>
                <label>{{getTotalPay}}</label>
            </div>
            <div class="col-md-7" style=""></div>
            <div class="col-md-3" style="display: flex;justify-content: space-around">
                <span>
                    <button type="button" class="btn btn-primary" @click="clickSubmit">保存并提交</button>
                </span>
                <span>
                    <button type="button" class="btn btn-danger" @click="jump2payment">前往收银</button>
                </span>
                <span>
                    <button type="button" class="btn btn-info" @click="clickBack">返回</button>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations, mapActions, mapGetters} from 'vuex';
    import {ChangeTabEvent} from '~/components/ChangeTabEvent'
    // import {TableEvent} from '~/components/TableEvent';
    import {calculateUtil, numberUtil} from '~/util';
    import Pagination from '~/components/Pagination';
    import TableCpn from '~/components/Table';
    import uuid from 'uuid';
    import RetailRecycleBillMain from '~/components/retail/offlineRetail/RetailRecycleBillMain';
    import ButtonWithModal from '~/components/ButtonWithModal';

    export default {
        props: ['passed'],
        components: {
            TableCpn,
            Pagination,
            ButtonWithModal
        },
        data() {
            return {
                test: {},
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                showUserIsMember: false,
                showUserCreateMember: false,
                telephone$: '',
                wareHouseId$: '',
                nickName$: '',
                gender$: '',
                depreciationRate$: '', // 折旧率
                retailRecycleBillAdd: [] // 新增的对象数组
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/retailBillAdd', {
                getUserInfo: 'getUserInfo'
            }),
            ...mapGetters('retail/offlineRetail/retailRecycleBillAdd', {
                retailRecycleBillAddView: 'getRetailRecycleBillAddView',
                getMetalPriceArr: 'getMetalPriceArr',
                getRrecyclerWareHouse: 'getRrecyclerWareHouse'
            }),
            ...mapGetters('retail/offlineRetail/retailRecycleBillMain', {
                getTotalPay: 'getTotalPay'
            })
        },
        methods: {
            ...mapMutations('retail/offlineRetail/retailRecycleBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            ...mapMutations('retail/offlineRetail/retailRecycleBillAdd', {
                resetRetailRecycleBillAdd: 'resetRetailRecycleBillAdd'
            }),
            ...mapMutations('retail/offlineRetail/retailRecycleBillMain', {
                resetTotalPay: 'resetTotalPay'
            }),
            ...mapActions('retail/offlineRetail/retailBillAdd', {
                apiGetUser: 'apiGetUser'
            }),
            ...mapActions('retail/offlineRetail/retailRecycleBillAdd', {
                getMetalPriceByMetal: 'getMetalPriceByMetal',
                addRetailRecycleBill: 'addRetailRecycleBill'
            }),
            ...mapActions('retail/offlineRetail/retailRecycleBillMain', {
                getRetailRecycleBills: 'getRetailRecycleBills'
            }),
            jump2payment() {
                let commitObj = this.beforeSubmit()
                if (!commitObj) {
                    alert('请添加回收单之后再提交');
                    return
                }
                this.addRetailRecycleBill({
                    callback: (data) => {
                        console.log('新增回收单', data)
                        ChangeTabEvent.$emit('JUMP_TO_PAYMENT', data.result.billNumber)
                    },
                    commitObj
                });
            },
            chooseWareHouse() {
                this.wareHouseId$ = event.target.value;
            },
            clickBack() {
                this.resetCurrCpn(RetailRecycleBillMain);
            },
            // add, adds, subtract, multiply, divide
            caculateCostPrice(metalPrice, processingCharges, netWeight, forfeit) {
                let {subtract, multiply} = calculateUtil;
                let result = subtract(multiply(subtract(metalPrice, processingCharges), netWeight), forfeit)
                return Number(result)
            },
            beforeSubmit() {
                let {wareHouseId$, telephone$, nickName$, gender$, retailRecycleBillAdd, showUserCreateMember, showUserIsMember} = this;
                let commitObj = {};
                retailRecycleBillAdd.forEach((item) => {
                    // item.totalCost = (item.metalPrice - item.processingCharges) * item.netWeight - item.forfeit;
                    item.totalCost = this.caculateCostPrice(numberUtil.toKeepTwoPlacesOfDecimalAndRoundSupplementZero(item.metalPrice), numberUtil.toKeepTwoPlacesOfDecimalAndRoundSupplementZero(item.processingCharges), numberUtil.toKeepTwoPlacesOfDecimalAndRoundSupplementZero(item.netWeight), numberUtil.toKeepTwoPlacesOfDecimalAndRoundSupplementZero(item.forfeit))
                    item.wareType = 'PURE';
                    delete item.depreciationRate$;
                    delete item.acturePay;
                })
                if (showUserCreateMember) {
                    commitObj.telephone = telephone$
                    commitObj.nickName = nickName$
                    commitObj.gender = gender$
                } else if (showUserIsMember) {
                    commitObj.customerId = this.getUserInfo.id
                    commitObj.telephone = this.getUserInfo.telephone
                    commitObj.nickName = this.getUserInfo.nickName
                }
                if (retailRecycleBillAdd.length <= 0)
                    return false
                commitObj.itemsJson = JSON.stringify(retailRecycleBillAdd);
                commitObj.wareHouseId = wareHouseId$;
                return commitObj
            },
            clickSubmit() { // 提交
                let that = this;
                let commitObj = this.beforeSubmit();
                if (!commitObj) {
                    alert('请添加回收单之后再提交');
                    return
                }
                this.addRetailRecycleBill({
                    callback: () => {
                        that.resetCurrCpn(RetailRecycleBillMain);
                        that.getRetailRecycleBills(); // 重置获取回收单
                    },
                    commitObj
                });
            },
            clickSearchUser() { // 点击搜索用户
                this.apiGetUser({
                    params: {
                        telephone: this.telephone$
                    },
                    callback: (data) => {
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
            changeMetal(event) { // 改变金属
                let value = event.target.value;
                let index = parseInt(event.target.dataset.index);
                let that = this;
                that.getMetalPriceArr.forEach((item) => {
                    if (item.metalId === value) {
                        let arr = [{
                            value: item.retailPrice,
                            index,
                            symbol: 'metalPrice'
                        }, {
                            value,
                            index,
                            symbol: 'metalId'
                        }];
                        that.oprateRetailRecycleBillAdd(arr);
                    }
                })
            },
            clickPlus() { // 点击添加一行
                this.oprateRetailRecycleBillAdd({
                    data: { // 新增某一行的数据
                        metalId: this.getMetalPriceArr[0].metalId,
                        priceType: 'WEIGHTED',
                        roughWeight: 0,
                        depreciationRate$: 0, // 折旧率
                        netWeight: 0,
                        processingCharges: 0,
                        metalPrice: 0,
                        forfeit: 0,
                        totalCost: 0
                    }
                });
            },
            clickDelete(e) { // 点击删除当前行
                this.oprateRetailRecycleBillAdd({
                    index: parseInt(e.target.dataset.index)
                });
            },
            enterPress(ref) { // item上的回车
                this.$refs[ref][0].focus()
            },
            modifyItemHandler($event, index, symbol) {
                let value = Number($event.target.value);
                if (symbol === 'roughWeight' || symbol === 'netWeight' || symbol === 'depreciationRate$') {
                    this.caculateRoughWeight(value, index, symbol);
                } else {
                    this.oprateRetailRecycleBillAdd({
                        value,
                        index,
                        symbol
                    });
                }
            },
            oprateRetailRecycleBillAdd(obj) {
                let tempArr = this.retailRecycleBillAdd;
                if (obj.data) { // 新增
                    tempArr.push(obj.data);
                } else if (obj.symbol) { // 修改
                    let {symbol} = obj;
                    for (let i = 0; i < tempArr.length; i++) {
                        if (i === obj.index) {
                            tempArr[i][symbol] = obj.value;
                            break;
                        }
                    }
                } else if (obj.length) {
                    for (let j = 0; j < obj.length; j++) {
                        let {symbol} = obj[j];
                        for (let i = 0; i < tempArr.length; i++) {
                            if (i === obj[j].index) {
                                tempArr[i][symbol] = obj[j].value;
                                break;
                            }
                        }
                    }
                } else { // 删除
                    tempArr.splice(obj.index, 1);
                }
                // 计算实付金额
                let totalPay = 0;
                tempArr.forEach((item) => {
                    if (!item.metalPrice) {
                        item.metalPrice = 0
                    }
                    console.log('计算实付金额', item.metalPrice, item.processingCharges, item.netWeight, item.forfeit);
                    let temp = this.caculateCostPrice(item.metalPrice, item.processingCharges, item.netWeight, item.forfeit);
                    totalPay += temp;
                    console.log('totalPay', totalPay);
                    item.acturePay = temp;
                })
                this.resetTotalPay(totalPay)
                this.retailRecycleBillAdd = tempArr;
            },
            caculateRoughWeight(value, index, symbol) { // 计算毛重，净重，折旧率
                let roughWeightValue = 0;
                let netWeightValue = 0;
                let depreciationRate$Value = 0;
                let arr = [];
                switch (symbol) {
                    case 'roughWeight' : {
                        roughWeightValue = value;
                        depreciationRate$Value = this.retailRecycleBillAdd[index].depreciationRate$;
                        arr = [{
                            value: roughWeightValue,
                            index,
                            symbol: 'roughWeight'
                        }, {
                            value: calculateUtil.multiply(roughWeightValue, depreciationRate$Value),
                            index,
                            symbol: 'netWeight'
                        }]
                        break;
                    }
                    case 'depreciationRate$' : {
                        depreciationRate$Value = value;
                        if (depreciationRate$Value > 1) {
                            alert('折旧率不能大于1');
                            depreciationRate$Value = 0
                        }
                        roughWeightValue = this.retailRecycleBillAdd[index].roughWeight;
                        arr = [{
                            value: depreciationRate$Value,
                            index,
                            symbol: 'depreciationRate$'
                        }, {
                            value: calculateUtil.multiply(roughWeightValue, depreciationRate$Value),
                            index,
                            symbol: 'netWeight'
                        }]
                        break;
                    }
                    case 'netWeight' : {
                        netWeightValue = value;
                        depreciationRate$Value = calculateUtil.divide(netWeightValue, this.retailRecycleBillAdd[index].roughWeight);
                        if (depreciationRate$Value >= 1) {
                            alert('折旧率不能大于或者等于1');
                            depreciationRate$Value = 0
                            netWeightValue = 0
                        }
                        arr = [{
                            value: depreciationRate$Value,
                            index,
                            symbol: 'depreciationRate$'
                        }, {
                            value: netWeightValue,
                            index,
                            symbol: 'netWeight'
                        }]
                        break;
                    }
                }
                arr.forEach((item) => {
                    console.log('item', item);
                    item.value = numberUtil.toKeepTwoPlacesOfDecimalAndRound(item.value);
                })
                this.oprateRetailRecycleBillAdd(arr);
            }
        },
        mounted() {
            console.log('回收单上层组件（add页面）  mounted');
            this.wareHouseId$ = this.getRrecyclerWareHouse[0].id
        },
        beforeMount() {
        }
    }
</script>

<style scoped>
    .red {
        background: #ec475873;
    }
</style>
