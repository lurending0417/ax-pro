<template>
    <div>
        <div class="modal-body">
            <div class="row">
                <div class="col-lg-3 left-config">
                    <div style="line-height: 34px">充值金额:</div>
                    <div style="line-height: 34px">银行付款单号:</div>
                </div>
                <div class="col-lg-9 right-config">
                    <div><input type="text" class="form-control" placeholder="1000元" v-model.number="form.amount"/>
                    </div>
                    <div><input type="text" class="form-control" placeholder="" v-model="form.billNumber"/></div>
                </div>
            </div>
            <fieldset style="padding: 20px;">
                <legend>上传图片凭证</legend>
                <ul>
                    <li v-for="(img,key) in images" class="imgList">
                        <img :src="img.path" class="img_style"/>
                        <a href="#" style="position: absolute;" @click="delImage(key, img.id)">
                            <span class="glyphicon glyphicon-remove"></span>
                        </a>
                        <p>{{img.remark}}</p>
                    </li>
                    <li class="last_li">
                        <span class='addPic' v-on:click="addPic">
                            <span data-type="SLIDE">添加图片</span>
                            <input type="file" @change="onFileChange" multiple style="display: none"
                                   ref="uploadFile"/>
                        </span>
                    </li>
                </ul>
            </fieldset>
        </div>

        <div class="modal-footer" style="text-align: center;">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="add">确定</button>
        </div>
    </div>
</template>

<script>
    // import { mapActions, mapGetters, mapMutations } from 'vuex'
    import {mapActions} from 'vuex'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent';
    import {browserUtil} from '~/util'

    export default {
        components: {},
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'ownerId'],
        data() {
            return {
                recordId: '',
                form: {
                    amount: '',
                    billNumber: ''
                },
                images: []
            }
        },
        computed: {
            // ...mapGetters('retail/offlineRetail/retailRecycleBillMain', {
            //     getRetailRecycleBillsView: 'getRetailRecycleBillsView',
            //     total: 'getTotal'
            // })
        },
        methods: {
            ...mapActions('account/walletAccount', {
                rechargeCashWalletPre: 'rechargeCashWalletPre',
                rechargeCashWalletPost: 'rechargeCashWalletPost',
                rechargeCashWalletAddAttach: 'rechargeCashWalletAddAttach',
                rechargeCashWalletDelAttach: 'rechargeCashWalletDelAttach'
            }),
            addPic() {
                this.$refs['uploadFile'].click();
            },
            onFileChange(e) {
                let files = e.target.files;
                if (!files.length) return
                // 构建formData对象
                let accessToken = browserUtil.getCookie('access-token');
                for (let i = 0, j = files.length; i < j; i++) {
                    let fd = new FormData();
                    fd.append('file', files[i]);
                    fd.append('recordId', this.recordId);
                    fd.append('access-token', accessToken);
                    this.sendImage(fd, i, files[i])
                }
                // this.createImage(files, type)
            },
            chooseURL() {
                let env = process.env.PLAT_ENV || '';
                switch (env) {
                    case 'dev': {
                        return process.env.devBaseUrl;
                    }
                    case 'test': {
                        return process.env.testBaseUrl;
                    }
                    case 'prod': {
                        return process.env.prodBaseUrl;
                    }
                    default: {
                        throw Error('不匹配的运行环境：' + env);
                    }
                }
            },
            sendImage(fd, index, file) {
                let xhrs = new XMLHttpRequest();
                let url = this.chooseURL() + '/account/cash/wallet/recharge/offline/attach';
                let vm = this;
                xhrs.onprogress = function (e) {
                    if (e.lengthComputable) {
                        console.log('percentage')
                        let total = e.total;
                        let loaded = e.loaded;
                        let percentage = Math.floor(total / loaded);
                        vm.images[index].progress = '已完成：' + percentage + '%';
                    }
                }
                xhrs.open('POST', url);
                xhrs.onreadystatechange = function () {
                    if (xhrs.readyState === 4 && xhrs.status === 200) {
                        let data = JSON.parse(xhrs.responseText).result;
                        console.log('上传成功', data.id);
                        vm.createImage(file, data.id);
                    } else if ((xhrs.status > 200 && xhrs.status < 300) || xhrs.status === 304) {
                        let str = xhrs.status + ' : ' + xhrs.statusText + ' : ' + xhrs.responseText
                        console.log('失败原因', str);
                        alert('上传失败！');
                    }
                };
                xhrs.send(fd);
            },
            createImage(file, id) {
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
                    vm.images.push(img)
                };
            },
            delImage: function (index, id) {
                this.images.splice(index, 1)
                this.rechargeCashWalletDelAttach({
                    params: {
                        attachId: id
                    },
                    callback: (data) => {
                        console.log(data);
                    }
                })
            },
            add() {
                this.rechargeCashWalletPost({
                    params: {
                        recordId: this.recordId,
                        transactionId: this.form.billNumber,
                        amount: this.form.amount
                    },
                    callback: data => {
                        console.log(data)
                    }
                });
                console.log(this.form);
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
            },
            setWithdrawals() {
                this.form.withdrawals = event.target.dataset.num;
            },
            sendValidateNum() {
                event.preventDefault();
                console.log();
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.recordId = ''
                this.form = {
                    amount: '',
                    billNumber: ''
                }
                this.images = []
                let vm = this;
                this.rechargeCashWalletPre({
                    params: {
                        ownerId: this.ownerId
                    },
                    callback: data => {
                        console.log(data);
                        vm.recordId = data.result
                    }
                });
            });
        }
    }
</script>

<style scoped>
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

    .left-config {
        font-weight: 600;
        text-align: right;
    }

    .left-config > div, .right-config > div {
        margin: 10px 0;
    }
</style>
