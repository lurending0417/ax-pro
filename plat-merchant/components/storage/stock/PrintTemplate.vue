<template>
    <div class="printTemplateBox">
        &nbsp;&nbsp;&nbsp;模板：
        <span v-if="templates && templates !== {}">
            <span v-for="template in Object.keys(templates)">
            <span v-if="template === printTemplateChecked">
                <button class="btn btn-danger printTemplateButton"
                        @click="checkedTemplate(template)">{{ template}}</button>
            </span>
            <span v-else>
                <button class="btn btn-default printTemplateButton"
                        @click="checkedTemplate(template)">{{ template}}</button>
            </span>
        </span>
        </span>
        <div v-if="type && type === 'batchPrint'">
            <ButtonWithModal
                :btnProps="{
                                btnClasses: ['btn btn-primary printTemplateButton'],
                                btnStyle: {marginRight: 10 + 'px'},
                                btnName: '选中模板并批量打印'
                            }"
                :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'batchPrint',
                                modalClasses: [''],
                                titleName: '批量打印'
                            }">
                <PrintNumberTemplate slot="main"
                                     :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                     :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'batchPrint'"></PrintNumberTemplate>
            </ButtonWithModal>
        </div>
        <div v-else>
            <button class="btn btn-primary printTemplateButton" @click="closeModal()">
                确定
            </button>
        </div>
    </div>
</template>

<script>
    import ButtonWithModal from '~/components/ButtonWithModal'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import PrintNumberTemplate from '~/components/storage/stock/PrintNumberTemplate'
    import uuid from 'uuid'
    import { mapActions } from 'vuex'

    export default {
        props: ['type', 'CONST_CLOSE_MODAL'],
        components: {
            ButtonWithModal,
            PrintNumberTemplate
        },
        data () {
            return {
                printTemplateChecked: '',
                templates: {},
                CONST_CLICK_MODAL: uuid()
            }
        },
        methods: {
            ...mapActions('storage/stock/procurementAdd', {
                goodsPrint: 'goodsPrint'
            }),
            checkedTemplate (template) {
                this.printTemplateChecked = template
                window.localStorage.setItem('printTemplateChecked', template)

//                this.goodsPrint({})
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
            }
        },
        mounted () {
            this.templates = JSON.parse(window.localStorage.getItem('printTemplate'))
            this.printTemplateChecked = window.localStorage.getItem('printTemplateChecked')
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.goodsPrint({})
            })
        }
    }
</script>

<style>
    .printTemplateBox {
        text-align: left;
    }

    .printTemplateBox .printTemplateButton {
        margin: 10px;
    }
</style>
