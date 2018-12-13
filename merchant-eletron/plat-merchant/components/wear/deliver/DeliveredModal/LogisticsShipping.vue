<template>
    <div>
        <div class="modal-body">
            <table class="table table-bordered" v-if="tracesArr.length>0">
                <tr v-for="item in tracesArr" v-if="item.opRemark">
                    <td>{{item.opTime }}</td>
                    <td  style="text-align: left">{{item.opRemark }}</td>
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

    export default {
        props: ['viewShilpParams'],
        data() {
            return {
                tracesArr: []
            }
        },
        methods: {
            close() {
                ButtonWithModalEvent.$emit(this.viewShilpParams.CONST_CLOSE_MODAL)
            }
        },
        beforeMount() {
            ButtonWithModalEvent.$off(this.viewShilpParams.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.viewShilpParams.CONST_CLICK_MODAL, (arr) => {
                arr.map((item) => {
                    item.opTime = dateUtil.pattern(new Date(item.opTime), 'yyyy-MM-dd HH:mm:ss')
                    return item
                })
                this.tracesArr = arr;
            });
        }
    }
</script>

<style scoped>
    .time{
        margin-right: 20px;
    }
    p{
        text-align: center;
    }
</style>
