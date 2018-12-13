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
                        <ResourceManageModify
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                            :refreshTable="refreshTable"
                            :currentClickItem="currentClickItem"></ResourceManageModify>
                    </ButtonWithModal>
                    <button class="btn btn-sm btn-default" style="margin-left: 10px;margin-right: 10px"
                            @click="clickDelete">删除
                    </button>
                    <ButtonWithModal
                        v-if="currentClickItem.type === 'actionGroup'"
                        :btnProps="{
                                btnClasses: ['btn btn-sm btn-default'],
                                btnName: '新增功能'
                            }"
                        :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '新增功能'
                            }">
                        <ResourceManageAdd
                            slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                            :refreshTable="refreshTable"
                            :currentClickItem="currentClickItem"></ResourceManageAdd>
                    </ButtonWithModal>
                </div>
            </div>
            <div class="col-md-2" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn-danger'],
                                btnStyle: { minWidth: 80 + 'px' },
                                btnName: '新增功能模块'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '新增功能模块'
                            }">
                    <ResourceManageAdd
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                        :refreshTable="refreshTable"></ResourceManageAdd>
                </ButtonWithModal>
            </div>
        </div>
        <div id="resourceManage">
            <VueTree
                v-model="checkedIds"
                :tree-data="getAuthActionTree"
                :options="{
                    idsWithParent: false
                }"
                @handle="clickItem">
            </VueTree>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import VueTree from 'vue-simple-tree/src/components/VueTree.vue'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import ResourceManageAdd from '~/components/auth/authManage/ResourceManageAdd'
    import ResourceManageModify from '~/components/auth/authManage/ResourceManageModify'
    import uuid from 'uuid'

    export default {
        props: ['passed'],
        components: {
            VueTree,
            ButtonWithModal,
            ResourceManageAdd,
            ResourceManageModify
        },
        data () {
            return {
                currentClickItem: {},
                checkedIds: [],
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid()
            }
        },
        computed: {
            ...mapGetters('auth', {
                getAuthActionTree: 'getAuthActionTree'
            })
        },
        watch: {},
        methods: {
            ...mapActions('auth', {
                apiGetAuthActionTree: 'apiGetAuthActionTree',
                apiDeleteAuthAction: 'apiDeleteAuthAction',
                apiDeleteAction: 'apiDeleteAction'
            }),
            clickItem (obj) {
                this.currentClickItem = obj
                document.getElementById('resourceManage').querySelectorAll('.item-label').forEach(ele => {
                    if (obj.label === ele.innerText.trim()) {
                        ele.style.color = 'red'
                    } else {
                        ele.style.color = 'black'
                    }
                })
            },
            clickDelete () {
                if (this.currentClickItem.type === 'actionGroup') {
                    this.apiDeleteAuthAction({
                        params: {
                            groupId: this.currentClickItem.id
                        },
                        callback: () => {
                            this.refreshTable()
                            this.currentClickItem = {}
                        }
                    })
                } else if (this.currentClickItem.type === 'action') {
                    this.apiDeleteAction({
                        params: {
                            actionId: this.currentClickItem.id
                        },
                        callback: () => {
                            this.refreshTable()
                            this.currentClickItem = {}
                        }
                    })
                }
            },
            refreshTable () {
                this.apiGetAuthActionTree({
                    params: {},
                    callback: () => {}
                })
            }
        },
        created () {
        },
        beforeMount () {
            this.apiGetAuthActionTree({
                params: {},
                callback: () => {}
            })
        }
    }
</script>

<style>
    .set-font-color {
        color: #d9534f;
    }
</style>
