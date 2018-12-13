<template>
    <div>
        <el-date-picker
            v-model="startYmd"
            :value-format="pickerFormat"
            type="date"
            placeholder="开始日期"
            @change="start">
        </el-date-picker>
        <span class="m-l-s m-r-s">至</span>
        <el-date-picker
            v-model="endYmd"
            :value-format="pickerFormat"
            type="date"
            placeholder="结束日期"
            @change="end">
        </el-date-picker>
    </div>
</template>


<script>

    import moment from "moment"

    export default {
        props: ['params'],
        data() {
            return {
                momentFormat: 'YYYY-MM-DD',
                pickerFormat: 'yyyy-MM-dd',
                startYmd: '',
                endYmd: ''
            }
        },
        mounted() {
            let today = moment(new Date()).format(this.momentFormat);
            if (!this.params.startYmd) {
                this.params.startYmd = today;
            }
            if (!this.params.endYmd) {
                this.params.endYmd = today;
            }
            this.startYmd = this.params.startYmd;
            this.endYmd = this.params.endYmd;
        },
        methods: {
            start(date) {
                this.params.startYmd = date ? moment(date).format(this.momentFormat) : '';
            },
            end(date) {
                this.params.endYmd = date ? moment(date).format(this.momentFormat) : '';
            }
        }

    }
</script>
