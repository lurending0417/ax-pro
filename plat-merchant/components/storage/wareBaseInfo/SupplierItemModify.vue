<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <label class="col-sm-2 control-label">编号</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.code" ref="code" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">名称</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.name" ref="name" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">地址</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.address" ref="address" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">联系人</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.contact" ref="contact" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">联系方式</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.phone" ref="phone" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">开户行</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.bankName" ref="bankName" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">银行账号</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.bankAccount" ref="bankAccount" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">税号</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" v-model="form.taxNo" ref="taxNo" placeholder="">
            </div>
        </div>
        <div class="form-group" style="text-align: left">
            <label class="col-sm-2 control-label">状态</label>
            <div class="radio col-sm-9">
                <label>
                    <input type="radio" v-model="form.enabled" name="radioName" :value="false"
                           :checked="form.enabled">
                    禁用
                </label><br/>
                <label style="margin-top: 6px">
                    <input type="radio" v-model="form.enabled" name="radioName" :value="true"
                           :checked="form.enabled">
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
    import {mapActions} from 'vuex'
    import {objectUtil} from '~/util';

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'params', 'refreshTable'],
        data() {
            return {
                form: {
                    vendorId: '',
                    name: '',
                    code: '',
                    contact: '',
                    phone: '',
                    corpName: '',
                    taxNo: '',
                    bankName: '',
                    bankAccount: '',
                    address: '',
                    enabled: true
                }
            }
        },
        methods: {
            ...mapActions('storage/warebaseinfo/supplierItemModify', {
                modifySupplier: 'modifySupplier'
            }),
            closeModal(name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                // 刷新表格
                this.refreshTable()
            },
            modify(name) {
                let vm = this;
                this.modifySupplier({
                    sendParams: this.form,
                    callBack: () => {
                        vm.refreshTable()
                        ButtonWithModalEvent.$emit(vm.CONST_CLOSE_MODAL, name)
                    }
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.form = objectUtil.replaceSameFieldsValue_1(this.params, this.form);
                this.form.enabled = this.params.enabled === '启用';
                this.form.vendorId = this.params.id;
            })
        }
    }
</script>

<style>
</style>
