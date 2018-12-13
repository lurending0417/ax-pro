<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <Table :heads="heads" :items="items"></Table>

        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="clickButton">确定</button>
        </div>
    </form>
</template>


<script>
    import Table from '~/components/Table'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import api from 'axios'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'params'],
        components: {
            Table
        },
        data () {
            return {
                heads: [
                    {propName: 'modifyTime', name: '修改时间'},
                    {propName: 'modityType', name: '修改数据类型'},
                    {propName: 'oldValue', name: '原数据'},
                    {propName: 'newValue', name: '修改后数据'},
                    {propName: 'modifyMan', name: '操作人'}
                ],
                items: []
            }
        },
        methods: {
            getData () {
                api.get('http://bm.9999ax.com/api/getConfig.htm')
                    .then((response) => {
                        console.log(response)
                        this.items = [
                            {
                                modifyTime: this.params,
                                modityType: 'SFW',
                                oldValue: '好得很',
                                newValue: 'AAA',
                                modifyMan: 'zhangSan'
                            },
                            {
                                modifyTime: this.params,
                                modityType: 'SdFW',
                                oldValue: 'FASDV',
                                newValue: 'AAwA',
                                modifyMan: 'zhangqwSan'
                            },
                            {
                                modifyTime: this.params,
                                modityType: 'wqdq',
                                oldValue: 'qwfq',
                                newValue: 'AAA',
                                modifyMan: 'qaaaa'
                            },
                            {
                                modifyTime: this.params,
                                modityType: 'Ffs',
                                oldValue: 'qdqw',
                                newValue: 'AAA',
                                modifyMan: 'qfqd'
                            }
                        ]
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            },
            closeModal (name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
            },
            clickButton (name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
            }
        },
        mounted () {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.getData()
            })
        }
    }
</script>

<style>
</style>
