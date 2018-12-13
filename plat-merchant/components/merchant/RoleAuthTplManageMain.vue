<template>
    <div>
        <div class="row">
            <div class="col-md-10">
                <!--当点击tree时-->
                <div v-if="currentClickItem.label">
                    当前操作：<label>{{ currentClickItem.label }}&nbsp;&nbsp;&nbsp;</label>
                    <ButtonWithModal
                        :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '修改'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '修改'
                            }">
                        <RoleAuthTplManageModify
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                            :refreshTable="refreshTable"
                            :currentClickItem="currentClickItem"></RoleAuthTplManageModify>
                    </ButtonWithModal>
                    <button class="btn btn-sm btn-default" style="margin-left: 10px;margin-right: 10px"
                            @click="clickDelete">删除
                    </button>
                    <ButtonWithModal
                        v-show="currentClickItem.type === 'roleGroup'"
                        :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '新增角色'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '新增角色'
                            }">
                        <RoleAuthTplManageAdd
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                            :refreshTable="refreshTable"
                            :currentClickItem="currentClickItem"></RoleAuthTplManageAdd>
                    </ButtonWithModal>
                </div>
            </div>
            <div class="col-md-2" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn-danger'],
                                btnStyle: { minWidth: 80 + 'px' },
                                btnName: '新增角色分组'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '新增角色分组'
                            }">
                    <RoleAuthTplManageAdd
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                        :refreshTable="refreshTable"></RoleAuthTplManageAdd>
                </ButtonWithModal>
            </div>
        </div>
        <fieldset class="col-md-5" style="margin: 10px">
            <legend>角色</legend>
            <div id="roleAuthTplManage">
                <VueTree
                    :tree-data="getRoleAuthTpls"
                    :options="{
                        idsWithParent: false,
                        checkbox: false
                    }"
                    @handle="clickItem">
                </VueTree>
            </div>
        </fieldset>
        <fieldset class="col-md-5" style="margin: 10px">
            <legend>绑定页面功能</legend>
            <div>
                <VueTree
                    v-model="checkedIds"
                    :tree-data="authRoleActions"
                    :options="{
                        idsWithParent: false
                    }"
                    @handle="clickItem">
                </VueTree>
            </div>
        </fieldset>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import VueTree from 'vue-simple-tree/src/components/VueTree.vue'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import RoleAuthTplManageAdd from '~/components/merchant/RoleAuthTplManageAdd'
    import RoleAuthTplManageModify from '~/components/merchant/RoleAuthTplManageModify'
    import uuid from 'uuid'
    import lodash from 'lodash'

    export default {
        props: ['passed'],
        components: {
            VueTree,
            ButtonWithModal,
            RoleAuthTplManageAdd,
            RoleAuthTplManageModify
        },
        data () {
            return {
                currentClickItem: {},
                checkedIds: [],
                actionIds: [],
                isChangeAction: true, // 是否是切换角色选项，如果是正在切换角色选项，则清空checkedIds后不执行watch中的方法，否则执行watch中方法
                authRoleActions: [],
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid()
            }
        },
        watch: {
            checkedIds () {
                this.checkedChange()
            }
        },
        computed: {
            ...mapGetters('merchant/roleAuthTplManageAdd', {
                getRoleAuthTpls: 'getRoleAuthTpls'
            })
        },
        methods: {
            ...mapActions('merchant/roleAuthTplManageAdd', {
                apiGetRoleAuthTpl: 'apiGetRoleAuthTpl',
                apiDeleteRoleGroupAuthTpl: 'apiDeleteRoleGroupAuthTpl',
                apiDeleteRoleAuthTpl: 'apiDeleteRoleAuthTpl',
                apiGetRoleActionAuthTplTree: 'apiGetRoleActionAuthTplTree',
                apiAddRoleActionAuthTpl: 'apiAddRoleActionAuthTpl'
            }),
            checkedChange: lodash.debounce(function () {
                if (this.isChangeAction) {
                    // 计算，如果勾选的是角色分组而不是角色，则不传递功能组id
                    this.actionIds = []
                    this.isChangeAction = false
                    this.getActionFromRoleActionTree(this.authRoleActions) // 遍历最后一层的功能有哪些，并存储在actionIds中
                    console.log(this.actionIds)
                    this.apiAddRoleActionAuthTpl({
                        params: {
                            roleTplId: this.currentClickItem.id,
                            pageActionIds: this.actionIds.toString()
                        },
                        callback: (data) => {}
                    })
                } else {
                    this.isChangeAction = true
                }
            }, 200),
            clickItem (obj) {
                this.currentClickItem = obj
                this.isChangeAction = false
                document.getElementById('roleAuthTplManage').querySelectorAll('.item-label').forEach(ele => {
                    if (obj.label === ele.innerText.trim()) {
                        ele.style.color = 'red'
                    } else {
                        ele.style.color = 'black'
                    }
                })
                if (this.currentClickItem.type === 'roleGroup') {
                    this.checkedIds = []
                    this.authRoleActions = []
                } else if (this.currentClickItem.type === 'role') {
                    this.apiGetRoleActionAuthTplTree({
                        params: {
                            roleTplId: this.currentClickItem.id
                        },
                        callback: (data) => {
                            console.log(data)
                            this.checkedIds = data.checkedIds
                            this.authRoleActions = data.treeNodes
                        }
                    })
                }
            },
            clickDelete () {
                if (this.currentClickItem.type === 'roleGroup') {
                    // 删除指定角色分组
                    this.apiDeleteRoleGroupAuthTpl({
                        params: {
                            tplId: this.currentClickItem.id
                        },
                        callback: () => {
                            this.refreshTable()
                        }
                    })
                } else if (this.currentClickItem.type === 'role') {
                    // 删除指定角色
                    this.apiDeleteRoleAuthTpl({
                        params: {
                            tplId: this.currentClickItem.id
                        },
                        callback: () => {
                            this.refreshTable()
                        }
                    })
                }
            },
            getActionFromRoleActionTree (arr) {
                arr.forEach(item => {
                    if (item.children) {
                        this.getActionFromRoleActionTree(item.children)
                    } else if (!item.children && item.type === 'action') {
                        this.checkedIds.forEach(id => {
                            if (id === item.id && this.actionIds.indexOf(item.id) === -1) {
                                this.actionIds.push(item.id)
                            }
                        })
                    }
                })
            },
            refreshTable () {
                this.apiGetRoleAuthTpl()
            }
        },
        created () {
        },
        beforeMount () {
            this.apiGetRoleAuthTpl()
        }
    }
</script>

<style>
    .set-font-color {
        color: #d9534f;
    }
</style>
