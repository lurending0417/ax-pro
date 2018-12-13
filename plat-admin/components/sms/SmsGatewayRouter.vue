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
                <el-button type="success" icon="el-icon-circle-plus" @click="addRouter">&nbsp;添加规则</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="rows"
            stripe
            border
            style="width:100%">
            <el-table-column prop="router.billType" label="类型" :formatter="renderBillType"></el-table-column>
            <el-table-column prop="router.voice" label="语音接口" :formatter="renderVoice"></el-table-column>
            <el-table-column prop="gateway.name" label="网关"></el-table-column>
            <el-table-column prop="account.appId" label="appId"></el-table-column>
            <el-table-column prop="router.priority" label="优先级"></el-table-column>
            <el-table-column prop="router.createTime" width="170" label="创建时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="router.creatorName" label="创建人"></el-table-column>
            <el-table-column prop="router.updateTime" width="170" label="修改时间" align="center" :formatter="renderTime"></el-table-column>
            <el-table-column prop="router.updaterName" label="修改人"></el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template slot-scope="scope">
                    <div class="nowrap">
                        <el-button size="mini" type="primary" @click="editRouter(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" @click="deleteRouter(scope.row)">删除</el-button>
                        <el-button size="mini" @click="history(scope.row)">历史</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="text-right m-t">
            <Pagination :options="this" @list="list"></Pagination>
        </div>

        <HistoryView :options="historyModal" @close="closeHistory"></HistoryView>

        <SmsGatewayRouterEditor :options="editorModal" @close="closeEditor"></SmsGatewayRouterEditor>

    </div>
</template>

<script>

    import api from "~/api"

    import {baseUtil, renderUtil} from "~/util"

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
        computed: {
            gateways: () => {
                return baseUtil.getMetadata('smsGateway')
            }
        },
        mounted() {
            this.$on("init", () => {
                this.list();
            });
        },
        methods: {
            renderVoice(row, cell, value) {
                return value ? '是' : '否';
            },
            renderBillType(row, cell, value) {
                return value ? renderUtil.renderEnum('smsBillType', value) : '';
            },
            renderGateway(row, cell, value) {
                for (var i = 0, j = this.gateways.length; i < j; i++) {
                    let gateway = this.gateways[i];
                    if (gateway.id === value) {
                        return gateway.name;
                    }
                }
            },
            list() {
                api.request({
                    url: api.url.sms.gateway.router.list,
                    params: this.params,
                    success: (json) => {
                        this.rows = json.rows;
                        this.total = json.total;
                    }
                });
            },
            addRouter() {
                this.editorModal = {
                    visible: true,
                    action: 'add',
                    json: {},
                    gateways: this.gateways
                }
            },
            editRouter(row) {
                this.editorModal = {
                    visible: true,
                    action: 'edit',
                    json: row,
                    gateways: this.gateways
                }
            },
            deleteRouter(row) {
                this.$confirm('您确定要删除选中的网关路由吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.sms.gateway.router.del,
                        params: {
                            routerId: row.id
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
                    entityId: row.router.id
                }
            },
            closeHistory() {
                this.historyModal = {};
            },
            closeEditor(updated) {
                this.editorModal = {}
                updated === true && this.list();
            }
        }
    }


</script>
