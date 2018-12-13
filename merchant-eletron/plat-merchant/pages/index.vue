<template>
    <div class="loginColumns animated fadeInDown">
        <div class="row">
            <div class="col-lg-6"></div>
            <div class="col-lg-6">
                <div class="form_wrap">
                    <p style="text-align: center;margin: 20px 0;font-size:16px;font-weight: bold;">易戴易美珠宝管理系统</p>
                    <div v-if="!isForgetPassword">
                        <div class="line_wrap">
                            <label class="label_cls">账号</label>
                            <div class="input_wrap">
                                <input type="text" class="form-control width_limit flo_right" placeholder="手机号码" autocomplete="off"
                                       @keyup.13="enterEventOnMobileInput" @input="changeMobile" ref="telephone">
                            </div>
                        </div>
                        <div class="line_wrap" v-if="isPasswordType">
                            <label class="label_cls">密码</label>
                            <div class="input_wrap">
                                <input type="password" class="form-control width_limit flo_right" placeholder="密码"
                                       ref="passwordInput"
                                       @keyup.13="enterEventOnPasswordInput"
                                       @input="changePassword">
                            </div>
                        </div>
                        <div class="line_wrap" v-else>
                            <label class="label_cls">验证码</label>
                            <input type="text" class="form-control validate_cls" placeholder="验证码"
                                   @keyup.13="enterEventOnValidate" ref="validateInput"
                                   @input="changeValidateCode">
                            <button type="button" class="btn btn-white" @click="sendValidate" :disabled="isSendValidateCode">
                                {{isSendValidateCode?second +'秒后重新发送':'发送验证码' }}</button>
                        </div>

                        <div class="flex" v-if="isPasswordType">
                            <span class="hover_cla" @click="changeLoginType">验证码登录</span>
                            <span class="hover_cla" @click="forgetPassword">忘记密码</span>
                        </div>
                        <div class="flex" v-else>
                            <span class="hover_cla" @click="changeLoginType">密码登录</span>
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-primary block full-width m-b" @click="login">登录
                            </button>
                        </div>
                    </div>
                    <div v-else>
                        <div class="line_wrap">
                            <label class="label_cls">账号</label>
                            <div class="input_wrap">
                                <input type="text" class="form-control width_limit flo_right_forget" placeholder="手机号码"
                                       @keyup.13="enterOnMobileInputForget" style="width: 90%"
                                       v-model="modifyParams.telephone">
                            </div>
                        </div>
                        <div class="line_wrap">
                            <label class="label_cls">验证码</label>
                            <input type="text" class="form-control validate_cls" placeholder="验证码"
                                   @keyup.13="enterOnValidateFoget" ref="validateInputForget"
                                   v-model="modifyParams.smsCode">
                            <button type="button" class="btn btn-white" @click="sendValidateInValidate" :disabled="isSendValidateCode">
                                {{isSendValidateCode?second +'秒后重新发送':'发送验证码' }}</button>
                        </div>
                        <div class="line_wrap" style="position: relative;">
                            <label class="label_cls">新密码</label>
                            <div class="input_wrap">
                                <input type="password" class="form-control width_limit flo_right_forget"
                                       placeholder="请输入6—10位英文或数字"
                                       ref="passwordInputForget" style="width: 95%;"
                                       @keyup.13="enterOnPasswordInputForget" v-model="modifyParams.password">
                            </div>
                            <span class="remark_cls">{{remark.password}}</span>
                        </div>
                        <div class="line_wrap" style="position: relative;">
                            <label class="label_cls">确认密码</label>
                            <div class="input_wrap">
                                <input type="password" class="form-control width_limit flo_right_forget"
                                       placeholder="密码"
                                       ref="rePasswordInputForget"
                                       @keyup.13="enterOnRePasswordInputForget"
                                       @input="changeRePassword">
                            </div>
                            <span class="remark_cls">{{remark.rePassword}}</span>
                        </div>
                        <div class="form-group" style="text-align: center">
                            <button type="button" class="btn btn-primary" @click="modifyPassword" style="margin-right:70px">
                                确定
                            </button>
                            <button type="button" class="btn btn-default" @click="changeToForgetPassword">
                                返回
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--商户选择-->
        <ModalItem
            :modalProps="{
                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                titleName: '请选择登录商户'
            }">
            <ChooseMerchantModal slot="main"
                                 :CONST_CLICK_MODAL="CONST_CLICK_MODAL"
                                 :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL">
            </ChooseMerchantModal>
        </ModalItem>
    </div>
</template>

<script>
    import {mapMutations, mapActions} from 'vuex'
    import {encryptSignUtil} from '~/util'
    import ModalItem from '~/components/ModalItem'
    import ChooseMerchantModal from '~/components/ChooseMerchantModal'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import uuid from 'uuid'
    export default {
        layout: 'simple',
        components: {
            ModalItem,
            ChooseMerchantModal
        },
        data() {
            return {
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid(),
                focusPassword: false,
                isPasswordType: true,
                isForgetPassword: false,
                isSendValidateCode: false,
                second: 60,
                intervalId: 0,
                modifyParams: {
                    telephone: '',
                    password: '',
                    smsToken: '',
                    smsCode: '',
                    ip: '192.0.0.1',
                    client: 'MERCHANT'
                },
                remark: {
                    password: '',
                    rePassword: ''
                }
            }
        },
        watch: {
            'modifyParams.password': {
                handler: function (val) {
                    let isTrue = /^[a-zA-Z0-9]{6,10}$/.test(val);
                    if (!isTrue) {
                        this.remark.password = '密码有误，请输入6—10位英文或数字';
                    } else {
                        this.remark.password = '';
                    }
                },
                deep: true
            }
        },
        methods: {
            ...mapMutations('login', {
                resetMobile: 'resetMobile',
                resetPassword: 'resetPassword',
                resetValidateCode: 'resetValidateCode'
            }),
            ...mapActions('login', {
                loginAction: 'loginAction',
                sendSmsCode: 'sendSmsCode', // 验证码登录发送验证码
                resetPasswordAction: 'resetPasswordAction'
            }),
            ...mapActions('wear/wearRecords', {
                sendCode: 'sendSmsCode' // 修改密码发送验证码
            }),
            sendValidate() {
                this.sendSmsCode((data) => {
                    this.beginInterval();
                });
            },
            beginInterval() {
                this.isSendValidateCode = true;
                this.intervalId = setInterval(() => {
                    this.second = this.second - 1;
                    if (this.second === 0) {
                        clearInterval(this.intervalId)
                        this.isSendValidateCode = false;
                        this.second = 60
                    }
                }, 1000)
            },
            addClassToBody() {
                document.body.setAttribute('class', 'gray-bg')
            },
            enterOnMobileInputForget() {
                this.$refs.validateInputForget.focus();
            },
            enterOnValidateFoget() {
                this.$refs.passwordInputForget.focus();
            },
            enterOnPasswordInputForget() {
                this.$refs.rePasswordInputForget.focus();
            },
            enterOnRePasswordInputForget() {
                this.modifyPassword();
            },
            enterEventOnMobileInput() {
                if (this.isPasswordType) {
                    this.$refs.passwordInput.focus()
                } else {
                    this.$refs.validateInput.focus()
                }
            },
            enterEventOnPasswordInput() {
                this.login()
            },
            enterEventOnValidate() {
                this.login()
            },
            forgetPassword() {
                this.modifyParams.telephone = this.$refs.telephone.value;
                this.isForgetPassword = true;
            },
            changeMobile(event) {
                this.resetMobile(event.target.value)
            },
            changePassword(event) {
                this.resetPassword(event.target.value)
            },
            changeValidateCode(event) {
                this.resetValidateCode(event.target.value)
            },
            changeRePassword() {
                if (event.target.value !== this.modifyParams.password) {
                    this.remark.rePassword = '两次输入密码不一致，请重新输入'
                } else {
                    this.remark.rePassword = ''
                }
            },
            login() {
                // let vm = this;
                this.loginAction({
                    params: {router: this.$router, swal: this.$swal, isPasswordType: this.isPasswordType},
                    callback: data => {
                        if (data.chooseMerchant) {
                            // 选择商户
                            ButtonWithModalEvent.$emit(this.CONST_CLICK_MODAL, data)
                        }
                    }
                })
            },
            sendValidateInValidate() {
                this.sendCode({
                    params: {
                        telephone: this.modifyParams.telephone,
                        sign: encryptSignUtil.encrypt(this.modifyParams.telephone),
                        voice: false
                    },
                    callBack: (data) => {
                        this.modifyParams.smsToken = data.result
                        this.beginInterval();
                    }
                });
            },
            modifyPassword() {
                this.resetPasswordAction({
                    params: {router: this.$router, swal: this.$swal, sendParams: this.modifyParams},
                    callback: data => {
                        if (data.chooseMerchant) {
                            // 选择商户
                            ButtonWithModalEvent.$emit(this.CONST_CLICK_MODAL, data)
                        }
                    }
                })
            },
            changeLoginType() {
                this.isPasswordType = !this.isPasswordType;
            },
            changeToForgetPassword() {
                this.isForgetPassword = !this.isForgetPassword;
            }
        },
        beforeMount() {
            this.addClassToBody()
        }
    }
</script>

<style scoped>
    .form_wrap {
        width: 345px;
        background-color: #fff;
        padding: 20px;
    }

    .line_wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0;
    }

    .btn-white{
        width: 125px;
    }

    .input_wrap {
        overflow: hidden;
        flex-grow: 1;
        position: relative;
    }

    .validate_cls {
        width: 30%;
    }

    .label_cls {
        margin-right: 20px;
    }

    .remark_cls {
        position: absolute;
        top: 100%;
        left: 23%;
        font-size: 12px;
        color: red;
    }

    .form-control {
        margin: 0;
    }

    .flo_right {
        float: right;
        width: 90%;
    }

    .flo_right_forget {
        float: right;
    }

    .flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0;
    }

    .hover_cla:hover {
        cursor: pointer;
        color: #18a689;
    }
</style>
