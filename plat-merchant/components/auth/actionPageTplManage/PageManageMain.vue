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
                        <PageManageModify
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                            :refreshTable="refreshTable"
                            :currentClickItem="currentClickItem"></PageManageModify>
                    </ButtonWithModal>
                    <button class="btn btn-sm btn-default" style="margin-left: 10px;margin-right: 10px"
                            @click="clickDelete">删除
                    </button>
                    <ButtonWithModal
                        v-show="currentClickItem.type === 'pageGroup'"
                        :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '新增页面分组'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '新增页面分组'
                            }">
                        <PageManageAdd
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                            :refreshTable="refreshTable"
                            :currentClickItem="currentClickItem"></PageManageAdd>
                    </ButtonWithModal>
                    <ButtonWithModal
                        v-show="currentClickItem.type === 'page'"
                        :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '新增子页面'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '新增子页面'
                            }">
                        <PageManageAdd
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                            :refreshTable="refreshTable"
                            :currentClickItem="currentClickItem"></PageManageAdd>
                    </ButtonWithModal>
                </div>
            </div>
            <div class="col-md-2" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn-danger'],
                                btnStyle: { minWidth: 80 + 'px' },
                                btnName: '新增页面模块'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '新增页面模块'
                            }">
                    <PageManageAdd
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                        :refreshTable="refreshTable"></PageManageAdd>
                </ButtonWithModal>
            </div>
        </div>
        <fieldset id="pageActionManage" class="col-md-5" style="margin: 10px">
            <legend>页面</legend>
            <VueTree
                :tree-data="getAuthPageTree"
                :options="{
                        idsWithParent: false,
                        checkbox: false
                    }"
                @handle="clickItem">
            </VueTree>
        </fieldset>
        <fieldset class="col-md-5" style="margin: 10px">
            <legend>绑定功能</legend>
            <VueTree
                v-model="checkedIds"
                :tree-data="authPageActions"
                :options="{
                        idsWithParent: false
                    }">
            </VueTree>
        </fieldset>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import VueTree from 'vue-simple-tree/src/components/VueTree.vue'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import PageManageAdd from '~/components/auth/actionPageTplManage/PageManageAdd'
    import PageManageModify from '~/components/auth/actionPageTplManage/PageManageModify'
    import uuid from 'uuid'
    import lodash from 'lodash'

    export default {
        props: ['passed'],
        components: {
            VueTree,
            ButtonWithModal,
            PageManageAdd,
            PageManageModify
        },
        data () {
            return {
                currentClickItem: {},
                checkedIds: [],
                isChangeAction: true, // 是否是切换页面选项，如果是正在切换页面选项，则清空checkedIds后不执行watch中的方法，否则执行watch中方法
                authPageActions: [],
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
            ...mapGetters('auth', {
                getAuthPageTree: 'getAuthPageTree',
                getAuthPageAction: 'getAuthPageAction'
            })
        },
        methods: {
            ...mapActions('auth', {
                apiGetAuthPageTree: 'apiGetAuthPageTree',
                apiDeleteAuthPageGroup: 'apiDeleteAuthPageGroup',
                apiDeleteAuthPage: 'apiDeleteAuthPage',
                apiDeleteAuthTab: 'apiDeleteAuthTab',
                apiGetAuthPageAction: 'apiGetAuthPageAction',
                apiPostAuthPageAction: 'apiPostAuthPageAction'
            }),
            checkedChange: lodash.debounce(function () {
                if (this.isChangeAction) {
                    // 计算，如果勾选的功能权限是功能组而不是功能，则不传递功能组id
                    let ids = []
                    let actionIds = []
                    this.authPageActions.forEach(pageAction => {
                        pageAction.children && pageAction.children.forEach(action => {
                            ids.push(action)
                        })
                    })
                    ids.forEach(item => {
                        if (this.checkedIds.length > 0) {
                            this.checkedIds.forEach(id => {
                                if (item.id === id && item.type === 'action') {
                                    actionIds.push(id)
                                }
                            })
                        }
                    })
                    this.apiPostAuthPageAction({
                        params: {
                            pageId: this.currentClickItem.id,
                            actionIds: actionIds.toString()
                        },
                        callback: (data) => {}
                    })
                } else {
                    this.isChangeAction = true
                }
            }, 200),
            clickItem (obj) {
                console.log(this)
                this.currentClickItem = obj
                this.isChangeAction = false
                document.getElementById('pageManage').querySelectorAll('.item-label').forEach(ele => {
                    if (obj.label === ele.innerText.trim()) {
                        ele.style.color = 'red'
                    } else {
                        ele.style.color = 'black'
                    }
                })
                if (obj.type !== 'pageGroup') {
                    this.apiGetAuthPageAction({
                        params: {
                            pageId: this.currentClickItem.id
                        },
                        callback: (data) => {
                            this.checkedIds = data.checkedIds
                            this.authPageActions = data.treeNodes
                        }
                    })
                } else {
                    this.checkedIds = []
                    this.authPageActions = []
                }
            },
            clickDelete () {
                console.log(this.currentClickItem)
                if (this.currentClickItem.type === 'pageGroup') {
                    this.apiDeleteAuthPageGroup({
                        params: {
                            groupId: this.currentClickItem.id
                        },
                        callback: () => {
                            this.refreshTable()
                        }
                    })
                } else if (this.currentClickItem.type === 'page') {
                    this.apiDeleteAuthPage({
                        params: {
                            pageId: this.currentClickItem.id
                        },
                        callback: () => {
                            this.refreshTable()
                        }
                    })
                } else if (this.currentClickItem.type === 'tab') {
                    this.apiDeleteAuthTab({
                        params: {
                            tabId: this.currentClickItem.id
                        },
                        callback: () => {
                            this.refreshTable()
                        }
                    })
                }
            },
            refreshTable () {
                this.apiGetAuthPageTree()
            }
        },
        created () {
        },
        beforeMount () {
            this.apiGetAuthPageTree()
        }
    }
</script>

<style>
    .set-font-color {
        color: #d9534f;
    }
</style>
