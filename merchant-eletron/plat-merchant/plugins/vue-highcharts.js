import Vue from 'vue'
import VueHighcharts from 'vue2-highcharts'
import HighCharts from 'highcharts'

HighCharts.setOptions({
    lang: {
        resetZoom: '重置缩放比例',
        resetZoomTitle: '重置缩放比例'
    }
})

Vue.component('VueHighcharts', VueHighcharts)
