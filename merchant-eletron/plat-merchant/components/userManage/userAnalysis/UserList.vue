<template>
    <div>
        <div class="modal-body">
            <table class="table table-bordered table-cls">
                <thead>
                <tr>
                    <th colspan="4">用户列表（{{userType }}——{{districtName}}）</th>
                </tr>
                <tr>
                    <th >序号</th>
                    <th >手机号</th>
                    <th >昵称</th>
                    <th >注册日期</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in tableView">
                    <td>{{index + 1}}</td>
                    <td>{{item.telephone}}</td>
                    <td>{{item.nickName}}</td>
                    <td>{{item.createYmd }}</td>
                </tr>
                </tbody>
            </table>
            <Pagination
                :total="total"
                :limit="20"
                :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
                :CONST_RESTORE="CONST_RESTORE"
            >
            </Pagination>
        </div>
        <div class="modal-footer">
            <button class="btn btn-success" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
    import KeyValueCom from '~/components/KeyValueCom'
    import Pagination from '~/components/Pagination'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import { PaginationEvent } from '~/components/PaginationEvent'
    import uuid from 'uuid'
    import {mapActions, mapGetters} from 'vuex';
    export default {
        components: {
            Pagination,
            KeyValueCom
        },
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'item'],
        data() {
            return {
                CONST_RESTORE: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                tableView: [],
                total: 0,
                initStatus: true
            }
        },
        computed: {
            ...mapGetters('userManage/userList', {
                userType: 'getType',
                districtName: 'getDistrictName'
            })
        },
        methods: {
            ...mapActions('userManage/userList', {
                apiGetUserStatRegionDetail: 'apiGetUserStatRegionDetail'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            registerPaginationEvent () {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    if (!this.initStatus) {
                        this.search(pager)
                    }
                })
            },
            search(params) {
                this.apiGetUserStatRegionDetail({
                    params,
                    callback: (data) => {
                        this.total = data.total;
                        this.tableView = data.rows
                    }
                })
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.initStatus && (this.initStatus = false);
                this.search({limit: 20, start: 0})
            })
        }
    }
</script>
