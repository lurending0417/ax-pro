<template>
    <div>
        <div class="form-group">
            <button class="btn btn-primary form-group-margin" @click="addNotice">新增通知素材</button>
            <ButtonWithModal
                :btnProps="{
                                btnClasses: ['btn-default', 'form-group-margin'],
                                btnStyle: { minWidth: 80 + 'px' },
                                btnName: '发布历史'
                            }"
                :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                modalClasses: ['modal-lg'],
                                titleName: '发布历史'
                            }"
            >
                <NoticeSendHistory slot="main"
                                   :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                   :CONST_CLICK_MODAL="CONST_CLICK_MODAL">
                </NoticeSendHistory>
            </ButtonWithModal>
        </div>
        <div class="flex-cls">
            <div class="flex-item-cls" v-for="(item,index) in msgTemplateList">
                <NoticeItem :content="item" :passed="passed"></NoticeItem>
            </div>
            <div v-if="msgTemplateList.length === 0">
                暂无通知模板，请点击上方新增通知素材按钮进行添加。
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import NoticeItem from './NoticeItem'
    import NoticeSendHistory from './NoticeSendHistory'
    import uuid from 'uuid';
    export default {
        props: ['passed'],
        components: {
            NoticeSendHistory,
            ButtonWithModal,
            NoticeItem
        },
        data() {
            return {
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid()
            }
        },
        computed: {
            ...mapState('userManage/notice', {
                msgTemplateList: 'messageTemplateList'
            })
        },
        methods: {
            ...mapActions('userManage/notice', {
                apiGetMessageTemplateList: 'apiGetMessageTemplateList',
                apiPutMessageTemplate: 'apiPutMessageTemplate',
                apiPostMessageTemplate: 'apiPostMessageTemplate'
            }),
            addNotice() {
                this.apiPostMessageTemplate({
                    params: {},
                    callback: () => {
                        this.passed.changeCurrCpn('NoticeAdd')
                    }
                })
            }
        },
        mounted() {
            this.apiGetMessageTemplateList({})
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
        width: 30%;
        margin:10px 20px ;
    }
</style>
