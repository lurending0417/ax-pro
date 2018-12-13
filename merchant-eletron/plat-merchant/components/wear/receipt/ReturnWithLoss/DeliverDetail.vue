<template>
    <div  :id="'modalId'+CONST_CLICK_MODAL">
        <div class="modal-body">
            <LeaseDetailModalCopy :modalId="CONST_CLICK_MODAL" :params="params"></LeaseDetailModalCopy>
        </div>
        <div class="modal-footer" style="text-align: center">
            <button type="button" class="btn btn-w-m btn-info" @click="close">关闭</button>
            <button type="button" class="btn btn-w-m btn-info" @click="modifyForfeit" v-if="isConfirm">更改扣款</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex'
    import LeaseDetailModalCopy from '~/components/LeaseDetailModalCopy'
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
                deliverDetailItem: {
                    buyer: {
                        nickName: '',
                        telephone: ''
                    },
                    leaseRecord: {},
                    leaseQcs: [],
                    rxAddress: {}, // 收货地址
                    backShippingRecord: {},
                    leaseStorage: {
                        lease: {},
                        storageView: {
                            props: [],
                            storage: {}
                        }
                    },
                    status: ''
                }
            }
        },
        computed: {
            isConfirm() {
                console.log(this.deliverDetailItem.status);
                if (this.deliverDetailItem.status === 'WAIT_QC_CONFIRM') {
                    return true
                }
            }
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiGetDeliverDetailById: 'apiGetDeliverDetailById'
            }),
            modifyForfeit() {
                if (this.deliverDetailItem.leaseQcs.length > 0) {
                    ButtonWithModalEvent.$emit(this.validateParams.CONST_CLICK_MODAL, {
                        qcId: this.deliverDetailItem.leaseQcs[0].id,
                        passed: false,
                        refreshTable: this.refreshTable
                    });
                    ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                }
            },
            close() {
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
                            vm.deliverDetailItem = data
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
