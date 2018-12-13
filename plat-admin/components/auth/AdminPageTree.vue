<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="16">
                <el-button size="medium" @click="pageTree">&nbsp;刷新树</el-button>
                <el-button size="medium" type="success" v-if="currentNode.type==='pageGroup'" @click="addPage">&nbsp;添加页面</el-button>
                <el-button size="medium" type="primary" v-if="currentNode.type==='pageGroup'" @click="editPageGroup">&nbsp;修改分组</el-button>
                <el-button size="medium" type="danger" v-if="currentNode.type==='pageGroup'" @click="deletePageGroup">&nbsp;删除分组</el-button>
                <el-button size="medium" type="success" v-if="currentNode.type==='page'" @click="addTab">&nbsp;添加选项卡</el-button>
                <el-button size="medium" type="primary" v-if="currentNode.type==='page'" @click="editPage">&nbsp;修改页面</el-button>
                <el-button size="medium" type="danger" v-if="currentNode.type==='page'" @click="deletePage">&nbsp;删除页面</el-button>
                <el-button size="medium" type="primary" v-if="currentNode.type==='tab'" @click="editTab">&nbsp;修改选项卡</el-button>
                <el-button size="medium" type="danger" v-if="currentNode.type==='tab'" @click="deleteTab">&nbsp;删除选项卡</el-button>
            </el-col>
            <el-col :span="8" class="text-right">
                <el-button type="success" icon="el-icon-circle-plus" @click="addPageGroup">&nbsp;添加页面分组</el-button>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" class="m-t">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header">
                        <span><span class="text-danger text-bold">平台</span>页面树</span>
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
                        <span><span class="text-danger text-bold">平台</span>功能树</span>
                    </div>
                    <el-tree
                        :data="actionTreeNodes"
                        show-checkbox
                        node-key="id"
                        :default-checked-keys="checkedActionIds"
                        default-expand-all
                        ref="actionTree"
                        @check-change="setAction">
                    </el-tree>
                </el-card>
            </el-col>
        </el-row>

        <AdminPageGroupEditor :options="groupModal" @close="closePageGroupEditor"></AdminPageGroupEditor>

        <AdminPageEditor :options="pageModal" @close="closePageEditor"></AdminPageEditor>

        <AdminTabEditor :options="tabModal" @close="closeTabEditor"></AdminTabEditor>

    </div>
</template>

<script>

    import api from "~/api"

    import lodash from "lodash"

    export default {
        data() {
            return {
                treeNodes: [],
                currentNode: {},
                groupModal: {},
                pageModal: {},
                tabModal: {},
                actionTreeNodes: [],
                checkedActionIds: [],
                loadingAction: false,
            }
        },
        mounted() {
            this.$on("init", () => {
                this.pageTree();
            });
        },
        watch: {
            treeNodes() {
                this.checkedActionIds = [];
                this.actionTreeNodes = [];
            }
        },
        methods: {
            pageTree() {
                api.request({
                    url: api.url.auth.admin.page.tree,
                    success: (json) => {
                        this.treeNodes = json.rows;
                        this.currentNode = {};
                    }
                });
            },
            selectNode(node) {
                this.currentNode = node;
                if (node.type === 'page' || node.type === 'tab') {
                    this.actionTree(node.id);
                } else {
                    this.checkedActionIds = [];
                    this.actionTreeNodes = [];
                }
            },
            addPageGroup() {
                this.groupModal = {
                    visible: true,
                    action: 'add'
                }
            },
            editPageGroup() {
                this.groupModal = {
                    visible: true,
                    action: 'edit',
                    json: this.currentNode
                }
            },
            deletePageGroup() {
                this.$confirm('您确定要删除选中的页面分组吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.auth.admin.page.group.del,
                        params: {
                            groupId: this.currentNode.id
                        },
                        success: () => {
                            this.$message.success('删除成功！');
                            this.pageTree();
                        }
                    });
                }).catch(() => {
                });
            },
            closePageGroupEditor(updated) {
                this.groupModal = {};
                updated === true && this.pageTree();
            },
            addPage() {
                this.pageModal = {
                    visible: true,
                    action: 'add',
                    json: {
                        groupId: this.currentNode.id
                    }
                }
            },
            editPage() {
                this.pageModal = {
                    visible: true,
                    action: 'edit',
                    json: this.currentNode
                }
            },
            deletePage() {
                this.$confirm('您确定要删除选中的页面吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.auth.admin.page.del,
                        params: {
                            pageId: this.currentNode.id
                        },
                        success: () => {
                            this.$message.success('删除成功！');
                            this.pageTree();
                        }
                    });
                }).catch(() => {
                });
            },
            closePageEditor(updated) {
                this.pageModal = {};
                updated === true && this.pageTree();
            },
            addTab() {
                this.tabModal = {
                    visible: true,
                    action: 'add',
                    pageId: this.currentNode.id
                }
            },
            editTab() {
                this.tabModal = {
                    visible: true,
                    action: 'edit',
                    json: this.currentNode
                }
            },
            deleteTab() {
                this.$confirm('您确定要删除选中的选项卡吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    api.request({
                        url: api.url.auth.admin.page.tab.del,
                        params: {
                            tabId: this.currentNode.id
                        },
                        success: () => {
                            this.$message.success('删除成功！');
                            this.pageTree();
                        }
                    });
                }).catch(() => {
                });
            },
            closeTabEditor(updated) {
                this.tabModal = {};
                updated === true && this.pageTree();
            },
            actionTree(pageId) {
                this.loadingAction = true;
                api.request({
                    url: api.url.auth.admin.page.action.tree,
                    params: {
                        pageId: pageId
                    },
                    success: (json) => {
                        this.checkedActionIds = json.result.checkedIds;
                        this.actionTreeNodes = json.result.treeNodes;
                        this.resetLoadingAction();
                    }
                })
            },
            resetLoadingAction: lodash.debounce(function () {
                this.loadingAction = false;
            }, 1500),
            setAction: lodash.debounce(function () {
                if (this.loadingAction) {
                    return;
                }
                let actionIds = this.$refs.actionTree.getCheckedNodes(true).map((node) => {
                    if (node.type === 'action') {
                        return node.id;
                    }
                }).filter(element => element).join();
                api.request({
                    url: api.url.auth.admin.page.action.add,
                    params: {
                        pageId: this.currentNode.id,
                        actionIds: actionIds
                    },
                    success: () => {
                        this.$message.success('功能设置成功！');
                    }
                });
            }, 500)
        }
    }
</script>
