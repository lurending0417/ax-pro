<template>
    <div>
        <div class="row">
            <div class="col-lg-4">
                <div class="panel panel-default">
                    <div class="panel-heading">押金设置</div>
                    <div class="panel-body">
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label">定价</label>
                            <div class="col-sm-10">
                                <select class="form-control" v-model="form.priceType">
                                    <option value="DISCOUNT">零售价打折法</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label">比例</label>
                            <div class="col-sm-10">
                                <input :disabled="depositeIniteStatus" type="text" class="form-control"
                                       v-model="showRules.depositRule.ratio">
                            </div>
                        </div>
                        <div class="btn_wrap" v-if="depositeIniteStatus">
                            <button class="btn btn-danger" @click="edit('deposit')">编辑</button>
                        </div>
                        <div class="btn_wrap" v-else>
                            <button class="btn btn-default" @click="cancle('deposit')" style="margin-right:10px">取消
                            </button>
                            <button class="btn btn-danger" @click="save('deposit')">保存</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-8">
                <div class="panel panel-default">
                    <div class="panel-heading">租金设置</div>
                    <div class="panel-body">
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th colspan="3">零售价</th>
                                <th>租金</th>
                                <th>操作</th>
                            </tr>
                            </thead>

                            <tbody v-if="rentIniteStatus">
                            <tr v-for="rule in showRules.rentRules">
                                <td>{{rule.startPrice}}元</td>
                                <td>——</td>
                                <td>{{rule.endPrice}}元</td>
                                <td>{{rule.rent}}元/日</td>
                                <td></td>
                            </tr>
                            </tbody>

                            <tbody v-else>
                            <tr>
                                <td><span style="margin-right: 10px">0</span>元</td>
                                <td>——</td>
                                <td><input
                                    style="max-width: 50px;margin-right: 10px;"
                                    type="text"
                                    v-model="otherAmount.startPrice"
                                    @blur="validateNum"
                                >元
                                </td>
                                <td><input type="text" style="max-width: 50px;margin-right: 10px"
                                           v-model="otherAmount.rent"/>元/日
                                </td>
                                <td></td>
                            </tr>
                            <tr v-for="(item,index) in rendList">
                                <td><input disabled type="text" style="max-width: 50px;margin-right: 10px;"
                                           :value="item.startPrice"/>元
                                </td>
                                <td>——</td>
                                <td><input type="text"
                                           style="max-width: 50px;margin-right: 10px;"
                                           @input="changeEndAmount(index)"
                                           @blur="validateNum(index)"
                                           data-type="arrItem"
                                           :value="item.endPrice"/>元
                                </td>
                                <td><input type="text" style="max-width: 50px;margin-right: 10px;"
                                           v-model="item.rent"/>元/日
                                </td>
                                <td>
                                    <button class="btn btn-danger" @click="remove(item.id)">
                                        <i class="fa fa-minus-square">&nbsp;&nbsp;删除</i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><input type="text" disabled style="max-width: 50px;margin-right: 10px;"
                                           v-model="otherAmount.endPrice"/>元
                                </td>
                                <td>——</td>
                                <td><span style="margin-right: 10px">50000</span>元</td>
                                <td><input type="text" style="max-width: 50px;margin-right: 10px;"
                                           v-model="otherAmount.endRent"/>元/日
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colspan="5">
                                    <button class="btn btn-danger" style="minWidth:80px" @click="add">
                                        <i class="fa fa-plus-square">&nbsp;&nbsp;新增</i>
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="btn_wrap" v-if="rentIniteStatus">
                            <button class="btn btn-danger" @click="edit('rent')">编辑</button>
                        </div>
                        <div class="btn_wrap" v-else>
                            <button class="btn btn-default" @click="cancle('rent')" style="margin-right:10px">取消
                            </button>
                            <button class="btn btn-danger" @click="save('rent')">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '~/api'

    export default {
        data() {
            return {
                otherAmount: {
                    startPrice: '',
                    rent: '',
                    endPrice: '',
                    endRent: ''
                },
                rendList: [{
                    id: 0,
                    startPrice: '',
                    rent: '',
                    endPrice: ''
                }],
                form: {
                    priceType: 'DISCOUNT',
                    ratio: '0.5'
                },
                showRules: {
                    depositRule: {
                        ratio: ''
                    },
                    rentRules: []
                },
                depositeIniteStatus: false,
                rentIniteStatus: false
            }
        },
        watch: {
            'otherAmount.startPrice': function (newValue) {
                if (this.rendList.length > 0) {
                    this.rendList[0].startPrice = newValue
                } else {
                    this.otherAmount.endPrice = newValue
                }
            },
            'form.ratio': function (newValue) {
                if (parseInt(newValue) >= 1) {
                    alert('押金比例不能大于1')
                }
                if (parseInt(newValue) <= 0) {
                    alert('押金比例不能小于0')
                }
            }
        },
        methods: {
            edit(type) {
                if (type === 'rent') {
                    this.rentIniteStatus = false;
                    let rentRules = [...this.showRules.rentRules];
                    let len = rentRules.length;
                    if (len > 0) {
                        this.otherAmount = {
                            startPrice: rentRules[0].endPrice,
                            rent: rentRules[0].rent,
                            endPrice: rentRules[len - 1].startPrice,
                            endRent: rentRules[len - 1].rent
                        }
                    }
                    rentRules.shift()
                    rentRules.pop()
                    this.rendList = rentRules;
                } else if (type === 'deposit') {
                    this.depositeIniteStatus = false;
                }
            },
            cancle(type) {
                if (type === 'rent') {
                    this.rentIniteStatus = true;
                } else if (type === 'deposit') {
                    this.depositeIniteStatus = true;
                }
            },
            validateNum(index) {
                if (event.target.dataset.type === 'arrItem') {
                    if (parseInt(event.target.value) <= parseInt(this.rendList[index].startPrice)) {
                        alert('结束值不能小于或者等于起始值')
                        event.target.value = ''
                        event.target.focus()
                    }
                } else {
                    if (parseInt(this.otherAmount.startPrice) <= 0) {
                        alert('结束值不能小于或者等于起始值')
                        this.otherAmount.startPrice = '';
                        event.target.focus()
                    }
                }
            },
            changeEndAmount(index) {
                let val = event.target.value;
                this.rendList[index].endPrice = val
                if (index === this.rendList.length - 1) {
                    this.otherAmount.endPrice = val
                } else {
                    this.rendList[index + 1].startPrice = val
                }
            },
            add() {
                let len = this.rendList.length;
                this.rendList.push({
                    id: len,
                    startPrice: len === 0 ? this.otherAmount.startPrice : this.rendList[len - 1].endPrice,
                    rent: '',
                    endPrice: ''
                })
                this.otherAmount.endPrice = '';
            },
            remove(id) {
                let len = this.rendList.length;
                let index = 0;
                this.rendList.forEach((item, i) => {
                    if (item.id === id) {
                        index = i;
                    }
                })
                if (len > 1) {
                    if (index === 0) {
                        this.rendList[index + 1].startPrice = this.otherAmount.startPrice
                    } else if (index === len - 1) {
                        this.otherAmount.endPrice = this.rendList[index - 1].endPrice
                    } else {
                        this.rendList[index + 1].startPrice = this.rendList[index - 1].endPrice
                    }
                } else {
                    this.otherAmount.endPrice = this.otherAmount.startPrice
                }
                this.rendList.splice(index, 1)
            },
            save(type) {
                if (type === 'rent') {
                    this.rentIniteStatus = true;
                    this.joinRules();
                } else if (type === 'deposit') {
                    this.depositeIniteStatus = true;
                    this.setDepositRule();
                }
            },
            joinRules() { // 拼装rentRules
                let rentRules = this.rendList.map((item) => {
                    delete item.id
                    return {
                        startPrice: parseInt(item.startPrice),
                        endPrice: parseInt(item.endPrice),
                        rent: parseFloat(item.rent)
                    }
                })
                rentRules.unshift({
                    startPrice: 0,
                    endPrice: parseInt(this.otherAmount.startPrice),
                    rent: parseFloat(this.otherAmount.rent)
                })
                rentRules.push({
                    startPrice: parseInt(this.otherAmount.endPrice),
                    endPrice: 50000,
                    rent: parseFloat(this.otherAmount.endRent)
                })
                this.setRentRule(rentRules)
            },
            setRentRule(rentRules) { // 设置租金规则
                let vm = this;
                api.request({
                    url: api.consts._LEASE_RENT_RULE_SETTING,
                    params: {
                        ruleJson: JSON.stringify(rentRules)
                    },
                    method: 'post',
                    success(data) {
                        console.log('租金设置成功')
                        vm.getRentRule()
                    },
                    fail(error) {
                        alert(error.message)
                    }
                })
            },
            setDepositRule() { // 设置押金规则
                api.request({
                    url: api.consts._LEASE_DEPOSIT_RULE_SETTING,
                    params: {
                        ratio: parseFloat(this.showRules.depositRule.ratio)
                    },
                    method: 'post',
                    success(data) {
                        console.log('押金设置成功')
                    },
                    fail(error) {
                        alert(error.message)
                    }
                })
            },
            getDepositRule() { // 获取押金规则
                let vm = this;
                api.request({
                    url: api.consts._LEASE_DEPOSIT_RULE_GETTING,
                    params: {},
                    success(data) {
                        console.log('获取押金规则', data)
                        vm.depositeIniteStatus = true;
                        vm.showRules.depositRule = data.result;
                    },
                    fail(error) {
                        alert(error.message)
                    }
                })
            },
            getRentRule() { // 获取租金规则
                let vm = this;
                api.request({
                    url: api.consts._LEASE_RENT_RULE_GETTING,
                    params: {},
                    success(data) {
                        console.log('获取租金规则', data)
                        vm.rentIniteStatus = true;
                        vm.showRules.rentRules = data.rows.map((item) => {
                            item.sortPrice = parseInt(item.startPrice)
                            return item;
                        }).sort((a, b) => {
                            return a.sortPrice - b.sortPrice
                        });
                    },
                    fail(error) {
                        alert(error.message)
                    }
                })
            }
        },
        mounted() {
            this.getRentRule()
            this.getDepositRule()
        }
    }
</script>

<style scoped>
    caption, th {
        text-align: center;
    }

    .btn_wrap {
        text-align: center;
    }

    .table tbody tr td {
        vertical-align: middle;
        text-align: center;
    }
</style>
