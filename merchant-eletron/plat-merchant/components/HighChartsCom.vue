<template>
    <div :id="id" :option="option"></div>
</template>
<script>
    import HighCharts from 'highcharts'
    export default {
        // 验证类型
        props: {
            id: {
                type: String
            },
            option: {
                type: Object
            }
        },
        data() {
            return {
                chart: null
            }
        },
        mounted() {
            this.chart = HighCharts.chart(this.id, this.option)
        }
    }
</script>
