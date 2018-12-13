<template>
    <div>
        <div class="modal-body">
            <div class="form-inline" style="text-align: left; padding-left: 20px;" v-if="!billId">
                <div class="form-group form-group-margin">
                    <label>仓库：</label>
                    <select class="form-control" v-model="wareHouseId" name="wareHouseId">
                        <option v-for="item in wareHouses" :value="item.id">{{item.name}}</option>
                    </select>
                </div>
            </div>
            <div class="form-inline" style="text-align: left; padding-left: 20px;">
                <div class="form-group form-group-margin" style="width: 100%">
                    <label>文件：</label>
                    <input type="file" class="form-control"  @change="changeFile" style="display: none" ref="fileBox"/>
                    <input type="text" class="form-control"  v-model="fileName" readonly style="width: 57%"/>
                    <button class="btn btn-info" style="margin-left: 10px;" @click="searchFile">浏览</button>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" @click="importFile">导入</button>
            <button class="btn btn-success" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
//    import extension from '~/api/extension'
    import sendFormData from '~/api/formDataApi'
    import consts from '~/api/consts'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import {baseUtil} from '~/util'
    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'refreshTable', 'refreshStock', 'billId'],
        data() {
            return {
                wareHouses: [],
                wareHouseId: '',
                accessToken: '',
                file: '',
                fileName: '',
                actions: ''
            }
        },
        methods: {
            searchFile() {
                this.$refs.fileBox.click();
            },
            changeFile() {
                this.file = event.target.files[0]
                this.fileName = this.file.name
                console.log('this.file', this.file);
            },
            createFormData() {
                let fd = new FormData();
                fd.append('file', this.file);
                if (this.billId) {
                    fd.append('billId', this.billId);
                } else {
                    fd.append('wareHouseId', this.wareHouseId);
                }
                return fd
            },
            importFile() {
                if (this.billId) {
                    sendFormData({
                        formData: this.createFormData(),
                        url: consts._GOODS_STOCK_TEMPLATE,
                        success: (data) => {
                            console.log(data)
                            this.refreshStock()
                            ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                        }
                    })
                } else {
                    sendFormData({
                        formData: this.createFormData(),
                        url: consts._LEASE_STORAGE_TEMPLATE,
                        success: (data) => {
                            console.log(data)
                            this.refreshTable()
                            ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                        }
                    })
                }
            },
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.wareHouses = baseUtil.getWarehouseByStoreId()
                this.wareHouseId = this.wareHouses[0].id
            })
        }
    }
</script>
