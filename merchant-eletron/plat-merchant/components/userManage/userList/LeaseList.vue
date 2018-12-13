<template>
    <table class="table table-bordered table-cls">
        <thead>
        <tr>
            <th colspan="14">试戴单列表</th>
        </tr>
        <tr>
            <th>序号</th>
            <th>日期</th>
            <th>门店</th>
            <th>试戴单号</th>
            <th>条码</th>
            <th>数量</th>
            <th>金属</th>
            <th>宝石</th>
            <th>品类</th>
            <th>押金</th>
            <th>租金</th>
            <th>租期</th>
            <th>状态</th>
            <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in tableView">
            <td>{{index + 1}}</td>
            <td>{{item.createTime}}</td>
            <td>{{item.storeName}}</td>
            <td>{{item.billNumber}}</td>
            <td>{{item.serial}}</td>
            <td>{{item.amount}}</td>
            <td>{{item.metalName}}</td>
            <td>{{item.gemName}}</td>
            <td>{{item.categoryName}}</td>
            <td>{{handleItemUnit(item.depositPrice, '元')}}</td>
            <td>{{handleItemUnit(item.rentPrice, '元')}}</td>
            <td>{{item.leaseDays}}</td>
            <td>{{item.statusName}}</td>
            <td>
                <ButtonWithModal
                    :btnProps="{
                            btnClasses: ['btn btn-sm btn-primary'],
                            btnName: '详情'
                        }"
                    :modalProps="{
                            CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                            CONST_CLICK_MODAL:CONST_CLICK_MODAL+index,
                            modalClasses: ['modal-lg'],
                            titleName: '详情'
                        }">
                    <LeaseDetail
                        slot="main"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :item="item">
                    </LeaseDetail>
                </ButtonWithModal>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    import ButtonWithModal from '~/components/ButtonWithModal'
    import LeaseDetail from './LeaseDetail'
    import {mapGetters} from 'vuex';
    import uuid from 'uuid'
    import api from '~/api'
    import {componentUtil} from '~/util'
    const handleResult = componentUtil.handleResult
    export default {
        components: {
            ButtonWithModal,
            LeaseDetail
        },
        data() {
            return {
                tableView: [],
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid()
            }
        },
        computed: {
            ...mapGetters('userManage/userList', {
                customerId: 'getCustomerId'
            })
        },
        methods: {
            getLeaseListByCustomerId() {
                api.request({
                    url: api.consts._LEASE_RECORDS_LIST,
                    params: {customerId: this.customerId},
                    success: (data) => {
                        this.tableView = handleResult(data.rows)
                    }
                })
            }
        },
        mounted() {
            this.getLeaseListByCustomerId()
        }
    }
</script>
<style scoped>
    .table-cls td,.table-cls th{
        text-align: center;
    }
</style>
