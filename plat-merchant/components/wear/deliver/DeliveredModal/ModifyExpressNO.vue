<template>
    <div>
        <div class="modal-body">
            <div class="form-group" style="display:flex; align-items: center;margin-top:15px;justify-content: center">
                <input type="text" class="form-control" style="width: 70%;" v-model="form.logisticsCode"
                       ref="expressNoInput">
            </div>
        </div>
        <div class="modal-footer" style="text-align: center">
            <button type="button" class="btn btn-w-m btn-info" @click="asure">确定</button>
            <button type="button" class="btn btn-w-m btn-info" @click="cancle">取消</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex'

    export default {
        props: ['modifyParams'],
        data() {
            return {
                form: {
                    logisticsCode: '',
                    leaseRecordId: '',
                    refreshTable: '',
                    storageSerial: ''
                }
            }
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiLeaseRecordOut: 'apiLeaseRecordOut'
            }),
            cancle() {
                ButtonWithModalEvent.$emit(this.modifyParams.CONST_CLOSE_MODAL)
            },
            asure() {
                let vm = this;
                this.form.shipper = 'SF';
                this.form.noShipping = false;
                let temp = this.form.refreshTable;
                delete this.form.refreshTable;
                this.apiLeaseRecordOut({
                    params: this.form,
                    callBack() {
                        ButtonWithModalEvent.$emit(vm.modifyParams.CONST_CLOSE_MODAL)
                        temp()
                    }
                });
            }
        },
        beforeMount() {
            let vm = this;
            ButtonWithModalEvent.$off(this.modifyParams.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.modifyParams.CONST_CLICK_MODAL, (obj) => {
                vm.form = obj
            });
        }
    }
</script>
