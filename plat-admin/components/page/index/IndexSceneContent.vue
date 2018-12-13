<template>
    <el-dialog
        title="场景内容"
        width="70%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-form inline>
                    <el-form-item>
                        <el-select v-model="params.enabled" placeholder="状态" clearable>
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
                <el-button type="success" icon="el-icon-circle-plus" @click="addContent">&nbsp;添加内容</el-button>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center" style="width:100%">
            <el-table-column prop="code" label="编号"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="imgPath" label="图片"></el-table-column>
            <el-table-column prop="storageId" label="库存ID"></el-table-column>
            <el-table-column prop="enabled" label="状态" :formatter="renderEnabled"></el-table-column>
            <el-table-column prop="createTime" width="170" label="创建时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="creatorName" label="创建人"></el-table-column>
            <el-table-column prop="updateTime" width="170" label="修改时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="updaterName" label="修改人"></el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button size="mini" type="primary" @click="editContent(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" @click="deleteContent(scope.row)">删除</el-button>
                        <el-button size="mini" @click="history(scope.row)">历史</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <HistoryView :options="historyModal" @close="closeHistory"></HistoryView>

        <IndexSceneContentEditor :options="editorModal" @close="closeEditor"></IndexSceneContentEditor>

    </el-dialog>
</template>


<script>

    import api from "~/api"

    export default {
        props: ['options'],
        data() {
            return {
                params: {},
                easyClose: true,
                editorModal: {
                    visible: false
                },
                historyModal: {},
                rows: [],
                total: 0
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    this.params.sceneId = this.options.sceneId;
                    this.list();
                }
            }
        },
        methods: {
            list() {
                api.request({
                    url: api.url.page.index.scene.content.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            close() {
                this.$emit("close");
            },
            addContent() {
                this.editorModal = {
                    visible: true,
                    action: 'add',
                    json: {
                        sceneId: this.params.sceneId,
                        enabled: true
                    }
                }
            },
            editContent(row) {
                this.editorModal = {
                    visible: true,
                    action: 'edit',
                    json: row
                }
            },
            deleteContent(row) {
                this.$confirm('您确定要删除选中的内容吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.page.index.scene.content.del,
                        params: {
                            contentId: row.id
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
                }
                update && this.list();
            },
            closeHistory() {
                this.historyModal = {};
            }
        }
    }
</script>
