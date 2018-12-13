<template>
    <div>
        <div v-if="!getCanChange" class="form-inline">
            <div class="form-group form-group-margin">
                <label>置换单号&nbsp;&nbsp;&nbsp;</label>
                <span>{{ getExchangeBillDetail.billNumber }}</span>
            </div>
        </div>

        <div v-if="getCanChange">
            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <label>客户手机号</label>
                    <input type="text" class="form-control" style="display: inline-block; max-width: 150px"
                           v-model="telephone$" @keyup.enter="clickSearchUser()">
                    <button class="btn btn-info" style="margin: 0 10px 3px" @click="clickSearchUser">搜索</button>
                </div>
            </div>
            <div v-if="showUserIsMember" class="form-inline" style="margin-bottom: 15px">
                <fieldset style="padding: 10px">
                    <legend>客户资料</legend>
                    <label class="label label-default m-l-xs" style="margin: 15px">客户昵称：{{ getUserInfo.nickName
                        }}</label>
                    <label class="label label-default m-l-xs" style="margin: 15px">性别：{{ getUserInfo.gender }}</label>
                    <label class="label label-default m-l-xs" style="margin: 15px">手机号码：{{ getUserInfo.telephone
                        }}</label>
                    <label class="label label-default m-l-xs" style="margin: 15px">注册日期：{{ getUserInfo.createTime
                        }}</label>
                </fieldset>
            </div>
            <div v-if="showUserCreateMember" class="form-inline">
                <fieldset style="padding: 10px">
                    <legend>客户资料</legend>
                    <label style="padding:15px;"><i class="fa fa-star text-danger">新客户档案</i></label>
                    <label style="padding:15px;">姓名</label>
                    <input v-model="nickName$" type="text" class="form-control"
                           style="display: inline-block; max-width: 150px">
                    <label style="padding:15px;">性别</label>
                    <select class="form-control" v-model="gender$">
                        <option value="FEMALE">女</option>
                        <option value="MALE">男</option>
                    </select>
                </fieldset>
            </div>
        </div>
        <div v-else>
            <fieldset style="padding: 10px">
                <legend>客户资料</legend>
                <label class="label label-default m-l-xs" style="margin: 15px">客户昵称：{{ getUserInfo.nickName }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">性别：{{ getUserInfo.gender }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">手机号码：{{ getUserInfo.telephone }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">注册日期：{{ getUserInfo.createTime}}</label>
            </fieldset>
        </div>

        <fieldset style="padding: 10px">
            <legend>来料</legend>
            <div class="form-inline">
                <div class="form-group form-group-margin">
                    <label class="titleNameSize">收货仓库&nbsp;&nbsp;&nbsp;</label>
                    <select v-if="getCanChange" class="form-control" v-model="wareHouseId$">
                        <option v-for="wareHouse in getRejectWareHouse" :value="wareHouse.id">{{ wareHouse.name }}
                        </option>
                    </select>
                    <span v-else>{{ getExchangeBillDetail.wareHouseId }}</span>
                </div>
                <div v-if="!getCanChange" style="text-align: right">
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn btn-warning'],
                                btnStyle: {marginRight: 10 + 'px'},
                                btnName: '打印模板'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                modalClasses: [''],
                                titleName: '选择打印模板'
                            }">
                        <PrintTemplate slot="main"
                                       :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"></PrintTemplate>
                    </ButtonWithModal>
                </div>
            </div>

            <table v-if="getCanChange" class="table table-striped" style="background-color: rgb(221, 221, 221)">
                <thead>
                <tr>
                    <th class="table-bordered">序号</th>
                    <th class="table-bordered">金属</th>
                    <th class="table-bordered">毛重</th>
                    <th class="table-bordered">折旧率</th>
                    <th class="table-bordered">净重</th>
                    <th class="table-bordered">金价</th>
                    <th class="table-bordered">工费</th>
                    <th class="table-bordered">原价金额</th>
                    <th class="table-bordered">其他扣除</th>
                    <th class="table-bordered">实收金额</th>
                    <th class="table-bordered">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in exchangeBillItems">
                    <td class="table-bordered">{{ index + 1 }}</td>
                    <td class="table-bordered">
                        <select style="max-width: 100px" :ref="'metalId' + index" @change="changeMetal"
                                :data-index="index">
                            <option v-for="metal in getMetals" :value="metal.id">{{metal.name}}</option>
                        </select>
                    </td>
                    <td class="table-bordered">
                        <input
                            type="number"
                            style="max-width: 50px"
                            @keyup.enter="enterPress(`depreciationRate${index}`)"
                            @input="modifyItemHandler($event, index, 'roughWeight')"
                            :ref="'roughWeight' + index"
                            :value="item.roughWeight"
                            :data-index="index"
                        />
                    </td>
                    <td class="table-bordered">
                        <input
                            type="number"
                            style="max-width: 50px"
                            @keyup.enter="enterPress(`netWeight${index}`)"
                            @input="modifyItemHandler($event, index, 'depreciationRate')"
                            :ref="'depreciationRate' + index"
                            :value="item.depreciationRate"
                            :data-index="index"
                        />
                    </td>
                    <td class="table-bordered">
                        <input
                            type="number"
                            style="max-width: 50px"
                            @keyup.enter="enterPress(`metalPrice${index}`)"
                            @input="modifyItemHandler($event, index, 'netWeight')"
                            :ref="'netWeight' + index"
                            :value="item.netWeight"
                            :data-index="index"
                        />
                    </td>
                    <td class="table-bordered">
                        <input
                            type="number"
                            style="max-width: 50px"
                            @keyup.enter="enterPress(`processingCharges${index}`)"
                            @input="modifyItemHandler($event, index, 'metalPrice')"
                            :ref="'metalPrice' + index"
                            :value="item.metalPrice"
                            :data-index="index"
                        />
                    </td>
                    <td class="table-bordered">
                        <input
                            type="number"
                            style="max-width: 50px"
                            @keyup.enter="enterPress(`originalPrice${index}`)"
                            @input="modifyItemHandler($event, index, 'processingCharges')"
                            :ref="'processingCharges' + index"
                            :value="item.processingCharges"
                            :data-index="index"
                        />
                    </td>
                    <td class="table-bordered">
                        <input
                            type="number"
                            style="max-width: 50px"
                            @keyup.enter="enterPress(`forfeit${index}`)"
                            @input="modifyItemHandler($event, index, 'originalPrice')"
                            :ref="'originalPrice' + index"
                            :value="item.originalPrice"
                            :data-index="index"
                        />
                        <!--<span>{{item.originalPrice}}</span>-->
                    </td>
                    <td class="table-bordered">
                        <input
                            type="number"
                            style="max-width: 50px"
                            @keyup.enter="enterPress(`totalCost${index}`)"
                            @input="modifyItemHandler($event, index, 'forfeit')"
                            :ref="'forfeit' + index"
                            :value="item.forfeit"
                            :data-index="index"
                        />
                    </td>
                    <td class="table-bordered">
                        <input
                            type="number"
                            style="max-width: 50px"
                            @keyup.enter="enterPress(`roughWeight${index}`)"
                            @input="modifyItemHandler($event, index, 'totalCost')"
                            :ref="'totalCost' + index"
                            :value="item.totalCost"
                            :data-index="index"
                        />
                        <!--<span>{{item.totalCost}}</span>-->
                    </td>
                    <td class="table-bordered">
                        <button class="btn btn-danger btn-sm" :data-index="index" @click="deleteItem(index)">删除</button>
                    </td>
                </tr>
                <tr>
                    <td class="table-bordered">
                        <i class="fa fa-plus" style="color: green; cursor: pointer" @click="addItem"></i>
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
                </tr>
                </tbody>
            </table>

            <TableCpn
                v-else
                :heads="[
                    {propName:'metalId',name:'金属'},
                    {propName:'priceType',name:'计价方式'},
                    {propName:'roughWeight',name:'毛重'},
                    {propName:'depreciationRate',name:'折旧率'},
                    {propName:'netWeight',name:'净重'},
                    {propName:'processingCharges',name:'工费'},
                    {propName:'metalPrice',name:'金价'},
                    {propName:'originalPrice',name:'原价金额'},
                    {propName:'forfeit',name:'其他扣除'},
                    {propName:'totalCost',name:'实收金额'}
                ]"
                :items="getExchangeBillDetailItems">
            </TableCpn>
        </fieldset>

        <div class="row" style="margin-bottom: 20px;margin-top: 20px">
            <div class="col-md-3">
                <label>&nbsp;&nbsp;实付金额：</label>
                <label>{{getCanChange ? totalPay : getExchangeBillDetail.totalCost}}</label>
            </div>
            <div class="col-md-9" style="text-align: right">
                <span v-if="getCanChange">
                    <button v-if="getCanChange" type="button" class="btn btn-primary" @click="add">保存并提交</button>
                    <button v-if="getCanChange" style="margin: 10px" type="button" class="btn btn-primary"
                            @click="clickGoRetail">前往销售</button>
                </span>
                <span v-else style="margin: 10px">
                    <button type="button" class="btn btn-success" data-dismiss="modal"
                            @click="print(getExchangeBillDetailItems)">打印票据</button>
                </span>
                <span style="margin: 10px">
                    <button type="button" class="btn btn-info" @click="back">返回</button>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import ExchangeBillMain from '~/components/retail/offlineRetail/ExchangeBillMain'
    import TableCpn from '~/components/Table'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import PrintTemplate from '~/components/storage/stock/PrintTemplate'
    import uuid from 'uuid'
    import {numberUtil} from '~/util'
    import { ChangeTabEvent } from '~/components/ChangeTabEvent'

    export default {
        components: {
            TableCpn,
            ButtonWithModal,
            PrintTemplate
        },
        props: ['passed', 'changeTab'],
        data() {
            return {
                showUserIsMember: false,
                showUserCreateMember: false,
                wareHouseId$: '',
                customerId$: '',
                telephone$: '',
                nickName$: '',
                gender$: '',
                exchangeBillItems: [],
                CONST_CLOSE_MODAL: uuid()
            }
        },
        computed: {
            ...mapGetters('retail/offlineRetail/exchangeBillAdd', {
                getCanChange: 'getCanChange',
                getMetals: 'getMetals',
                getMetalPrice: 'getMetalPrice',
                getStaffs: 'getStaffs',
                getRejectWareHouse: 'getRejectWareHouse',
                getUserInfo: 'getUserInfo',
                getExchangeBillDetail: 'getExchangeBillDetail',
                getExchangeBillDetailItems: 'getExchangeBillDetailItems'
            }),
            totalPay() {
                console.log('totalPay');
                let countTotal = 0;
                this.exchangeBillItems.forEach(item => {
                    if (Number(item.totalCost)) {
                        countTotal += Number(item.totalCost)
                    }
                })
                return countTotal
            }
        },
        methods: {
            ...mapMutations('retail/offlineRetail/retailBill', {
                resetBillNumber: 'resetBillNumber'
            }),
            ...mapMutations('retail/offlineRetail/retailBillAdd', {
                resetCanChange: 'resetCanChange'
            }),
            ...mapMutations('retail/offlineRetail/retailBillMain', {
                resetHasExchangeBill: 'resetHasExchangeBill'
            }),
            ...mapMutations('retail/offlineRetail/exchangeBillAdd', {}),
            ...mapActions('retail/offlineRetail/exchangeBillAdd', {
                apiAddExchangeBill: 'apiAddExchangeBill',
                apiGetMetalPrice: 'apiGetMetalPrice',
                apiGetUser: 'apiGetUser',
                apiGetExchangeBillItem: 'apiGetExchangeBillItem'
            }),
            // 打印标签
            print (item) {
                console.log('打印标签ing:', item)
                console.log('=====')
            },
            deleteItem(index) {
                this.exchangeBillItems.splice(index, 1)
            },
            addItem() {
                this.exchangeBillItems.push({
                    wareType: 'PURE',
                    metalId: this.getMetals[0].id,
                    roughWeight: 0,
                    depreciationRate: 0,
                    netWeight: 0,
                    metalPrice: this.getMetalPrice.find(ele => ele.metalId === this.getMetals[0].id).retailPrice,
                    processingCharges: 0,
                    originalPrice: 0,
                    forfeit: 0,
                    totalCost: 0
                })
            },
            enterPress(ref) { // item上的回车
                this.$refs[ref][0].focus()
            },
            changeMetal($event) {
                let index = parseInt($event.target.dataset.index)
                this.exchangeBillItems[index].metalId = $event.target.value
                this.exchangeBillItems[index].metalPrice = this.getMetalPrice.find(ele => ele.metalId === this.exchangeBillItems[index].metalId).retailPrice
            },
            modifyItemHandler($event, number, symbol) {
                if (symbol === 'depreciationRate' && $event.target.value > 1) {
                    $event.target.value = 1
                } else if (symbol === 'depreciationRate' && $event.target.value < 0) {
                    $event.target.value = 0
                }
                let index = parseInt($event.target.dataset.index)
                this.exchangeBillItems[index][symbol] = $event.target.value
                // 计算 毛重、折旧率、净重 关联关系
                switch (symbol) {
                    case 'forfeit':
                    {
                        let totalCost = this.exchangeBillItems[index]['originalPrice'] - $event.target.value
                        if (numberUtil.judgeDecimal(totalCost)) {
                            totalCost = numberUtil.toKeepTwoPlacesOfDecimalAndRound(totalCost);
                        }
                        this.exchangeBillItems[index].totalCost = totalCost
                        return
                    }
                    case 'originalPrice':
                    {
                        let forfeit = Number(this.exchangeBillItems[index]['forfeit']);
                        let totalCost = $event.target.value - forfeit
                        let metalPrice = 0;
                        if (this.exchangeBillItems[index]['netWeight'] !== 0) {
                            metalPrice = ($event.target.value / this.exchangeBillItems[index]['netWeight']) + Number(this.$refs['processingCharges' + number][0].value)
                            console.log($event.target.value / this.exchangeBillItems[index]['netWeight']);
                            console.log(this.$refs['processingCharges' + number][0].value);
                            console.log(metalPrice);
                        }
                        if (numberUtil.judgeDecimal(totalCost)) {
                            totalCost = numberUtil.toKeepTwoPlacesOfDecimalAndRound(totalCost);
                        }
                        if (numberUtil.judgeDecimal(metalPrice)) {
                            metalPrice = numberUtil.toKeepTwoPlacesOfDecimalAndRound(metalPrice);
                        }
                        this.exchangeBillItems[index].totalCost = totalCost
                        this.exchangeBillItems[index].metalPrice = metalPrice
                        return;
                    }
                    case 'totalCost':
                    {
                        let forfeit = this.exchangeBillItems[index].originalPrice - Number($event.target.value);
                        if (numberUtil.judgeDecimal(forfeit)) {
                            forfeit = numberUtil.toKeepTwoPlacesOfDecimalAndRound(forfeit);
                        }
                        this.exchangeBillItems[index].forfeit = forfeit
                        return
                    }
                    case 'roughWeight':
                    case 'depreciationRate':
                        let netWeight = this.$refs['roughWeight' + number][0].value * this.$refs['depreciationRate' + number][0].value
                        if (numberUtil.judgeDecimal(netWeight)) {
                            netWeight = numberUtil.toKeepTwoPlacesOfDecimalAndRound(netWeight);
                        }
                        this.exchangeBillItems[index].netWeight = netWeight
                        break
                    case 'netWeight':
                        if ((this.$refs['netWeight' + number][0].value) / this.$refs['roughWeight' + number][0].value <= 1) {
                            let depreciationRate = this.$refs['netWeight' + number][0].value / this.$refs['roughWeight' + number][0].value
                            if (numberUtil.judgeDecimal(depreciationRate)) {
                                depreciationRate = numberUtil.toKeepTwoPlacesOfDecimalAndRound(depreciationRate);
                            }
                            this.exchangeBillItems[index].depreciationRate = depreciationRate
                        } else {
                            let roughWeight = this.$refs['netWeight' + number][0].value * this.$refs['depreciationRate' + number][0].value
                            if (numberUtil.judgeDecimal(roughWeight)) {
                                roughWeight = numberUtil.toKeepTwoPlacesOfDecimalAndRound(roughWeight);
                            }
                            this.exchangeBillItems[index].roughWeight = roughWeight
                        }
                        break
                }
                // 计算 应收金额 实收金额
                let originalPrice = (this.exchangeBillItems[index].metalPrice - this.exchangeBillItems[index].processingCharges) * this.exchangeBillItems[index].netWeight
                if (numberUtil.judgeDecimal(originalPrice)) {
                    originalPrice = numberUtil.toKeepTwoPlacesOfDecimalAndRound(originalPrice);
                }
                this.exchangeBillItems[index].originalPrice = originalPrice
                let totalCost = (this.exchangeBillItems[index].metalPrice - this.exchangeBillItems[index].processingCharges) * this.exchangeBillItems[index].netWeight - this.exchangeBillItems[index].forfeit
                if (numberUtil.judgeDecimal(totalCost)) {
                    totalCost = numberUtil.toKeepTwoPlacesOfDecimalAndRound(totalCost);
                }
                this.exchangeBillItems[index].totalCost = totalCost
            },
            clickSearchUser() {
                this.apiGetUser({
                    params: {
                        telephone: this.telephone$
                    },
                    callback: (data) => {
                        if (data.status === 200) {
                            this.showUserIsMember = true
                            this.showUserCreateMember = false
                            this.nickName$ = data.result.nickName
                            this.gender$ = data.result.gender
                        } else {
                            this.showUserIsMember = false
                            this.showUserCreateMember = true
                        }
                    }
                })
            },
            back() {
                this.passed.changeCurrCpn(ExchangeBillMain)
            },
            add() {
                this.saveExchangeBill(() => {
                    this.back()
                })
            },
            clickGoRetail() {
                console.log('前往销售', ChangeTabEvent);
                this.saveExchangeBill((data) => {
                    console.log('前往销售 add 新增置换单')
                    this.changeTab('retailBill', data.result.billNumber)
                    this.resetBillNumber(data.result.billNumber)
                    this.resetCanChange(true);
                    this.resetHasExchangeBill(false);
                })
            },
            saveExchangeBill(callback) {
                if (this.exchangeBillItems <= 0) {
                    alert('请添加置换商品之后再提交')
                    return
                }
                this.apiAddExchangeBill({
                    params: {
                        wareHouseId: this.wareHouseId$,
                        customerId: this.customerId$,
                        telephone: this.telephone$,
                        nickName: this.nickName$,
                        gender: this.gender$ || '',
                        itemsJson: JSON.stringify(this.exchangeBillItems)
                    },
                    callback
                })
            },
            init() {
                this.apiGetMetalPrice()
                this.wareHouseId$ = this.getRejectWareHouse[0].id
            }
        },
        beforeMount() {
            if (this.getCanChange) {
                this.init()
            } else {
                this.apiGetExchangeBillItem({
                    params: {
                        billId: this.passed.item.id
                    },
                    callback: () => {
                    }
                })
            }
        }
    }
</script>
<style>
    .titleNameSize {
        font-size: 14px;
    }
</style>
