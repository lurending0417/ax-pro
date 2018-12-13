<template>
    <div>
        <div class="row">
            <div class="col-md-6">
                <input type="text" class="form-control" style="display: inline-block; max-width: 150px"
                       placeholder="昵称，手机号"
                       v-model="query" @keydown.enter="search()">
                <button class="btn btn-info" style="margin: 0 10px 3px" @click="search()">搜索</button>
                <button class="btn btn-warning" style="margin: 0 10px 3px" @click="reset()">重置</button>
                <span class="unfold-cls" @click="unfoldSelect">{{isShowSelect ? '收起' : '展开'}}高级查询条件
                    <i :class="isShowSelect?'fa fa-angle-double-up':'fa fa-angle-double-down'" aria-hidden="true"></i>
                </span>
            </div>
            <div class="col-md-2"></div>
            <div class="col-md-4" style="text-align: right;">
                <DropDown :dropDownList="dropDownList" :sendList="checkedArr"></DropDown>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <SelectList @getForm="getForm" ref="selectList" v-show="isShowSelect"></SelectList>
            </div>
        </div>
        <table class="table table-bordered table-cls">
            <thead>
            <tr>
                <th colspan="10">用户列表</th>
            </tr>
            <tr>
                <th><input type="checkbox" v-model="checkAll"></th>
                <th>序号</th>
                <th>手机号</th>
                <th>昵称</th>
                <th>注册日期</th>
                <th>性别</th>
                <th>年龄</th>
                <th>生日</th>
                <th>所属门店</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in tableView">
                <td><input type="checkbox" name="item" v-model="checkedArr" :value="item.id"></td>
                <td>{{index + 1}}</td>
                <td>{{item.telephone}}</td>
                <td>{{item.nickName}}</td>
                <td>{{item.createYmd}}</td>
                <td>{{item.gender}}</td>
                <td>{{item.age}}</td>
                <td>{{item.birthYmd}}</td>
                <td>{{item.storeName}}</td>
                <td>
                    <button class="btn btn-primary btn-sm" style="margin-right:10px;" @click="seeDetail('retail', item)"
                            v-if="item.retail">线下零售
                    </button>
                    <button class="btn btn-info btn-sm" @click="seeDetail('lease', item)" v-if="item.lease">线上试戴
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <Pagination
            :total="total"
            :limit="15"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>
    </div>
</template>

<script>
    import {mapMutations, mapState} from 'vuex';
    import Pagination from '~/components/Pagination';
    import api from '~/api'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import uuid from 'uuid'
    import DropDown from './DropDown'
    import SelectList from '../notice/SelectList'
    import {constUtil, baseUtil} from '~/util';

    export default {
        components: {
            SelectList,
            Pagination,
            DropDown
        },
        props: ['passed'],
        data() {
            return {
                query: '',
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                total: 0,
                tableView: [],
                dropDownList: [],
                checkAll: false,
                checkedArr: [],
                isShowSelect: false
            }
        },
        watch: {
            'checkAll': {
                handler(val) {
                    if (val) {
                        this.tableView.forEach(item => {
                            this.checkedArr.push(item.id)
                        })
                    } else {
                        this.checkedArr.length = 0;
                    }
                }
            }
        },
        computed: {
            ...mapState('userManage/notice', {
                queryConditions: 'queryConditions'
            })
        },
        methods: {
            ...mapMutations('userManage/notice', {
                resetQueryConditions: 'resetQueryConditions',
                resetQuery: 'resetQuery',
                resetUserList: 'resetUserList',
                resetCheckedArr: 'resetCheckedArr',
                resetCurTotal: 'resetCurTotal',
                resetTotal: 'resetTotal'
            }),
            ...mapMutations('userManage/userList', {
                resetLeaseOrRetail: 'resetLeaseOrRetail',
                resetCustomerId: 'resetCustomerId'
            }),
            unfoldSelect() {
                this.isShowSelect = !this.isShowSelect
            },
            reset() {
                this.resetQueryConditions()
                this.query = ''
                this.$refs.selectList.$emit('init')
                this.search()
            },
            getForm(form) {
                this.resetQueryConditions(form)
                this.resetQuery(this.query)
                this.search()
            },
            getAge(birthYmd) {
                let curYear = new Date().getFullYear();
                let birthYear = parseInt(birthYmd.toString().substr(0, 4));
                return curYear - birthYear
            },
            sendReq(params) {
                api.request({
                    url: api.consts._MERCHANT_CUSTOMER,
                    params,
                    success: (data) => {
                        this.resetUserList(data.rows)
                        this.tableView = data.rows.map(item => {
                            item.storeName = baseUtil.getNameFromPropId('stores', item.storeId)
                            if (item.birthYmd !== 0) {
                                item.age = this.getAge(item.birthYmd)
                            }
                            if (item.gender) {
                                item.gender = constUtil._CONST_USER_GENDER.find(ele => ele.value === item.gender).name
                            }
                            return item
                        });
                        this.resetCurTotal(data.rows.length)
                        this.resetTotal(data.total)
                        this.total = data.total;
                    }
                })
            },
            search(page) {
                let temp = {}
                if (JSON.stringify(this.queryConditions) !== '{}') {
                    temp = this.queryConditions
                }
                let params = {start: 0, limit: 15, query: this.query, ...temp};
                if (page) {
                    params.start = page.start;
                    params.limit = page.limit;
                }
                this.sendReq(params)
            },
            seeDetail(symbol, item) {
                this.resetLeaseOrRetail(symbol)
                this.resetCustomerId(item)
                this.passed.changeCurrCpn('ListWrap')
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, (params) => {
                    this.search(params)
                })
            },
            initData() {
                this.query = '';
                this.total = 0;
                this.checkedArr = [];
                this.checkAll = false;
                this.isShowSelect = false;
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            this.dropDownList = constUtil._CONST_SEND_NOTICE_ITEM
            this.initData()
        }
    }
</script>

<style scoped>
    .table-cls {
        margin-top: 10px;
    }

    .unfold-cls {
        margin-left: 20px;
    }

    .unfold-cls:hover {
        cursor: pointer;
        color: #d43f3a;
    }
</style>
