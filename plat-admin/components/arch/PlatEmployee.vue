<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-form inline>
                    <el-form-item>
                        <el-select v-model="params.atWork" clearable placeholder="状态">
                            <el-option label="在职" value="true"></el-option>
                            <el-option label="离职" value="false"></el-option>
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
                <el-button type="success" icon="el-icon-circle-plus" @click="addEmployee">&nbsp;添加员工</el-button>
            </el-col>
        </el-row>
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center" style="width:100%">
            <el-table-column prop="code" label="工号"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="telephone" label="手机号码"></el-table-column>
            <el-table-column prop="atWork" label="状态" width="100" align="center" :formatter="renderAtWork">
            </el-table-column>
            <el-table-column prop="createTime" width="170" label="创建时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="creatorName" label="创建人"></el-table-column>
            <el-table-column prop="updateTime" width="170" label="修改时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="updaterName" label="修改人"></el-table-column>
            <el-table-column label="操作" width="280" align="center">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button size="mini" type="primary" @click="editEmployee(scope.row)">修改</el-button>
                        <el-button size="mini" @click="history(scope.row)">历史</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

        <HistoryView :options="historyModal" @close="closeHistory"></HistoryView>

        <PlatEmployeeEditor :options="editorModal" @close="closeEditor"></PlatEmployeeEditor>

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
            renderAtWork(row, cell, value) {
                return value ? '在职' : '离职';
            },
            list() {
                api.request({
                    url: api.url.user.employee.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            addEmployee() {
                this.editorModal = {
                    visible: true,
                    action: 'add',
                    json: {
                        atWork: true
                    }
                }
            },
            editEmployee(row) {
                this.editorModal = {
                    visible: true,
                    action: 'edit',
                    json: row
                }
            },
            history(row) {
                this.historyModal = {
                    visible: true,
                    entityId: row.id
                };
            },
            closeEditor(update) {
                this.editorModal = {};
                update && this.list();
            },
            closeHistory() {
                this.historyModal = {};
            }
        }

    }

</script>
