<template>
    <div>
        <form class="form-horizontal" style="padding-right: 70px;">
            <div class="form-group">
                <label class="col-lg-2 control-label">标题</label>
                <div class="col-lg-10">
                    <input class="form-control" v-model="form.title" maxlength="10">
                </div>
            </div>

            <div class="form-group">
                <label class="col-lg-2 control-label">简介内容</label>
                <div class="col-lg-10">
                    <textarea class="form-control" v-model="form.content" maxlength="50"></textarea>
                </div>
            </div>

            <div class="form-group">
                <label class="col-lg-2 control-label">详情页图片</label>
                <div class="col-lg-10">
                    <div class="panel panel-default">
                        <div class="panel-body">
                            <ul>
                                <li v-for="(img,key) in images" class="form-group-margin">
                                    <img :src="img.path" class="img-rounded img-shadow img_style"/>
                                    <a href="#" style="position: absolute;" @click="delImage(key, img.id)">
                                        <span class="glyphicon glyphicon-remove"></span>
                                    </a>
                                </li>
                                <li class="last_li">
                                    <span class='addPic' v-on:click="addPic()">
                                        <span data-type="MAIN">添加图片<br>(最佳宽度：690px)</span>
                                        <input type="file" @change="onFileChange()" class="fileBox"
                                               ref="uploadFile"/>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </form>
        <div class="form-group" style="text-align: center;">
            <ButtonWithModal
                :btnProps="{
                                btnClasses: ['btn-success form-group-margin'],
                                btnName: '保存并发布'
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
                            :item="messageTemplateItem"
                            :form="form"
                            :passed="passed"
                >
                </NoticeSend>
            </ButtonWithModal>
            <button class="btn btn-primary form-group-margin" @click="save">保存并关闭</button>
            <button class="btn btn-default form-group-margin" @click="close">关闭</button>
        </div>
    </div>
</template>
<script>
    import sendFormData from '~/api/formDataApi'
    import api from '~/api'
    import uuid from 'uuid'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import consts from '~/api/consts'
    import {mapActions, mapState} from 'vuex'
    import NoticeSend from './NoticeSend'

    export default {
        components: {
            ButtonWithModal,
            NoticeSend
        },
        props: ['passed'],
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                images: [],
                form: {
                    title: '',
                    content: ''
                },
                basePath: ''
            }
        },
        computed: {
            ...mapState('userManage/notice', {
                messageTemplateItem: 'messageTemplateItem'
            })
        },
        methods: {
            ...mapActions('userManage/notice', {
                apiPutMessageTemplate: 'apiPutMessageTemplate'
            }),
            send() {
                this.close()
            },
            save() {
                this.apiPutMessageTemplate({ // 修改
                    params: {
                        ...this.form,
                        templateId: this.messageTemplateItem.id
                    },
                    callback: () => {
                        this.close()
                    }
                })
            },
            close() {
                this.passed.changeCurrCpn('NoticeSettingMain')
            },
            addPic() {
                this.$refs['uploadFile'].click();
            },
            delImage(index, id) {
                this.images.splice(index, 1)
                this.apiDelImage(id)
            },
            apiDelImage(imageId) {
                api.request({
                    url: 'message/template/image/{imageId}',
                    params: {
                        imageId
                    },
                    method: 'delete',
                    fail(error) {
                        alert(error.message)
                    }
                })
            },
            onFileChange() {
                let e = event;
                let files = e.target.files;
                if (!files.length) return
                // 构建formData对象
                for (let i = 0, j = files.length; i < j; i++) {
                    let fd = new FormData();
                    fd.append('file', files[i]);
                    fd.append('templateId', this.messageTemplateItem.id);
                    this.sendImage(fd, i, files[i])
                }
            },
            sendImage(fd) {
                sendFormData({
                    formData: fd,
                    url: consts._POST_MESSAGE_TEMPLATE_IMAGE,
                    success: (data) => {
                        console.log(data.result.id)
                        this.createImg(data.result)
                    }
                })
            },
            createImg(item) {
                this.images.push({
                    id: item.id,
                    path: this.basePath + item.path
                })
            }
        },
        mounted() {
            let {content, title, images} = this.messageTemplateItem;
            this.basePath = process.env.imgBaseUrl;
            this.form = {content, title}
            if (images) {
                this.images = images.map(item => {
                    item.path = this.basePath + item.path
                    return item
                })
            }
        }
    }
</script>

<style scoped>
    .fileBox {
        display: none;
    }

    ul {
        padding: 0;
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    li {
        list-style: none;
        margin-bottom: 20px;
    }

    .imgList {
        /*float: left;*/
        margin-right: 20px;
    }

    .img_style {
        width: 170px;
    }

    .addPic:hover {
        cursor: pointer;
    }

    .last_li {
        align-self: center;
    }
</style>
