<template>
    <div :id="'modalId'+CONST_CLICK_MODAL">
        <div class="modal-body">
            <LeaseDetailModalCopy :modalId="CONST_CLICK_MODAL" :params="params"></LeaseDetailModalCopy>
        </div>
        <div class="modal-footer footer_btn">
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
        props: ['item', 'CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL'],
        components: {
            LeaseDetailModalCopy
        },
        data() {
            return {
                params: {
                    PAGE_OPEN: uuid()
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
