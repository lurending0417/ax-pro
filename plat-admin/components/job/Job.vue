<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-form inline>
                    <el-form-item>
                        <el-select v-model="scheduled" clearable placeholder="状态">
                            <el-option label="已调度" value="true"></el-option>
                            <el-option label="待调度" value="false"></el-option>
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
        <el-table :data="rows" stripe border highlight-current-row header-cell-class-name="text-center" style="width:100%">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="className" label="类名"></el-table-column>
            <el-table-column prop="cron" label="执行计划" width="200"></el-table-column>
            <el-table-column prop="state" label="状态" width="100" align="center" :formatter="renderState"></el-table-column>
            <el-table-column prop="lastFireTime" width="170" label="上次执行时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="nextFireTime" width="170" label="下次执行时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column label="操作" width="215" align="left">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button size="mini" type="primary" v-if="!scope.row.state" @click="schedule(scope.row)">调度</el-button>
                        <el-button size="mini" type="warning" v-if="scope.row.state" @click="reSchedule(scope.row)">修改</el-button>
                        <el-button size="mini" type="warning" v-if="scope.row.state=='NORMAL'" @click="pauseSchedule(scope.row)">暂停</el-button>
                        <el-button size="mini" type="primary" v-if="scope.row.state=='PAUSED'" @click="resumeSchedule(scope.row)">恢复</el-button>
                        <el-button size="mini" type="danger" v-if="scope.row.state" @click="unSchedule(scope.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>


<script>


    import api from "~/api"

    export default {
        data() {
            return {
                easyClose: true,
                scheduled: 'true',
                params: {
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
                    url: this.scheduled === 'true' ? api.url.job.scheduled.list : api.url.job.toSchedule,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            renderState(row) {
                switch (row && row.state) {
                    case 'NORMAL':
                        return '正常';
                    case 'PAUSED':
                        return '暂停';
                    case 'ERROR':
                        return '错误';
                    default:
                        return row.state;
                }
            },
            schedule(row) {
                this.$prompt('请输入执行计划', '提示', {}).then(({value}) => {
                    api.request({
                        url: api.url.job.scheduled.add,
                        params: {
                            jobClassName: row.className,
                            cronExpression: value
                        },
                        success: () => {
                            this.$message.success('调度成功！');
                            this.list();
                        }
                    });
                }).catch(() => {
                });
            },
            reSchedule(row) {
                this.$prompt('请输入执行计划', '提示', {
                    inputValue: row.cron || ""
                }).then(({value}) => {
                    api.request({
                        url: api.url.job.scheduled.edit,
                        params: {
                            jobClassName: row.className,
                            cronExpression: value
                        },
                        success: () => {
                            this.$message.success('调度成功！');
                            this.list();
                        }
                    });
                }).catch(() => {
                });
            },
            pauseSchedule(row) {
                this.$confirm('您确定要暂停选中的任务吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.job.scheduled.pause,
                        params: {
                            jobClassName: row.className
                        },
                        success: () => {
                            this.$message.success('暂停成功！');
                            this.list();
                        }
                    });
                }).catch(() => {
                });
            },
            resumeSchedule(row) {
                this.$confirm('您确定要恢复选中的任务吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.job.scheduled.resume,
                        params: {
                            jobClassName: row.className
                        },
                        success: () => {
                            this.$message.success('恢复成功！');
                            this.list();
                        }
                    });
                }).catch(() => {
                });
            },
            unSchedule(row) {
                this.$confirm('您确定要删除选中的任务吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.job.scheduled.del,
                        params: {
                            jobClassName: row.className
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
                this.editorModal = {};
                update && this.list();
            },
            closeHistory() {
                this.historyModal = {};
            },
            closeProp() {
                this.propModal = {}
            }

        }

    }

</script>
