<template>
    <div :id="'modalId'+CONST_CLICK_MODAL">
        <div class="modal-body">
            <LeaseDetailModalCopy :modalId="CONST_CLICK_MODAL" :params="params"></LeaseDetailModalCopy>
        </div>
        <div class="modal-footer" style="text-align: center">
            <button type="button" class="btn btn-w-m btn-info" @click="close">打印标签</button>
            <button type="button" class="btn btn-w-m btn-info" @click="passInspection">质检通过</button>
            <button type="button" class="btn btn-w-m btn-info" @click="rejectInspection">质检未通过</button>
            <button type="button" class="btn btn-w-m btn-info" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import LeaseDetailModalCopy from '~/components/LeaseDetailModalCopy'
    import {mapActions} from 'vuex';
    import {TableEvent} from '~/components/TableEvent'
    import uuid from 'uuid'

    export default {
        props: ['item', 'CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL', 'validateParams'],
        components: {
            LeaseDetailModalCopy
        },
        data() {
            return {
                params: {
                    PAGE_OPEN: uuid()
                },
                serial: ''
            }
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiLeasingInspection: 'apiLeasingInspection',
                apiGetDeliverDetailById: 'apiGetDeliverDetailById'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.refreshTable()
            },
            passInspection() {
                let vm = this;
                this.apiLeasingInspection({
                    callBack: () => {
                        ButtonWithModalEvent.$emit(vm.CONST_CLOSE_MODAL)
                        vm.refreshTable()
                    },
                    params: {
                        storageSerial: this.serial,
                        passed: true
                    }
                });
            },
            rejectInspection() {
                ButtonWithModalEvent.$emit(this.validateParams.CONST_CLICK_MODAL, {
                    storageSerial: this.serial,
                    passed: false
                })
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            }
        },
        mounted() {
            let vm = this;
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.apiGetDeliverDetailById({
                    params: {
                        recordId: vm.item.id
                    },
                    callBack(data) {
                        if (data) {
                            TableEvent.$emit(vm.params.PAGE_OPEN, data);
                            vm.serial = data.leaseStorage.storageView.storage.serial;
                        }
                    }
                })
            });
        }
    }
</script>

<style scoped>
    .fileBox {
        display: none;
    }

    fieldset {
        padding: 5px 0px 20px 20px;
    }

    ul {
        padding: 0;
        overflow: hidden;
    }

    li {
        list-style: none;
    }
</style>
