<template>
    <div>
        <div class="row">
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
                <div class="panel panel-primary">
                    <div class="panel-heading" style="text-align: center;">
                        转买优惠券
                    </div>
                    <div class="panel-body">
                        <p>{{coupon.cost}}元</p>
                        <p>{{coupon.count}}张</p>
                    </div>
                    <div class="panel-footer">
                        <div style="text-align: center">
                            <span style="margin-right:15px">
                                <ButtonWithModal
                                    :btnProps="{
                                    btnClasses: ['btn btn-primary btn-sm'],
                                    btnName: '卡券规则'
                                    }"
                                    :modalProps="{
                                    CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                    CONST_CLICK_MODAL: CONST_CLICK_MODAL+'coupon',
                                    titleName: '转买券发放规则',
                                    modalClasses: ['modal-lg']
                                }">
                                <CouponList slot="main"
                                              :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                              :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'coupon'"
                                >
                                </CouponList>
                            </ButtonWithModal>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4"></div>
        </div>
    </div>
</template>

<script>
    import ButtonWithModal from '~/components/ButtonWithModal'
    import ModifyCoupon from './ModifyCoupon'
    import CouponList from './CouponList'
    import uuid from 'uuid'
    import api from '~/api'
    import {baseUtil} from '~/util'

    export default {
        components: {
            ButtonWithModal,
            CouponList,
            ModifyCoupon
        },
        data() {
            return {
                CONST_CLOSE_MODAL: uuid(),
                CONST_CLICK_MODAL: uuid(),
                coupon: {
                    cost: 0,
                    count: 0
                },
                item: {},
                merchantId: ''
            }
        },
        methods: {
            getCoupons() {
                api.request({ // 获取卡券统计数据
                    url: api.consts._ACCOUNT_COUPON_STAT,
                    params: {
                        srcMerchantId: '',
                        srcStoreId: '',
                        type: 'CASH_LEASE_TO_BUY',
                        status: 'ACTIVE'
                    },
                    success: (data) => {
                        let {cost, count} = data.rows[0]
                        this.coupon.cost = cost;
                        this.coupon.count = count;
                        console.log(data)
                    }
                })
            }
        },
        mounted() {
            this.merchantId = baseUtil.getMerchantId()
            this.getCoupons()
        }
    }
</script>

<style scoped>
    .panel-body p {
        text-align: center;
    }
</style>
