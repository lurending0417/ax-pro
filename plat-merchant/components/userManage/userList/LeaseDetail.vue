<template>
    <div :id="'modalId'+modalId">
        <div class="modal-body">
            <LeaseDetailModalCopy :modalId="modalId" :params="params"></LeaseDetailModalCopy>
        </div>
        <div class="modal-footer">
            <button class="btn btn-success" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
    import LeaseDetailModalCopy from '~/components/LeaseDetailModalCopy'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import {TableEvent} from '~/components/TableEvent'
    import { mapActions } from 'vuex'
    import uuid from 'uuid'

    export default {
        components: {
            LeaseDetailModalCopy
        },
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'item'],
        data() {
            return {
                modalId: uuid(),
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
            }
        },
        mounted() {
            let vm = this;
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.apiGetDeliverDetailById({
                    params: {
                        recordId: this.item.id
                    },
                    callBack: (data) => {
                        if (data) {
                            TableEvent.$emit(vm.params.PAGE_OPEN, data);
                        }
                    }
                })
            })
        }
    }
</script>

<style scoped>
    .statusWrap{
        width: 100%;
    }
    .status-items-cls{
        position: relative;
        width: 135px;
        text-align: center;
    }
    .back-line-cls{
        width:100%;
        height: 1px;
        position: absolute;
        right:0;
        top: 8px;
        background-color: #00cccc;
    }
    .icon-cls{
        position: relative;
        z-index: 2;
        color:#00cccc;
    }
    .name-cls{
        padding-bottom:4px;
    }
    .flex-cls{
        display: flex;
    }
    .traceRecord-cls{
        padding: 5px 0;
        position: relative;
        display: flex;
        align-items: center;
    }
    .traceRecord-back-line-cls{
        position: absolute;
        bottom: 0px;
        left: 136px;
        width: 1px;
        height: 100%;
        background-color: #00cccc;
    }
    .traceRecord-icon-cls{
        margin: auto 10px;
        color: #00cccc;
    }
    .pay-info{
        display: flex;
        justify-content: space-between;
    }
    .remark-cls {
        display: block;
        width: 80%;
        word-wrap: break-word;
        text-align: left;
    }
</style>
