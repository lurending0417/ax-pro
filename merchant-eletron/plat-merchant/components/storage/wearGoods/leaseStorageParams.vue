<template>
    <div>
        <div class="modal-body">
            <div v-if="getCategoryParams.props && getCategoryParams.props.length > 0">
                <fieldset>
                    <legend>{{getCategoryParams.name}}</legend>
                    <div v-for="props in getCategoryParams.props" class="form-group" style="padding: 7px" v-if="!props.isNotShow">
                        <label class="control-label form-control-static col-md-2">{{props.name}}</label>
                        <div class="form-control-static col-md-10" style="text-align: left">
                            <span v-for="(value, index) in props.preValues" class="normal m-r">
                                <span v-if="props.inputType === 'INPUT'">
                                    <input type="text" :name="props.id" :placeholder="value"
                                           v-model="props.gettedValue"
                                           :disabled="pageReadOnly || props.disabled"/>
                                </span>
                                <span v-else-if="props.inputType === 'RADIO'">
                                    <input type="radio" v-bind:value="value" v-model="props.gettedValue"
                                           :id="props.id+index" :name="props.id" :key="index"
                                           :disabled="pageReadOnly || props.disabled"/>{{value}}
                                </span>
                                <span v-else-if="props.inputType === 'CHECKBOX'">
                                    <input type="checkbox" :name="props.id" v-bind:value="value"
                                           v-model="props.gettedValue"
                                           :disabled="pageReadOnly || props.disabled"/>{{value}}
                                </span>
                            </span>
                            <span v-if="!props.preValues" >
                                <span v-if="props.inputType === 'INPUT'">
                                    <input type="text" :name="props.id" v-model="props.gettedValue"
                                           :disabled="pageReadOnly || props.disabled"/>
                                </span>
                            </span>
                        </div>
                    </div>
                </fieldset>
            </div>

            <div v-if="getGemParams.props && getGemParams.props.length > 0">
                <fieldset>
                    <legend>{{getGemParams.name}}</legend>
                    <div v-for="props in getGemParams.props" class="form-group" style="padding: 7px" v-if="!props.isNotShow">
                        <label class="control-label form-control-static col-md-2">{{props.name}}</label>
                        <div class="form-control-static col-md-10" style="text-align: left">
                                <span v-for="(value, index) in props.preValues" class="normal m-r">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" :placeholder="value"
                                               v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"/>
                                    </span>
                                    <span v-else-if="props.inputType === 'RADIO'">
                                        <input type="radio" v-bind:value="value" v-model="props.gettedValue"
                                               :id="props.id+index" :name="props.id" :key="index"
                                               :disabled="pageReadOnly || props.disabled"/>{{value}}
                                    </span>
                                    <span v-else-if="props.inputType === 'CHECKBOX'">
                                        <input type="checkbox" :name="props.id" v-bind:value="value"
                                               v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"/>{{value}}
                                    </span>
                                </span>
                            <span v-if="!props.preValues">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"/>
                                    </span>
                                </span>
                        </div>
                    </div>
                </fieldset>
            </div>

            <div v-if="getMetalParams.props && getMetalParams.props.length > 0">
                <fieldset>
                    <legend>{{getMetalParams.name}}</legend>
                    <div v-for="props in getMetalParams.props" class="form-group" style="padding: 7px" v-if="!props.isNotShow">
                        <label class="control-label form-control-static col-md-2">{{props.name}}</label>
                        <div class="form-control-static col-md-10" style="text-align: left">
                                <span v-for="(value, index) in props.preValues" class="normal m-r">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" :placeholder="value"
                                               v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"/>
                                    </span>
                                    <span v-else-if="props.inputType === 'RADIO'">
                                        <input type="radio" v-bind:value="value" v-model="props.gettedValue"
                                               :id="props.id+index" :name="props.id" :key="index"
                                               :disabled="pageReadOnly || props.disabled"/>{{value}}
                                    </span>
                                    <span v-else-if="props.inputType === 'CHECKBOX'">
                                        <input type="checkbox" :name="props.id" v-bind:value="value"
                                               v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"/>{{value}}
                                    </span>
                                </span>
                            <span v-if="!props.preValues">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" v-model="props.gettedValue"
                                               :disabled="pageReadOnly || props.disabled"/>
                                    </span>
                                </span>
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="clickPutParams">{{pageReadOnly ? '返回' : '保存'}}
            </button>
        </div>
    </div>
</template>

<script>
    import {mapMutations, mapGetters, mapActions} from 'vuex'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import TableCpn from '~/components/Table'
    import ParamItemGroup from '~/components/ParamItemGroup'

    export default {
        components: {
            TableCpn,
            ParamItemGroup
        },
        props: ['params', 'CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'billId'],
        data() {
            return {
                propsId: [],
                currentEvent: '',
                pageReadOnly: false
            }
        },
        computed: {
            ...mapGetters('storage/wearStorage/leaseStorageParams', {
                getCategoryParams: 'getCategoryParams',
                getGemParams: 'getGemParams',
                getMetalParams: 'getMetalParams'
            })
        },
        methods: {
            ...mapMutations('storage/wearStorage/leaseStorageParams', {
                resetBillId: 'resetBillId',
                resetItemId: 'resetItemId',
                resetAllParams: 'resetAllParams',
                resetCategoryParams: 'resetCategoryParams',
                resetGemParams: 'resetGemParams',
                resetMetalParams: 'resetMetalParams'
            }),
            ...mapActions('storage/wearStorage/leaseStorageParams', {
                apiGetLeaseParams: 'apiGetLeaseParams'
            }),
            clickPutParams() {
                this.params.props = this.handleParams(this.getCategoryParams).concat(this.handleParams(this.getGemParams), this.handleParams(this.getMetalParams))
                console.log('this.params.props', this.params.props);
                this.closeModal()
            },
            handleParams(obj) {
                let arr = []
                if (obj.props && obj.props.length > 0) {
                    obj.props.forEach(item => {
                        if (item.gettedValue) {
                            if (item.gettedValue instanceof Array) {
                                console.log('item.gettedValue', item.gettedValue.length, item.gettedValue);
                                item.gettedValue = item.gettedValue.join()
                            }
                            arr.push({
                                fieldId: item.id,
                                value: item.gettedValue
                            });
                        }
                    })
                }
                console.log('arr', arr);
                return arr
            },
            closeModal(name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                // 根据当前传入的item,判断参数类型
                this.resetAllParams()
                let curItem = this.params;
                if (curItem.id && this.billId) { // 点击详情进入时，调用接口获取当前props
                    this.pageReadOnly = true;
                    this.apiGetLeaseParams({
                        params: {
                            billId: this.billId,
                            itemId: curItem.id
                        },
                        callback: (rows) => {
                            let gettedArr = []
                            rows.forEach(item => {
                                gettedArr.push({
                                    fieldId: item.fieldId,
                                    value: item.fieldValue
                                });
                            })
                            if (curItem.categoryId) {
                                this.resetCategoryParams({
                                    categoryId: curItem.categoryId,
                                    gettedArr
                                })
                            }
                            if (curItem.metalId) {
                                this.resetMetalParams({
                                    metalId: curItem.metalId,
                                    gettedArr
                                })
                            }
                            if (curItem.gemId) {
                                this.resetGemParams({
                                    gemId: curItem.gemId,
                                    gettedArr
                                })
                            }
                        }
                    })
                } else {
                    if (curItem.categoryId) {
                        this.resetCategoryParams({
                            categoryId: curItem.categoryId,
                            gettedArr: curItem.props
                        })
                    }
                    if (curItem.metalId) {
                        this.resetMetalParams({
                            metalId: curItem.metalId,
                            gettedArr: curItem.props
                        })
                    }
                    if (curItem.gemId) {
                        this.resetGemParams({
                            gemId: curItem.gemId,
                            gettedArr: curItem.props
                        })
                    }
                }
            })
        }
    }
</script>

<style scoped>
    input[type=text]::-webkit-input-placeholder {
        color: #abacad;
    }
</style>
