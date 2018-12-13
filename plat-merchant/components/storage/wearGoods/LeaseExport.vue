<template>
    <div>
        <form :action="actions" method="get">
            <div class="modal-body">
                <div class="form-inline" style="text-align: left; padding-left: 20px;">
                    <input type="hidden" name="access-token" :value="accessToken">
                    <input type="hidden" name="billId" :value="billId" v-if="billId">
                    <div class="form-group form-group-margin">
                        <label>品类：</label>
                        <select class="form-control" v-model="form.categoryId" name="categoryId">
                            <option value=""></option>
                            <option v-for="item in categories" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin" v-if="!billId || wareType === 'MIXED'">
                        <label>宝石：</label>
                        <select class="form-control" v-model="form.gemId" name="gemId">
                            <option value=""></option>
                            <option v-for="item in gems" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="form-group form-group-margin">
                        <label>金属：</label>
                        <select class="form-control" v-model="form.metalId" name="metalId">
                            <option value=""></option>
                            <option v-for="item in metals" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" @click="submitForm">导出</button>
                <button class="btn btn-success" @click="close">关闭</button>
            </div>
        </form>
    </div>
</template>

<script>
    import extension from '~/api/extension'
    import consts from '~/api/consts'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {baseUtil, browserUtil} from '~/util'

    function FormObj(metalId, gemId, categoryId) {
        this.gemId = gemId || '';
        this.metalId = metalId || '';
        this.categoryId = categoryId || '';
    }

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'billId', 'wareType', 'storeId'],
        data() {
            return {
                metals: [],
                gems: [],
                categories: [],
                form: new FormObj(),
                accessToken: '',
                actions: ''
            }
        },
        methods: {
            submitForm(event) {
                if (this.billId) {
                    if (this.storeId !== baseUtil.getStore().id) {
                        event.preventDefault()
                        alert('门店不匹配')
                    } else {
                        if (!this.form.metalId && !this.form.gemId && !this.form.categoryId) {
                            event.preventDefault()
                            alert('金属、宝石、品类不能同时为空')
                        } else {
                            ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                        }
                    }
                } else {
                    if (!this.form.metalId && !this.form.gemId) {
                        event.preventDefault()
                        alert('金属或宝石不能同时为空')
                    } else {
                        ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                    }
                }
            },
            close(event) {
                event.preventDefault()
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.metals = baseUtil.getArrByKeyFromMetaData('metal')
                this.gems = baseUtil.getArrByKeyFromMetaData('gem')
                this.categories = baseUtil.getArrByKeyFromMetaData('category')
                this.form = new FormObj()
                this.form.categoryId = this.categories[0].id
//                this.form.metalId = this.metals[0].id
//                this.form.gemId = this.gems[0].id
                this.accessToken = browserUtil.getCookie('access-token');
                if (this.billId) { // 采购入库导出
                    console.log('wareType', this.wareType);
                    this.actions = extension.chooseURL() + '/' + consts._GOODS_STOCK_TEMPLATE
                } else { // 简版试戴商品导入
                    this.actions = extension.chooseURL() + '/' + consts._LEASE_STORAGE_TEMPLATE
                }
            })
        }
    }
</script>
