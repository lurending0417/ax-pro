<template>
    <div>
        <div class="modal-body">
            <textarea class="form-control" v-model="repairDetail">{{repairDetail}}</textarea>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="close">关闭
            </button>
            <button type="button" class="btn btn-primary" @click="asure">确定</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex'

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'item', 'refreshTable'],
        data() {
            return {
                repairDetail: ''
            }
        },
        methods: {
            ...mapActions('retail/offlineRetail/repairBillMain', {
                apiPutRepairBill: 'apiPutRepairBill'
            }),
            initData() {
                this.repairDetail = this.item.repairDetail
            },
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.refreshTable()
            },
            asure() {
                this.apiPutRepairBill({
                    params: {
                        recordId: this.item.id,
                        repairDetail: this.repairDetail
                    },
                    callback: () => {
                        this.close()
                    }
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.initData()
            })
        }
    }
</script>
