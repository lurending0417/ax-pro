<template>
    <table class="table table-striped">
        <thead>
        <tr v-for="head in getHeads()" style="background-color: rgb(221, 221, 221)">
            <th v-for="headItem in head" v-if="headItem" :colspan="headItem.colspan" :rowspan="headItem.rowspan"
                class="table-bordered">
                {{headItem.name}}
            </th>
        </tr>
        </thead>

        <tbody>
        <tr v-if="getItems().length === 0">
            <td class="table-bordered" colspan="20">暂无数据</td>
        </tr>
        <tr v-for="(item,index) in getItems()" :data-index="index" v-else>
            <td v-for="obj in item" v-if="obj.tag" class="table-bordered">
                <slot :name="obj.tag+index" :item=items[index]></slot>
            </td>
            <td class="table-bordered" v-else @click="clickTr(item, index, obj, $event)" :class="obj.className">
                {{obj.name}}{{obj.unit && (obj.name === 0 || obj.name)?obj.unit:''}}
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    // heads: 按从左至右的顺序排布表头
    // hasLeft: 是否自己定义最左边的列,默认false,
    // hasOrderId: 是否需要自动生成最左侧的序号列，默认true
    export default {
        props: ['heads', 'items', 'hasOrderId', 'hasLeft'],
        methods: {
            getHeadColspan (mergeName) {
                let count = 0
                this.heads.forEach(head => {
                    if (head.mergeName === mergeName) {
                        count++
                    }
                })
                return count
            },
            isContains (obj, arr) {
                let isContain = false
                arr.forEach(item => {
                    if (obj.name === item.name) {
                        isContain = true
                    }
                })
                return isContain
            },
            getHeads () { // 拼装Heads
                let topHeads = []
                let firstHead = []
                let secondHead = []
                let isSingleHead = true
                this.heads.forEach(head => {
                    if (head.mergeName) {
                        isSingleHead = false
                    }
                })
                // 添加复选框head
                if (this.hasLeft) {
                    if (isSingleHead) {
                        firstHead.push({
                            name: this.heads[0].name
                        })
                    } else {
                        firstHead.push({
                            name: this.heads[0].name,
                            rowspan: 2
                        })
                    }
                }
                if (this.hasOrderId !== false) {
                    if (isSingleHead) {
                        firstHead.push({
                            name: '序号'
                        })
                    } else {
                        firstHead.push({
                            name: '序号',
                            rowspan: 2
                        })
                    }
                }
                this.heads.forEach((head, index) => {
                    if (this.hasLeft && index === 0) {
                        return
                    }
                    if (head.mergeName) {
                        let obj = {
                            name: head.mergeName,
                            colspan: this.getHeadColspan(head.mergeName)
                        }
                        if (!this.isContains(obj, firstHead)) {
                            firstHead.push(obj)
                        }
                    } else {
                        firstHead.push({
                            name: head.name,
                            rowspan: 2
                        })
                    }
                    if (head.mergeName) {
                        secondHead.push({
                            name: head.name
                        })
                    }
                })
                topHeads.push(firstHead)
                topHeads.push(secondHead)
                return topHeads
            },
            getItems () {
                let heads = []
                this.heads.forEach(head => {
                    let item = {}
                    // head ===>  { propName: 'billNumber', name: '入库单号' }
                    if (head.tag) {
                        // { name: '操作', tag: 'BUTTON' }
                        item.tag = head.tag
                    }
                    if (head.unit) {
                        // { propName: 'totalWeight', name: '总质量', unit: 'g' }
                        item.unit = head.unit
                    }
                    if (head.callback) {
                        // { propName: 'totalWeight', name: '总质量', callback: ()=> {} }
                        item.callback = head.callback
                    }
                    if (head.className) {
                        // { propName: 'totalWeight', name: '总质量', className: '' }
                        item.className = head.className
                    }
                    item.propName = head.propName
                    heads.push(item)
                })
                let itemArr = []
                if (this.items) {
                    this.items.forEach((item, index) => {
                        // item ===> {billNumber: '5234'}
                        let singleItems = []
                        if (this.hasLeft) {
                            if (heads[0].tag) {
                                // singleItems ===> [{name: '', tag: 'BUTTON'}]
                                singleItems.push({name: heads[0].propName, tag: heads[0].tag})
                            } else {
                                // singleItems ===> [{name: ''}]
                                singleItems.push({name: heads[0].propName})
                            }
                        }
                        if (this.hasOrderId !== false) {
                            // singleItems ===> [{name: 1}]
                            singleItems.push({name: index + 1})
                        }
                        heads.forEach((head, index) => {
                            // head ===> {propName: 'billNumber'}
                            if (this.hasLeft && index === 0) {
                                return
                            }
                            let singleItem = {}
                            if (head.tag) {
                                // singleItems ===> [{name: ''}, {name: '', tag: 'BUTTON'}]
                                singleItem.tag = head.tag
                            }
                            if (head.unit) {
                                // singleItems ===> [{name: ''}, {name: '5234', unit: 'g'}]
                                singleItem.unit = head.unit
                            }
                            if (head.callback) {
                                // singleItems ===> [{name: ''}, {name: '5234', callback: 'g'}]
                                singleItem.callback = head.callback
                            }
                            if (head.className) {
                                // singleItems ===> [{name: ''}, {name: '5234', callback: 'g'}]
                                singleItem.className = head.className
                            }
                            singleItem.name = item[head.propName]
                            singleItems.push(singleItem)
                        })
                        itemArr.push(singleItems)
                    })
                }
                return itemArr
            },
            clickTr(item, index, obj, $event) {
                if (obj.callback) {
                    obj.callback(item, index, obj, $event)
                }
            }
        },
        computed: {}
    }
</script>

<style>
    .table {
        margin-top: 20px;
    }

    .table th, td {
        line-height: 1.8;
        text-align: center;
        vertical-align: inherit !important;
        padding: 6px !important;
    }

    .table button {
        margin-left: 3px;
        margin-top: 1px;
        margin-bottom: 1px;
        padding: 2px 8px !important;
    }

    .modal-footer .btn {
        padding: 6px 12px !important;
    }


</style>
