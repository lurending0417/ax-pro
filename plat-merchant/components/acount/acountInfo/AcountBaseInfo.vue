<template>
    <div class="col-lg-12">
        <div class="panel panel-default">
            <div class="panel-heading" style="text-align: center;">
                <i class="fa fa-question-circle-o hover-cla text-success" aria-hidden="true" @click="showDetail"></i>
                账户基础信息
            </div>
            <div class="panel-body">
                <p>商家财务联系人：{{baseInfo.contactName  }}</p>
                <p>联系方式：{{baseInfo.contactPhone  }}</p>
                <p>开户行：{{baseInfo.bankName  }}</p>
                <p>开户名：{{baseInfo.accountName }}</p>
                <p>开户账号：{{baseInfo.accountNumber  }}</p>
                <!--<p>税号：{{baseInfo.taxNumber  }}</p>-->
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import ButtonWithModal from '~/components/ButtonWithModal';
    import Tooltip from '~/components/Tooltip';
    import uuid from 'uuid';
    import {baseUtil} from '~/util';

    export default {
        components: {
            ButtonWithModal, Tooltip
        },
        data () {
            return {
                CONST_CLOSE_MODAL: uuid(),
                merchantId: '',
                baseInfo: {
                    contactName: '',
                    contactPhone: '',
                    bankName: '',
                    accountName: '',
                    accountNumber: '',
                    taxNumber: ''
                },
                msg: '账户基础信息是易戴易美与商户结算的重要信息。如需变更，请及时与易戴易美商务人员联系。'
            }
        },
        methods: {
            ...mapActions('account/walletAccount', {
                getMerchantAccountBaseInfo: 'getMerchantAccountBaseInfo'
            }),
            showDetail(event) {
//                console.log('scrollHeight', document.documentElement.scrollHeight)
//                console.log('clientHeight', document.body.clientHeight)
//                console.log('event.screenY', event.screenY)
//                console.log('event.screenX', event.screenX)
//                console.log('offsetLeft', event.target.offsetLeft)
//                console.log('offsetTop', event.target.offsetTop)
                this.$msgBox.showMsgBox({
                    title: '账户基础信息',
                    content: this.msg,
                    defineStyle: {
                        bottom: (document.body.clientHeight - event.screenY + 90) + 'px',
                        left: event.screenX - 5 + 'px'
                    }
                })
            }
        },
        mounted () {
            this.merchantId = baseUtil.getMerchantId()
            this.getMerchantAccountBaseInfo({
                params: {
                    merchantId: this.merchantId
                },
                callback: data => {
                    this.baseInfo = data.result
                }
            })
        }
    }
</script>

<style scoped>
    .hover-cla:hover{
        cursor: pointer;
        color: red;
    }
</style>
