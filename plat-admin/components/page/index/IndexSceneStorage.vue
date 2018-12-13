<template>
    <el-dialog
        title="场景商品"
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
                <el-button type="success" icon="el-icon-circle-plus" @click="addStorage">&nbsp;添加商品</el-button>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center" style="width:100%">
            <el-table-column prop="sceneStorage.code" label="编号"></el-table-column>
            <el-table-column prop="storage.storageView.storageName" label="名称"></el-table-column>
            <el-table-column prop="storage.storageView.storage.serial" label="条码"></el-table-column>
            <el-table-column prop="storage.storageView.lease.depositPrice" label="押金"></el-table-column>
            <el-table-column prop="sceneStorage.enabled" width="60" align="center" label="状态" :formatter="renderEnabled"></el-table-column>
            <el-table-column prop="sceneStorage.createTime" width="170" label="创建时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="sceneStorage.creatorName" label="创建人"></el-table-column>
            <el-table-column prop="sceneStorage.updateTime" width="170" label="修改时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="sceneStorage.updaterName" label="修改人"></el-table-column>
            <el-table-column label="操作" width="80" align="center">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button size="mini" type="danger" @click="deleteStorage(scope.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <IndexSceneStorageEditor :options="editorModal" @close="closeEditor"></IndexSceneStorageEditor>
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
                    url: api.url.page.index.scene.storage.list,
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
            addStorage() {
                this.editorModal = {
                    visible: true,
                    action: 'add',
                    json: {
                        sceneId: this.params.sceneId,
                        enabled: true
                    }
                }
            },
            deleteStorage(row) {
                this.$confirm('您确定要删除选中的商品吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.page.index.scene.storage.del,
                        params: {
                            storageId: row.sceneStorage.id
                        },
                        success: () => {
                            this.$message.success('删除成功！');
                            this.list();
                        }
                    });
                });
            },
            closeEditor(update) {
                this.editorModal = {
                    json: {}
                }
                update && this.list();
            }
        }
    }
</script>
