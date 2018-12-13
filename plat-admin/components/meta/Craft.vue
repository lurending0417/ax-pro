<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-form inline>
                    <el-form-item>
                        <el-select v-model="params.enabled" clearable placeholder="状态">
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
                <el-button type="success" icon="el-icon-circle-plus" @click="addCraft">&nbsp;添加工艺</el-button>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center" style="width:100%">
            <el-table-column prop="code" label="编号"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="labelName" label="标签名"></el-table-column>
            <el-table-column prop="enabled" label="状态" width="100" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.enabled">启用</span>
                    <span v-else class="text-danger">停用</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" width="170" label="创建时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="creatorName" label="创建人"></el-table-column>
            <el-table-column prop="updateTime" width="170" label="修改时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="updaterName" label="修改人"></el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button size="mini" type="primary" @click="editCraft(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" @click="deleteCraft(scope.row)">删除</el-button>
                        <el-button size="mini" @click="history(scope.row)">历史</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

        <HistoryView :options="historyModal" @close="closeHistory"></HistoryView>

        <CraftEditor :options="editorModal" @close="closeEditor"></CraftEditor>

    </div>
</template>


<script>


    import api from "~/api"

    export default {
        data() {
            return {
                easyClose: true,
                params: {
                    enabled: '',
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
                    url: api.url.goods.craft.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            addCraft() {
                this.editorModal = {
                    visible: true,
                    action: 'add',
                    json: {
                        enabled: true
                    }
                }
            },
            editCraft(row) {
                this.editorModal = {
                    visible: true,
                    action: 'edit',
                    json: row
                }
            },
            deleteCraft(row) {
                this.$confirm('您确定要删除选中的工艺吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.goods.craft.del,
                        params: {
                            craftId: row.id
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
                };
            },
            closeEditor(update) {
                this.editorModal = {
                    json: {}
                };
                update && this.list();
            },
            closeHistory() {
                this.historyModal = {};
            }

        }

    }

</script>
