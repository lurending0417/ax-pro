<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-form inline>
                    <el-form-item>
                        <el-input v-model="params.query" clearable placeholder="关键字"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="list">&nbsp;搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8" class="text-right">
                <el-button type="success" icon="el-icon-circle-plus" @click="addTemplate">&nbsp;添加模板</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="rows"
            stripe
            border
            style="width:100%">
            <el-table-column prop="code" label="模板编号"></el-table-column>
            <el-table-column prop="name" label="模板名称"></el-table-column>
            <el-table-column prop="template" label="模板内容"></el-table-column>
            <el-table-column prop="createTime" width="170" label="创建时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="creatorName" label="创建人"></el-table-column>
            <el-table-column prop="updateTime" width="170" label="修改时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="updaterName" label="修改人"></el-table-column>
            <el-table-column label="操作" width="280" align="center">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button size="mini" type="primary" @click="editTemplate(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" @click="deleteTemplate(scope.row)">删除</el-button>
                        <el-button size="mini" @click="history(scope.row)">历史</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

        <HistoryView :options="historyModal" @close="closeHistory"></HistoryView>

        <SmsTemplateEditor :options="editorModal" @close="closeEditor"></SmsTemplateEditor>

    </div>
</template>

<script>

    import api from "~/api"

    export default {

        data() {
            return {
                params: {
                    query: ''
                },
                rows: [],
                total: 0,
                editorModal: {
                    visible: false,
                    action: '',
                    json: {}
                },
                historyModal: {
                    visible: false,
                    entityId: ''
                }
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
                    url: api.url.sms.template.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            addTemplate() {
                this.editorModal = {
                    visible: true,
                    action: 'add',
                    json: {}
                }
            },
            editTemplate(row) {
                this.editorModal = {
                    visible: true,
                    action: 'edit',
                    json: row
                }
            },
            deleteTemplate(row) {
                this.$confirm('您确定要删除选中的短信模板吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.sms.template.del,
                        params: {
                            templateId: row.id
                        },
                        success: () => {
                            this.$message.success('删除成功！');
                            this.list();
                        }
                    });
                }).catch(() => {
                });
            },
            history(row) {
                this.historyModal = {
                    visible: true,
                    entityId: row.id
                }
            },
            closeHistory() {
                this.historyModal = {}
            },
            closeEditor(updated) {
                this.editorModal = {};
                updated === true && this.list();
            }
        }


    }

</script>

