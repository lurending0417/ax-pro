<template>
    <div>
        <div class="row">
            <div class="col-lg-6">
                <table class="table table-bordered table-cls">
                    <thead>
                    <tr>
                        <th colspan="5">用户消费结构表</th>
                    </tr>
                    <tr>
                        <th >注册用户</th>
                        <th >零售用户</th>
                        <th >试戴用户</th>
                        <th >转买用户</th>
                        <th >未消费用户</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td @click="searchRegion('ALL')">{{stat.all}}</td>
                        <td @click="searchRegion('RETAIL')">{{stat.retail}}</td>
                        <td @click="searchRegion('LEASE')">{{stat.lease}}</td>
                        <td @click="searchRegion('LEASE_TO_BUY')">{{stat.leaseToBuy}}</td>
                        <td @click="searchRegion('NONE')">{{stat.none }}</td>
                    </tr>
                    </tbody>
                </table>
                <vue-highcharts :options="options" ref="lineCharts"></vue-highcharts>
            </div>
            <div class="col-lg-6">
                <table class="table table-bordered table-cls">
                    <thead>
                    <tr>
                        <th colspan="3">用户归属地结构表（{{typeTitle}}）</th>
                    </tr>
                    <tr>
                        <th >地区</th>
                        <th >数量</th>
                        <th >比例</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in tableView">
                        <td  @click="searchDetail(item.districtCode, item.districtName)">{{item.districtName }}</td>
                        <td  @click="searchDetail(item.districtCode, item.districtName)">{{item.amount }}</td>
                        <td  @click="searchDetail(item.districtCode, item.districtName)">{{item.percent }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <ModalItem
            :modalProps="{
                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                titleName: '用户列表'
            }">
            <UserList slot="main" :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL" :CONST_CLICK_MODAL="CONST_CLICK_MODAL"></UserList>
        </ModalItem>
    </div>
</template>

<script>
    import VueHighcharts from 'vue2-highcharts'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import ModalItem from '~/components/ModalItem'
    import UserList from '~/components/userManage/userAnalysis/UserList'
    import {mapGetters, mapMutations} from 'vuex';
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import api from '~/api'
    import uuid from 'uuid'
    import {regionUtil} from '~/util'
    export default {
        props: ['passed'],
        components: {
            ButtonWithModal,
            VueHighcharts,
            UserList,
            ModalItem
        },
        data() {
            return {
                stat: {
                    all: 0,
                    retail: 0,
                    lease: 0,
                    leaseToBuy: 0,
                    none: 0
                },
                typeTitle: '',
                type: '',
                tableView: [],
                asyncData: [],
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                id: 'userBehaviourId',
                options: {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        allowDecimals: false,
                        title: {
                            text: '数量'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                    },
                    credits: {
                        enabled: false // 隐藏Highcharts.com
                    },
                    series: []
                }
            }
        },
        computed: {
            ...mapGetters('merchant/storeManageMain', {
                reginData: 'reginData'
            })
        },
        methods: {
            ...mapMutations('userManage/userList', {
                resetType: 'resetType',
                resetDistrictCode: 'resetDistrictCode'
            }),
            searchUser() {
                let lineCharts = this.$refs.lineCharts;
                lineCharts.delegateMethod('showLoading', 'Loading...');
                api.request({
                    url: api.consts._MERCHANT_CUSTOMER_STAT,
                    params: {},
                    success: (data) => {
                        this.stat = data.result;
                        let arr = []
                        for (let key in data.result) {
                            let item = {}
                            if (data.result.hasOwnProperty(key)) {
                                switch (key) {
                                    case 'all' : item = {name: '注册用户', y: data.result[key]}; break;
                                    case 'retail' : item = {name: '零售用户', y: data.result[key]}; break;
                                    case 'lease' : item = {name: '试戴用户', y: data.result[key]}; break;
                                    case 'leaseToBuy' : item = {name: '转买用户', y: data.result[key]}; break;
                                    case 'none' : item = {name: '未消费用户', y: data.result[key]}; break;
                                }
                            }
                            arr.push(item)
                        }
                        let series = {
                            name: '用户分类',
                            colorByPoint: true,
                            data: arr
                        }
                        lineCharts.addSeries(series);
                        lineCharts.hideLoading();
                    }
                })
            },
            searchRegion(type) {
                this.resetType(type);
                switch (type) {
                    case 'ALL': this.typeTitle = '注册用户'; break
                    case 'LEASE': this.typeTitle = '试戴用户'; break
                    case 'LEASE_TO_BUY': this.typeTitle = '转买用户'; break
                    case 'RETAIL': this.typeTitle = '零售用户'; break
                    case 'NONE': this.typeTitle = '未消费用户'; break
                }
                api.request({
                    url: api.consts._MERCHANT_CUSTOMER_STAT_REGION,
                    params: {type},
                    success: (data) => {
                        let temp = data.rows.map(item => {
                            item.districtName = regionUtil.getDetailAddress(item.districtCode, this.reginData)
                            return item
                        })
                        this.tableView = [...temp]
                    }
                })
            },
            searchDetail(districtCode, districtName) {
                this.resetDistrictCode({districtCode, districtName})
                ButtonWithModalEvent.$emit(this.CONST_CLICK_MODAL)
            }
        },
        mounted() {
            this.searchUser()
            this.type = '';
        }
    }
</script>
<style scoped>
    td:hover{
        cursor: pointer;
        background-color: #00afb517;
    }
</style>
