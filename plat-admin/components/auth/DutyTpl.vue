<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-button size="medium" type="success" @click="addDuty">&nbsp;添加岗位</el-button>
                <el-button size="medium" v-if="currentNode.id" type="primary" @click="editDuty">&nbsp;修改岗位</el-button>
                <el-button size="medium" v-if="currentNode.id" type="danger" @click="deleteDuty">&nbsp;删除岗位</el-button>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" class="m-t">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header">
                        <span><span class="text-danger text-bold">商户</span>岗位模板</span>
                    </div>
                    <el-tree
                        :data="treeNodes"
                        highlight-current
                        node-key="id"
                        :props="props"
                        @node-click="selectNode">
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card m-l">
                    <div slot="header">
                        <span><span class="text-danger text-bold">商户</span>岗位角色授权</span>
                    </div>
                    <el-tree
                        :data="dutyRoleNodes"
                        show-checkbox
                        node-key="id"
                        :default-checked-keys="checkedRoleIds"
                        default-expand-all
                        ref="dutyRoleTree"
                        @check-change="setDutyRole">
                    </el-tree>
                </el-card>
            </el-col>
        </el-row>

        <DutyEditor :options="modal" @close="closeDutyEditor"></DutyEditor>

    </div>
</template>

<script>

    import api from "~/api"
    import lodash from "lodash"

    export default {
        data() {
            return {
                treeNodes: [],
                currentNode: [],
                props: {
                    label: 'name'
                },
                modal: {},
                dutyRoleNodes: [],
                checkedRoleIds: [],
                loadingDR: false
            }
        },
        mounted() {
            this.$on("init", () => {
                this.dutyTree();
            });
        },
        watch: {
            treeNodes() {
                this.dutyRoleNodes = [];
                this.checkedRoleIds = [];
            }
        },
        methods: {
            dutyTree() {
                api.request({
                    url: api.url.auth.duty.tpl.list,
                    success: (json) => {
                        this.treeNodes = json.rows;
                        this.currentNode = {};
                    }
                });
            },
            selectNode(node) {
                this.currentNode = node;
                this.dutyRoleTree();
            },
            addDuty() {
                this.modal = {
                    visible: true,
                    action: 'add'
                }
            },
            editDuty() {
                this.modal = {
                    visible: true,
                    action: 'edit',
                    json: this.currentNode
                }
            },
            deleteDuty() {
                this.$confirm('您确定要删除选中的岗位吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.auth.duty.tpl.del,
                        params: {
                            tplId: this.currentNode.id
                        },
                        success: () => {
                            this.$message.success('删除成功！');
                            this.dutyTree();
                        }
                    });
                }).catch(() => {
                });
            },
            closeDutyEditor(updated) {
                this.modal = {};
                updated === true && this.dutyTree();
            },
            dutyRoleTree() {
                this.loadingDR = true;
                api.request({
                    url: api.url.auth.duty.tpl.role.tree,
                    params: {
                        dutyTplId: this.currentNode.id
                    },
                    success: (json) => {
                        this.dutyRoleNodes = json.result.treeNodes;
                        this.checkedRoleIds = json.result.checkedIds;
                        this.resetLoadingDR();
                    }
                });
            },
            resetLoadingDR: lodash.debounce(function () {
                this.loadingDR = false;
            }, 1500),
            setDutyRole: lodash.debounce(function () {
                if (this.loadingDR) {
                    return;
                }
                let roleIds = this.$refs.dutyRoleTree.getCheckedNodes(true).map((node) => {
                    if (node.type === 'role') {
                        return node.id;
                    }
                }).filter(element => element).join();
                api.request({
                    url: api.url.auth.duty.tpl.role.add,
                    params: {
                        dutyTplId: this.currentNode.id,
                        roleTplIds: roleIds
                    },
                    success: () => {
                        this.$message.success('岗位授权成功！');
                    }
                });
            }, 500)
        }
    }
</script>
