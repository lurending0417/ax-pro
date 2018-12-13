<template>
    <form v-if="currentClickItem" class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <label class="col-sm-3 control-label">功能编号</label>
            <div class="col-sm-8">
                <input v-model="code$" type="text" class="form-control">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">功能名称</label>
            <div class="col-sm-8">
                <input v-model="name$" type="text" class="form-control">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">功能别名</label>
            <div class="col-sm-8">
                <input v-model="alias$" type="text" class="form-control">
            </div>
        </div>
        <div class="form-group">
            <div class="form-inline">
                <label class="col-sm-3 control-label">功能HTTP请求方法</label>
                <div class="col-sm-8">
                    <select v-model="method$" class="form-control">
                        <option value="GET">GET</option>
                        <option value="HEAD">HEAD</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="PATCH">PATCH</option>
                        <option value="DELETE">DELETE</option>
                        <option value="OPTIONS">OPTIONS</option>
                        <option value="TRACE">TRACE</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">功能对应的URI</label>
            <div class="col-sm-8">
                <input v-model="uri$" type="text" class="form-control">
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


    <form v-else class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <label class="col-sm-3 control-label">功能编号</label>
            <div class="col-sm-8">
                <input v-model="code$" type="text" class="form-control">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label">功能名称</label>
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
            ...mapActions('auth', {
                apiAddAuthAction: 'apiAddAuthAction',
                apiAddAction: 'apiAddAction'
            }),
            closeModal (name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                this.refreshTable()
            },
            add () {
                if (this.currentClickItem) {
                    if (!this.name$ || !this.currentClickItem.id || !this.method$ || !this.uri$) {
                        alert('功能分组名称、所属功能分组ID、功能HTTP请求方法、功能对应的URI 为必选项')
                        return
                    }
                    this.apiAddAction({
                        params: {
                            groupId: this.currentClickItem.id,
                            code: this.code$,
                            name: this.name$,
                            enabled: this.enabled$,
                            alias: this.alias$,
                            method: this.method$,
                            uri: this.uri$
                        },
                        callback: () => {
                            this.closeModal()
                        }
                    })
                } else {
                    if (!this.name$) {
                        alert('功能分组名称 为必选项')
                        return
                    }
                    this.apiAddAuthAction({
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
