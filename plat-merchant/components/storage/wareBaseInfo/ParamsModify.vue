<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <label class="col-sm-2 control-label">编号</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" @change="changeCode" :value="params.code">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">名称</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" @change="changeName" :value="params.name">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">类型</label>
            <div class="col-sm-9 categoryRadio">
                <label>
                    <input type="radio" name="styles" :value="'INPUT'"
                           :checked="(params.inputType === '文本框') && true" @change="changeInputType">文本框&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <label>
                    <input type="radio" name="styles" :value="'RADIO'"
                           :checked="(params.inputType === '单选框') && true" @change="changeInputType">单选框&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <label>
                    <input type="radio" name="styles" :value="'CHECKBOX'"
                           :checked="(params.inputType === '复选框') && true" @change="changeInputType">复选框&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">预设</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" @change="changePreValues" :value="params.preValues">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">必填字段</label>
            <div class="col-sm-9 categoryRadio">
                <label>
                    <input type="radio" name="required" :value="true" :checked="(params.required === '必填') && true"
                           @change="changeRequired">必填&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <label>
                    <input type="radio" name="required" :value="false" :checked="(params.required === '非必填') && true"
                           @change="changeRequired">非必填&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">状态</label>
            <div class="col-sm-9 categoryRadio">
                <label>
                    <input type="radio" name="enabled" :value="true" :checked="(params.enabled === '启用') && true"
                           @change="changeEnabled">启用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <label>
                    <input type="radio" name="enabled" :value="false" :checked="(params.enabled === '禁用') && true"
                           @change="changeEnabled">禁用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
            </div>
        </div>

        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="modify('addModal')">确定</button>
        </div>
    </form>
</template>


<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapMutations, mapActions, mapGetters, mapState} from 'vuex'
    import uuid from 'uuid'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'refreshTable', 'params'],
        data() {
            return {
                CONST_RESTORE: uuid()
            }
        },
        computed: {
            ...mapState('storage/warebaseinfo/paramsModify', {
                state: 'state'
            }),
            ...mapGetters('storage/warebaseinfo/paramsModify', {})
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/paramsModify', {
                resetFieldId: 'resetFieldId',
                resetCode: 'resetCode',
                resetName: 'resetName',
                resetInputType: 'resetInputType',
                resetPreValues: 'resetPreValues',
                resetRequired: 'resetRequired',
                resetEnabled: 'resetEnabled'
            }),
            ...mapActions('storage/warebaseinfo/paramsModify', {
                modifyParams: 'modifyParams'
            }),
            changeCode(event) {
                this.resetCode(event.target.value)
            },
            changeName(event) {
                this.resetName(event.target.value)
            },
            changeInputType(event) {
                this.resetInputType(event.target.value)
            },
            changePreValues(event) {
                this.resetPreValues(event.target.value)
            },
            changeRequired(event) {
                this.resetRequired(event.target.value)
            },
            changeEnabled(event) {
                this.resetEnabled(event.target.value)
            },
            closeModal(name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                this.refreshTable()
            },
            modify() {
                this.modifyParams(() => {
                    ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                    this.refreshTable()
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.resetFieldId(this.params.id)
                this.resetCode(this.params.code)
                this.resetName(this.params.name)
                this.resetInputType(this.params.inputType)
                this.resetPreValues(this.params.preValues)
                this.resetRequired(this.params.required)
                this.resetEnabled(this.params.enabled)
            })
        }
    }
</script>

<style>
    .categoryRadio {
        text-align: left;
    }
</style>
