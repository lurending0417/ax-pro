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
            <SelectItem v-model="form.storeId" selectTitle="门店" :selectItems="stores" v-if="!isNormalStore"></SelectItem>
            <div class="form-group form-group-margin">
                <button class="btn btn-success" @click="getStatistical">统计</button>
            </div>
        </div>
        <!--<TableCpn :heads="heads" :items="tableView" v-if="isCount"></TableCpn>-->
        <table class="table table-bordered" v-if="isCount">
            <thead>
            <tr>
                <th v-for="(item, index) in heads">{{item.name}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in tableView" v-if="index < rowsLen - 1">
                <td>{{item.storeName}}</td>
                <td>{{item.staffName}}</td>
                <td v-for="i in pkgs">{{item[i.id]}}</td>
                <td>{{item.total}}</td>
            </tr>
            <tr>
                <td colspan="2">合计</td>
                <td v-for="item in totalArr">{{item.value}}</td>
                <td>{{tableView[rowsLen-1].total}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
    import api from '~/api'
    import SelectItem from '~/components/SelectItem'
    import DatePicker from '~/components/DatePicker'
    import {dateUtil, baseUtil} from '~/util'

    export default {
        props: ['index'],
        components: {
            SelectItem,
            DatePicker
        },
        data() {
            return {
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    storeId: ''
                },
                stores: [],
                heads: [
                    {propName: 'storeName', name: '门店'},
                    {propName: 'staffName', name: '员工'},
                    {propName: 'total', name: '小计'}
                ],
                tableView: [],
                pkgs: [],
                isCount: false,
                totalArr: [],
                rowsLen: 0,
                isNormalStore: false
            }
        },
        methods: {
            getStatistical() {
                this.isCount = false;
                api.request({
                    url: api.consts._REPORT_PERFORMANCE_STAT,
                    method: 'get',
                    params: {
                        ...this.form
                    },
                    success: (data) => {
                        let {pkgs, rows} = data.result;
                        this.pkgs = pkgs;
                        this.heads = [
                            {propName: 'store', name: '门店'},
                            {propName: 'staff', name: '员工'},
                            {propName: 'total', name: '小计'}
                        ]
                        this.rowsLen = rows.length;
                        this.totalArr = []
                        pkgs.forEach((item, index) => {
                            this.totalArr.push({id: item.id})
                            this.heads.splice((index + 2), 0, {propName: item.id, name: item.name})
                        })
                        this.isCount = true;
                        this.tableView = rows.map((item, index) => {
                            if (index < this.rowsLen - 1) {
                                for (let k in item.pkgs) {
                                    item[k] = item.pkgs[k]
                                }
                            } else {
                                this.totalArr = this.totalArr.map(ele => {
                                    if (item.pkgs[ele.id] || item.pkgs[ele.id] === 0) {
                                        ele.value = item.pkgs[ele.id]
                                    }
                                    return ele
                                })
                            }
                            return item
                        });
                    }
                })
            },
            handleStore() {
                // 如果当前门店为管理性质（MANAGE）的门店，则展示当前商户的所有门店
                // 如果当前门店为普通性质（NORMAL）的门店，选中当前门店，并且不展示下拉选项
                let store = baseUtil.getStore()
                if (store.type === 'NORMAL') {
                    this.form.storeId = store.id;
                    this.isNormalStore = true;
                } else {
                    this.stores = baseUtil.getMetadataStore()
                    this.form.storeId = '';
                    this.isNormalStore = false;
                }
            }
        },
        mounted() {
            if (this.index === 0) {
                this.handleStore()
            }
            this.$on('init', () => {
                this.handleStore()
            })
        }
    }
</script>
