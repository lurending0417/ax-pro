<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-button size="medium" @click="tree">&nbsp;刷新树</el-button>
                <el-button size="medium" type="success" v-if="currentNode.type==='actionGroup'" @click="addAction">&nbsp;添加功能</el-button>
                <el-button size="medium" type="primary" v-if="currentNode.type==='actionGroup'" @click="editActionGroup">&nbsp;修改分组</el-button>
                <el-button size="medium" type="danger" v-if="currentNode.type==='actionGroup'" @click="deleteActionGroup">&nbsp;删除分组</el-button>
                <el-button size="medium" type="primary" v-if="currentNode.type==='action'" @click="editAction">&nbsp;修改功能</el-button>
                <el-button size="medium" type="danger" v-if="currentNode.type==='action'" @click="deleteAction">&nbsp;删除功能</el-button>
                <el-button size="medium" type="info" v-if="currentNode.type==='action'" @click="copyAction">&nbsp;拷贝功能</el-button>
            </el-col>
            <el-col :span="8" class="text-right">
                <el-button type="success" icon="el-icon-circle-plus" @click="addActionGroup">&nbsp;添加功能分组</el-button>
            </el-col>
        </el-row>
        <el-card class="box-card m-t">
            <el-tree
                :data="treeNodes"
                highlight-current
                :render-content="renderNode"
                @node-click="selectNode">
            </el-tree>
        </el-card>

        <ActionGroupEditor :options="groupModal" @close="closeGroupEditor"></ActionGroupEditor>

        <ActionEditor :options="actionModal" @close="closeActionEditor"></ActionEditor>

    </div>
</template>

<script>

    import api from "~/api"

    export default {
        data() {
            return {
                treeNodes: [],
                currentNode: {},
                groupModal: {},
                actionModal: {}
            }
        },
        mounted() {
            this.$on("init", () => {
                this.tree();
            });
        },
        methods: {
            tree() {
                api.request({
                    url: api.url.auth.action.tree,
                    success: (json) => {
                        this.treeNodes = json.rows;
                        this.currentNode = {};
                    }
                });
            },
            renderNode(h, {data}) {
                if (data.enabled) {
                    return ( < span
                class
                    = "el-tree-node__label" > {data.label
                }<
                    /span>);
                } else {
                    return ( < span
                class
                    = "el-tree-node__label text-danger" > {data.label
                }<
                    /span>);
                }
            },
            selectNode(node) {
                this.currentNode = node;
            },
            addActionGroup() {
                this.groupModal = {
                    visible: true,
                    action: 'add',
                    json: {
                        enabled: true
                    }
                }
            },
            editActionGroup() {
                this.groupModal = {
                    visible: true,
                    action: 'edit',
                    json: this.currentNode
                }
            },
            deleteActionGroup() {
                this.$confirm('您确定要删除选中的功能分组吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.auth.action.group.del,
                        params: {
                            groupId: this.currentNode.id
                        },
                        success: () => {
                            this.$message.success('删除成功！');
                            this.tree();
                        }
                    });
                }).catch(() => {
                });
            },
            closeGroupEditor(updated) {
                this.groupModal = {};
                updated === true && this.tree();
            },
            addAction() {
                this.actionModal = {
                    visible: true,
                    action: 'add',
                    json: {
                        enabled: true,
                        groupId: this.currentNode.id
                    }
                }
            },
            editAction() {
                this.actionModal = {
                    visible: true,
                    action: 'edit',
                    json: this.currentNode
                }
            },
            deleteAction() {
                this.$confirm('您确定要删除选中的功能吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.auth.action.del,
                        params: {
                            actionId: this.currentNode.id
                        },
                        success: () => {
                            this.$message.success('删除成功！');
                            this.tree();
                        }
                    });
                }).catch(() => {
                });
            },
            copyAction() {
                this.currentNode.groupId = this.currentNode.parentId;
                this.actionModal = {
                    visible: true,
                    action: 'add',
                    json: this.currentNode
                }
            },
            closeActionEditor(updated) {
                this.actionModal = {};
                updated === true && this.tree();
            }
        }
    }
</script>
