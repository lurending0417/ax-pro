<template>
    <el-dialog
        title="参数列表"
        width="70%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-form inline>
                    <el-form-item>
                        <el-select v-model="params.filterable" clearable placeholder="前端筛选" class="w150">
                            <el-option label="支持" value="true"></el-option>
                            <el-option label="不支持" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="params.enabled" clearable placeholder="状态" class="w150">
                            <el-option label="启用" value="true"></el-option>
                            <el-option label="停用" value="false"></el-option>
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
            <el-col :span="8" class="text-right">
                <el-button type="success" icon="el-icon-circle-plus" @click="addProperty">&nbsp;添加参数</el-button>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center" style="width:100%">
            <el-table-column prop="code" label="编号"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="inputType" label="类型" :formatter="renderInputType">
            </el-table-column>
            <el-table-column prop="preValues" label="预设值"></el-table-column>
            <el-table-column prop="required" label="必填项" align="center" width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.required" class="text-danger">必填</span>
                    <span v-else>选填</span>
                </template>
            </el-table-column>
            <el-table-column prop="filterable" label="前端筛选" align="center" width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.filterable">支持</span>
                    <span v-else class="text-danger">不支持</span>
                </template>
            </el-table-column>
            <el-table-column prop="enabled" label="状态" align="center" width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.enabled">启用</span>
                    <span v-else class="text-danger">停用</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="210">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button size="mini" type="primary" @click="editProperty(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" @click="deleteProperty(scope.row)">删除</el-button>
                        <el-button size="mini" @click="history(scope.row)">历史</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

        <HistoryView :options="historyModal" @close="closeHistory"></HistoryView>

        <MetaPropEditor :options="editorModal" @close="closeEditor"></MetaPropEditor>

    </el-dialog>
</template>

<script>

    import api from "~/api"
    import renderUtil from "~/util/renderUtil"

    export default {
        props: ['options'],
        data() {
            return {
                easyClose: true,
                params: {
                    filterable: '',
                    enabled: '',
                    query: ''
                },
                rows: [],
                total: 0,
                editorModal: {
                    visible: false,
                    json: {}
                },
                historyModal: {
                    visible: false,
                    entityId: ''
                }
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    this.params.type = this.options.type;
                    this.params.targetId = this.options.targetId
                    this.list();
                }
            }
        },
        methods: {
            renderInputType(row, cell, value) {
                return value ? renderUtil.renderEnum('warePropertyInputType', value) : '';
            },
            list() {
                api.request({
                    url: api.url.goods.property.field.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            addProperty() {
                this.editorModal = {
                    visible: true,
                    action: 'add',
                    type: this.options.type,
                    targetId: this.options.targetId,
                    json: {}
                }
            },
            editProperty(row) {
                this.editorModal = {
                    visible: true,
                    action: 'edit',
                    type: this.options.type,
                    targetId: this.options.targetId,
                    json: row
                }
            },
            deleteProperty(row) {
                this.$confirm('您确定要删除选中的参数吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.goods.property.field.del,
                        params: {
                            fieldId: row.id
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
            close() {
                this.$emit("close");
            },
            closeEditor(updated) {
                this.editorModal = {};
                updated === true && this.list();
            },
            closeHistory() {
                this.historyModal = {}
            }
        }

    }
</script>
