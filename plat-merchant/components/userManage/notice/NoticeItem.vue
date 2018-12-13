<template>
    <div style="text-align: center;">
        <div class="panel panel-success" @click="modifyNotice">
            <div class="panel-body noticeItem">
                <div class="title">
                    <img alt="image" class="img-rounded m-t-xs img-responsive img-cls" src="../../../assets/msg_icon.png">
                    <h4 class="title-text"><strong>{{content.title}}</strong></h4>
                </div>
                <div class="content">
                    <p>{{content.content}}</p>
                </div>
                <!--<div>-->
                    <!--<div class="col-sm-4">-->
                        <!--<div class="text-center">-->
                            <!--<img alt="image" class="img-rounded m-t-xs img-responsive" src="../../../assets/msg_icon.png">-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div class="col-sm-8" >-->
                        <!--<h3><strong>{{content.title}}</strong></h3>-->
                        <!--<p>{{content.content}}</p>-->
                    <!--</div>-->
                    <!--<div class="clearfix"></div>-->
                <!--</div>-->
                <div class="noticeItem-mask"></div>
            </div>
        </div>
        <div class="form-group" style="text-align: center;" v-if="!fromUser">
            <ButtonWithModal
                :btnProps="{
                                btnClasses: [' btn-success form-group-margin'],
                                btnStyle: { minWidth: 80 + 'px' },
                                btnName: '发布'
                            }"
                :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName: '发送对象',
                                modalClasses: ['modal-lg']
                            }"
            >
                <NoticeSend slot="main"
                            :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                            :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                            :item="content"
                >
                </NoticeSend>
            </ButtonWithModal>
            <button class="btn btn-default form-group-margin" @click="del" style="min-width: 80px;">删除</button>
        </div>
        <div class="form-group" v-else>
            <button class="btn btn-success" @click="send" style="min-width: 80px;">发布</button>
        </div>
    </div>
</template>
<script>
    import ButtonWithModal from '~/components/ButtonWithModal'
    import uuid from 'uuid'
    import NoticeSend from './NoticeSend'
    import {mapActions, mapMutations, mapState} from 'vuex'

    export default {
        props: ['content', 'passed', 'fromUser', 'customerId'],
        components: {
            ButtonWithModal,
            NoticeSend
        },
        data() {
            return {
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid()
            }
        },
        computed: {
            ...mapState('userManage/notice', {
                query: 'query',
                queryConditions: 'queryConditions'
            })
        },
        methods: {
            ...mapActions('userManage/notice', {
                apiPostMessageTemplateSend: 'apiPostMessageTemplateSend',
                apiDelMessageTemplate: 'apiDelMessageTemplate'
            }),
            ...mapMutations('userManage/notice', {
                resetMessageTemplateItem: 'resetMessageTemplateItem'
            }),
            send() {
                let temp = null;
                if (this.customerId) { // 当前页或者选中页
                    temp = {customerId: this.customerId}
                } else { // 筛选结果
                    temp = {
                        query: this.query,
                        ...this.queryConditions
                    }
                }
                temp.templateId = this.content.id
                this.apiPostMessageTemplateSend({
                    params: temp,
                    fromUser: true,
                    callback: () => {
                        alert('发送成功')
                    }
                })
            },
            del() {
                let flag = confirm('你确定要删除吗？')
                if (flag) {
                    this.apiDelMessageTemplate({
                        templateId: this.content.id
                    });
                }
            },
            modifyNotice() {
                if (!this.fromUser) {
                    this.resetMessageTemplateItem(this.content)
                    this.passed.changeCurrCpn('NoticeAdd')
                }
            }
        }
    }
</script>
<style scoped>
    .noticeItem-mask {
        position: relative;
    }

    .noticeItem:hover {
        cursor: pointer;
    }
    .noticeItem {
        height: 170px;
        padding: 10px;
    }

    .noticeItem:hover .noticeItem-mask {
        visibility: visible;
    }

    .noticeItem-mask {
        position: absolute;
        top: 0;
        left: 0;
        visibility: hidden;
        width: 100%;
        height: 100%;
        background-color: hsla(232, 100%, 42%, 0.02);
    }
    .img-cls{
        width: 50px;
        height: 50px;
    }
    .title-text{
        flex: 1;
        text-align: center;
    }
    .title{
        display: flex;
        align-items: center;
    }
    .content{
        margin: 10px 0;
        text-align: left;
        line-height: 1.5em;
    }
</style>
