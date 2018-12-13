<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <label class="col-sm-2 control-label">编号</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.code">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">名称</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.name">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">类型</label>
            <div class="col-sm-9 categoryRadio">
                <label>
                    <input type="radio" name="styles" :value="'INPUT'" v-model="form.inputType">文本框&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <label>
                    <input type="radio" name="styles" :value="'RADIO'" v-model="form.inputType">单选框&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <label>
                    <input type="radio" name="styles" :value="'CHECKBOX'" v-model="form.inputType">复选框&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">预设</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.preValues">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">必填字段</label>
            <div class="col-sm-9 categoryRadio">
                <label>
                    <input type="radio" name="required" :value="true" v-model="form.required">必填&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <label>
                    <input type="radio" name="required" :value="false" v-model="form.required">非必填&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">状态</label>
            <div class="col-sm-9 categoryRadio">
                <label>
                    <input type="radio" name="enabled" :value="true" v-model="form.enabled">启用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <label>
                    <input type="radio" name="enabled" :value="false" v-model="form.enabled">禁用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
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
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapMutations, mapActions, mapGetters} from 'vuex'
    import uuid from 'uuid'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL_1', 'refreshTable', 'params', 'from'],
        data() {
            return {
                form: {
                    type: '',
                    targetId: '',
                    code: '',
                    name: '',
                    inputType: '',
                    preValues: '',
                    required: '',
                    enabled: ''
                },
                CONST_RESTORE: uuid()
            }
        },
        computed: {
            ...mapGetters('storage/warebaseinfo/paramsAdd', {})
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/paramsAdd', {
                resetType: 'resetType',
                resetTargetId: 'resetTargetId',
                resetCode: 'resetCode',
                resetName: 'resetName',
                resetInputType: 'resetInputType',
                resetPreValues: 'resetPreValues',
                resetRequired: 'resetRequired',
                resetEnabled: 'resetEnabled'
            }),
            ...mapActions('storage/warebaseinfo/paramsAdd', {
                addParams: 'addParams'
            }),
            closeModal(name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                this.refreshTable()
            },
            add() {
                if (this.from === '品类') {
                    this.form.type = 'CATEGORY';
                } else if (this.from === '宝石') {
                    this.form.type = 'GEM';
                } else if (this.from === '金属') {
                    this.form.type = 'METAL';
                }
                this.form.targetId = this.params.id
                this.addParams({
                    params: this.form,
                    callback: () => {
                        ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                        this.refreshTable()
                    }
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL_1)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL_1, () => {
                this.form = {
                    type: '',
                    targetId: '',
                    code: '',
                    name: '',
                    inputType: '',
                    preValues: '',
                    required: '',
                    enabled: true
                }
            })
        }
    }
</script>

<style>
    .categoryRadio {
        text-align: left;
    }
</style>
