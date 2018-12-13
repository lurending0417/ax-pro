<template>
    <div>
        <div class="modal-body">
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">商品展示图&nbsp;&nbsp;(推荐尺寸375px*375px)</div>
                <div class="panel-body">
                    <ul>
                        <li v-for="(img,key) in mainImages" class="imgList">
                            <img :src="img.path" class="img-rounded img-shadow img_style"/>
                            <a href="#" style="position: absolute;" @click="delImage('MAIN', key, img.id)">
                                <span class="glyphicon glyphicon-remove"></span>
                            </a>
                            <!--<p>{{img.progress}}</p>-->
                        </li>
                        <li class="last_li" v-if="mainImages.length === 0">
                            <span class='addPic' v-on:click="addPic('MAIN')">
                                <span data-type="MAIN">添加图片</span>
                                <input type="file" @change="onFileChange('MAIN')" class="fileBox"
                                       ref="uploadFileMAIN"/>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">商品banner图&nbsp;&nbsp;(推荐尺寸375px*375px)</div>
                <div class="panel-body">
                    <ul>
                        <li v-for="(img,key) in slideImages" class="imgList">
                            <img :src="img.path" class="img-rounded img-shadow img_style"/>
                            <a href="#" style="position: absolute;" @click="delImage('SLIDE', key, img.id)">
                                <span class="glyphicon glyphicon-remove"></span>
                            </a>
                            <p>{{img.remark}}</p>
                        </li>
                        <li class="last_li">
                            <span class='addPic' v-on:click="addPic('SLIDE')">
                                <span data-type="SLIDE">添加图片</span>
                                <input type="file" @change="onFileChange('SLIDE')" multiple class="fileBox"
                                       ref="uploadFileSLIDE"/>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">详情图&nbsp;&nbsp;(推荐尺寸345px*345px)</div>
                <div class="panel-body">
                    <ul>
                        <li v-for="(img,key) in detailImages" class="imgList">
                            <img :src="img.path" class="img-rounded img-shadow img_style"/>
                            <a href="#" style="position: absolute;" @click="delImage('DETAIL', key, img.id)">
                                <span class="glyphicon glyphicon-remove"></span>
                            </a>
                            <!--<p>{{img.progress}}</p>-->
                        </li>
                        <li class="last_li">
                            <span class='addPic' v-on:click="addPic('DETAIL')">
                                <span data-type="DETAIL">添加图片</span>
                                <input type="file" @change="onFileChange('DETAIL')" multiple class="fileBox"
                                       ref="uploadFileDETAIL"/>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: center">商品描述</div>
                <div class="panel-body">
                    <textarea class="form-control" placeholder="请输入商品描述" rows="3"></textarea>
                    <div ref="test"></div>
                </div>
            </div>
        </div>
        <div class="modal-footer" style="text-align: center">
            <button type="button" class="btn btn-w-m btn-info" @click="close">确定</button>
        </div>
    </div>
</template>

<script>
    import api from '~/api'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex';
    import extension from '~/api/extension'
    import {browserUtil} from '~/util'

    export default {
        props: ['item', 'CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL'],
        data() {
            return {
                mainImages: [],
                slideImages: [],
                detailImages: [],
                imgObj: {}
            }
        },
        methods: {
            ...mapActions('storage/wearStorage/wearGoodsMain', {
                apiLeaseConfigDetail: 'apiLeaseConfigDetail'
            }),
            addPic(type) {
                this.$refs['uploadFile' + type].click();
            },
            onFileChange(type) {
                let e = event;
                let files = e.target.files;
                if (!files.length) return
                // 构建formData对象
                let accessToken = browserUtil.getCookie('access-token');
                for (let i = 0, j = files.length; i < j; i++) {
                    let fd = new FormData();
                    fd.append('file', files[i]);
                    fd.append('storageId', this.item.storageId);
                    fd.append('type', type);
                    fd.append('access-token', accessToken);
                    this.sendImage(fd, i, type, files[i])
                }
                // this.createImage(files, type)
            },
            createImage(file, type, id) {
                let vm = this;
                let reader = new FileReader();
                let img = {};
                img.name = file.name;
                img.id = id;
                reader.readAsDataURL(file);
                reader.onprogress = function (e) {
                    // 这个是定时触发的事件，文件较大的时候较明显
                    img.progress = '已完成：' + Math.round(e.loaded / e.total * 100) + '%';
                };
                reader.onloadend = function (e) {
                    let dataURL = reader.result;
                    img.path = dataURL;
                    if (type === 'MAIN') { // 商品展示图
                        vm.mainImages.push(img);
                    } else if (type === 'SLIDE') { // banner
                        vm.slideImages.push(img)
                    } else if (type === 'DETAIL') { // 详情
                        vm.detailImages.push(img)
                    }
                };
            },
            sendImage(fd, index, type, file) {
                let xhrs = new XMLHttpRequest();
                let url = extension.chooseURL() + '/lease/image';
                let vm = this;
                xhrs.onprogress = function (e) {
                    if (e.lengthComputable) {
                        console.log('percentage')
                        let total = e.total;
                        let loaded = e.loaded;
                        let percentage = Math.floor(total / loaded);
                        if (type === 'MAIN') {
                            vm.mainImages[index].progress = '已完成：' + percentage + '%';
                        } else if (type === 'SLIDE') {
                            vm.slideImages[index].progress = '已完成：' + percentage + '%';
                        } else if (type === 'DETAIL') {
                            vm.detailImages[index].progress = '已完成：' + percentage + '%';
                        }
                    }
                }
                xhrs.open('POST', url);
                xhrs.onreadystatechange = function () {
                    if (xhrs.readyState === 4 && xhrs.status === 200) {
                        let data = JSON.parse(xhrs.responseText).result;
                        console.log('上传成功', data.id);
                        vm.createImage(file, type, data.id);
                    } else if ((xhrs.status > 200 && xhrs.status < 300) || xhrs.status === 304) {
                        let str = xhrs.status + ' : ' + xhrs.statusText + ' : ' + xhrs.responseText
                        console.log('失败原因', str);
                        alert('上传失败！');
                    }
                };
                xhrs.send(fd);
            },
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.mainImages = [];
                this.slideImages = [];
                this.detailImages = [];
                this.refreshTable()
            },
            delImage: function (type, index, id) {
                console.log(type, index, id)
                if (type === 'MAIN') {
                    this.mainImages.splice(index, 1)
                } else if (type === 'SLIDE') {
                    this.slideImages.splice(index, 1)
                } else if (type === 'DETAIL') {
                    this.detailImages.splice(index, 1)
                }
                this.apiDelImage(id)
            },
            apiDelImage(imageId) {
                api.request({
                    url: 'lease/image/{imageId}',
                    params: {
                        imageId
                    },
                    method: 'delete',
                    success(data) {
                        console.log('删除成功', data)
                    },
                    fail(error) {
                        console.log(error.message);
                    }
                })
            },
            joinPath(arr) {
                let basePath = process.env.imgBaseUrl;
                return arr.map((item) => {
                    if (item.path) {
                        item.path = basePath + item.path
                        return item
                    }
                })
            }
        },
        mounted() {
            let vm = this;
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                vm.apiLeaseConfigDetail({
                    storageId: vm.item.id,
                    callBack(result) {
                        vm.mainImages = [];
                        vm.slideImages = [];
                        vm.detailImages = [];
                        if (result.mainImage) {
                            result.mainImage.path = process.env.imgBaseUrl + result.mainImage.path;
                            vm.mainImages.push(result.mainImage);
                        }
                        vm.slideImages = vm.joinPath(result.slideImages);
                        vm.detailImages = vm.joinPath(result.detailImages);
                    }
                })
            });
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
