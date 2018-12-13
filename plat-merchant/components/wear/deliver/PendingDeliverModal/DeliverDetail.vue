<template>
    <div :id="'modalId'+modalId">
        <div class="modal-body">
            <LeaseDetailModalCopy :modalId="modalId" :params="params"></LeaseDetailModalCopy>
        </div>
        <div class="modal-footer footer_btn">
            <button type="button" class="btn btn-w-m btn-info" @click="print">打印取货小票</button>
            <button type="button" class="btn btn-w-m btn-info" @click="send">发货</button>
            <button type="button" class="btn btn-w-m btn-info" @click="cancle">取消订单</button>
            <button type="button" class="btn btn-w-m btn-info" @click="close">关闭</button>
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
        props: ['id', 'CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL', 'validateParams', 'item'],
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
                        detailImages: [],
                        mainImage: null,
                        slideImages: [],
                        lease: {},
                        storageView: {
                            props: [],
                            storage: {}
                        }
                    }
                },
                rxAddressId: ''
            }
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiGetDeliverDetailById: 'apiGetDeliverDetailById',
                apiLeaseRecordCancle: 'apiLeaseRecordCancle'
            }),
            print() {
                // 打印快递信息
                this.getRecordDetail();
                console.log('deliverDetailItem', this.deliverDetailItem);
            },
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.refreshTable()
            },
            send() {
                ButtonWithModalEvent.$emit(this.validateParams.CONST_CLICK_MODAL, {
                    detailParams: this.CONST_CLICK_MODAL,
                    recordId: this.deliverDetailItem.leaseRecord.id,
                    rxAddressId: this.rxAddressId,
                    refreshTable: this.refreshTable
                })
//                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            cancle() {
                let flag = confirm('确定取消订单吗?')
                if (flag) {
                    this.apiLeaseRecordCancle({
                        params: {
                            leaseRecordId: this.id
                        },
                        callBack: () => {
                            this.close()
                        }
                    });
                }
            },
            getRecordDetail() {
                let vm = this;
                this.apiGetDeliverDetailById({
                    params: {
                        recordId: vm.item.id
                    },
                    callBack(data) {
                        vm.rxAddressId = data.rxAddress.id
                        if (data) {
                            TableEvent.$emit(vm.params.PAGE_OPEN, data);
                            vm.deliverDetailItem = data;
                        }
                    }
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.getRecordDetail()
            });
        }
    }
</script>
