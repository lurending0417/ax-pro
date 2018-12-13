<template>
    <div>
        <!--<vue-highcharts :options="options" ref="lineCharts"></vue-highcharts>-->
        <!--<button @click="load">load</button>-->
        <HighChartsCom :id="id" :option="options" ref="lineCharts"></HighChartsCom>
    </div>
</template>
<script>
    import VueHighcharts from 'vue2-highcharts'
    import Highcharts from 'highcharts'
    import HighChartsCom from '~/components/HighChartsCom'
    import api from '~/api'

    export default {
        components: {
            VueHighcharts,
            HighChartsCom
        },
        data() {
            return {
                id: 'userGrowthCharts',
                data: [],
                options: {
                    chart: {
                        type: 'line',
                        zoomType: 'x'
                    },
                    title: {
                        text: '用户增长分析'
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            millisecond: '%H:%M:%S.%L',
                            second: '%H:%M:%S',
                            minute: '%H:%M',
                            hour: '%H:%M',
                            day: '%m-%d',
                            week: '%m-%d',
                            month: '%Y-%m',
                            year: '%Y'
                        }
                    },
                    yAxis: {
                        allowDecimals: false,
                        title: {
                            text: '数量'
                        },
                        dateTimeLabelFormats: {
                            millisecond: '%H:%M:%S.%L',
                            second: '%H:%M:%S',
                            minute: '%H:%M',
                            hour: '%H:%M',
                            day: '%Y-%m-%d',
                            week: '%m-%d',
                            month: '%Y-%m',
                            year: '%Y'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        crosshairs: true,
                        shared: true,
                        dateTimeLabelFormats: {
                            millisecond: '%H:%M:%S.%L',
                            second: '%H:%M:%S',
                            minute: '%H:%M',
                            hour: '%H:%M',
                            day: '%Y-%m-%d',
                            week: '%m-%d',
                            month: '%Y-%m',
                            year: '%Y'
                        }
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: []
                },
                activeArr: [],
                totalArr: []
            }
        },
        methods: {
            getData() {
                let lineCharts = this.$refs.lineCharts.chart;
                lineCharts.showLoading('Loading...');
                api.request({
                    url: api.consts._MERCHANT_CUSTOMER_GROWTH,
                    method: 'get',
                    params: {},
                    success: (data) => {
                        data.rows.forEach((item) => {
                            let year = parseInt(item.billYmd.toString().slice(0, 4))
                            let month = parseInt(item.billYmd.toString().slice(4, 6)) - 1
                            let day = parseInt(item.billYmd.toString().slice(6))
                            this.totalArr.push([Date.UTC(year, month, day), item.total])
                            this.activeArr.push([Date.UTC(year, month, day), item.active])
                        })
                        lineCharts.addSeries({
                            name: '注册用户',
                            marker: {
                                enabled: false
                            },
                            data: this.totalArr
                        });
                        lineCharts.addSeries({
                            name: '有效用户',
                            marker: {
                                enabled: false
                            },
                            data: this.activeArr
                        });
                        lineCharts.hideLoading();
                        Highcharts.setOptions({
                            lang: {
                                resetZoom: '重置缩放比例'
                            }
                        })
                    }
                })
            }
        },
        mounted() {
            this.getData()
        }
    }
</script>
