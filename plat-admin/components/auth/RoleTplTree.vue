<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-button size="medium" @click="roleTree">&nbsp;刷新树</el-button>
                <el-button size="medium" type="success" v-if="currentNode.type==='roleGroup'" @click="addRole">&nbsp;添加角色</el-button>
                <el-button size="medium" type="primary" v-if="currentNode.type==='roleGroup'" @click="editRoleGroup">&nbsp;修改分组</el-button>
                <el-button size="medium" type="danger" v-if="currentNode.type==='roleGroup'" @click="deleteRoleGroup">&nbsp;删除分组</el-button>
                <el-button size="medium" type="primary" v-if="currentNode.type==='role'" @click="editRole">&nbsp;修改角色</el-button>
                <el-button size="medium" type="danger" v-if="currentNode.type==='role'" @click="deleteRole">&nbsp;删除角色</el-button>
            </el-col>
            <el-col :span="8" class="text-right">
                <el-button type="success" icon="el-icon-circle-plus" @click="addRoleGroup">&nbsp;添加角色分组</el-button>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" class="m-t">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header">
                        <span><span class="text-danger text-bold">商户</span>角色树</span>
                    </div>
                    <el-tree
                        :data="treeNodes"
                        highlight-current
                        node-key="id"
                        @node-click="selectNode">
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card m-l">
                    <div slot="header">
                        <span><span class="text-danger text-bold">商户</span>页面功能树</span>
                    </div>
                    <el-tree
                        :data="rolePageActionTreeNodes"
                        show-checkbox
                        node-key="id"
                        :default-checked-keys="checkedPageActionIds"
                        default-expand-all
                        ref="rolePageActionTree"
                        @check-change="setRolePageAction">
                    </el-tree>
                </el-card>
            </el-col>
        </el-row>

        <RoleGroupEditor :options="groupModal" @close="closeRoleGroupEditor"></RoleGroupEditor>

        <RoleEditor :options="roleModal" @close="closeRoleEditor"></RoleEditor>

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
                groupModal: {},
                roleModal: {},
                rolePageActionTreeNodes: [],
                checkedPageActionIds: [],
                loadingRPA: false
            }
        },
        mounted() {
            this.$on("init", () => {
                this.roleTree();
            });
        },
        watch: {
            treeNodes() {
                this.rolePageActionTreeNodes = [];
                this.checkedPageActionIds = [];
            }
        },
        methods: {
            roleTree() {
                api.request({
                    url: api.url.auth.role.tpl.tree,
                    success: (json) => {
                        this.treeNodes = json.rows;
                        this.currentNode = {};
                    }
                });
            },
            selectNode(node) {
                this.currentNode = node;
                if (node.type === 'role') {
                    this.actionTree(node.id);
                } else {
                    this.rolePageActionTreeNodes = [];
                    this.checkedPageActionIds = [];
                }
            },
            addRoleGroup() {
                this.groupModal = {
                    visible: true,
                    action: 'add'
                }
            },
            editRoleGroup() {
                this.groupModal = {
                    visible: true,
                    action: 'edit',
                    json: this.currentNode
                }
            },
            deleteRoleGroup() {
                this.$confirm('您确定要删除选中的角色分组吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.auth.role.group.tpl.del,
                        params: {
                            tplId: this.currentNode.id
                        },
                        success: () => {
                            this.$message.success('删除成功！');
                            this.roleTree();
                        }
                    });
                }).catch(() => {
                });
            },
            closeRoleGroupEditor(updated) {
                this.groupModal = {};
                updated === true && this.roleTree();
            },

            addRole() {
                this.roleModal = {
                    visible: true,
                    action: 'add',
                    json: {
                        groupId: this.currentNode.id
                    }
                }
            },
            editRole() {
                this.roleModal = {
                    visible: true,
                    action: 'edit',
                    json: this.currentNode
                }
            },
            deleteRole() {
                this.$confirm('您确定要删除选中的角色吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.auth.role.tpl.del,
                        params: {
                            tplId: this.currentNode.id
                        },
                        success: () => {
                            this.$message.success('删除成功！');
                            this.roleTree();
                        }
                    });
                }).catch(() => {
                });
            },
            closeRoleEditor(updated) {
                this.roleModal = {};
                updated === true && this.roleTree();
            },

            actionTree(roleTplId) {
                this.loadingRPA = true;
                api.request({
                    url: api.url.auth.role.tpl.action.tree,
                    params: {
                        roleTplId: roleTplId
                    },
                    success: (json) => {
                        this.rolePageActionTreeNodes = json.result.treeNodes;
                        this.checkedPageActionIds = json.result.checkedIds;
                        this.resetLoadingRPA();
                    }
                });
            },
            resetLoadingRPA: lodash.debounce(function () {
                this.loadingRPA = false;
            }, 1500),
            setRolePageAction: lodash.debounce(function () {
                if (this.loadingRPA) {
                    return;
                }
                let pageActionIds = this.$refs.rolePageActionTree.getCheckedNodes(true).map((node) => {
                    if (node.type === 'action') {
                        return node.id;
                    }
                }).filter(element => element).join();
                api.request({
                    url: api.url.auth.role.tpl.action.add,
                    params: {
                        roleTplId: this.currentNode.id,
                        pageActionIds: pageActionIds
                    },
                    success: () => {
                        this.$message.success('角色授权成功！');
                    }
                });
            }, 500)
        }
    }
</script>
