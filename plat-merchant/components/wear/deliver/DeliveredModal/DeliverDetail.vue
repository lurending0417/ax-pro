<template>
    <div :id="'modalId'+modalId">
        <div class="modal-body">
            <LeaseDetailModalCopy :modalId="modalId" :params="params"></LeaseDetailModalCopy>
        </div>
        <div class="modal-footer footer_btn">
            <button type="button" class="btn btn-w-m btn-info" @click="print">打印快递信息</button>
            <!--<button type="button" class="btn btn-w-m btn-info" @click="viewShip">查看物流</button>-->
            <button type="button" class="btn btn-w-m btn-info" @click="cancle">用户拒收</button>
            <button type="button" class="btn btn-w-m btn-info" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {TableEvent} from '~/components/TableEvent'
    import LeaseDetailModalCopy from '~/components/LeaseDetailModalCopy'
    import {mapActions} from 'vuex';
    import uuid from 'uuid'

    export default {
        components: {
            LeaseDetailModalCopy
        },
        props: ['item', 'CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL', 'viewShilpParams', 'modifyParams'],
        data() {
            return {
                modalId: uuid(),
                params: {
                    PAGE_OPEN: uuid()
                },
                traceRecords: [],
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
                },
                PAGE_OPEN: uuid()
            }
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiGetDeliverDetailById: 'apiGetDeliverDetailById',
                apiLeaseRecordCancle: 'apiLeaseRecordCancle'
            }),
            viewShip() {
                ButtonWithModalEvent.$emit(this.viewShilpParams.CONST_CLICK_MODAL, this.traceRecords);
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.refreshTable()
            },
            print() {
                console.log('打印');
            },
            cancle() {
                this.apiLeaseRecordCancle({
                    params: {
                        leaseRecordId: this.item.id
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
                            vm.traceRecords = data.leaseShippingRecord.traceRecords
                        }
                    }
                })
            });
        }
    }
</script>
