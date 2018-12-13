<template>
    <div>
        <form class="form-horizontal" style="margin-top: 16px">
            <div class="form-group">
                <label class="col-sm-3 control-label">{{labels.num}}</label>
                <div class="col-sm-8">
                    <input v-model="code$" type="text" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">{{labels.name}}</label>
                <div class="col-sm-8">
                    <input v-model="name$" type="text" class="form-control">
                </div>
            </div>
            <div class="form-group" style="text-align: left">
                <div class="form-inline">
                    <label class="col-sm-3 control-label">启用状态</label>
                    <div class="col-sm-8">
                        <select v-model="enabled$" class="form-control">
                            <option value=""></option>
                            <option value="true">启用</option>
                            <option value="false">禁用</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <slot name="btn"></slot>
                <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModal('addModal')">关闭
                </button>
                <button type="button" class="btn btn-primary" @click="add('addModal')">确定</button>
            </div>
        </form>
    </div>
</template>


<script>
    import {mapActions} from 'vuex'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'refreshTable', 'currentClickItem'],
        data() {
            return {
                code$: '',
                name$: '',
                enabled$: '',
                alias$: '',
                method$: '',
                uri$: ''
            }
        },
        computed: {
            labels() {
                let labelObj = {
                    num: '角色分组编号',
                    name: '角色分组名称'
                }
                if (this.currentClickItem) {
                    labelObj = {
                        num: '角色编号',
                        name: '角色名称'
                    }
                }
                return labelObj
            }
        },
        methods: {
            ...mapActions('merchant/roleAuthManageAdd', {
                apiAddRoleGroupAuth: 'apiAddRoleGroupAuth',
                apiAddRoleAuth: 'apiAddRoleAuth'
            }),
            closeModal(name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                this.refreshTable()
            },
            add() {
                if (!this.name$) {
                    alert('名称 为必填项')
                    return
                }
                if (this.currentClickItem) {
                    // 新增角色
                    this.apiAddRoleAuth({
                        params: {
                            groupId: this.currentClickItem.id,
                            code: this.code$,
                            name: this.name$,
                            enabled: this.enabled$
                        },
                        callback: () => {
                            this.closeModal()
                        }
                    })
                } else {
                    // 新增角色分组
                    this.apiAddRoleGroupAuth({
                        params: {
                            code: this.code$,
                            name: this.name$,
                            enabled: this.enabled$
                        },
                        callback: () => {
                            this.closeModal()
                        }
                    })
                }
            },
            initData() {
                this.code$ = ''
                this.name$ = ''
                this.enabled$ = ''
                this.alias$ = ''
                this.method$ = ''
                this.uri$ = ''
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.initData()
            })
        }
    }
</script>

<style>
</style>
