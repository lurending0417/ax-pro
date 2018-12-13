<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <label class="col-sm-2 control-label">编号</label>
            <div class="col-sm-9">
                <input type="text" ref="code" class="form-control" v-model="form.code">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">名称</label>
            <div class="col-sm-9">
                <input type="text" ref="name" class="form-control" v-model="form.name">
            </div>
        </div>
        <div class="form-group" style="text-align: left">
            <label class="col-sm-2 control-label">状态</label>
            <div class="radio col-sm-9">
                <label>
                    <input type="radio" value="false" name="genstoneRadio" v-model="form.enabled">禁用
                </label><br/>
                <label style="margin-top: 6px">
                    <input type="radio" value="true" name="genstoneRadio" v-model="form.enabled">启用
                </label>
            </div>
        </div>

        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="add('addModal')">确定</button>
        </div>
    </form>
</template>


<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex'
    import uuid from 'uuid'

    export default {
        props: ['CONST_CLOSE_MODAL', 'refreshTable', 'params', 'CONST_CLICK_MODAL'],
        data() {
            return {
                form: {
                    code: '',
                    name: '',
                    labelName: '',
                    enabled: true
                },
                CONST_RESTORE: uuid()
            }
        },
        methods: {
            ...mapActions('storage/warebaseinfo/gemstoneItemAdd', {
                addGemstoneItem: 'addGemstoneItem'
            }),
            add() {
                this.addGemstoneItem({
                    params: this.form,
                    callback: () => {
                        this.closeModal()
                    }
                })
            },
            closeModal() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.refreshTable()
            },
            initData() {
                this.form = {
                    code: '',
                    name: '',
                    labelName: '',
                    enabled: true
                }
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
    .categoryRadio {
        text-align: left;
    }
</style>
