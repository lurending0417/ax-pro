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
        </div>
        <table class="table table-bordered table-cls">
            <thead>
            <tr>
                <th>时间</th>
                <th>有效用户</th>
                <th>零售用户</th>
                <th>试戴用户</th>
                <th>转买用户</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in tableView ">
                <td>{{item.billYmd}}</td>
                <td>{{item.active }}</td>
                <td>{{item.retail}}</td>
                <td>{{item.lease}}</td>
                <td>{{item.leaseBuy}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import {dateUtil} from '~/util'
    import api from '~/api'
    import DatePicker from '~/components/DatePicker'

    export default {
        components: {
            DatePicker
        },
        data() {
            return {
                form: {
                    startYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-'),
                    endYmd: dateUtil.formatDateToYYYYMMDD(new Date(), '-')
                },
                tableView: []
            }
        },
        watch: {
            'form': {
                handler() {
                    this.search()
                },
                deep: true
            }
        },
        methods: {
            search() {
                api.request({
                    url: api.consts._MERCHANT_CUSTOMER_GROWTH,
                    params: this.form,
                    success: (data) => {
                        this.tableView = data.rows;
                    }
                })
            }
        },
        mounted() {
            this.search()
        }
    }
</script>
