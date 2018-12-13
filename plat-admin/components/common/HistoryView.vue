<template>
    <el-dialog
        title="查看修改记录"
        width="60%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        append-to-body
        :before-close="close">
        <el-row type="flex" justify="space-between">
            <el-col :span="24">
                <el-form inline>
                    <el-form-item>
                        <DateRange :params="params"></DateRange>
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
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center" style="width:100%">
            <el-table-column prop="createTime" label="时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="fieldName" label="字段"></el-table-column>
            <el-table-column prop="oldValue" label="原值"></el-table-column>
            <el-table-column prop="newValue" label="新值"></el-table-column>
            <el-table-column prop="creatorName" label="修改人"></el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

    </el-dialog>
</template>


<script>

    import api from "~/api"

    export default {

        props: ['options'],

        data() {
            return {
                easyClose: true,
                params: {
                    startYmd: '',
                    endYmd: '',
                    query: '',
                    entityId: ''
                },
                rows: [],
                total: 0,
            }
        },

        watch: {
            'options.visible': function (value) {
                if (value) {
                    this.list();
                } else {
                    this.rows = [];
                    this.total = 0;
                }
            }
        },
        mounted() {
        },
        methods: {
            close() {
                this.$emit("close");
            },
            list() {
                this.params.entityId = this.options.entityId;
                api.request({
                    url: api.url.history.list,
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
