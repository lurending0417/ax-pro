<template>
    <div class="printNumberTemplateBox">
        <input type="number" :value="start" @change="changeStart"/>
        <input type="number" :value="end" @change="changeEnd"/>
        <button @click="closeModal()">取消</button>
        <button @click="print()">确认</button>
        <script>
            window.requireFFI = window.require
        </script>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions, mapGetters} from 'vuex'
    import {baseUtil} from '~/util'
    function TEcoding(str) {
        var iconv = require('iconv-lite')
        return iconv.encode(Buffer.from(str), 'gbk')
    }
    export default {
        props: ['type', 'CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL'],
        components: {},
        data () {
            return {
                printTemplateChecked: '',
                templates: {}, // 模板
                start: 1,
                end: 1,
                batchTemplates: [] // 批量打印
            }
        },
        computed: {
            ...mapGetters('storage/stock/procurementAdd', {
                preStockView: 'preStockView'
            }),
            ...mapGetters('storage/stock/procurementAdd', {
                getStockItemsView: 'stockItemsView'
            })
        },
        methods: {
            ...mapActions('storage/stock/procurementAdd', {
                getPrintInfo: 'getPrintInfo',
                goodsPrint: 'goodsPrint'
            }),
            checkedTemplate(template) {
                this.printTemplateChecked = template
                window.localStorage.setItem('printTemplateChecked', template)
            },
            batchPrint () {
                let hasTemplate = false
                for (let key in this.templates) {
                    if (key === this.printTemplateChecked) {
                        hasTemplate = true
                    }
                }
                if (hasTemplate) {
                    console.log('批量打印ing:', this.printTemplateChecked)
                    this.closeModal()
                } else {
                    console.log('请选择模板')
                }
            },
            closeModal () {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            print() {
                console.log(',,,,,,,,,,,,,,,')
                console.log(this.preStockView)
                console.log(this.preStockView.id)
                this.getPrintInfo({
                    stockBillId: this.preStockView.id,
                    callback: (data) => {
                        console.log(data)
                        let templates = baseUtil.getTemplates()
                        var isContain = true
                        var isMactch = true
                        console.log('sssssssssssssss')
                        console.log(data.rows.count)
                        for (var i = 0; i < data.rows.length; i++) {
                            console.log(data.rows[i])
                            if ((i >= this.start - 1) && (i < this.end)) {
                                console.log(data.rows[i].labelTemplateId)
                                if (!data.rows[i].labelTemplateId) {
                                    alert('第' + (i + 1) + '个模板未能匹配模板，请添加对应模板')
                                    isContain = false
                                    return
                                }
                                console.log(templates[data.rows[i].labelTemplateId])
                                if (!templates[data.rows[i].labelTemplateId]) {
                                    alert('未找到匹配模板,请刷新模板库或重新登录')
                                    isMactch = false
                                    return
                                }
                            }
                        }
                        if (isContain && isMactch) {
                            // if (this.start - 1 >= 0 && this.end - 1 <= list.count)
                            console.log('批量打印 ' + this.start + '——' + this.end)
                            console.log('=====')
                            var ffi = requireFFI('ffi')
                            var ref = requireFFI('ref')
                            var intP = ref.refType('int');
                            var DLL = ffi.Library('./TLXLabelPaint', {
                                'TLXOpenDocumentA': ['int', ['string', intP]],
                                'TLXSetNamedVariableA': ['int', ['int', 'string', 'string']],
                                'TLXSetNamedVariableW': ['int', ['int', 'string', 'string']],
                                'TLXOutputLabel': ['int', ['int', 'int', 'int']],
                                'TLXOutputDocument': ['int', ['int', 'int', 'int', 'int']],
                                'TLXOpenDocumentXMLA': ['int', ['string', intP, 'bool']],
                                'TLXOpenDocumentXMLW': ['int', ['string', intP, 'bool']],
                                'TLXCloseDocument': ['int', ['int']]
                            })
                            data.rows.map((item, index) => {
                                if ((index >= this.start - 1) && (index < this.end)) {
                                    var buffer = Buffer.alloc(32);
                                    DLL.TLXOpenDocumentXMLA(TEcoding(templates[item.labelTemplateId]), buffer, false)
                                    if (item.storage.modelCode) {
                                        DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('版号'), TEcoding(item.storage.modelCode))
                                    }
                                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('条码'), item.storage.serial)
                                    // 金属 + 宝石 + 品类
                                    //  基础信息(金属 + 宝石 + 品类)
                                    var proName = ''
                                    if (item.storage.metalName) {
                                        proName += item.storage.metalName
                                        DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('金属'), TEcoding(item.storage.metalName))
                                    }
                                    if (item.storage.gemName) {
                                        proName += item.storage.gemName
                                        DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('宝石'), TEcoding(item.storage.gemName))
                                    }
                                    if (item.storage.categoryName) {
                                        proName += item.storage.categoryName
                                        DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('品类'), TEcoding(item.storage.categoryName))
                                    }
                                    if (item.storage.craftName) {
                                        DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('工艺'), TEcoding(item.storage.craftName))
                                    }
                                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('基础信息'), TEcoding(proName))
                                    if (item.storage.moralName) {
                                        DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('寓意名'), TEcoding(item.storage.moralName))
                                    }
                                    if (item.storage.computedProcessingCharges > 0) {
                                        DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('工费'), TEcoding(item.storage.computedProcessingCharges + '元'))
                                    }
                                    if (item.storage.regularPrice > 0) {
                                        DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('原价'), TEcoding(item.storage.regularPrice + '元'))
                                    }
                                    if (item.storage.retailPrice > 0) {
                                        DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('折后价'), TEcoding(item.storage.retailPrice + '元'))
                                    }
                                    if (item.storage.mainGemWeight) {
                                        DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('主石'), TEcoding(item.storage.mainGemWeight + 'ct/' + item.storage.mainGemAmount))
                                    }
                                    if (data.rows[0].storage.mainGemWeight) {
                                        DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('宝石重量'), TEcoding(data.rows[0].storage.mainGemWeight + 'g/' + data.rows[0].storage.mainGemAmount))
                                    }
                                    DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding('总重量'), TEcoding(item.storage.weight + item.storage.weightUnit))
                                    item.props.map((item, index) => {
                                        if (item.fieldValue) {
                                            DLL.TLXSetNamedVariableA(buffer.readInt32LE(0), TEcoding(item.fieldName), TEcoding(item.fieldValue))
                                        }
                                    })
                                    // var fff = DLL.TLXOutputLabel(1, 1, 0)
                                    var fff = DLL.TLXOutputDocument(buffer.readInt32LE(0), 1, 1, 0)
                                    var out = DLL.TLXCloseDocument(buffer.readInt32LE(0))
                                    console.log(fff)
                                }
                            })
                            this.closeModal()
                        }
                    }
                })
            },
            changeStart (e) {
                this.start = e.target.value
            },
            changeEnd (e) {
                this.end = e.target.value
            },
            init () {
                this.printTemplateChecked = ''
                this.templates = {}
                this.start = 1
                this.end = 1
                this.batchTemplates = [] // 批量打印
            }
        },
        mounted () {
            // this.templates = JSON.parse(window.localStorage.getItem('printTemplate'))
            // this.printTemplateChecked = window.localStorage.getItem('printTemplateChecked')
            // this.batchTemplates = JSON.parse(localStorage.getItem('printTemplateBatch'))
            // if (JSON.parse(localStorage.getItem('printTemplateBatch'))) {
            //     this.end = JSON.parse(localStorage.getItem('printTemplateBatch')).length + 1
            // }
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.goodsPrint({})
            })
        }
    }
</script>
<style>
    .printNumberTemplateBox {
        padding: 10px;
    }
</style>
