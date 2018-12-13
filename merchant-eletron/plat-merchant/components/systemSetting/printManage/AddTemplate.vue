<template>
    <div>
        <div class="modal-body">
            <div class="row">
                <div class="col-lg-3 left-config">
                    <div style="line-height: 34px">名称</div>
                    <div style="line-height: 34px">模板</div>
                    <div style="margin:15px 0">素/非素</div>
                    <div style="margin:15px 0">定价方式</div>
                </div>
                <div class="col-lg-9 right-config">
                    <div><input type="text" class="form-control" v-model="form.name"/></div>
                    <div>
                        <div class="input-group">
                            <input type="file" class="form-control" ref="fileInput" style="display: none;"
                                   placeholder="请选择模板文件" @change="changeFile">
                            <input type="text" class="form-control" v-model="form.fileName"
                                   placeholder="请选择模板文件" readonly>
                            <span class="input-group-btn">
                            <button class="btn btn-default" type="button" @click="chooseFile">浏览</button>
                        </span>
                        </div>
                    </div>
                    <!--素金/非素金-->
                    <div>
                        <label class="checkbox-inline clearPadding">
                            <input type="radio" name="wareType" :value="true" v-model="form.pure">素金</label>
                        <label class="checkbox-inline">
                            <input type="radio" name="wareType" :value="false" v-model="form.pure">非素</label>
                    </div>
                    <!--计价方式-->
                    <div>
                        <label class="checkbox-inline" v-for="(item, index) in countPriceArr"
                               :class="index === 0 ? 'clearPadding' : ''">
                            <input type="radio" name="priceType" :value="item.id" v-model="form.priceType">{{item.name}}</label>
                    </div>
                </div>
            </div>
            <form class="form-horizontal">
            <div class="border_wrap">
                <strong class="marginRight">金属</strong>
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
                <strong class="marginRight">宝石</strong>
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
                <strong class="marginRight">品类</strong>
                <div>
                    <label class="checkbox-inline">
                        <input type="checkbox" name="store" v-model="category.isCheckAll">全部</label>
                    <label class="checkbox-inline" v-for="item in category.categoryArr">
                        <input type="checkbox" name="store" :value="item.id"
                               v-model="category.checkedArr">{{item.name}}</label>
                </div>
            </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="asure">确定</button>
        </div>
    </div>
</template>

<script>
    import {baseUtil, constUtil, browserUtil} from '~/util'
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import extension from '~/api/extension'
    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'refreshTable', 'item'],
        data() {
            return {
                form: {
                    name: '',
                    file: {},
                    pure: '',
                    priceType: '',
                    fileName: ''
                },
                countPriceArr: [],
                gem: {
                    gemArr: [],
                    checkedArr: [],
                    isCheckAll: true,
                    isCheckNone: false
                },
                metal: {
                    metalArr: [],
                    checkedArr: [],
                    isCheckAll: true,
                    isCheckNone: false
                },
                category: {
                    categoryArr: [],
                    checkedArr: [],
                    isCheckAll: true
                }
            }
        },
        methods: {
            createFormData(accessToken) {
                let fd = new FormData();
                fd.append('file', this.form.file);
                fd.append('name', this.form.name);
                fd.append('pure', this.form.pure);
                fd.append('priceType', this.form.priceType);
                fd.append('metalIds', this.form.metalIds);
                fd.append('gemIds', this.form.gemIds);
                fd.append('categoryIds', this.form.categoryIds);
                fd.append('access-token', accessToken);
                return fd
            },
            asure() {
                let vm = this;
                console.log(this.form);
                this.handleCheckboxValue('metal');
                this.handleCheckboxValue('gem');
                this.handleCheckboxValue('category');
                // 处理none
                if (this.gem.isCheckNone) {
                    this.form.gemIds += ',none';
                }
                if (this.metal.isCheckNone) {
                    this.form.metalIds += ',none'
                }
                let xhrs = new XMLHttpRequest();
                let accessToken = browserUtil.getCookie('access-token');
                let url = '';
                if (this.item) {
                    url = extension.chooseURL() + '/goods/print/template/label/' + this.item.id;
                } else {
                    url = extension.chooseURL() + '/goods/print/template/label';
                }
                xhrs.open('POST', url);
                xhrs.send(this.createFormData(accessToken));
                xhrs.onreadystatechange = function () {
                    if (xhrs.readyState === 4 && xhrs.status === 200) {
                        let data = JSON.parse(xhrs.responseText);
                        if (data.status === 200) {
                            console.log(data);
                            vm.refreshTable()
                            ButtonWithModalEvent.$emit(vm.CONST_CLOSE_MODAL);
                        } else {
                            alert(data.message);
                        }
                    } else if ((xhrs.status > 200 && xhrs.status < 300) || xhrs.status === 304) {
                        let str = xhrs.status + ' : ' + xhrs.statusText + ' : ' + xhrs.responseText
                        alert('提交失败！' + str);
                    }
                };
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
            handleCheckboxValue(tag) {
                if (this[tag].isCheckAll) {
                    this.form[tag + 'Ids'] = 'all'
                } else {
                    this.form[tag + 'Ids'] = this[tag].checkedArr.join();
                }
            },
            changeFile() {
                this.form.file = event.target.files[0]
                this.form.fileName = this.form.file.name
            },
            chooseFile() {
                this.$refs.fileInput.click();
            },
            initArr() {
                this.countPriceArr = constUtil._CONST_PRINT_PRICE_TYPE;
                this.metal.metalArr = baseUtil.getMetadataMetal();
                this.gem.gemArr = baseUtil.getMetadataGem();
                this.category.categoryArr = baseUtil.getMetadataCategory();
            },
            initData() {
                this.metal.checkedArr = this.checkedAll(this.metal.metalArr);
                this.gem.checkedArr = this.checkedAll(this.gem.gemArr);
                this.category.checkedArr = this.checkedAll(this.category.categoryArr);
                this.form = {
                    name: '',
                    file: {},
                    pure: '',
                    priceType: '',
                    fileName: ''
                }
            },
            initModifyData(item) {
                this.form.name = item.name
                this.form.file = {}
                this.form.fileName = ''
                this.form.priceType = item.priceType
                this.form.pure = item.pure

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
//
//                this.gem.isCheckAll = item.gemIds === 'all'
//                this.gem.checkedArr = item.gemIds === 'all' ? this.checkedAll(this.gem.gemArr) : item.gemIds.split(',')
//                this.metal.isCheckAll = item.metalIds === 'all'
//                this.metal.checkedArr = item.metalIds === 'all' ? this.checkedAll(this.metal.metalArr) : item.metalIds.split(',')
                this.category.isCheckAll = item.categoryIds === 'all'
                this.category.checkedArr = item.categoryIds === 'all' ? this.checkedAll(this.category.categoryArr) : item.categoryIds.split(',')
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
            },
            handleIsCheckAll(bool, tag) {
                if (bool) {
                    this[tag].checkedArr = this.checkedAll(this[tag][tag + 'Arr'])
                }
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
                    if (arr.length === this[tag][tag + 'Arr'].length) {
                        this[tag].isCheckAll = true
                    } else {
                        this[tag].isCheckAll = false;
                    }
                }
            }
        },
        mounted() {
            this.initArr()
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                if (this.item) { // 修改界面
                    this.initModifyData(this.item);
                } else {
                    this.initData();
                }
            })
            this.watchFunc()
        }
    }
</script>

<style scoped>
    .clearPadding{
        padding:0;
    }
    .left-config {
        font-weight: 600;
        text-align: left;
        width: 15%;
    }

    .right-config {
        text-align: left;
    }

    .left-config > div, .right-config > div {
        margin: 10px 0;
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
    .marginRight{
        margin-right: 38px;
    }
</style>
