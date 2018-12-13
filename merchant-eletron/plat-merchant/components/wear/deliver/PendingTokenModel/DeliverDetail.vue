<template>
    <div :id="'modalId'+modalId">
        <div class="modal-body">
            <LeaseDetailModalCopy :modalId="modalId" :params="params"></LeaseDetailModalCopy>
        </div>
        <div class="modal-footer footer_btn">
            <button type="button" class="btn btn-w-m btn-info" @click="inputExpressNo">输入快递单号</button>
            <button type="button" class="btn btn-w-m btn-info" @click="close">关闭</button>
            <button type="button" class="btn btn-w-m btn-info" @click="cancle">取消订单</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex';
    import uuid from 'uuid'
    import {TableEvent} from '~/components/TableEvent'
    import LeaseDetailModalCopy from '~/components/LeaseDetailModalCopy'

    export default {
        props: ['item', 'CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL', 'validateParams'],
        components: {
            LeaseDetailModalCopy
        },
        data() {
            return {
                modalId: uuid(),
                params: {
                    PAGE_OPEN: uuid()
                },
                deliverDetailItem: {
                    buyer: {
                        nickName: '',
                        telephone: ''
                    },
                    leaseRecord: {},
                    rxAddress: {}, // 收货地址
                    backShippingRecord: {},
                    leaseStorage: {
                        lease: {},
                        storageView: {
                            props: [],
                            storage: {}
                        }
                    }
                }
            }
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiGetDeliverDetailById: 'apiGetDeliverDetailById',
                apiLeaseRecordCancle: 'apiLeaseRecordCancle'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.refreshTable()
            },
            inputExpressNo() {
                ButtonWithModalEvent.$emit(this.validateParams.CONST_CLICK_MODAL, {
                    leaseRecordId: this.item.id,
                    storageSerial: this.item.serial,
                    refreshTable: this.refreshTable
                })
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            cancle() {
                this.apiLeaseRecordCancle({
                    params: {
                        leaseRecordId: this.id
                    },
                    callBack: () => {
                        this.refreshTable()
                    }
                });
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
                        }
                    }
                })
            });
        }
    }
</script>
