<template>
    <div>
        <div class="modal-body">
            <p class="help-block" style="text-align: left;">发送对象：{{count}}人</p>
            <div class="flex-cls">
                <div class="flex-item-cls" v-for="(item,index) in msgTemplateList">
                    <NoticeItem :content="item" :fromUser="true" :customerId="customerId"></NoticeItem>
                </div>
                <div v-if="msgTemplateList.length === 0" style="text-align: left;">
                    暂无通知模板，请在 用户管理=》通知管理 页面进行添加。
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
    import NoticeItem from '../notice/NoticeItem'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions, mapState} from 'vuex'
    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'count', 'customerId'],
        components: {
            NoticeItem
        },
        computed: {
            ...mapState('userManage/notice', {
                msgTemplateList: 'messageTemplateList'
            })
        },
        methods: {
            ...mapActions('userManage/notice', {
                apiGetMessageTemplateList: 'apiGetMessageTemplateList'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.apiGetMessageTemplateList({})
            })
        }
    }
</script>
<style scoped>
    .flex-cls{
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
    }
    .flex-item-cls{
        width: 28%;
        margin:10px 20px ;
    }
</style>
