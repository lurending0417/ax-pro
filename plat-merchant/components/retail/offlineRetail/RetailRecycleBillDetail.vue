<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <label>单号：</label>{{getRetailRecycleBillItem.billNumber}}
            </div>
        </div>
        <fieldset style="width: 60%" v-if="showUserIsMember" >
            <legend>客户信息</legend>
            <div class="form-inline" style="margin-bottom: 15px">
                <label class="label label-default m-l-xs" style="margin: 15px">客户昵称：{{ getRetailRecycleBillItem.customer.nickName }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">手机号码：{{ getRetailRecycleBillItem.customer.telephone }}</label>
                <label class="label label-default m-l-xs" style="margin: 15px">注册日期：{{ getRetailRecycleBillItem.customer.createTime }}</label>
            </div>
        </fieldset>

        <div class="form-inline" style="margin-top: 20px">
            <div class="form-group form-group-margin">
                <label>回收仓库：</label>{{getRetailRecycleBillItem.wareHouseId}}
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
                <th>付款状态</th>
                <th>付款人</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in getRetailRecycleBillDetailView">
                <td class="table-bordered">{{ index + 1 }}</td>
                <td class="table-bordered">{{item.metalId}}</td>
                <td class="table-bordered">{{item.priceType}}</td>
                <td class="table-bordered">{{item.roughWeight}}</td>
                <td class="table-bordered">
                    {{item.netWeight / item.roughWeight ? item.netWeight / item.roughWeight : 0}}
                </td>
                <td class="table-bordered">{{item.netWeight}}</td>
                <td class="table-bordered">{{item.processingCharges}}</td>
                <td class="table-bordered">{{item.metalPrice}}</td>
                <td class="table-bordered">{{item.forfeit}}</td>
                <td class="table-bordered">{{item.totalCost}}</td>
                <td class="table-bordered">{{item.paid}}</td>
                <td class="table-bordered">{{item.updaterId }}</td>
            </tr>
            </tbody>
        </table>
        <div class="row">
            <div class="col-md-2">
                <label>&nbsp;&nbsp;实付金额：</label>
                <label>{{getTotalPay}}</label>
            </div>
            <div class="col-md-10" style="text-align: right">
                <span style="margin: 10px">
                    <button type="button" class="btn btn-sm btn-primary" data-dismiss="modal"
                            @click="print(getRetailRecycleBillDetailView)">打印票据</button>
                </span>
                <span style="margin: 10px" v-if="getRetailRecycleBillItem.paid === '未付款'">
                    <button type="button" class="btn btn-sm btn-default"
                            @click="jump2payment(getRetailRecycleBillItem.billNumber)">前往收银</button>
                </span>
                <span style="margin: 10px">
                    <button type="button" class="btn btn-sm btn-default" @click="clickBack">返回</button>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapMutations, mapActions, mapGetters } from 'vuex'
    import Pagination from '~/components/Pagination'
    import TableCpn from '~/components/Table'
    import uuid from 'uuid'
    import RetailRecycleBillMain from '~/components/retail/offlineRetail/RetailRecycleBillMain'
    import { ChangeTabEvent } from '~/components/ChangeTabEvent'

    export default {
        components: {
            TableCpn,
            Pagination
        },
        data () {
            return {
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
                getRetailRecycleBillItem: 'getRetailRecycleBillItem',
                getRetailRecycleBillDetailView: 'getRetailRecycleBillDetailView',
                getTotalPay: 'getTotalPay'
            })
        },
        methods: {
            ...mapMutations('retail/offlineRetail/retailRecycleBill', {
                resetCurrCpn: 'resetCurrCpn'
            }),
            ...mapActions('retail/offlineRetail/retailBillAdd', {
                apiGetUser: 'apiGetUser'
            }),
            // 打印标签
            print (item) {
                console.log('打印标签ing:', item)
                console.log('=====')
            },
            jump2payment (billId) {
                // 跳转到收银页面，进行收银操作
                ChangeTabEvent.$emit('JUMP_TO_PAYMENT', billId)
            },
            clickBack () {
                this.resetCurrCpn(RetailRecycleBillMain)
            }
        },
        mounted () {
            console.log('getRetailRecycleBillItem', this.getRetailRecycleBillItem);
            if (this.getRetailRecycleBillItem.customer) {
                this.showUserIsMember = true
            }
        },
        beforeMount () {
        }
    }
</script>

<style scoped>
    .red {
        background: #ec475873;
    }
</style>
