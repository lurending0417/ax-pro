<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-form inline>
                    <el-form-item>
                        <el-select v-model="params.enabled" clearable placeholder="启用状态">
                            <el-option key="true" label="启用" value="true"></el-option>
                            <el-option key="false" label="停用" value="false"></el-option>
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
                <el-button type="success" icon="el-icon-circle-plus" @click="addPhysicalGold">&nbsp;添加金条</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="rows"
            stripe
            border
            style="width:100%">
            <el-table-column prop="name" label="金条名称"></el-table-column>
            <el-table-column prop="weight" label="重量(g)"></el-table-column>
            <el-table-column prop="processingCharges" label="工费(¥/g)"></el-table-column>
            <el-table-column prop="purity" label="纯度"></el-table-column>
            <el-table-column prop="dimension" label="尺寸"></el-table-column>
            <el-table-column prop="description" label="描述信息"></el-table-column>
            <el-table-column prop="enabled" label="启用状态" align="center" :formatter="renderEnabled"></el-table-column>
            <el-table-column prop="createTime" width="170" label="创建时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="creatorName" label="创建人"></el-table-column>
            <el-table-column prop="updateTime" width="170" label="修改时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="updaterName" label="修改人"></el-table-column>
            <el-table-column label="操作" width="280" align="center">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button size="mini" type="primary" @click="editPhysicalGold(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" @click="deletePhysicalGold(scope.row)">删除</el-button>
                        <el-button size="mini" @click="history(scope.row)">历史</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

        <HistoryView :options="historyModal" @close="closeHistory"></HistoryView>

        <PhysicalGoldEditor :options="editorModal" @close="closeEditor"></PhysicalGoldEditor>

    </div>
</template>


<script>

    import api from "~/api"

    export default {
        data() {
            return {
                params: {
                    query: '',
                },
                rows: [],
                total: 0,
                editorModal: {},
                historyModal: {}
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
                    url: api.url.physical.gold.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            addPhysicalGold() {
                this.editorModal = {
                    visible: true,
                    action: 'add',
                    json: {
                        enabled: true
                    }
                }
            },
            editPhysicalGold(row) {
                this.editorModal = {
                    visible: true,
                    action: 'edit',
                    json: row
                }
            },
            deletePhysicalGold(row) {
                this.$confirm('您确定要删除选中的黄金吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.physical.gold.del,
                        params: {
                            goldId: row.id
                        },
                        success: () => {
                            this.$message.success('删除成功！');
                            this.list();
                        }
                    });
                }).catch(() => {
                })
            },
            history(row) {
                this.historyModal = {
                    visible: true,
                    entityId: row.id
                }
            },
            closeHistory() {
                this.historyModal = {};
            },
            closeEditor(updated) {
                this.editorModal = {};
                updated === true && this.list();
            }
        }
    }

</script>
