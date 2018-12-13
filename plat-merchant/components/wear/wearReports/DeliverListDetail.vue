<template>
    <div :id="'modalId'+modalId">
        <div class="modal-body">
            <LeaseDetailModalCopy :modalId="modalId" :params="params"></LeaseDetailModalCopy>
        </div>
        <div class="modal-footer footer_btn">
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
        props: ['item', 'CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL'],
        data() {
            return {
                modalId: uuid(),
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
                params: {
                    PAGE_OPEN: uuid()
                }
            }
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiGetDeliverDetailById: 'apiGetDeliverDetailById'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.refreshTable()
            }
        },
        mounted() {
            let vm = this;
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.apiGetDeliverDetailById({
                    params: {
                        recordId: vm.item.leaseRecordId
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
