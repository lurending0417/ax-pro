<template>
    <div>
        <div class="modal-body">
            <LeaseDetailModal :params="{
                reginData: reginData,
                PAGE_OPEN: PAGE_OPEN
            }">
                <p slot="express" class="order_style">
                    <span>快递公司：</span><span style="margin-right:20px;">{{express.shipper}}</span>
                    <span>快递单号：</span><span>{{express.logisticsCode}}</span>
                </p>
            </LeaseDetailModal>
        </div>
        <div class="modal-footer footer_btn">
            <button type="button" class="btn btn-w-m btn-info" @click="print">打印收货信息</button>
            <ButtonWithModal
                :btnProps="{
                                btnClasses: ['btn btn-w-m btn-info'],
                                btnName: '收货'
                            }"
                :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL_1+'receive',
                                CONST_CLICK_MODAL:CONST_CLICK_MODAL_1+'receive',
                                titleName: '收货'
                            }">
                <ReceiveRecord
                    slot="main"
                    :CONST_CLICK_MODAL="CONST_CLICK_MODAL_1+'receive'"
                    :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL_1+'receive'"
                    :refreshTable="refreshTable"
                >
                </ReceiveRecord>
            </ButtonWithModal>
            <button type="button" class="btn btn-w-m btn-info" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import ReceiveRecord from './ReceiveRecord';
    import ButtonWithModal from '~/components/ButtonWithModal'
    import {TableEvent} from '~/components/TableEvent'
    import LeaseDetailModal from '~/components/LeaseDetailModal'
    import {mapActions, mapGetters} from 'vuex';
    import uuid from 'uuid'
    import {baseUtil} from '~/util';

    export default {
        components: {
            LeaseDetailModal,
            ButtonWithModal,
            ReceiveRecord
        },
        props: ['item', 'CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL'],
        data() {
            return {
                express: {
                    shipper: '',
                    logisticsCode: ''
                },
                detailData: {},
                PAGE_OPEN: uuid(),
                CONST_CLOSE_MODAL_1: uuid(),
                CONST_CLICK_MODAL_1: uuid()
            }
        },
        computed: {
            ...mapGetters('merchant/storeManageMain', {
                reginData: 'reginData'
            })
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
            print() {
                let receivePerson = baseUtil.getStaff().nickName
                let printConfig = {
                    billNumber: this.detailData.leaseRecord.billNumber,
                    shipper: this.express.shipper,
                    logisticsCode: this.express.logisticsCode,
                    serial: this.detailData.leaseStorage.storageView.storage.serial,
                    name: this.detailData.leaseStorage.storageView.scientificName,
                    weight: this.detailData.leaseStorage.storageView.storage.weight,
                    outStoreName: this.detailData.outStore.name, // 发货店铺
                    receivePerson // 收货人
                }
                console.log('快递信息', printConfig);
            }
        },
        mounted() {
            let vm = this;
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                vm.express = {
                    shipper: vm.item.shipperNameBack,
                    logisticsCode: vm.item.logisticsCodeBack
                };
                this.apiGetDeliverDetailById({
                    params: {
                        recordId: vm.item.id
                    },
                    callBack(data) {
                        if (data) {
                            TableEvent.$emit(vm.PAGE_OPEN, data);
                            vm.detailData = data
                        }
                    }
                })
            });
        }
    }
</script>

<style scoped>
    fieldset {
        padding: 10px 20px;
        text-align: center;
    }

    fieldset div {
        text-indent: 2em;
    }

    .footer_btn {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .order_style {
        text-align: left;
        font-weight: 700;
        font-size: inherit;
        color: #676a6c;
    }
</style>
