<template>
    <div>
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
                    <p class="titleWeight">计价方式</p>
                    <div>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="countPrice" v-model="countPrice.isCheckAll">全选</label>
                        <label class="checkbox-inline" v-for="item in countPrice.countPriceArr">
                            <input type="checkbox" name="metal" :value="item.id" v-model="countPrice.checkedArr">{{item.name}}</label>
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
                    <p class="titleWeight">赠送比例</p>
                    <div class="line_wrap">
                        <span>消费</span>
                        <input type="text" class="form-inline" v-model="benchmark"
                               style="margin: 0 10px;width:50px;">
                        <span>元，送1mg</span>
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
            <div class="line_wrap">
                <p class="titleWeight">说明</p>
                <div class="right_item">
                    <ol>
                        <li>只对用户实际支付的货币部分，按规则进行赠送，旧料抵扣部分不赠送黄金；</li>
                        <li>平台将按照商家送出黄金的50%，每单上限20mg进行补贴，直到补贴金使用完。</li>
                        <li>补贴详情可在资金账户中查看。</li>
                    </ol>
                </div>
            </div>
        </div>
        <div class="modal-footer" style="text-align: center;">
            <button type="button" class="btn btn-primary" @click="asure">确定</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {baseUtil, constUtil} from '~/util'
    import {mapActions} from 'vuex'

    export default {
        props: ['addModalParams'],
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
                benchmark: '',
                enabled: true
            }
        },
        methods: {
            ...mapActions('active/presentGold', {
                apiPostGoldPresentRuleList: 'apiPostGoldPresentRuleList',
                apiPutGoldPresentRuleList: 'apiPutGoldPresentRuleList'
            }),
            asure() {
                let sendParams = {
                    metalIds: this.metal.isCheckAll ? 'all' : this.metal.checkedArr.join(','),
                    gemIds: this.gem.isCheckAll ? 'all' : this.gem.checkedArr.join(','),
                    priceTypes: this.countPrice.isCheckAll ? 'all' : this.countPrice.checkedArr.join(','),
                    storeIds: this.store.isCheckAll ? 'all' : this.store.checkedArr.join(','),
                    benchmark: this.benchmark,
                    enabled: this.enabled
                }
                // console.log('sendParams', sendParams);
                if (this.addModalParams.item) { // 修改
                    sendParams.ruleId = this.addModalParams.item.id;
                    this.apiPutGoldPresentRuleList({
                        params: sendParams,
                        callBack: () => {
                            ButtonWithModalEvent.$emit(this.addModalParams.CONST_CLOSE_MODAL);
                            this.addModalParams.refresh()
                        }
                    });
                } else { // 新增
                    this.apiPostGoldPresentRuleList({
                        params: sendParams,
                        callBack: () => {
                            ButtonWithModalEvent.$emit(this.addModalParams.CONST_CLOSE_MODAL);
                            this.addModalParams.refresh()
                        }
                    });
                }
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
                this.countPrice.checkedArr = this.checkedAll(this.countPrice.countPriceArr)
                this.gem.checkedArr = this.checkedAll(this.gem.gemArr);
                this.benchmark = ''
                this.enabled = true
            },
            initModifyData(item) {
                this.benchmark = item.benchmark
                this.enabled = item.enabled
                this.gem.isCheckAll = item.gemIds === 'all'
                this.gem.checkedArr = item.gemIds === 'all' ? this.checkedAll(this.gem.gemArr) : item.gemIds.split(',')
                this.metal.isCheckAll = item.metalIds === 'all'
                this.metal.checkedArr = item.metalIds === 'all' ? this.checkedAll(this.metal.metalArr) : item.metalIds.split(',')
                this.store.isCheckAll = item.storeIds === 'all'
                this.store.checkedArr = item.storeIds === 'all' ? this.checkedAll(this.store.storeArr) : item.storeIds.split(',')
                this.countPrice.isCheckAll = item.priceTypes === 'all'
                this.countPrice.checkedArr = item.priceTypes === 'all' ? this.checkedAll(this.countPrice.countPriceArr) : item.priceTypes.split(',')
            },
            watchFunc() {
                this.$watch('metal.isCheckAll', function (val) {
                    this.handleIsCheckAll(val, 'metal')
                })
                this.$watch('gem.isCheckAll', function (val) {
                    this.handleIsCheckAll(val, 'gem')
                })
                this.$watch('countPrice.isCheckAll', function (val) {
                    this.handleIsCheckAll(val, 'countPrice')
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
                this.$watch('countPrice.checkedArr', function (val) {
                    this.handleCheckedArr(val, 'countPrice');
                }, {deep: true})
                this.$watch('store.checkedArr', function (val) {
                    this.handleCheckedArr(val, 'store');
                }, {deep: true})
            }
        },
        mounted() {
            this.metal.metalArr = baseUtil.getMetadataMetal();
            this.gem.gemArr = baseUtil.getMetadataGem();
            this.countPrice.countPriceArr = constUtil._CONST_PRESENT_GOLD_PRICE_TYPE;
            this.store.storeArr = baseUtil.getMetadataStore();
            ButtonWithModalEvent.$off(this.addModalParams.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.addModalParams.CONST_CLICK_MODAL, () => {
                if (this.addModalParams.item) { // 修改界面
                    this.initModifyData(this.addModalParams.item);
                } else {
                    this.initData();
                }
            })
            this.watchFunc();
        }
    }
</script>

<style scoped>
    ol {
        padding-left: 10px;
    }

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
