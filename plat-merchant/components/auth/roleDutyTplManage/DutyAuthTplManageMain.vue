<template>
    <div>
        <div class="row">
            <div class="col-md-10">
                <!--当点击tree时-->
                <div v-if="currentClickItem.name">
                    当前操作：<label>{{ currentClickItem.name }}&nbsp;&nbsp;&nbsp;</label>
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
                        <DutyAuthTplManageModify
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                            :refreshTable="refreshTable"
                            :currentClickItem="currentClickItem"></DutyAuthTplManageModify>
                    </ButtonWithModal>
                    <button class="btn btn-sm btn-default" style="margin-left: 10px;margin-right: 10px"
                            @click="clickDelete">删除
                    </button>
                </div>
            </div>
            <div class="col-md-2" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn-danger'],
                                btnStyle: { minWidth: 80 + 'px' },
                                btnName: '新增岗位'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '新增岗位'
                            }">
                    <DutyAuthTplManageAdd
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                        :refreshTable="refreshTable"></DutyAuthTplManageAdd>
                </ButtonWithModal>
            </div>
        </div>
        <fieldset id="pageActionManage" class="col-md-5" style="margin: 10px">
            <legend>岗位</legend>
            <div id="dutyAuthTplManage">
                <VueTree
                    :tree-data="getDutyAuthTpls"
                    :options="{
                        idsWithParent: false,
                        checkbox: false,
                        label:'name'
                    }"
                    @handle="clickItem">
                </VueTree>
            </div>
        </fieldset>
        <fieldset class="col-md-5" style="margin: 10px">
            <legend>绑定角色</legend>
            <div>
                <VueTree
                    v-model="checkedIds"
                    :tree-data="authDutyRoles"
                    :options="{
                        idsWithParent: false
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
    import DutyAuthTplManageAdd from '~/components/auth/roleDutyTplManage/DutyAuthTplManageAdd'
    import DutyAuthTplManageModify from '~/components/auth/roleDutyTplManage/DutyAuthTplManageModify'
    import uuid from 'uuid'
    import lodash from 'lodash'

    export default {
        props: ['passed'],
        components: {
            VueTree,
            ButtonWithModal,
            DutyAuthTplManageAdd,
            DutyAuthTplManageModify
        },
        data () {
            return {
                currentClickItem: {},
                checkedIds: [],
                isChangeAction: true, // 是否是切换岗位选项，如果是正在切换岗位选项，则清空checkedIds后不执行watch中的方法，否则执行watch中方法
                authDutyRoles: [],
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
            ...mapGetters('authTpl/dutyAuthTplManageAdd', {
                getDutyAuthTpls: 'getDutyAuthTpls'
            })
        },
        methods: {
            ...mapActions('authTpl/dutyAuthTplManageAdd', {
                apiGetDutyAuthTpl: 'apiGetDutyAuthTpl',
                apiDeleteDutyAuthTpl: 'apiDeleteDutyAuthTpl',
                apiGetRoleAuthTplTree: 'apiGetRoleAuthTplTree',
                apiAddRoleToAuth: 'apiAddRoleToAuth'
            }),
            checkedChange: lodash.debounce(function () {
                if (this.isChangeAction) {
                    // 计算，如果勾选的是角色分组而不是角色，则不传递功能组id
                    let ids = []
                    let actionIds = []
                    this.authDutyRoles.forEach(dutyRole => {
                        dutyRole.children && dutyRole.children.forEach(role => {
                            ids.push(role)
                        })
                    })
                    ids.forEach(item => {
                        if (this.checkedIds.length > 0) {
                            this.checkedIds.forEach(id => {
                                if (item.id === id && item.type === 'role') {
                                    actionIds.push(id)
                                }
                            })
                        }
                    })
                    this.apiAddRoleToAuth({
                        params: {
                            dutyTplId: this.currentClickItem.id,
                            roleTplIds: actionIds.toString()
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
                document.getElementById('dutyAuthTplManage').querySelectorAll('.item-label').forEach(ele => {
                    if (obj.name === ele.innerText.trim()) {
                        ele.style.color = 'red'
                    } else {
                        ele.style.color = 'black'
                    }
                })
                this.apiGetRoleAuthTplTree({
                    params: {
                        dutyTplId: this.currentClickItem.id
                    },
                    callback: (data) => {
                        this.checkedIds = data.checkedIds
                        this.authDutyRoles = data.treeNodes
                    }
                })
            },
            clickDelete () {
                this.apiDeleteDutyAuthTpl({
                    params: {
                        tplId: this.currentClickItem.id
                    },
                    callback: () => {
                        this.refreshTable()
                    }
                })
            },
            refreshTable () {
                this.apiGetDutyAuthTpl()
            }
        },
        created () {
        },
        beforeMount () {
            this.apiGetDutyAuthTpl()
        }
    }
</script>

<style>
    .set-font-color {
        color: #d9534f;
    }
</style>
