<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="modal-body" style="text-align: left">

            <div class="border_wrap">
                <div class="line_wrap">
                    <p class="titleWeight">材质</p>
                    <div>
                        <fieldset style="text-align: center">
                            <legend>素金</legend>
                            <div>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="metal"
                                           v-model="metal.isCheckAll">全选</label>
                                <label class="checkbox-inline" v-for="item in metal.metalArr">
                                    <input type="checkbox" name="metal" :value="item.id" v-model="metal.checkedArr">{{item.name}}</label>
                            </div>
                        </fieldset>
                        <fieldset style="text-align: center">
                            <legend>非素金</legend>
                            <div>
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="metal" v-model="gem.isCheckAll">全选</label>
                                <label class="checkbox-inline" v-for="item in gem.gemArr">
                                    <input type="checkbox" name="metal" :value="item.id" v-model="gem.checkedArr">{{item.name}}</label>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
            <div class="border_wrap">
                <div class="line_wrap">
                    <p class="titleWeight">参与店面</p>
                    <div>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="store" v-model="store.isCheckAll">全选</label>
                        <label class="checkbox-inline" v-for="item in store.storeArr">
                            <input type="checkbox" name="store" :value="item.id" v-model="store.checkedArr">{{item.name}}</label>
                    </div>
                </div>
            </div>
            <div class="border_wrap">
                <div class="line_wrap">
                    <p class="titleWeight">卡券金额</p>
                    <div class="line_wrap">
                        <span>押金*</span>
                        <input type="text" class="form-inline" v-model.number="ratio"
                               style="margin: 0 10px;width:50%;" >
                        <span>0.05-0.45</span>
                    </div>
                </div>
            </div>
            <div class="border_wrap">
                <div class="line_wrap">
                    <p class="titleWeight">状态</p>
                    <div class="right_item">
                        <label class="radio-inline"> <input type="radio" name="status" :value="true" v-model="enabled">启用</label>
                        <label class="radio-inline"> <input type="radio" name="status" :value="false" v-model="enabled">停用</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-footer" style="text-align: center">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="asure">确定</button>
        </div>
    </form>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {baseUtil} from '~/util'
    import api from '~/api'

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'item', 'getCouponList'],
        data() {
            return {
                gem: {
                    gemArr: [],
                    checkedArr: [],
                    isCheckAll: true
                },
                metal: {
                    metalArr: [],
                    checkedArr: [],
                    isCheckAll: true
                },
                countPrice: {
                    countPriceArr: [],
                    checkedArr: [],
                    isCheckAll: true
                },
                store: {
                    storeArr: [],
                    checkedArr: [],
                    isCheckAll: true
                },
                ratio: 0,
                enabled: true
            }
        },
        methods: {
            asure() {
                if (this.ratio > 0.45 || this.ratio < 0.05) {
                    alert('押金比例不正确，请重新输入')
                    this.ratio = ''
                    return
                }
                let sendParams = {
                    metalIds: this.metal.isCheckAll ? 'all' : this.metal.checkedArr.join(','),
                    gemIds: this.gem.isCheckAll ? 'all' : this.gem.checkedArr.join(','),
                    storeIds: this.store.isCheckAll ? 'all' : this.store.checkedArr.join(','),
                    ratio: this.ratio,
                    enabled: this.enabled
                }
                 console.log('sendParams', sendParams);
                if (this.item) { // 修改
                    sendParams.ruleId = this.item.id;
                    api.request({
                        url: api.consts._PROMO_COUPON_TOBUY_RULE,
                        method: 'put',
                        params: sendParams,
                        success: () => {
                            this.close()
                        }
                    })
                } else { // 新增
                    api.request({
                        url: api.consts._COUPON_RULE_SET,
                        method: 'post',
                        params: sendParams,
                        success: () => {
                            this.close()
                        }
                    })
                }
            },
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                this.getCouponList()
            },
            checkedAll(arr) {
                let temp = [];
                arr.forEach((item) => {
                    temp.push(item.id)
                })
                return temp;
            },
            handleCheckedArr(arr, tag) {
                if (arr) {
                    if (arr.length === this[tag][tag + 'Arr'].length) {
                        this[tag].isCheckAll = true
                    } else {
                        this[tag].isCheckAll = false;
                    }
                }
            },
            handleIsCheckAll(bool, tag) {
                if (bool) {
                    this[tag].checkedArr = this.checkedAll(this[tag][tag + 'Arr'])
                }
            },
            initData() {
                this.store.checkedArr = this.checkedAll(this.store.storeArr);
                this.metal.checkedArr = this.checkedAll(this.metal.metalArr);
                this.gem.checkedArr = this.checkedAll(this.gem.gemArr);
                this.ratio = 0
                this.enabled = true
            },
            initModifyData(item) {
                console.log('item', item);
                this.ratio = item.ratio
                this.enabled = item.enabled
                if (item.gemIds) {
                    this.gem.isCheckAll = item.gemIds === 'all'
                    this.gem.checkedArr = item.gemIds === 'all' ? this.checkedAll(this.gem.gemArr) : item.gemIds.split(',')
                } else {
                    this.gem.isCheckAll = false
                }
                if (item.metalIds) {
                    this.metal.isCheckAll = item.metalIds === 'all'
                    this.metal.checkedArr = item.metalIds === 'all' ? this.checkedAll(this.metal.metalArr) : item.metalIds.split(',')
                } else {
                    this.metal.isCheckAll = false
                }
                if (item.storeIds) {
                    this.store.isCheckAll = item.storeIds === 'all'
                    this.store.checkedArr = item.storeIds === 'all' ? this.checkedAll(this.store.storeArr) : item.storeIds.split(',')
                } else {
                    this.store.isCheckAll = false
                }
            },
            watchFunc() {
                this.$watch('metal.isCheckAll', function (val) {
                    this.handleIsCheckAll(val, 'metal')
                })
                this.$watch('gem.isCheckAll', function (val) {
                    this.handleIsCheckAll(val, 'gem')
                })
                this.$watch('store.isCheckAll', function (val) {
                    this.handleIsCheckAll(val, 'store')
                })
                this.$watch('metal.checkedArr', function (val) {
                    this.handleCheckedArr(val, 'metal');
                }, {deep: true})
                this.$watch('gem.checkedArr', function (val) {
                    this.handleCheckedArr(val, 'gem');
                }, {deep: true})
                this.$watch('store.checkedArr', function (val) {
                    this.handleCheckedArr(val, 'store');
                }, {deep: true})
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            this.metal.metalArr = baseUtil.getMetadataMetal();
            this.gem.gemArr = baseUtil.getMetadataGem();
            this.store.storeArr = baseUtil.getMetadataStore();
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                if (this.item) { // 修改界面
                    this.initModifyData(this.item);
                } else {
                    this.initData();
                }
            })
            this.watchFunc();
        }
    }
</script>

<style scoped>
    .titleWeight {
        margin: 0 20px 0 0;
        font-weight: 600;
    }

    .border_wrap {
        border: 1px solid #bbb;
        padding: 10px;
        margin-bottom: 20px;
    }

    .line_wrap {
        display: flex;
        align-items: center;
        justify-content: left;
    }
</style>
