<template>
    <div>
        <div class="modal-body">
            <form class="form-horizontal" style="margin-top: 16px">
                <fieldset>
                    <legend>基本信息</legend>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">门店名称</label>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" v-model="baseInfo.name">
                        </div>
                        <div class="col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">门店简介</label>
                        <div class="col-sm-10">
                            <textarea class="form-control" placeholder="门店简介，100字以内"  maxlength="100" v-model="baseInfo.intro"></textarea>
                        </div>
                    </div>
                    <RegionSelect :params="{
                            data: reginData,
                            title: '门店地址',
                            PAGE_OPEN: PAGE_OPEN+'base'
                    }" @getCode="getBaseAddr">
                    </RegionSelect>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">详细地址</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" v-model="baseInfo.address">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">联系人</label>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" v-model="baseInfo.managerName">
                        </div>
                        <div class="col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">联系电话</label>
                        <div class="col-sm-4" style="position:relative;">
                            <input type="text" class="form-control" v-model="baseInfo.managerPhone"
                                   @input="validateTel('baseInfoManagerTel')">
                            <span class="telephoneErrorMsg" v-if="false">电话号码格式错误</span>
                        </div>
                        <div class="col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">客服电话</label>
                        <div class="col-sm-4" style="position: relative;">
                            <input type="text" class="form-control" v-model="baseInfo.servicePhone"
                                   @input="validateTel('baseInfoServiceTel')">
                            <span class="telephoneErrorMsg" v-if="false">电话号码格式错误</span>
                        </div>
                        <div class="col-sm-2"></div>
                    </div>
                    <div class="form-group" style="text-align: left">
                        <label class="col-sm-2 control-label">状态</label>
                        <div class="radio col-sm-4">
                            <label>
                                <input type="radio" name="status" :value="false" v-model="baseInfo.enabled">禁用
                            </label><br/>
                            <label style="margin-top: 6px">
                                <input type="radio" name="status" :value="true" v-model="baseInfo.enabled">启用
                            </label>
                        </div>
                    </div>
                    <div class="form-group" style="text-align: left">
                        <label class="col-sm-2 control-label">性质</label>
                        <div class="radio col-sm-4">
                            <label>
                                <input type="radio" name="type" value="MANAGE" v-model="baseInfo.type">管理门店
                            </label><br/>
                            <label style="margin-top: 6px">
                                <input type="radio" name="type" value="NORMAL" v-model="baseInfo.type">普通门店
                            </label>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>发货信息</legend>
                    <RegionSelect :params="{
                            data: reginData,
                            title: '发货地址',
                            PAGE_OPEN: PAGE_OPEN+'send'
                    }" @getCode="getSendAddr">
                    </RegionSelect>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">详细地址</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" v-model="sendInfo.street">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">联系人</label>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" v-model="sendInfo.name">
                        </div>
                        <div class="col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">联系电话</label>
                        <div class="col-sm-4" style="position: relative">
                            <input type="text" class="form-control" v-model="sendInfo.telephone"
                                   @input="validateTel('sendInfoTel')">
                            <span class="telephoneErrorMsg" v-if="false">电话号码格式错误</span>
                        </div>
                        <div class="col-sm-2"></div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>收货信息</legend>
                    <RegionSelect :params="{
                            data: reginData,
                            title: '收货地址',
                            PAGE_OPEN: PAGE_OPEN+'receive'
                    }" @getCode="getReceiveAddr">
                    </RegionSelect>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">详细地址</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" v-model="receiveInfo.street">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">联系人</label>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" v-model="receiveInfo.name">
                        </div>
                        <div class="col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">联系电话</label>
                        <div class="col-sm-4" style="position: relative;">
                            <input type="text" class="form-control" v-model="receiveInfo.telephone"
                                   @input="validateTel('receiveInfoTel')">
                            <span class="telephoneErrorMsg" v-if="false">电话号码格式错误</span>
                        </div>
                        <div class="col-sm-2"></div>
                    </div>
                </fieldset>
            </form>
        </div>
        <div class="modal-footer" style="text-align: center">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="clickAsure">确定</button>
        </div>
        <!--<div v-if="plainAlertBoxParams.isShowPlainAlertBox">-->
        <!--<plainAlertBox :propParams="{msg: plainAlertBoxParams.msg, defineStyle: {top: '400px'}}"></plainAlertBox>-->
        <!--</div>-->
    </div>
</template>


<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions, mapGetters} from 'vuex'
    import {TableEvent} from '~/components/TableEvent'
    import RegionSelect from '~/components/RegionSelect'
    import uuid from 'uuid'
    import {regionUtil} from '~/util'

    export default {
        components: {
            RegionSelect
        },
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'refreshTable'],
        data() {
            return {
                wareHouseItem: {},
                baseInfo: {
                    name: '',
                    districtCode: '110101', // 默认110101
                    districtName: '',
                    intro: '',
                    address: '',
                    managerName: '',
                    managerPhone: '',
                    servicePhone: '',
                    enabled: true,
                    type: ''
                },
                sendInfo: {
                    districtCode: '110101',
                    street: '',
                    name: '',
                    telephone: ''
                },
                receiveInfo: {
                    districtCode: '110101',
                    street: '',
                    name: ''
                },
                districtCode: {
                    base: '',
                    send: '',
                    receive: ''
                },
                PAGE_OPEN: uuid(),
                plainAlertBoxParams: {
                    isShowPlainAlertBox: false,
                    msg: ''
                },
                sendInfoTel: true,
                receiveInfoTel: true,
                baseInfoManagerTel: true,
                baseInfoServiceTel: true
            }
        },
        computed: {
            ...mapGetters('merchant/storeManageMain', {
                getMerchantId: 'getMerchantId',
                reginData: 'reginData'
            })
        },
        methods: {
            ...mapActions('merchant/storeManageMain', {
                addStoreToMerchant: 'addStoreToMerchant'
            }),
            validateTel(tag) {
                let val = event.target.value
                this[tag] = /^1[3578]\d{9}$/.test(val) || /^0\d{2,3}-?\d{7,8}$/.test(val)
            },
            clickAsure() {
                let vm = this;
                let sendParams = this.baseInfo;
                sendParams.districtName = regionUtil.getDetailAddress(this.baseInfo.districtCode);
                this.sendInfo.districtName = regionUtil.getDetailAddress(this.sendInfo.districtCode);
                this.receiveInfo.districtName = regionUtil.getDetailAddress(this.receiveInfo.districtCode);
                sendParams.txAddressJson = JSON.stringify(this.sendInfo)
                sendParams.rxAddressJson = JSON.stringify(this.receiveInfo)
                this.addStoreToMerchant({
                    callback: () => {
                        ButtonWithModalEvent.$emit(vm.CONST_CLOSE_MODAL)
                        vm.refreshTable()
                    },
                    sendParams
                });
            },
            getBaseAddr(val) {
                this.baseInfo.districtCode = val
            },
            getReceiveAddr(val) {
                this.receiveInfo.districtCode = val
            },
            getSendAddr(val) {
                this.sendInfo.districtCode = val
            },
            resetDatas() {
                this.baseInfo = {
                    name: '',
                    districtCode: '',
                    districtName: '',
                    address: '',
                    intro: '',
                    managerName: '',
                    managerPhone: '',
                    servicePhone: '',
                    enabled: true
                };
                this.sendInfo = {
                    districtCode: '',
                    street: '',
                    name: '',
                    telephone: ''
                };
                this.receiveInfo = {
                    districtCode: '',
                    street: '',
                    name: ''
                };
                this.$watch('baseInfo.managerName', function (val) {
                    this.baseInfoManagerTel = true;
                }, {deep: true});
            }
        },
        mounted() {
            let vm = this;
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, (type) => {
                this.resetDatas()
                TableEvent.$emit(vm.PAGE_OPEN + 'send');
                TableEvent.$emit(vm.PAGE_OPEN + 'receive');
                TableEvent.$emit(vm.PAGE_OPEN + 'base');
            });
        }
    }
</script>

<style scoped>
    .select_item {
        width: 50%;
        margin: 50px auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    fieldset {
        text-align: center;
    }

    .telephoneErrorMsg {
        position: absolute;
        top: 7px;
        right: -100px;
        color: red;
    }
</style>
