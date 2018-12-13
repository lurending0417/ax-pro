<template>
    <div>
        <form class="form-horizontal" style="margin-top: 16px">
            <div class="form-group">
                <label class="col-sm-3 control-label">模板编号</label>
                <div class="col-sm-8">
                    <input v-model="code$" type="text" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">模板名称</label>
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
    import { mapActions } from 'vuex'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'

    export default {
        props: ['CONST_CLOSE_MODAL', 'refreshTable', 'currentClickItem'],
        data () {
            return {
                code$: '',
                name$: '',
                enabled$: '',
                alias$: '',
                method$: '',
                uri$: ''
            }
        },
        computed: {},
        methods: {
            ...mapActions('merchant/roleAuthTplManageAdd', {
                apiAddRoleGroupAuthTpl: 'apiAddRoleGroupAuthTpl',
                apiGetOneRoleGroupAuthTpl: 'apiGetOneRoleGroupAuthTpl',
                apiModifyRoleGroupAuthTpl: 'apiModifyRoleGroupAuthTpl',
                apiDeleteRoleGroupAuthTpl: 'apiDeleteRoleGroupAuthTpl',
                apiAddRoleAuthTpl: 'apiAddRoleAuthTpl'
            }),
            closeModal (name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                this.refreshTable()
            },
            add () {
                if (!this.name$) {
                    alert('模板名称 为必填项')
                    return
                }
                if (this.currentClickItem) {
                    // 新增角色
                    this.apiAddRoleAuthTpl({
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
                    this.apiAddRoleGroupAuthTpl({
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
            initData () {
                this.code$ = ''
                this.name$ = ''
                this.enabled$ = ''
                this.alias$ = ''
                this.method$ = ''
                this.uri$ = ''
            }
        },
        mounted () {
            this.initData()
        }
    }
</script>

<style>
</style>
