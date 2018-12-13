<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <label class="col-sm-2 control-label">编号</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" ref="code" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">名称</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" ref="name" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">地址</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" ref="address" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">联系人</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" ref="contact" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">联系方式</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" ref="phone" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">开户行</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" ref="bankName" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">银行账号</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" ref="bankAccount" placeholder="">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">税号</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" ref="taxNo" placeholder="">
            </div>
        </div>
        <div class="form-group" style="text-align: left">
            <label class="col-sm-2 control-label">状态</label>
            <div class="radio col-sm-9">
                <label>
                    <input type="radio" v-model="supplierEnable" name="supplierRadio" value="false"
                           :checked="!supplierEnable ? true : false">禁用
                </label><br/>
                <label style="margin-top: 6px">
                    <input type="radio" v-model="supplierEnable" name="supplierRadio" value="true"
                           :checked="supplierEnable ? true : false">启用
                </label>
            </div>
        </div>

        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModal('addModal')">关闭
            </button>
            <button type="button" class="btn btn-primary" @click="add('addModal')">保存</button>
        </div>
    </form>
</template>


<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapMutations, mapActions, mapGetters} from 'vuex'
    import baseUtil from '~/util/baseUtil'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'refreshTable'],
        data() {
            return {
                supplierEnable: true
            }
        },
        computed: {
            ...mapGetters('storage/warebaseinfo/supplierItemAdd', {})
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/supplierItemAdd', {
                addSupplier: 'addSupplier',
                resetSupplierItemAddInfo: 'resetSupplierItemAddInfo'
            }),
            ...mapActions('storage/warebaseinfo/supplierItemAdd', {
                addSupplier: 'addSupplier'
            }),
            closeModal(name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                // 刷新表格
                this.refreshTable()
            },
            add(name) {
                this.resetSupplierItemAddInfo({
                    merchantId: baseUtil.getMerchantId(),
                    code: this.$refs.code.value,
                    name: this.$refs.name.value,
                    contact: this.$refs.contact.value,
                    phone: this.$refs.phone.value,
                    // corpName: this.$refs.corpName.value,
                    taxNo: this.$refs.taxNo.value,
                    bankName: this.$refs.bankName.value,
                    bankAccount: this.$refs.bankAccount.value,
                    address: this.$refs.address.value,
                    enabled: this.supplierEnable
                })
                this.addSupplier(() => {
                    this.refreshTable();
                    ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name);
                    this.restoreStatus();
                })
            },
            restoreStatus() {
                console.log('restoreStatus');
                this.$refs.code.value = ''
                this.$refs.name.value = ''
                this.$refs.contact.value = ''
                this.$refs.phone.value = ''
                this.$refs.taxNo.value = ''
                this.$refs.bankName.value = ''
                this.$refs.bankAccount.value = ''
                this.$refs.address.value = ''
                this.supplierEnable = true;
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                console.log('CONST_CLICK_MODAL');
                this.restoreStatus();
            })
        }
    }
</script>

<style>
</style>
