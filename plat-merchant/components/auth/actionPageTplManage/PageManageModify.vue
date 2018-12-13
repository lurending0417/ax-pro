<template>
    <form v-if="currentClickItem.type === 'pageGroup'" class="form-horizontal" style="margin-top: 16px">
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
            <button type="button" class="btn btn-primary" @click="clickModify">修改</button>
        </div>
    </form>


    <form v-else-if="currentClickItem.type === 'page'" class="form-horizontal" style="margin-top: 16px">
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

        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModal('addModal')">关闭
            </button>
            <button type="button" class="btn btn-primary" @click="clickModify">确定</button>
        </div>
    </form>

    <form v-else-if="currentClickItem.type === 'tab'" class="form-horizontal" style="margin-top: 16px">
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

        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModal('addModal')">关闭
            </button>
            <button type="button" class="btn btn-primary" @click="clickModify">确定</button>
        </div>
    </form>
</template>


<script>
    import { mapActions } from 'vuex'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'refreshTable', 'currentClickItem'],
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
                apiGetAuthPageGroup: 'apiGetAuthPageGroup',
                apiModifyAuthPageGroup: 'apiModifyAuthPageGroup',
                apiGetAuthPage: 'apiGetAuthPage',
                apiModifyAuthPage: 'apiModifyAuthPage',
                apiGetAuthTab: 'apiGetAuthTab',
                apiModifyAuthTab: 'apiModifyAuthTab'
            }),
            closeModal (name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                this.refreshTable()
            },
            clickModify () {
                if (this.currentClickItem.type === 'pageGroup') {
                    this.apiModifyAuthPageGroup({
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
                } else if (this.currentClickItem.type === 'page') {
                    this.apiModifyAuthPage({
                        params: {
                            pageId: this.currentClickItem.id,
                            code: this.code$,
                            name: this.name$,
                            uri: this.uri$,
                            enabled: this.enabled$
                        },
                        callback: () => {
                            this.closeModal()
                        }
                    })
                } else if (this.currentClickItem.type === 'tab') {
                    this.apiModifyAuthTab({
                        params: {
                            tabId: this.currentClickItem.id,
                            code: this.code$,
                            name: this.name$,
                            alias: this.alias$,
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
                this.uri$ = ''
            }
        },
        mounted () {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.initData()
                if (this.currentClickItem.type === 'pageGroup') {
                    this.apiGetAuthPageGroup({
                        params: {
                            groupId: this.currentClickItem.id
                        },
                        callback: (data) => {
                            console.log(data)
                            this.code$ = data.code
                            this.name$ = data.name
                            this.enabled$ = data.enabled
                        }
                    })
                } else if (this.currentClickItem.type === 'page') {
                    this.apiGetAuthPage({
                        params: {
                            pageId: this.currentClickItem.id
                        },
                        callback: (data) => {
                            console.log(data)
                            this.code$ = data.code
                            this.name$ = data.name
                            this.enabled$ = data.enabled
                            this.uri$ = data.uri
                        }
                    })
                } else if (this.currentClickItem.type === 'tab') {
                    this.apiGetAuthTab({
                        params: {
                            tabId: this.currentClickItem.id
                        },
                        callback: (data) => {
                            console.log(data)
                            this.code$ = data.code
                            this.name$ = data.name
                            this.enabled$ = data.enabled
                            this.alias$ = data.alias
                        }
                    })
                }
            })
        }
    }
</script>

<style>
</style>
