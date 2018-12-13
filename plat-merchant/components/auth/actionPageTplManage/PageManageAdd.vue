<template>
    <div>
        <form v-if="currentClickItem" class="form-horizontal" style="margin-top: 16px">
            <div v-if="currentClickItem.type === 'pageGroup'">
                <div class="form-group">
                    <label class="col-sm-3 control-label">页面编号</label>
                    <div class="col-sm-8">
                        <input v-model="code$" type="text" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">页面名称</label>
                    <div class="col-sm-8">
                        <input v-model="name$" type="text" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">页面URI</label>
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
            </div>
            <div v-else-if="currentClickItem.type === 'page'">
                <div class="form-group">
                    <label class="col-sm-3 control-label">选项卡编号</label>
                    <div class="col-sm-8">
                        <input v-model="code$" type="text" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">选项卡名称</label>
                    <div class="col-sm-8">
                        <input v-model="name$" type="text" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">选项卡别名</label>
                    <div class="col-sm-8">
                        <input v-model="alias$" type="text" class="form-control">
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
                <label class="col-sm-3 control-label">页面分组编号</label>
                <div class="col-sm-8">
                    <input v-model="code$" type="text" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">页面分组名称</label>
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
                uri$: '',
                alias$: ''
            }
        },
        computed: {},
        methods: {
            ...mapActions('auth', {
                apiAddAuthPageGroup: 'apiAddAuthPageGroup',
                apiAddAuthPage: 'apiAddAuthPage',
                apiAddAuthTab: 'apiAddAuthTab'
            }),
            closeModal (name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                this.refreshTable()
            },
            add () {
                console.log(this.currentClickItem)
                if (this.currentClickItem && this.currentClickItem.type === 'pageGroup') {
                    if (!this.name$ || !this.currentClickItem.id || !this.uri$) {
                        alert('页面分组ID、页面名称、页面URI 为必选项')
                        return
                    }
                    this.apiAddAuthPage({
                        params: {
                            groupId: this.currentClickItem.id,
                            code: this.code$,
                            name: this.name$,
                            enabled: this.enabled$,
                            uri: this.uri$
                        },
                        callback: () => {
                            this.closeModal()
                        }
                    })
                } else if (this.currentClickItem && this.currentClickItem.type === 'page') {
                    this.apiAddAuthTab({
                        params: {
                            pageId: this.currentClickItem.id,
                            code: this.code$,
                            name: this.name$,
                            alias: this.alias$,
                            enabled: this.enabled$
                        },
                        callback: () => {
                            this.closeModal()
                        }
                    })
                } else {
                    if (!this.name$) {
                        alert('页面分组名称 为必选项')
                        return
                    }
                    this.apiAddAuthPageGroup({
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
                this.uri$ = ''
            }
        },
        mounted () {
            this.initData()
            console.log(this.currentClickItem)
        }
    }
</script>

<style>
</style>
