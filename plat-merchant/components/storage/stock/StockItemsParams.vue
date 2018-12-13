<template>
    <div :class="index">
        <div class="modal-body">
            <fieldset>
                <legend>基础信息</legend>
                <TableCpn :heads="[
                        {propName:'serial',name:'条码'},
                        {propName:'weight',name:'总质量'},
                        {propName:'costPrice',name:'成本价'},
                        {propName:'regularPrice',name:'零售价(原价)'},
                        {propName:'retailPrice',name:'零售价(折后)'}
                    ]" :items="[item]">
                </TableCpn>
            </fieldset>

            <div v-if="canChange">
                <div v-if="getCategoryParams.props && getCategoryParams.props.length > 0">
                    <fieldset>
                        <legend>{{getCategoryParams.name}}</legend>
                        <div v-for="props in getCategoryParams.props" class="form-group" style="padding: 7px">
                            <label class="control-label form-control-static col-md-2">{{props.name}}</label>
                            <div class="form-control-static col-md-10" style="text-align: left">
                                <span v-for="value in props.preValues" class="normal m-r">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" v-bind:value="value"
                                               :data-type="props.name+'_category'"/>
                                    </span>
                                    <span v-else>
                                        <input :type="props.inputType" :name="props.id" v-bind:value="value"
                                               :data-type="props.name+'_category'"/>{{value}}
                                    </span>
                                </span>
                                <span v-if="!props.preValues.length">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" :data-type="props.name+'_category'"/>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div v-if="getGemParams.props && getGemParams.props.length > 0">
                    <fieldset>
                        <legend>{{getGemParams.name}}</legend>
                        <div v-for="props in getGemParams.props" class="form-group" style="padding: 7px">
                            <label class="control-label form-control-static col-md-2">{{props.name}}</label>
                            <div class="form-control-static col-md-10" style="text-align: left">
                                <span v-for="value in props.preValues" class="normal m-r">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" :value="value" :data-type="props.name+'_gem'"/>
                                    </span>
                                    <span v-else>
                                        <input :type="props.inputType" :name="props.id" :value="value"
                                               :data-type="props.name+'_gem'"/>{{value}}
                                    </span>
                                </span>
                                <span  v-if="!props.preValues.length">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" :data-type="props.name+'_gem'"/>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div v-if="getMetalParams.props && getMetalParams.props.length > 0">
                    <fieldset>
                        <legend>{{getMetalParams.name}}</legend>
                        <div v-for="props in getMetalParams.props" class="form-group" style="padding: 7px">
                            <label class="control-label form-control-static col-md-2">{{props.name}}</label>
                            <div class="form-control-static col-md-10" style="text-align: left">
                                <span v-for="value in props.preValues" class="normal m-r">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" :value="value" :data-type="props.name+'_metal'"/>
                                    </span>
                                    <span v-else>
                                        <input :type="props.inputType" :name="props.id" :value="value"
                                               :data-type="props.name+'_metal'"/>{{value}}
                                    </span>
                                </span>
                                <span  v-if="!props.preValues.length">
                                    <span v-if="props.inputType === 'INPUT'">
                                        <input type="text" :name="props.id" :data-type="props.name+'_metal'"/>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>

            <div v-else>
                <fieldset>
                    <legend>参数信息</legend>
                    <div v-for="prop in getStockItemParams.props">
                        <span style="font-weight: bold">{{prop.fieldName}}</span>：{{prop.fieldValue}}
                    </div>
                </fieldset>
            </div>
        </div>

        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="closeModal('addModal')">关闭
            </button>
            <button v-if="canChange" type="button" class="btn btn-primary" @click="clickPutParams">保存</button>
        </div>
    </div>
</template>

<script>
    import { mapMutations, mapActions, mapGetters } from 'vuex'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import TableCpn from '~/components/Table'

    export default {
        components: {
            TableCpn
        },
        props: ['item', 'CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'index', 'canChange'],
        data () {
            return {
                params: {
                    storageId: '',
                    propsId: []
                }
            }
        },
        computed: {
            ...mapGetters('storage/stock/stockItemsParams', {
                getStockItemParams: 'getStockItemParams',
                getCategoryParams: 'getCategoryParams',
                getGemParams: 'getGemParams',
                getMetalParams: 'getMetalParams'
            })
        },
        methods: {
            ...mapMutations('storage/stock/stockItemsParams', {
                resetCategoryParams: 'resetCategoryParams',
                resetGemParams: 'resetGemParams',
                resetMetalParams: 'resetMetalParams'
            }),
            ...mapActions('storage/stock/stockItemsParams', {
                apiGetStockItemParams: 'apiGetStockItemParams',
                apiPutStockItemParams: 'apiPutStockItemParams'
            }),
            closeModal (name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
            },
            clickPutParams (event) {
                let eleDoms = event.target.parentNode.parentNode.querySelectorAll('input')
                console.log(eleDoms)
                // 拼装props参数
                let props = []
                this.params.propsId.forEach(propId => {
                    // let doms = document.getElementsByName(propId)
                    let value = ''
                    // console.log(doms)
                    eleDoms.forEach(dom => {
                        if (dom.name === propId) {
                            if (dom.type === 'text') {
                                value = value + dom.value + ','
                            } else {
                                if (dom.checked) {
                                    value = value + dom.value + ','
                                }
                            }
                        }
                    })
                    if (value !== '') {
                        value = value.substring(0, value.length - 1)
                    }
                    props.push({
                        fieldId: propId,
                        value: value
                    })
                })
                this.apiPutStockItemParams({
                    storageId: this.item.id,
                    props: JSON.stringify(props),
                    callback: () => {
                        this.closeModal()
                    }
                })
            },
            initData () {
                // 判断从{库存明细}中进入，还是从{退货单明细}中进入到详情页面
                if (this.item.storageId) {
                    console.log('退货单明细');
                    // 从退货单明细中进入时，商品id是storageId
                    this.params.storageId = this.item.storageId
                } else {
                    console.log('库存明细');
                    // 从库存明细中进入时，商品id是id
                    this.params.storageId = this.item.id
                }
                console.log(this.item)
                this.apiGetStockItemParams({
                    params: this.params,
                    callback: (data) => {
                        console.log(this.canChange)
                        if (this.canChange) {
                            // 设置当前的参数id
                            this.resetCategoryParams(data.storage.categoryId)
                            this.resetGemParams(data.storage.gemId)
                            this.resetMetalParams(data.storage.metalId)
                            this.getCategoryParams.props.forEach(category => {
                                if (this.params.propsId.indexOf(category.id) === -1) {
                                    this.params.propsId.push(category.id)
                                }
                            })
                            this.getGemParams.props.forEach(gem => {
                                if (this.params.propsId.indexOf(gem.id) === -1) {
                                    this.params.propsId.push(gem.id)
                                }
                            })
                            this.getMetalParams.props.forEach(metal => {
                                if (this.params.propsId.indexOf(metal.id) === -1) {
                                    this.params.propsId.push(metal.id)
                                }
                            })
                            setTimeout(() => this.initChoose(data), 100)
                        }
                    }
                })
            },
            initChoose (data) {
                // 自动勾选已选中的参数
                let doms = document.querySelector('.' + this.index).querySelectorAll('input')
                // 初始化选择框和输入框
                doms.forEach(dom => {
                    if (dom.type === 'INPUT') {
                        dom.value = ''
                    } else {
                        dom.checked = false
                    }
                })
                // 设置值到选择框或输入框中
                // data.props.forEach(item => {
                //     doms.forEach(dom => {
                //         item.fieldValue.forEach(value => {
                //             if (value === dom.value) {
                //                 if (dom.type === 'INPUT') {
                //                     dom.value = value
                //                 } else {
                //                     dom.checked = true
                //                 }
                //             }
                //         })
                //     })
                // })
                let rows = data.props
                for (let i = 0, j = doms.length; i < j; i++) {
                    let temp = doms[i].dataset.type.split('_');
                    let paramsType = temp[0]; // fieldName
                    let name = temp[1].toUpperCase(); // category, gem, metal
                    for (let ii = 0, jj = rows.length; ii < jj; ii++) {
                        if (name === rows[ii].type && rows[ii].fieldName === paramsType) {
                            if (doms[i].type === 'text') {
                                doms[i].value = rows[ii].fieldValue
                            } else {
                                rows[ii].fieldValue.split(',').forEach(value => {
                                    if (value === doms[i].value) {
                                        doms[i].checked = true
                                    }
                                })
                            }
                            break
                        }
                    }
                }
            }
        },
        mounted () {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.initData()
            })
        }
    }
</script>
