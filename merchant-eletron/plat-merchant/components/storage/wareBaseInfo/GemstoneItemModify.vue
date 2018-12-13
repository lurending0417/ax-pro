<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <label class="col-sm-2 control-label">编号</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" @change="resetCode" :value="params.code">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">名称</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" @change="resetName" :value="params.name">
            </div>
        </div>
        <div class="form-group" style="text-align: left">
            <label class="col-sm-2 control-label">状态</label>
            <div class="radio col-sm-9">
                <label>
                    <input type="radio" name="radios" :value="false" @change="resetEnabled" :checked="!gemstoneEnabled">
                    禁用
                </label><br/>
                <label style="margin-top: 6px">
                    <input type="radio" name="radios" :value="true" @change="resetEnabled" :checked="gemstoneEnabled">
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
                gemstoneEnabled: ''
            }
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/gemstoneItemModify', {
                resetInfo: 'resetInfo',
                resetGemId: 'resetGemId',
                resetCode: 'resetCode',
                resetName: 'resetName',
                resetLabelName: 'resetLabelName',
                resetEnabled: 'resetEnabled'
            }),
            ...mapActions('storage/warebaseinfo/gemstoneItemModify', {
                modifyGemstoneItem: 'modifyGemstoneItem'
            }),
            closeModal(name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                this.refreshTable()
            },
            modify(name) {
                this.modifyGemstoneItem(() => {
                    this.closeModal(name)
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.resetInfo(this.params)
                this.gemstoneEnabled = this.params.enabled === '启用'
                this.resetGemId(this.params.id)
            })
        }
    }
</script>

<style>
</style>
