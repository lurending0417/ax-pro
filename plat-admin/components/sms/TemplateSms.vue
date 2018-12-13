<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="24">
                <el-form inline>
                    <el-form-item>
                        <DateRange :params="params"></DateRange>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="params.sent" clearable placeholder="状态">
                            <el-option label="已发送" value="true"></el-option>
                            <el-option label="未发送" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="params.query" clearable placeholder="关键字"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="list">&nbsp;搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center">
            <el-table-column align="center" prop="telephone" label="手机号码"></el-table-column>
            <el-table-column align="center" prop="templateId" label="模板ID"></el-table-column>
            <el-table-column prop="content" label="短信内容"></el-table-column>
            <el-table-column align="center" width="180" prop="createTime" label="请求时间" :formatter="renderTime"></el-table-column>
            <el-table-column align="center" width="180" prop="sendTime" label="发送时间" :formatter="renderTime"></el-table-column>
            <el-table-column align="center" prop="triedTimes" label="重试次数"></el-table-column>
            <el-table-column align="center" width="180" prop="lastTriedTime" label="最后重试时间" :formatter="renderTime"></el-table-column>
            <el-table-column prop="failMsg" label="重试事由"></el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>
    </div>

</template>


<script>

    import api from "~/api"

    export default {
        data() {
            return {
                params: {
                    sent: '',
                    query: ''
                },
                rows: [],
                total: 0
            }
        },
        mounted() {
            this.$on("init", () => {
                this.list();
            });
        },
        methods: {
            list() {
                api.request({
                    url: api.url.sms.sms.template.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            }
        }
    }

</script>
