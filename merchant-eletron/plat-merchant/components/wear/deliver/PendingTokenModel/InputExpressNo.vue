<template>
    <div>
        <div class="modal-body">
            <div class="form-group" style="display:flex; align-items: center;margin-top:15px;justify-content: center">
                <input type="text" class="form-control" style="width: 70%;" v-model="form.logisticsCode"
                       ref="expressNoInput">
            </div>
        </div>
        <div class="modal-footer" style="text-align: center">
            <button type="button" class="btn btn-w-m btn-info" @click="validate">确定</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex'

    export default {
        props: ['validateParams'],
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
            close() {
                ButtonWithModalEvent.$emit(this.validateParams.CONST_CLOSE_MODAL)
            },
            validate() {
                let vm = this;
                this.form.shipper = 'SF';
                this.form.noShipping = false;
                let temp = this.form.refreshTable;
                delete this.form.refreshTable;
                this.apiLeaseRecordOut({
                    params: this.form,
                    callBack() {
                        ButtonWithModalEvent.$emit(vm.validateParams.CONST_CLOSE_MODAL)
                        temp()
                    }
                });
            }
        },
        beforeMount() {
            let vm = this;
            ButtonWithModalEvent.$off(this.validateParams.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.validateParams.CONST_CLICK_MODAL, (obj) => {
                vm.form = obj
            });
        }
    }
</script>
