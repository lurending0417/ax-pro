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
        <div class="form-group" style="text-align: left">
            <label class="col-sm-2 control-label">状态</label>
            <div class="radio col-sm-9">
                <label>
                    <input type="radio" name="radios" :value="false" @change="changeEnabled" :checked="!craftEnable">
                    禁用
                </label><br/>
                <label style="margin-top: 6px">
                    <input type="radio" name="radios" :value="true" @change="changeEnabled" :checked="craftEnable">
                    启用
                </label>
            </div>
        </div>

        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="modify()">确定</button>
        </div>
    </form>
</template>


<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapMutations, mapActions} from 'vuex'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'params', 'refreshTable'],
        data() {
            return {
                craftEnable: ''
            }
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/craftItemModify', {
                resetInfo: 'resetInfo',
                resetLabelName: 'resetLabelName',
                resetCraftId: 'resetCraftId',
                resetCode: 'resetCode',
                resetName: 'resetName',
                resetEnabled: 'resetEnabled'
            }),
            ...mapActions('storage/warebaseinfo/craftItemModify', {
                modifyCraftItem: 'modifyCraftItem'
            }),
            initResetInfo(obj) {
                this.resetInfo(obj)
            },
            changeCode(event) {
                this.resetCode(event.target.value)
            },
            changeName(event) {
                this.resetName(event.target.value)
            },
            changeLabelName(event) {
                this.resetLabelName(event.target.value)
            },
            changeEnabled(event) {
                this.resetEnabled(event.target.value)
            },
            closeModal(name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                // 刷新表格
                this.refreshTable()
            },
            modify() {
                this.modifyCraftItem(() => {
                    this.refreshTable()
                })
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.craftEnable = this.params.enabled === '启用'
                this.initResetInfo(this.params)
            })
        }
    }
</script>

<style>
</style>
