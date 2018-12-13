<template>
    <div class="printNumberTemplateBox">
        <input type="number" :value="start" @change="changeStart"/>
        <input type="number" :value="end" @change="changeEnd"/>
        <button @click="closeModal()">取消</button>
        <button @click="print()">确认</button>
        <script>
            //            window.requireFFI = window.require
        </script>
    </div>
</template>

<script>
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'

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
        methods: {
            checkedTemplate (template) {
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
            print () {
//                var list = localStorage.getItem('printTemplateBatch')
//                let templates = JSON.parse(window.localStorage.getItem('printTemplate'))
//                let printTemplateChecked = window.localStorage.getItem('printTemplateChecked')
                console.log('批量打印 ' + this.start + '——' + this.end)
                console.log('=====')
//                var ffi = requireFFI('ffi')
//                var ref = requireFFI('ref')
//                var intP = ref.refType('int');
//                var DLL = ffi.Library('./TLXLabelPaint', {
//                    'TLXOpenDocumentA': ['int', ['string', intP]],
//                    'TLXSetNamedVariableA': ['int', ['int', 'string', 'string']],
//                    'TLXSetNamedVariableW': ['int', ['int', 'string', 'string']],
//                    'TLXOutputLabel': ['int', ['int', 'int', 'int']],
//                    'TLXOutputDocument': ['int', ['int', 'int', 'int', 'int']],
//                    'TLXOpenDocumentXMLA': ['int', ['string', intP, 'bool']],
//                    'TLXOpenDocumentXMLW': ['int', ['string', intP, 'bool']]
//                })
//                var data = JSON.parse(list)
//                console.log(data)
//                console.log(templates[printTemplateChecked])
//                    data.map((item, index) => {
//                        console.log('ssssssssssssssssssssss')
//                        var out = DLL.TLXOpenDocumentXMLW(templates[printTemplateChecked].charCodeAt(0).toString(16), Buffer.alloc(index + 1), false)
//                        console.log(out)
//                        var dddd = DLL.TLXSetNamedVariableA(index, 'moralName', item.storage.moralName)
//                        console.log(dddd)
//                        DLL.TLXSetNamedVariableA(index, 'serial', item.storage.serial)
//                        DLL.TLXSetNamedVariableA(index, 'weight', item.storage.weight.toString())
//                        DLL.TLXSetNamedVariableA(index, 'costPrice', item.storage.costPrice.toString())
//                        // DLL.TLXSetNamedVariableA(0, '数量', data.rows[0].storage.amount)
//                        DLL.TLXOutputDocument(1, 1, 1, 0)
//                    })
//                this.closeModal()
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
            this.templates = JSON.parse(window.localStorage.getItem('printTemplate'))
            this.printTemplateChecked = window.localStorage.getItem('printTemplateChecked')
            this.batchTemplates = JSON.parse(localStorage.getItem('printTemplateBatch'))
            if (JSON.parse(localStorage.getItem('printTemplateBatch'))) {
                this.end = JSON.parse(localStorage.getItem('printTemplateBatch')).length + 1
            }
        }
    }
</script>

<style>
    .printNumberTemplateBox {
        padding: 10px;
    }
</style>
