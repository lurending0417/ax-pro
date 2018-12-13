<template>
    <div>
        <form class="form-horizontal">
            <div class="modal-body" style="text-align: left">
                <div class="border_wrap">
                    <p class="titleWeight">等效项名称</p>
                    <div class="line_wrap" style="flex: 1;">
                        <input type="text" class="form-control" v-model="name"
                               style="margin: 0 10px;width:50%;">
                        <span>*相同绩效的商品集合的名称。</span>
                    </div>
                </div>
                <div class="border_wrap">
                    <p class="titleWeight">等效项序号</p>
                    <div class="line_wrap" style="flex: 1;">
                        <input type="text" class="form-control" v-model="code"
                               style="margin: 0 10px;width:50%;">
                        <span>*表示等效项在业绩表中的列序。</span>
                    </div>
                </div>
                <div class="border_wrap">
                    <p class="titleWeight">业务类型</p>
                    <div>
                        <label class="checkbox-inline" v-for="item in tranType.tranTypeArr">
                            <input type="checkbox" name="tranType" :value="item.id"
                                   v-model="tranType.checkedArr">{{item.name}}</label>
                    </div>
                </div>
                <div class="border_wrap" v-if="merchantVersion === 'STANDARD'">
                    <p class="titleWeight">素/非素</p>
                    <div>
                        <label class="checkbox-inline" v-for="item in wareType.wareTypeArr">
                            <input type="checkbox" name="wareType"
                                   :value="item.id" v-model="wareType.checkedArr">{{item.name}}</label>
                    </div>
                </div>
                <div class="border_wrap" v-if="merchantVersion === 'STANDARD'">
                    <p class="titleWeight">精品/普货</p>
                    <div>
                        <label class="checkbox-inline" v-for="item in processingType.processingTypeArr">
                            <input type="checkbox" name="processingType" :value="item.id"
                                   v-model="processingType.checkedArr">{{item.name}}</label>
                    </div>
                </div>
                <div class="border_wrap">
                    <p class="titleWeight">金属</p>
                    <div>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="metal" v-model="metal.isCheckAll">全部</label>
                        <label class="checkbox-inline" v-for="item in metal.metalArr">
                            <input type="checkbox" name="metal" :value="item.id"
                                   v-model="metal.checkedArr">{{item.name}}</label>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="metal"
                                   v-model="metal.isCheckNone">无金属</label>
                    </div>
                </div>
                <div class="border_wrap">
                    <p class="titleWeight">宝石</p>
                    <div>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="gem" v-model="gem.isCheckAll">全部</label>
                        <label class="checkbox-inline" v-for="item in gem.gemArr">
                            <input type="checkbox" name="gem" :value="item.id"
                                   v-model="gem.checkedArr">{{item.name}}</label>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="gem"
                                   v-model="gem.isCheckNone">无宝石</label>
                    </div>
                </div>

                <div class="border_wrap">
                    <p class="titleWeight">品类</p>
                    <div>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="store" v-model="category.isCheckAll">全部</label>
                        <label class="checkbox-inline" v-for="item in category.categoryArr">
                            <input type="checkbox" name="store" :value="item.id"
                                   v-model="category.checkedArr">{{item.name}}</label>
                    </div>
                </div>
                <div class="border_wrap" v-if="merchantVersion === 'STANDARD'">
                    <p class="titleWeight">计价方式</p>
                    <div>
                        <label class="checkbox-inline" v-for="item in priceType.priceTypeArr">
                            <input type="checkbox" name="tranType" :value="item.id"
                                   v-model="priceType.checkedArr">{{item.name}}</label>
                    </div>
                </div>
                <div class="border_wrap">
                    <p class="titleWeight">状态</p>
                    <div class="right_item">
                        <label class="radio-inline"> <input type="radio" name="status" :value="true"
                                                            v-model="enabled">启用</label>
                        <label class="radio-inline"> <input type="radio" name="status" :value="false"
                                                            v-model="enabled">停用</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="text-align: center">
                <slot name="btn"></slot>
                <button type="button" class="btn btn-primary" @click="asure">确定</button>
                <button type="button" class="btn btn-success" @click="close">取消</button>
            </div>
        </form>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {baseUtil, constUtil} from '~/util'
    import {mapActions, mapGetters} from 'vuex'

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'refreshTable', 'item'],
        data() {
            return {
                wareType: {
                    wareTypeArr: [],
                    checkedArr: []
                },
                processingType: {
                    processingTypeArr: [],
                    checkedArr: []
                },
                tranType: {
                    checkedArr: [],
                    tranTypeArr: []
                },
                priceType: {
                    priceTypeArr: [],
                    checkedArr: []
                },
                category: {
                    categoryArr: [],
                    checkedArr: [],
                    isCheckAll: true
                },
                gem: {
                    gemArr: [],
                    checkedArr: [],
                    isCheckAll: true,
                    isCheckNone: true
                },
                metal: {
                    metalArr: [],
                    checkedArr: [],
                    isCheckAll: true,
                    isCheckNone: true
                },
                name: '',
                code: '',
                enabled: true
            }
        },
        computed: {
            ...mapGetters('retail/statisticalReport/statisticalRetail', {
                merchantVersion: 'getMerchantVersion'
            })
        },
        methods: {
            ...mapActions('retail/statisticalReport/statisticalRetail', {
                apiPostEquivalentItem: 'apiPostEquivalentItem',
                apiPutEquivalentItem: 'apiPutEquivalentItem'
            }),
            asure() {
                let sendParams = {
                    gemIds: this.gem.isCheckAll ? 'all' : this.gem.checkedArr.join(','),
                    metalIds: this.metal.isCheckAll ? 'all' : this.metal.checkedArr.join(','),
                    categoryIds: this.category.isCheckAll ? 'all' : this.category.checkedArr.join(','),
                    wareTypes: this.wareType.checkedArr.join(','),
                    processingTypes: this.processingType.checkedArr.join(','),
                    tranTypes: this.tranType.checkedArr.join(','),
                    priceTypes: this.priceType.checkedArr.join(','),
                    name: this.name,
                    code: this.code,
                    enabled: this.enabled
                }
                if (this.gem.isCheckNone) {
                    sendParams.gemIds += ',none';
                }
                if (this.metal.isCheckNone) {
                    sendParams.metalIds += ',none'
                }

                console.log('sendParams', sendParams);
                if (this.item) { // 修改
                    sendParams.packageId = this.item.id;
                    this.apiPutEquivalentItem({
                        params: sendParams,
                        callback: () => {
                            this.close()
                        }
                    })
                } else { // 新增
                    this.apiPostEquivalentItem({
                        params: sendParams,
                        callback: () => {
                            this.close()
                        }
                    })
                }
            },
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
                this.refreshTable()
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
                    if (arr.length < this[tag][tag + 'Arr'].length) {
                        this[tag].isCheckAll = false
                    } else {
                        this[tag].isCheckAll = true
                    }
                }
            },
            handleIsCheckAll(bool, tag) {
                if (bool) {
                    this[tag].checkedArr = this.checkedAll(this[tag][tag + 'Arr'])
                }
            },
            handleModifyArr(item, symbol) {
                let tempArr = item[symbol + 'Ids'].split(',');
                let metalFlag = tempArr.indexOf('all') !== -1
                this[symbol].isCheckAll = metalFlag
                // 处理none
                let index = tempArr.indexOf('none')
                if (index !== -1) {
                    this[symbol].isCheckNone = true
                    tempArr.splice(index, 1)
                } else {
                    this[symbol].isCheckNone = false
                }
                this[symbol].checkedArr = metalFlag ? this.checkedAll(this[symbol][symbol + 'Arr']) : tempArr
            },
            initData() {
                this.metal.checkedArr = this.checkedAll(this.metal.metalArr);
                this.gem.checkedArr = this.checkedAll(this.gem.gemArr);
                this.category.checkedArr = this.checkedAll(this.category.categoryArr);

                this.wareType.checkedArr = this.checkedAll(this.wareType.wareTypeArr);
                this.processingType.checkedArr = this.checkedAll(this.processingType.processingTypeArr);
                this.tranType.checkedArr = this.checkedAll(this.tranType.tranTypeArr);
                this.priceType.checkedArr = this.checkedAll(this.priceType.priceTypeArr);

                this.name = ''
                this.code = ''
                this.enabled = true
            },
            initModifyData(item) {
                this.code = item.code
                this.name = item.name
                this.enabled = item.enabled

                this.wareType.checkedArr = item.wareTypes.split(',')
                this.processingType.checkedArr = item.processingTypes.split(',')
                this.tranType.checkedArr = item.tranTypes.split(',')
                this.priceType.checkedArr = item.priceTypes.split(',')

                if (item.metalIds) {
                    this.handleModifyArr(item, 'metal')
                } else {
                    this.metal.isCheckAll = false
                    this.metal.isCheckNone = false
                }

                if (item.gemIds) {
                    this.handleModifyArr(item, 'gem')
                } else {
                    this.gem.isCheckAll = false
                    this.gem.isCheckNone = false
                }

                if (item.categoryIds) {
                    this.category.isCheckAll = item.categoryIds === 'all'
                    this.category.checkedArr = item.categoryIds === 'all' ? this.checkedAll(this.category.categoryArr) : item.categoryIds.split(',')
                } else {
                    this.category.isCheckAll = false
                }
            },
            watchFunc() {
                this.$watch('metal.isCheckAll', function (val) {
                    this.handleIsCheckAll(val, 'metal')
                })
                this.$watch('gem.isCheckAll', function (val) {
                    this.handleIsCheckAll(val, 'gem')
                })
                this.$watch('category.isCheckAll', function (val) {
                    this.handleIsCheckAll(val, 'category')
                })
                this.$watch('metal.checkedArr', function (val) {
                    this.handleCheckedArr(val, 'metal');
                }, {deep: true})
                this.$watch('gem.checkedArr', function (val) {
                    this.handleCheckedArr(val, 'gem');
                }, {deep: true})
                this.$watch('category.checkedArr', function (val) {
                    this.handleCheckedArr(val, 'category');
                }, {deep: true})
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            this.metal.metalArr = baseUtil.getMetadataMetal();
            this.gem.gemArr = baseUtil.getMetadataGem();
            this.category.categoryArr = baseUtil.getMetadataCategory();
            this.tranType.tranTypeArr = constUtil._CONST_BUSINESS_TYPE;
            this.wareType.wareTypeArr = constUtil._CONST_WARES_TYPE_EQUIVALENT;
            this.processingType.processingTypeArr = constUtil._CONST_PROCESSING_TYPE;
            if (this.merchantVersion === 'SMART') {
                this.tranType.tranTypeArr = constUtil._CONST_BUSINESS_TYPE_SMART;
            }
            this.priceType.priceTypeArr = constUtil._CONST_EQUIVALENT_PRICE_TYPE;
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
        width: 65px;
        font-weight: 600;
        flex-shrink: 0;
    }

    .border_wrap {
        display: flex;
        align-items: center;
        padding: 10px;
        margin-bottom: 5px;
    }

    .border_wrap > div {
        margin: 0 10px;
    }

    .border_wrap > .line_wrap {
        margin: 0px;
    }

    .line_wrap {
        display: flex;
        align-items: center;
        justify-content: left;
    }
</style>
