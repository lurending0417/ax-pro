<template>
    <table class="table table-bordered table-cls">
        <thead>
        <tr>
            <th colspan="6">质保单单列表</th>
        </tr>
        <tr>
            <th >序号</th>
            <th >日期</th>
            <th >门店</th>
            <th >质保单号</th>
            <th >备注</th>
            <th >操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in tableView">
            <td>{{index + 1}}</td>
            <td>{{item.createTime}}</td>
            <td>{{item.storeName}}</td>
            <td>{{item.billNumber}}</td>
            <td>{{item.remark}}</td>
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
                    <ConsumeDetail
                        slot="main"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+index"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :item="item">
                    </ConsumeDetail>
                </ButtonWithModal>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    import ButtonWithModal from '~/components/ButtonWithModal'
    import ConsumeDetail from './ConsumeDetail'
    import {mapGetters} from 'vuex';
    import api from '~/api'
    import uuid from 'uuid'
    import {dateUtil, baseUtil} from '~/util'
    export default {
        props: ['passed'],
        components: {
            ButtonWithModal,
            ConsumeDetail
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
            getRetailListByCustomerId() {
                api.request({
                    url: api.consts._RETAIL_CONSUME_GET,
                    params: {customerId: this.customerId},
                    success: (data) => {
                        this.tableView = data.rows.map(item => {
                            item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                            item.salesmanName = baseUtil.getNameFromPropId('staffs', item.salesmanId)
                            return item
                        })
                    }
                })
            }
        },
        mounted() {
            this.getRetailListByCustomerId()
        }
    }
</script>

<style scoped>
    .table-cls td,.table-cls th{
        text-align: center;
        vertical-align: middle;
    }
</style>
