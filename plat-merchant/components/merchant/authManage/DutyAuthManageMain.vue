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
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'update',
                                titleName: '修改'
                            }">
                        <DutyAuthManageModify
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'update'"
                            :refreshTable="refreshTable"
                            :currentClickItem="currentClickItem"></DutyAuthManageModify>
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
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'addDuty',
                                titleName: '新增岗位'
                            }">
                    <DutyAuthManageAdd
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'addDuty'"
                        :refreshTable="refreshTable"></DutyAuthManageAdd>
                </ButtonWithModal>
            </div>
        </div>
        <fieldset id="pageActionManage" class="col-md-5" style="margin: 10px">
            <legend>岗位</legend>
            <div id="dutyAuthTplManage">
                <VueTree
                    :tree-data="getDutyAuths"
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
    import DutyAuthManageAdd from '~/components/merchant/authManage/DutyAuthManageAdd'
    import DutyAuthManageModify from '~/components/merchant/authManage/DutyAuthManageModify'
    import uuid from 'uuid'
    import lodash from 'lodash'

    export default {
        props: ['passed'],
        components: {
            VueTree,
            ButtonWithModal,
            DutyAuthManageAdd,
            DutyAuthManageModify
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
            ...mapGetters('merchant/dutyAuthManageAdd', {
                getDutyAuths: 'getDutyAuths'
            })
        },
        methods: {
            ...mapActions('merchant/dutyAuthManageAdd', {
                apiGetDutyAuth: 'apiGetDutyAuth',
                apiDeleteDutyAuth: 'apiDeleteDutyAuth',
                apiGetRoleAuthTree: 'apiGetRoleAuthTree',
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
                            dutyId: this.currentClickItem.id,
                            roleIds: actionIds.toString()
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
                this.apiGetRoleAuthTree({
                    params: {
                        dutyId: this.currentClickItem.id
                    },
                    callback: (data) => {
                        this.checkedIds = data.checkedIds
                        this.authDutyRoles = data.treeNodes
                    }
                })
            },
            clickDelete () {
                this.apiDeleteDutyAuth({
                    params: {
                        dutyId: this.currentClickItem.id
                    },
                    callback: () => {
                        this.refreshTable()
                    }
                })
            },
            refreshTable () {
                this.apiGetDutyAuth()
            }
        },
        created () {
        },
        beforeMount () {
            this.apiGetDutyAuth()
        }
    }
</script>

<style>
    .set-font-color {
        color: #d9534f;
    }
</style>
