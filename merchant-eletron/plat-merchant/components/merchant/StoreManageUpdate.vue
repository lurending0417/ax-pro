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
                        <div class="col-sm-4">
                            <input type="text" class="form-control" v-model="baseInfo.managerPhone">
                        </div>
                        <div class="col-sm-2"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">客服电话</label>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" v-model="baseInfo.servicePhone">
                        </div>
                        <div class="col-sm-2"></div>
                    </div>
                    <div class="form-group" style="text-align: left">
                        <label class="col-sm-2 control-label">状态</label>
                        <div class="radio col-sm-4">
                            <label>
                                <input type="radio" value="false" name="status" v-model="baseInfo.enabled">禁用
                            </label><br/>
                            <label style="margin-top: 6px">
                                <input type="radio" value="true" name="status" v-model="baseInfo.enabled">启用
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
                        <div class="col-sm-4">
                            <input type="text" class="form-control" v-model="sendInfo.telephone">
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
                        <div class="col-sm-4">
                            <input type="text" class="form-control" v-model="receiveInfo.telephone">
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
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions, mapGetters} from 'vuex'
    import {objectUtil, regionUtil} from '~/util'
    import RegionSelect from '~/components/RegionSelect'
    import {TableEvent} from '~/components/TableEvent'
    import uuid from 'uuid'

    export default {
        components: {
            RegionSelect
        },
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'refreshTable', 'item'],
        data() {
            return {
                wareHouseItem: {},
                baseInfo: {
                    storeId: '',
                    name: '',
                    districtCode: '',
                    intro: '',
                    address: '',
                    managerName: '',
                    managerPhone: '',
                    servicePhone: '',
                    enabled: true,
                    type: ''
                },
                sendInfo: {
                    districtCode: '',
                    districtName: '',
                    street: '',
                    name: '',
                    telephone: ''
                },
                receiveInfo: {
                    districtCode: '',
                    districtName: '',
                    street: '',
                    name: '',
                    telephone: ''
                },
                PAGE_OPEN: uuid()
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
                updateStoreById: 'updateStoreById',
                apiGetAddress: 'apiGetAddress'
            }),
            clickAsure() {
                let vm = this;
                let sendParams = this.baseInfo;
                sendParams.districtName = regionUtil.getDetailAddress(this.baseInfo.districtCode);
                this.sendInfo.districtName = regionUtil.getDetailAddress(this.sendInfo.districtCode);
                this.receiveInfo.districtName = regionUtil.getDetailAddress(this.receiveInfo.districtCode);
                sendParams.txAddressJson = JSON.stringify(this.sendInfo)
                sendParams.rxAddressJson = JSON.stringify(this.receiveInfo)
                console.log(sendParams)
                this.updateStoreById({
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
            initData() {
                this.wareHouseItem = {};
                this.baseInfo = {
                    storeId: '',
                    name: '',
                    districtCode: '',
                    intro: '',
                    address: '',
                    managerName: '',
                    managerPhone: '',
                    servicePhone: '',
                    enabled: true
                };
                this.sendInfo = {
                    districtCode: '',
                    districtName: '',
                    street: '',
                    name: '',
                    telephone: ''
                };
                this.receiveInfo = {
                    districtCode: '',
                    districtName: '',
                    street: '',
                    name: '',
                    telephone: ''
                };
                this.PAGE_OPEN = uuid();
            }
        },
        mounted() {
            let vm = this;
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, (type) => {
                if (type === 'CLEAR') {
                    vm.initData()
                } else {
                    if (vm.item.txAddressId) {
                        this.apiGetAddress({
                            sendParams: {
                                addressId: vm.item.txAddressId
                            },
                            callback(data) {
                                // vm.sendInfo = data;
                                objectUtil.replaceSameFieldsValue(data, vm.sendInfo);
                                TableEvent.$emit(vm.PAGE_OPEN + 'send', data.districtCode)
                            }
                        });
                    } else {
                        TableEvent.$emit(vm.PAGE_OPEN + 'send')
                    }
                    if (vm.item.rxAddressId) {
                        this.apiGetAddress({
                            sendParams: {
                                addressId: vm.item.rxAddressId
                            },
                            callback(data) {
                                // vm.receiveInfo = data;
                                objectUtil.replaceSameFieldsValue(data, vm.receiveInfo);
                                TableEvent.$emit(vm.PAGE_OPEN + 'receive', data.districtCode)
                            }
                        })
                    } else {
                        TableEvent.$emit(vm.PAGE_OPEN + 'receive')
                    }
                    objectUtil.replaceSameFieldsValue(this.item, this.baseInfo);
                    this.baseInfo.storeId = this.item.id
                    if (this.item.districtCode) {
                        TableEvent.$emit(vm.PAGE_OPEN + 'base', this.item.districtCode)
                    } else {
                        TableEvent.$emit(vm.PAGE_OPEN + 'base')
                    }
                }
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
</style>
