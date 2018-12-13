<template>
    <div>
        <div class="modal-body">
            <table class="table table-bordered" v-if="tracesArr.length>0">
                <tr v-for="item in tracesArr" v-if="item.opRemark">
                    <td>{{item.opTime }}</td>
                    <td style="text-align: left">{{item.opRemark }}</td>
                </tr>
            </table>

            <p v-else>暂无物流信息</p>
        </div>
        <div class="modal-footer" style="text-align: center">
            <button type="button" class="btn btn-w-m btn-info" @click="close">确定</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {dateUtil} from '~/util'
    import {mapActions} from 'vuex'

    export default {
        props: ['item', 'CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'refreshTable'],
        data() {
            return {
                tracesArr: []
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
        beforeMount() {
            let vm = this;
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.apiGetDeliverDetailById({
                    params: {
                        recordId: vm.item.id
                    },
                    callBack(data) {
                        if (data.backShippingRecord.traceRecords) {
                            vm.tracesArr = data.backShippingRecord.traceRecords.map((i) => {
                                i.opTime = dateUtil.pattern(new Date(i.opTime), 'yyyy-MM-dd HH:mm:ss');
                                return i
                            })
                        }
                    }
                })
            });
        }
    }
</script>

<style scoped>
    .time {
        margin-right: 20px;
    }

    p {
        text-align: center;
    }
</style>
