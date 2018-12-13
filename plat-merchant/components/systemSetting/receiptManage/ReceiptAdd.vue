<template>
    <div>
        <div class="modal-body">
            <div class="row">
                <div class="col-lg-3 left-config">
                    <div style="line-height: 34px">名称</div>
                    <div style="line-height: 34px">类型</div>
                    <div style="line-height: 34px">模板</div>
                </div>
                <div class="col-lg-9 right-config">
                    <div><input type="text" class="form-control" v-model="form.name"/></div>
                    <div>
                        <select class="form-control" v-model="form.type">
                            <option v-for="item in receiptTypes" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div>
                        <div class="input-group">
                            <input type="file" class="form-control" ref="fileInput" style="display: none;"
                                   placeholder="请选择模板文件" @change="changeFile">
                            <input type="text" class="form-control" v-model="form.fileName"
                                   placeholder="请选择模板文件" readonly>
                            <span class="input-group-btn">
                            <button class="btn btn-default" :class="this.item? 'padding_style': ''" type="button"
                                    @click="chooseFile">浏览</button>
                        </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="asure">确定</button>
        </div>
    </div>
</template>

<script>
    import {browserUtil} from '~/util'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import extension from '~/api/extension'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'refreshTable', 'item', 'receiptTypes'],
        data() {
            return {
                form: {
                    name: '',
                    file: {},
                    fileName: '',
                    type: ''
                }
            }
        },
        methods: {
            createFormData(accessToken) {
                let fd = new FormData();
                fd.append('file', this.form.file);
                fd.append('name', this.form.name);
                fd.append('type', this.form.type);
                fd.append('access-token', accessToken);
                return fd
            },
            asure() {
                let vm = this;
                console.log(this.form);
                let xhrs = new XMLHttpRequest();
                let accessToken = browserUtil.getCookie('access-token');
                let url = '';
                if (this.item) {
                    url = extension.chooseURL() + '/goods/print/template/receipt/' + this.item.id;
                } else {
                    url = extension.chooseURL() + '/goods/print/template/receipt';
                }
                xhrs.open('POST', url);
                xhrs.send(this.createFormData(accessToken));
                xhrs.onreadystatechange = function () {
                    if (xhrs.readyState === 4 && xhrs.status === 200) {
                        let data = JSON.parse(xhrs.responseText);
                        if (data.status === 200) {
                            console.log(data);
                            vm.refreshTable()
                            ButtonWithModalEvent.$emit(vm.CONST_CLOSE_MODAL);
                        } else {
                            alert(data.message);
                        }
                    } else if ((xhrs.status > 200 && xhrs.status < 300) || xhrs.status === 304) {
                        let str = xhrs.status + ' : ' + xhrs.statusText + ' : ' + xhrs.responseText
                        alert('提交失败！' + str);
                    }
                };
            },
            changeFile() {
                this.form.file = event.target.files[0]
                this.form.fileName = this.form.file.name
            },
            chooseFile() {
                this.$refs.fileInput.click();
            },
            initData() {
                this.form = {
                    name: '',
                    file: {},
                    fileName: '',
                    type: this.receiptTypes[0].id
                }
            },
            initModifyData(item) {
                this.form.name = item.name
                this.form.fileName = item.name
                this.form = {
                    name: item.name,
                    type: item.type,
                    fileName: '',
                    file: {}
                }
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                if (this.item) { // 修改界面
                    this.initModifyData(this.item);
                } else {
                    this.initData();
                }
            })
        }
    }
</script>

<style scoped>
    .clearPadding {
        padding: 0;
    }

    .left-config {
        font-weight: 600;
        text-align: left;
        width: 15%;
    }

    .right-config {
        text-align: left;
    }

    .left-config > div, .right-config > div {
        margin: 10px 0;
    }

    .padding_style {
        padding: 12px 6px;
    }
</style>
