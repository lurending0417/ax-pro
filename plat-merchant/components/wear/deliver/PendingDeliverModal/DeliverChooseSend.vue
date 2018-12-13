<template>
    <div>
        <div class="tabs-container" style="padding: 20px">
            <ul class="nav nav-tabs">
                <li :class="isActive?'':'active'" @click="clickTabTitle"><a data-toggle="tab"
                                                                            aria-expanded="true">快递发货</a></li>
                <li :class="isActive?'active':''" @click="clickTabTitle"><a data-toggle="tab"
                                                                            aria-expanded="true">现场提货</a></li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane" :class="isActive?'':'active'">
                    <div class="panel-body">
                        <!--<div class="form-group" style="display:flex; align-items: center;margin-top:15px;justify-content: space-around">-->
                            <!--<input type="text" class="form-control" style="width: 70%;" v-model="form.logisticsCode"-->
                                   <!--ref="expressNoInput" placeholder="快递单号">-->

                            <!--<button type="button" class="btn btn-w-m btn-info" @click="validate">确定</button>-->
                        <!--</div>-->
                        快递公司：京东快递
                        <!--<p>注：预约快递取件后，不可取消</p>-->
                        <div class="form-group"
                             style="display:flex; align-items: center;margin-top:15px;margin-bottom:0px;justify-content: center">
                            <button type="button" class="btn btn-w-m btn-info" style="margin-right: 15px;"
                                    @click="asure('express')">确定
                            </button>
                            <button type="button" class="btn btn-w-m btn-info" @click="close('express')">取消</button>
                        </div>
                    </div>
                </div>
                <div class="tab-pane" :class="isActive?'active':''">
                    <div class="panel-body">
                        <div class="form-group"
                             style="display:flex; align-items: center;margin-top:15px;justify-content: space-between">
                            <label class="control-label" style="margin-right:20px;">验证码</label>
                            <input type="text" class="form-control" style="width: 60%;margin-right: 15px;"
                                   v-model="smsCode">
                            <button type="button" class="btn" :class="isSend?'btn-default':'btn-info'"
                                    :disabled="isSend" @click="sendSmsCode">
                                {{isSend?remainSecond+'秒重新发送':'发送验证码'}}
                            </button>
                        </div>
                        <div>
                            {{isSend?'已经向手机号'+telephone+'发送验证码,请注意查收': ''}}
                        </div>
                        <div class="form-group"
                             style="display:flex; align-items: center;margin-top:15px;margin-bottom:0px;justify-content: center">
                            <button type="button" class="btn btn-w-m btn-info" style="margin-right: 15px;"
                                    @click="asure('getCode')">确定
                            </button>
                            <button type="button" class="btn btn-w-m btn-info" @click="close('getCode')">取消</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex'
    import {encryptSignUtil, baseUtil} from '~/util'

    export default {
        props: ['chooseSendParams'],
        data() {
            return {
                isActive: false,
                validateParams: {
                    serial: '',
                    refreshTable: '',
                    txAddressId: '',
                    recordId: ''
                },
                form: {
                    logisticsCode: '',
                    leaseRecordId: '',
                    storageSerial: ''
                },
                rxAddressId: '',
                telephone: '',
                smsCode: '',
                smsToken: '',
                isSend: false, // 是否发送了验证码
                remainSecond: 60, // 剩余时间
                intervalId: 0 // setInterval的id
            }
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiPreExpressSend: 'apiPreExpressSend',
                apiGetStoreDetail: 'apiGetStoreDetail',
                sendCode: 'sendSmsCode',
                apiLeaseRecordOut: 'apiLeaseRecordOut'
            }),
            ...mapActions('merchant/storeManageMain', {
                apiGetAddress: 'apiGetAddress'
            }),
            validate() {
                let vm = this;
                this.form.leaseRecordId = this.validateParams.recordId;
                this.form.storageSerial = this.validateParams.serial;
                this.form.shipper = 'SF';
                this.form.noShipping = false;
                this.apiLeaseRecordOut({
                    params: this.form,
                    callBack() {
                        ButtonWithModalEvent.$emit(vm.chooseSendParams.CONST_CLOSE_MODAL)
                        vm.validateParams.refreshTable()
                    }
                });
            },
            clickTabTitle() {
                this.isActive = !this.isActive;
            },
            sendSmsCode() {
                let vm = this;
                this.sendCode({
                    params: {
                        telephone: this.telephone,
                        sign: encryptSignUtil.encrypt(this.telephone),
                        voice: false
                    },
                    callBack(data) {
                        vm.smsToken = data.result
                        console.log(data);
                        vm.startCountDown()
                    }
                });
                // 倒计时函数
                // this.smsToken = '123123';
            },
            startCountDown() {
                this.isSend = true;
                this.remainSecond = 60
                this.intervalId = setInterval(() => {
                    this.remainSecond--;
                    if (this.remainSecond === 0) {
                        clearInterval(this.intervalId)
                        this.isSend = false;
                    }
                }, 1000)
            },
            asure(type) {
                let vm = this;
                console.log(type)
                let partParams = {
                    leaseRecordId: this.validateParams.recordId,
                    storageSerial: this.validateParams.serial
                }
                if (type === 'express') {
                    console.log('validateParams', this.validateParams);
                    this.apiLeaseRecordOut({
                        params: {
                            ...partParams,
                            noShipping: false
                        },
                        callBack() {
                            vm.validateParams.refreshTable()
                        }
                    })
                } else if (type === 'getCode') {
                    this.apiLeaseRecordOut({
                        params: {
                            ...partParams,
                            noShipping: true,
                            smsToken: vm.smsToken,
                            smsCode: vm.smsCode
                        },
                        callBack() {
                            clearInterval(this.intervalId)
                            vm.validateParams.refreshTable()
                        }
                    });
                }
                ButtonWithModalEvent.$emit(this.chooseSendParams.CONST_CLOSE_MODAL)
            },
            close(type) {
                console.log(type)
                ButtonWithModalEvent.$emit(this.chooseSendParams.CONST_CLOSE_MODAL)
            }
        },
        beforeMount() {
            let vm = this;
            ButtonWithModalEvent.$off(this.chooseSendParams.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.chooseSendParams.CONST_CLICK_MODAL, (obj) => {
                clearInterval(this.intervalId)
                this.isSend = false; // 是否发送了验证码
                this.remainSecond = 0; // 剩余时间
                this.smsCode = ''; // 清空验证码
                vm.rxAddressId = obj.rxAddressId
                vm.validateParams = obj;
                vm.form.logisticsCode = ''
                this.apiGetStoreDetail({
                    params: {
                        storeId: baseUtil.getStore().id
                    },
                    callBack: (data) => {
                        this.validateParams.txAddressId = data.txAddressId
                        console.log('txAddressId', data)
                    }
                });
                if (vm.rxAddressId) {
                    vm.apiGetAddress({
                        sendParams: {
                            addressId: obj.rxAddressId
                        },
                        callback(data) {
                            vm.telephone = data.telephone
                        }
                    });
                }
            });
        }
    }
</script>
