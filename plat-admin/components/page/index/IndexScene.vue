<template>
    <div>
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
                <el-button type="success" icon="el-icon-circle-plus" @click="addScene">&nbsp;添加场景</el-button>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center" style="width:100%">
            <el-table-column prop="code" label="编号"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="enabled" label="状态" :formatter="renderEnabled"></el-table-column>
            <el-table-column prop="createTime" width="170" label="创建时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="creatorName" label="创建人"></el-table-column>
            <el-table-column prop="updateTime" width="170" label="修改时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="updaterName" label="修改人"></el-table-column>
            <el-table-column label="操作" width="480" align="center">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button size="mini" type="primary" @click="editScene(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" @click="deleteScene(scope.row)">删除</el-button>
                        <el-button size="mini" type="info" @click="showBanner(scope.row)">BANNER</el-button>
                        <el-button size="mini" type="info" @click="showContent(scope.row)">内容</el-button>
                        <el-button size="mini" type="info" @click="showStorage(scope.row)">商品</el-button>
                        <el-button size="mini" @click="history(scope.row)">历史</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <HistoryView :options="historyModal" @close="closeHistory"></HistoryView>

        <IndexSceneEditor :options="editorModal" @close="closeEditor"></IndexSceneEditor>

        <IndexSceneBanner :options="bannerModal" @close="closeBanner"></IndexSceneBanner>
        <IndexSceneContent :options="contentModal" @close="closeContent"></IndexSceneContent>
        <IndexSceneStorage :options="storageModal" @close="closeStorage"></IndexSceneStorage>

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
                bannerModal: {
                    visible: false,
                    sceneId: ''
                },
                contentModal: {
                    visible: false,
                    sceneId: ''
                },
                storageModal: {
                    visible: false,
                    sceneId: ''
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
                    url: api.url.page.index.scene.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            addScene() {
                this.editorModal = {
                    visible: true,
                    action: 'add',
                    json: {
                        enabled: true
                    }
                }
            },
            editScene(row) {
                this.editorModal = {
                    visible: true,
                    action: 'edit',
                    json: row
                }
            },
            deleteScene(row) {
                this.$confirm('您确定要删除选中的场景吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.page.index.scene.del,
                        params: {
                            sceneId: row.id
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
            showBanner(row) {
                this.bannerModal = {
                    visible: true,
                    sceneId: row.id
                }
            },
            closeBanner() {
                this.bannerModal = {
                    visible: false
                }
            },
            showContent(row) {
                this.contentModal = {
                    visible: true,
                    sceneId: row.id
                }
            },
            closeContent() {
                this.contentModal = {}
            },
            showStorage(row) {
                this.storageModal = {
                    visible: true,
                    sceneId: row.id
                }
            },
            closeStorage() {
                this.storageModal = {};
            },
            closeHistory() {
                this.historyModal = {};
            }
        }
    }


</script>
