<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <label class="col-sm-4 control-label">编号：</label>
            <div class="col-sm-1"/>
            <div class="col-sm-7 supplierInfoText"><label>{{supplierItemsView[params].code}}</label></div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">名称：</label>
            <div class="col-sm-1"/>
            <div class="col-sm-7 supplierInfoText"><label>{{supplierItemsView[params].name}}</label></div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">地址：</label>
            <div class="col-sm-1"/>
            <div class="col-sm-7 supplierInfoText"><label>{{supplierItemsView[params].address}}</label></div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">联系人：</label>
            <div class="col-sm-1"/>
            <div class="col-sm-7 supplierInfoText"><label>{{supplierItemsView[params].contact}}</label></div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">联系方式：</label>
            <div class="col-sm-1"/>
            <div class="col-sm-7 supplierInfoText"><label>{{supplierItemsView[params].phone}}</label></div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">开户行：</label>
            <div class="col-sm-1"/>
            <div class="col-sm-7 supplierInfoText"><label>{{supplierItemsView[params].bankName}}</label></div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">银行账号：</label>
            <div class="col-sm-1"/>
            <div class="col-sm-7 supplierInfoText"><label>{{supplierItemsView[params].bankAccount}}</label></div>
        </div>
        <div class="form-group" style="text-align: left">
            <label class="col-sm-4 control-label">状态：</label>
            <div class="col-sm-1"/>
            <div class="radio col-sm-7 supplierInfoText">
                <label>
                    <input type="radio" name="optionsRadios" value="option1" checked
                           Enabled="false">
                    {{supplierItemsView[params].enabled}}
                </label>
            </div>
        </div>

        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModal('addModal')">关闭
            </button>
        </div>
    </form>
</template>


<script>
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import { mapGetters } from 'vuex'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'params'],
        data () {
            return {
                orderNumber: '',
                name: '',
                address: '',
                linkMan: '',
                linkType: '',
                bank: '',
                bankAccount: '',
                statu: ''
            }
        },
        computed: {
            ...mapGetters('storage/warebaseinfo/supplierItem', {
                supplierItemsView: 'supplierItemsView'
            })
        },
        methods: {
            closeModal (name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
            },
            save (name) {
                this.closeModal(name)
            }
        }
    }
</script>

<style>
    .supplierInfoText {
        padding-top: 7px;
        margin-bottom: 0;
        text-align: left;
    }

    .modal-footer {
        text-align: center;
    }
</style>
