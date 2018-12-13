<template>
    <div :class="index">
        <div style="margin: 10px;padding: 10px;border:1px solid gainsboro;overflow: hidden">
            <div class="form-inline" style="text-align: left">
                <div class="form-group form-group-margin">
                    <label class="titleNameSize control-label">基础信息</label>
                </div>
            </div>
            <div class="row" style="padding-left: 15px">
                <div class="form-group form-group-margin" style="line-height: 36px">
                    <label class="col-sm-1 control-label">条码</label>
                    <span class="col-sm-2">{{params.serial}}</span>
                </div>
                <div class="form-group form-group-margin">
                    <label class="col-sm-1 control-label">总质量</label>
                    <span class="col-sm-2">{{params.weight}}</span>
                </div>
                <div class="form-group form-group-margin">
                    <label class="col-sm-1 control-label">成本价</label>
                    <span class="col-sm-2">{{params.costPrice}}</span>
                </div>
                <div class="form-group form-group-margin">
                    <label class="col-sm-1 control-label">零售价(原价)</label>
                    <span class="col-sm-2">{{params.regularPrice}}</span>
                </div>
            </div>
            <div class="row" style="padding-left: 15px">
                <div class="form-group form-group-margin">
                    <label class="col-sm-1 control-label">零售价(折后)</label>
                    <span class="col-sm-2">{{params.retailPrice}}</span>
                </div>
            </div>
        </div>

        <div v-if="getCategoryParams.props && getCategoryParams.props.length > 0"
             style="margin: 10px;padding: 10px;border:1px solid gainsboro;overflow: hidden">
            <div class="form-inline" style="text-align: left">
                <div class="form-group form-group-margin">
                    <label class="titleNameSize control-label">{{getCategoryParams.name}}</label>
                </div>
            </div>
            <div v-for="props in getCategoryParams.props" class="form-group" style="padding: 7px">
                <label class="control-label form-control-static col-md-1">{{props.name}}</label>
                <div class="form-control-static col-md-11" style="text-align: left">
                    <span v-for="value in props.preValues" class="normal m-r">
                        <span v-if="props.inputType === 'INPUT'">
                            <input :type="props.inputType" :name="props.id" disabled :value="value"/>
                        </span>
                        <span v-else>
                            <input :type="props.inputType" :name="props.id" disabled :value="value"/>{{value}}
                        </span>
                    </span>
                </div>
            </div>
        </div>

        <div v-if="getGemParams.props && getGemParams.props.length > 0"
             style="margin: 10px;padding: 10px;border:1px solid gainsboro;overflow: hidden">
            <div class="form-inline" style="text-align: left">
                <div class="form-group form-group-margin">
                    <label class="titleNameSize control-label">{{getGemParams.name}}</label>
                </div>
            </div>
            <div v-for="props in getGemParams.props" class="form-group" style="padding: 7px">
                <label class="control-label form-control-static col-md-1">{{props.name}}</label>
                <div class="form-control-static col-md-11" style="text-align: left">
                        <span v-for="value in props.preValues" class="normal m-r">
                            <span v-if="props.inputType === 'INPUT'">
                                <input :type="props.inputType" :name="props.id" disabled :value="value"/>
                            </span>
                            <span v-else>
                                <input :type="props.inputType" :name="props.id" disabled :value="value"/>{{value}}
                            </span>
                        </span>
                </div>
            </div>
        </div>

        <div v-if="getMetalParams.props && getMetalParams.props.length > 0"
             style="margin: 10px;padding: 10px;border:1px solid gainsboro;overflow: hidden">
            <div class="form-inline" style="text-align: left">
                <div class="form-group form-group-margin">
                    <label class="titleNameSize control-label">{{getMetalParams.name}}</label>
                </div>
            </div>
            <div v-for="props in getMetalParams.props" class="form-group" style="padding: 7px">
                <label class="control-label form-control-static col-md-1">{{props.name}}</label>
                <div class="form-control-static col-md-11" style="text-align: left">
                        <span v-for="value in props.preValues" class="normal m-r">
                            <span v-if="props.inputType === 'INPUT'">
                                <input :type="props.inputType" :name="props.id" disabled :value="value"/>
                            </span>
                            <span v-else>
                                <input :type="props.inputType" :name="props.id" disabled :value="value"/>{{value}}
                            </span>
                        </span>
                </div>
            </div>
        </div>

        <div class="modal-footer" style="text-align: center;">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModal('addModal')">关闭
            </button>
        </div>
    </div>
</template>

<script>
    import {mapMutations, mapActions, mapGetters} from 'vuex'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'

    export default {
        props: ['params', 'CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'index'],
        data() {
            return {
                propsId: [],
                currentEvent: ''
            }
        },
        computed: {
            ...mapGetters('storage/stock/procurementParams', {
                getProcurementParams: 'getProcurementParams',
                getCategoryParams: 'getCategoryParams',
                getGemParams: 'getGemParams',
                getMetalParams: 'getMetalParams'
            })
        },
        methods: {
            ...mapMutations('storage/stock/procurementParams', {
                resetBillId: 'resetBillId',
                resetItemId: 'resetItemId',
                resetCategoryParams: 'resetCategoryParams',
                resetGemParams: 'resetGemParams',
                resetMetalParams: 'resetMetalParams'
            }),
            ...mapActions('storage/stock/procurementParams', {
                apiGetProcurementParams: 'apiGetProcurementParams',
                apiPutProcurementParams: 'apiPutProcurementParams'
            }),
            closeModal(name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.resetBillId(this.params.billId)
                this.resetItemId(this.params.id)
                this.apiGetProcurementParams((data) => {
                    var doms = document.querySelector('.' + this.index).querySelectorAll('input')
                    data.rows.forEach(item => {
                        doms.forEach(dom => {
                            item.fieldValue.split(',').forEach(value => {
                                if (value === dom.value) {
                                    console.log(value)
                                    if (dom.type === 'INPUT') {
                                        dom.value = value
                                    } else {
                                        dom.checked = true
                                    }
                                }
                            })
                        })
                    })
                })
                // 设置当前的参数id
                this.resetCategoryParams(this.params.categoryId)
                this.resetGemParams(this.params.gemId)
                this.resetMetalParams(this.params.metalId)
                this.getCategoryParams.props.forEach(category => {
                    this.propsId.push(category.id)
                })
                this.getGemParams.props.forEach(gem => {
                    this.propsId.push(gem.id)
                })
                this.getMetalParams.props.forEach(metal => {
                    this.propsId.push(metal.id)
                })
            })
        }
    }
</script>
