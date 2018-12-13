<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <span>
                        <DatePicker
                            field="myDate1"
                            placeholder="起始日期"
                            format="yyyy-mm-dd"
                            v-model="form.startYmd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                    <span class="input-group-addon" style="display: inline-block">到</span>
                    <span>
                        <DatePicker
                            field="myDate2"
                            placeholder="结束日期"
                            format="yyyy-mm-dd"
                            v-model="form.endYmd"
                            :backward="false"
                            :no-today="false"
                            :forward="false">
                        </DatePicker>
                    </span>
                </div>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">门店&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.storeId">
                    <option value="">全部</option>
                    <option v-for="item in stores" :value="item.id">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">是否邀请人奖励&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.inviter">
                    <option value="">全部</option>
                    <option :value="true">是</option>
                    <option :value="false">否</option>
                </select>
            </div>
        </div>
        <TableCpn :heads="[
                    {propName: 'createTime', name: '时间'},
                    {propName: 'billNumber', name: '关联单据'},
                    {propName: 'storeName', name: '门店'},
                    {propName: 'telephone', name: '手机号'},
                    {propName: 'goldAmount', name: '赠送重量', unit: 'g'}
                ]"
                  :items="tableView">
        </TableCpn>
        <div class="row">
            <div class="col-lg-2">
                重量合计：{{totalWeight}}
            </div>
            <div class="col-lg-10" style="text-align: right">
                <Pagination
                    :total="total"
                    :limit="20"
                    :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
                    :CONST_RESTORE="CONST_RESTORE"
                >
                </Pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '~/api'
    import DatePicker from '~/components/DatePicker';
    import TableCpn from '~/components/Table';
    import Pagination from '~/components/Pagination';
    import uuid from 'uuid'
    import {dateUtil, baseUtil} from '~/util'
    import {PaginationEvent} from '~/components/PaginationEvent';

    export default {
        components: {
            Pagination,
            DatePicker,
            TableCpn
        },
        data() {
            return {
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                stores: [],
                tableView: [],
                totalWeight: 0,
                total: 0,
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    storeId: '',
                    inviter: ''
                }
            }
        },
        methods: {
            searchPresentDetail(params) {
                let vm = this;
                api.request({
                    url: api.consts._PROMO_RETAIL_GOLD_RECORD,
                    params,
                    method: 'get',
                    success(data) {
                        vm.tableView = data.rows.map((item) => {
                            vm.totalWeight += item.goldAmount;
                            item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                            item.storeName = baseUtil.getNameFromPropId('stores', item.storeId)
                            item.goldAmount = item.goldAmount / 1000
                            return item
                        })
                        vm.total = data.total
                    },
                    fail(error) {
                        alert(error.message)
                    }
                })
            },
            search(page) {
                let params = {...this.form, limit: 20, start: 0}
                if (page) {
                    params.limit = page.limit;
                    params.start = page.start;
                }
                this.searchPresentDetail(params)
            },
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    this.search(pager)
                })
            }
        },
        beforeMount() {
            this.registerPaginationEvent()
        },
        mounted() {
            this.stores = baseUtil.getMetadataStore();
            this.$watch('form', function () {
                this.search()
            }, {deep: true});
        }
    }
</script>
