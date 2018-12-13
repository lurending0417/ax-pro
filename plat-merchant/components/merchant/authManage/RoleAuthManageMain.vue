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
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'update',
                                titleName: '修改'
                            }">
                        <RoleAuthManageModify
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'update'"
                            :refreshTable="refreshTable"
                            :currentClickItem="currentClickItem">
                        </RoleAuthManageModify>
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
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'addRole',
                                titleName: '新增角色'
                            }">
                        <RoleAuthManageAdd
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'addRole'"
                            :refreshTable="refreshTable"
                            :currentClickItem="currentClickItem"></RoleAuthManageAdd>
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
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'addRoleGroup',
                                titleName: '新增角色分组'
                            }">
                    <RoleAuthManageAdd
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'addRoleGroup'"
                        :refreshTable="refreshTable"></RoleAuthManageAdd>
                </ButtonWithModal>
            </div>
        </div>
        <fieldset class="col-md-5" style="margin: 10px">
            <legend>角色</legend>
            <div id="roleAuthTplManage">
                <VueTree
                    :tree-data="getRoleAuths"
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
                        idsWithParent: true,
                        checkedOpen: true,
                        depthOpen: 4
                    }">
                </VueTree>
            </div>
        </fieldset>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import VueTree from 'vue-simple-tree/src/components/VueTree.vue'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import RoleAuthManageAdd from '~/components/merchant/authManage/RoleAuthManageAdd'
    import RoleAuthManageModify from '~/components/merchant/authManage/RoleAuthManageModify'
    import uuid from 'uuid'
    import lodash from 'lodash'

    export default {
        props: ['passed'],
        components: {
            VueTree,
            ButtonWithModal,
            RoleAuthManageAdd,
            RoleAuthManageModify
        },
        data () {
            return {
                currentClickItem: {},
                checkedIds: [],
                actionIds: [],
                isTrrigerWatch: false, // 是否触发监听函数
                authRoleActions: [],
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid()
            }
        },
        watch: {
            checkedIds (val) {
                if (this.isTrrigerWatch) {
                    console.log('执行');
                    this.checkedChange()
                } else {
                    this.isTrrigerWatch = true
                }
            }
        },
        computed: {
            ...mapGetters('merchant/roleAuthManageAdd', {
                getRoleAuths: 'getRoleAuths'
            })
        },
        methods: {
            ...mapActions('merchant/roleAuthManageAdd', {
                apiGetRoleAuth: 'apiGetRoleAuth',
                apiDeleteRoleGroupAuth: 'apiDeleteRoleGroupAuth',
                apiDeleteRoleAuth: 'apiDeleteRoleAuth',
                apiGetRoleActionAuthTree: 'apiGetRoleActionAuthTree',
                apiAddRoleActionAuth: 'apiAddRoleActionAuth'
            }),
            checkedChange: lodash.debounce(function () {
                this.actionIds = []
                this.getActionFromRoleActionTree(this.authRoleActions) // 遍历最后一层的功能有哪些，并存储在actionIds中
                console.log('this.actionIds', this.actionIds)
                this.apiAddRoleActionAuth({
                    params: {
                        roleId: this.currentClickItem.id,
                        pageActionIds: this.actionIds.toString()
                    },
                    callback: (data) => {}
                })
            }, 200),
            clickItem (obj) {
                console.log('点击左侧');
                console.log(obj.type);
                this.currentClickItem = obj
                document.getElementById('roleAuthTplManage').querySelectorAll('.item-label').forEach(ele => {
                    if (obj.label === ele.innerText.trim()) {
                        ele.style.color = 'red'
                    } else {
                        ele.style.color = 'black'
                    }
                })
                console.log(this.currentClickItem.type)
                if (this.currentClickItem.type === 'roleGroup') {
                    this.isTrrigerWatch = false
                    this.checkedIds = []
                    this.authRoleActions = []
                } else if (this.currentClickItem.type === 'role') {
                    this.authRoleActions = []
                    this.apiGetRoleActionAuthTree({
                        params: {
                            roleId: this.currentClickItem.id
                        },
                        callback: (data) => {
                            console.log(data)
                            this.isTrrigerWatch = false
                            this.checkedIds = data.checkedIds
                            this.authRoleActions = data.treeNodes
                        }
                    })
                }
            },
            clickDelete () {
                if (this.currentClickItem.type === 'roleGroup') {
                    // 删除指定角色分组
                    this.apiDeleteRoleGroupAuth({
                        params: {
                            groupId: this.currentClickItem.id
                        },
                        callback: () => {
                            this.refreshTable()
                        }
                    })
                } else if (this.currentClickItem.type === 'role') {
                    // 删除指定角色
                    this.apiDeleteRoleAuth({
                        params: {
                            roleId: this.currentClickItem.id
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
                this.apiGetRoleAuth()
            }
        },
        created () {
        },
        beforeMount () {
            this.apiGetRoleAuth()
        }
    }
</script>

<style>
    .set-font-color {
        color: #d9534f;
    }
</style>
