<template>
    <div>
        <div class="form-inline">
            <div class="form-group form-group-margin">
                <div class="input-daterange input-group">
                    <div style="display: inline-block;">
                        <DatePicker
                            field="startDate"
                            placeholder="起始日期"
                            v-model="form.startYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false"
                        >
                        </DatePicker>
                    </div>
                    <span class="input-group-addon" style="display: inline-block">到</span>
                    <div style="display: inline-block">
                        <DatePicker
                            field="endDate"
                            placeholder="结束日期"
                            v-model="form.endYmd"
                            format="yyyy-mm-dd"
                            :backward="false"
                            :no-today="false"
                            :forward="false"
                        >
                        </DatePicker>
                    </div>
                </div>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">门店&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="storeId">
                    <option :value="item.id" v-for="item in stores">{{item.name}}</option>
                </select>
            </div>
            <div class="form-group form-group-margin">
                <span class="titleNameSize">仓库&nbsp;&nbsp;&nbsp;</span>
                <select class="form-control" v-model="form.wareHouseId">
                    <option value="">全部</option>
                    <option :value="item.id" v-for="item in wareHouses">{{item.name}}</option>
                </select>
            </div>
        </div>


        <table class="table table-bordered">
            <thead>
            <tr>
                <th rowspan="3">序号</th>
                <th rowspan="3">日期</th>
                <th rowspan="3">仓库</th>
                <th colspan="6">正常销售出货</th>
                <th colspan="6">置换销售</th>
                <th colspan="3">试戴出货</th>
            </tr>
            <tr>
                <th colspan="3">定价销售的商品</th>
                <th colspan="3">计重销售的商品</th>
                <th colspan="3">定价销售的商品</th>
                <th colspan="3">计重销售的商品</th>
                <th colspan="3">件数</th>
            </tr>
            <tr>
                <th>价格</th>
                <th>重量</th>
                <th>件数</th>
                <th>工费</th>
                <th>重量</th>
                <th>件数</th>
                <th>价格</th>
                <th>重量</th>
                <th>件数</th>
                <th>工费</th>
                <th>重量</th>
                <th>件数</th>
                <th>价格</th>
                <th>重量</th>
                <th>件数</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in reportsData" :key="index">
                <td>{{item.order}}</td>
                <td>{{item.billYmd}}</td>
                <td>{{item.wareHouseName}}</td>
                <td>{{item.retailFixedTotalCost}}</td>
                <td>{{item.retailFixedWeight}}</td>
                <td>{{item.retailFixedAmount || '' }}</td>

                <td>{{item.retailWeightedProcessingCharges }}</td>
                <td>{{item.retailWeightedWeight }}</td>
                <td>{{item.retailWeightedAmount || ''}}</td>

                <td>{{item.exchangeFixedTotalCost }}</td>
                <td>{{item.exchangeFixedWeight }}</td>
                <td>{{item.exchangeFixedAmount || ''}}</td>

                <td>{{item.exchangeWeightedProcessingCharges }}</td>
                <td>{{item.exchangeWeightedWeight }}</td>
                <td>{{item.exchangeWeightedAmount || '' }}</td>

                <td>{{item.leaseTotalCost }}</td>
                <td>{{item.leaseWeight }}</td>
                <td>{{item.leaseAmount || '' }}</td>
            </tr>
            </tbody>
        </table>
        <Pagination
            :total="total"
            :limit="10"
            :CONST_CHANGE_PAGE="CONST_CHANGE_PAGE"
            :CONST_RESTORE="CONST_RESTORE"
        >
        </Pagination>
    </div>
</template>

<script>
    import uuid from 'uuid'
    import Pagination from '~/components/Pagination'
    import {PaginationEvent} from '~/components/PaginationEvent'
    import {dateUtil, baseUtil} from '~/util'
    import api from '~/api'
    import DatePicker from '~/components/DatePicker'

    export default {
        props: ['index'],
        components: {
            Pagination,
            DatePicker
        },
        data() {
            return {
                wareHouses: [],
                stores: [],
                reportsData: [],
                total: 0,
                CONST_CHANGE_PAGE: uuid(),
                CONST_RESTORE: uuid(),
                storeId: '',
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    wareHouseId: ''
                }
            }
        },
        methods: {
            registerPaginationEvent() {
                PaginationEvent.$on(this.CONST_CHANGE_PAGE, pager => {
                    this.search(pager)
                })
            },
            refresh() {
                PaginationEvent.$emit(this.CONST_RESTORE)
            },
            search(page) {
                let params = {...this.form, limit: 10, start: 0, storeId: this.storeId, sum: true}
                if (page) {
                    params.start = page.start;
                    params.limit = page.limit;
                }
                this.searchReports(params)
            },
            searchReports(params) {
                api.request({
                    url: api.consts._REPORT_STORAGE_OUT_STAT,
                    params,
                    success: (data) => {
                        this.reportsData = data.rows.map((item, index) => {
                            item.order = index + 1;
                            if (index === data.rows.length - 1) {
                                item.order = '总计'
                                item.billYmd = ''
                            }
                            return item
                        });
                        this.total = data.total
                    }
                })
            },
            initData() {
                this.storeId = this.stores[0].id
                this.form = {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    wareHouseId: ''
                }
            }
        },
        beforeMount() {
            this.stores = baseUtil.getMetadataStore();
            this.wareHouses = baseUtil.getMetadataWareHouseByStoreId(this.stores[0].id);
            this.initData()
            this.registerPaginationEvent()
        },
        mounted() {
            this.$watch('storeId', function (val) {
                this.wareHouses = baseUtil.getMetadataWareHouseByStoreId(val);
                this.refresh()
            })
            this.$watch('form', function () {
                this.refresh()
            }, {deep: true})
        }
    }
</script>

<style scoped>
    .table th, .table td {
        text-align: center;
        vertical-align: middle !important;
    }
</style>
