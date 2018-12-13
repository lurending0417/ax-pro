<template>
    <div>
        <div class="modal-body">
            <fieldset>
                <legend>基础信息</legend>
                <TableCpn :heads="[
                        {propName:'serial',name:'条码'},
                        {propName:'weight',name:'总质量'},
                        {propName:'costPrice',name:'成本价'},
                        {propName:'regularPrice',name:'零售价(原价)'},
                        {propName:'retailPrice',name:'零售价(折后)'}
                    ]" :items="[params]">
                </TableCpn>
            </fieldset>

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
                                           :id="radioId+index" :name="radioId" :key="index"
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

            <div v-if="getGemParams.props && getGemParams.props.length > 0">
                <fieldset>
                    <legend>{{getGemParams.name}}</legend>
                    <div v-for="props in getGemParams.props" class="form-group" style="padding: 7px" v-if="!props.isNotShow">
                        <label class="control-label form-control-static col-md-2">{{props.name}}</label>
                        <div class="form-control-static col-md-10" style="text-align: left">
                            <span v-for="(value, index) in props.preValues" class="normal m-r">
                                <span v-if="props.inputType === 'INPUT'">
                                    <input type="text" :name="props.id" :placeholder="value" v-model="props.gettedValue"
                                           :disabled="pageReadOnly || props.disabled"/>
                                </span>
                                <span v-else-if="props.inputType === 'RADIO'">
                                    <input type="radio" v-bind:value="value" v-model="props.gettedValue"
                                           :id="radioId+index" :name="radioId" :key="index"
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
                                    <input type="text" :name="props.id" :placeholder="value" v-model="props.gettedValue"
                                           :disabled="pageReadOnly || props.disabled" :key="index"/>
                                </span>
                                <span v-else-if="props.inputType === 'RADIO'">
                                    <input type="radio" v-bind:value="value" v-model="props.gettedValue"
                                           :id="radioId+index" :name="radioId" :key="index"
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
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModal('addModal')">关闭
            </button>
            <button type="button" class="btn btn-primary" @click="clickPutParams" v-if="!pageReadOnly">保存</button>
        </div>
    </div>
</template>

<script>
    import {mapMutations, mapActions, mapGetters} from 'vuex'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import TableCpn from '~/components/Table'
    import uuid from 'uuid'

    export default {
        components: {
            TableCpn
        },
        data() {
            return {
                radioId: uuid()
            }
        },
        props: ['params', 'CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'pageReadOnly'],
        computed: {
            ...mapGetters('storage/stock/procurementParams', {
                getCategoryParams: 'getCategoryParams',
                getGemParams: 'getGemParams',
                getMetalParams: 'getMetalParams'
            })
        },
        methods: {
            ...mapMutations('storage/stock/procurementParams', {
                resetAllParams: 'resetAllParams',
                resetCategoryParams: 'resetCategoryParams',
                resetGemParams: 'resetGemParams',
                resetMetalParams: 'resetMetalParams'
            }),
            ...mapActions('storage/stock/procurementParams', {
                apiGetProcurementParams: 'apiGetProcurementParams',
                apiPutProcurementParams: 'apiPutProcurementParams'
            }),
            clickPutParams(event) {
                let props = this.handleParams(this.getCategoryParams).concat(this.handleParams(this.getGemParams), this.handleParams(this.getMetalParams))
                console.log('props', props);
                this.apiPutProcurementParams({
                    params: {
                        props: JSON.stringify(props),
                        billId: this.params.billId,
                        itemId: this.params.id
                    },
                    callback: () => {
                        this.closeModal()
                    }
                })
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
            },
            watchClose() {
                ButtonWithModalEvent.$on(this.CONST_CLOSE_MODAL, () => {
                    this.resetAllParams()
                })
            }
        },
        mounted() {
            this.watchClose()
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                console.log('this.params', this.params);
                this.resetAllParams()
                // 根据当前传入的item,判断参数类型
                let curItem = this.params;
                this.apiGetProcurementParams({
                    params: {
                        billId: curItem.billId,
                        itemId: curItem.id
                    },
                    callback: (data) => {
                        let rows = data.rows
                        let gettedArr = []
                        console.log('rows', rows)
                        rows.forEach(item => {
                            gettedArr.push({
                                fieldId: item.fieldId,
                                value: item.fieldValue
                            });
                        })
                        console.log()
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
            })
        }
    }
</script>
