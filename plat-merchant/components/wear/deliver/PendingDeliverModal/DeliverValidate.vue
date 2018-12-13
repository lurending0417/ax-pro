<template>
    <div>
        <div class="modal-body">
            <div class="form-group" style="display:flex; align-items: center;margin-top:15px;justify-content: center">
                <label class="control-label" style="margin-right:20px;">条码</label>
                <input type="text" class="form-control" style="width: 70%;" v-model="serial" ref="serialInput">
            </div>
        </div>
        <div class="modal-footer" style="text-align: center">
            <button type="button" class="btn btn-w-m btn-info" @click="validate">验证</button>
            <button type="button" class="btn btn-w-m btn-info" @click="close">取消</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex'

    export default {
        props: ['validateParams', 'chooseSendParams'],
        data() {
            return {
                serial: '',
                recordId: '',
                refreshTable: '',
                rxAddressId: '',
                leaseRecordId: '',
                storageSerial: '',
                detailParams: '' // 返回DeliverDetail页面的参数
            }
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiDeliverValidateSerial: 'apiDeliverValidateSerial'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.validateParams.CONST_CLOSE_MODAL)
                ButtonWithModalEvent.$emit(this.detailParams)
            },
            validate() {
                let vm = this;
                console.log('vm.recordId', vm.recordId);
                this.apiDeliverValidateSerial({
                    params: {
                        serial: vm.serial,
                        recordId: vm.recordId
                    },
                    callBack(result) {
                        if (result) {
                            ButtonWithModalEvent.$emit(vm.chooseSendParams.CONST_CLICK_MODAL, {
                                serial: vm.serial,
                                refreshTable: vm.refreshTable,
                                rxAddressId: vm.rxAddressId,
                                recordId: vm.recordId
                            })
                            ButtonWithModalEvent.$emit(vm.validateParams.CONST_CLOSE_MODAL)
                        } else {
                            alert('货品条码与订单不一致，请检查后重新验证。')
                            vm.serial = '';
                            vm.$refs.serialInput.focus()
                        }
                    }
                });
                // alert('货品条码与订单一致，可正常发货。')
                // alert('货品条码与订单不一致，请检查后重新验证。')
                // ButtonWithModalEvent.$emit(this.chooseSendParams.CONST_CLICK_MODAL, '在验证页面触发')
                // ButtonWithModalEvent.$emit(this.validateParams.CONST_CLOSE_MODAL)
            }
        },
        beforeMount() {
            let vm = this;
            ButtonWithModalEvent.$on(this.validateParams.CONST_CLICK_MODAL, (obj) => {
                this.serial = ''
                vm.detailParams = obj.detailParams;
                vm.recordId = obj.recordId;
                vm.refreshTable = obj.refreshTable;
                vm.rxAddressId = obj.rxAddressId;
            });
        }
    }
</script>
