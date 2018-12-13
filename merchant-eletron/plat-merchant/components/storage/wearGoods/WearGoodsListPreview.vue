<template>
    <div>
        <div class="modal-body">
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">基本信息</div>
                <div class="panel-body">
                    <table class="table table-striped" style="background-color: rgb(221, 221, 221)">
                        <thead>
                        <tr>
                            <th>条码</th>
                            <th>总质量</th>
                            <th>成本价</th>
                            <th>零售价（原价）</th>
                            <th>零售价（折后）</th>
                            <th>押金</th>
                            <th>租金</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td class="table-bordered">{{form.storageView.storage.serial}}</td>
                            <td class="table-bordered">{{form.storageView.storage.weight}}</td>
                            <td class="table-bordered">{{handleItemUnit(form.storageView.storage.costPrice, '元')}}</td>
                            <td class="table-bordered">{{handleItemUnit(form.storageView.storage.regularPrice, '元')}}</td>
                            <td class="table-bordered">{{handleItemUnit(form.storageView.storage.retailPrice, '元')}}</td>
                            <td class="table-bordered">{{handleItemUnit(form.lease.depositPrice, '元')}}</td>
                            <td class="table-bordered">{{handleItemUnit(form.lease.rentPrice, '元')}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">品类信息</div>
                <div class="panel-body">
                    <div v-if="paramsObj.category.length>0">
                        <p v-for="item in paramsObj.category">
                            <span class="titleNameSize">{{item.fieldName}}</span>:
                            <span>{{item.fieldValue}}</span>
                        </p>
                    </div>
                    <p v-else>暂无数据</p>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">宝石</div>
                <div class="panel-body">
                    <div v-if="paramsObj.gem.length>0">
                        <p v-for="item in paramsObj.gem">
                            <span class="titleNameSize">{{item.fieldName}}</span>:
                            <span>{{item.fieldValue}}</span>
                        </p>
                    </div>
                    <p v-else>暂无数据</p>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">金属</div>
                <div class="panel-body">
                    <div v-if="paramsObj.metal.length>0">
                        <p v-for="item in paramsObj.metal">
                            <span class="titleNameSize">{{item.fieldName}}</span>:
                            <span>{{item.fieldValue}}</span>
                        </p>
                    </div>
                    <p v-else>暂无数据</p>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align: left">图片</div>
                <div class="panel-body">
                    <fieldset>
                        <legend>商品展示图</legend>
                        <div style="text-align: left">
                            <img v-if="form.mainImage.path" :src="imgUrl+form.mainImage.path" alt=""
                                 style="width: 170px">
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>商品banner图</legend>
                        <div class="flex_layout">
                            <div v-if="obj.path" v-for="obj in form.slideImages">
                                <img :src="imgUrl+obj.path">
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>详情图</legend>
                        <div class="flex_layout">
                            <div v-if="obj.path" v-for="obj in form.detailImages">
                                <img :src="imgUrl+obj.path" alt="">
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </div>
        <div class="modal-footer" style="text-align: center">
            <button type="button" class="btn btn-w-m btn-info" style="margin:0 10px">打印标签</button>
            <button type="button" class="btn btn-w-m btn-info" style="margin-right:10px">流转记录</button>
            <button type="button" class="btn btn-w-m btn-info" @click="close" style="margin-right:10px">关闭</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import TableCpn from '~/components/Table'
    import {mapActions} from 'vuex';

    export default {
        props: ['storageId', 'CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL'],
        components: {
            TableCpn
        },
        data() {
            return {
                blobs: [],
                imgUrl: process.env.imgBaseUrl,
                form: {
                    detailImages: [{
                        path: ''
                    }],
                    lease: {
                        depositPrice: 0,
                        rentPrice: 0
                    },
                    mainImage: {
                        path: ''
                    },
                    slideImages: [{
                        path: ''
                    }],
                    storageView: {
                        props: [],
                        storage: {
                            costPrice: 0,
                            regularPrice: 0,
                            retailPrice: 0,
                            serial: '',
                            weight: 0
                        }
                    }
                }
            }
        },
        computed: {
            paramsObj() {
                let params = {
                    metal: [],
                    category: [],
                    gem: []
                };
                this.form.storageView.props.forEach((item) => {
                    switch (item.type) {
                        case 'METAL' : {
                            params.metal.push(item);
                            break;
                        }
                        case 'CATEGORY' : {
                            params.category.push(item);
                            break;
                        }
                        case 'GEM' : {
                            params.gem.push(item);
                        }
                    }
                });
                return params;
            }
        },
        methods: {
            ...mapActions('storage/wearStorage/wearGoodsMain', {
                apiLeaseConfigDetail: 'apiLeaseConfigDetail'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
                this.refreshTable()
            }
        },
        mounted() {
            let vm = this;
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                vm.apiLeaseConfigDetail({
                    storageId: vm.storageId,
                    callBack(result) {
                        if (result.detailImages.length > 0) {
                            vm.form.detailImages = result.detailImages;
                        }
                        if (result.mainImage) {
                            vm.form.mainImage = result.mainImage;
                        }
                        if (result.slideImages.length > 0) {
                            vm.form.slideImages = result.slideImages;
                        }
                        vm.form.lease = result.lease;
                        vm.form.storageView = result.storageView;
                        console.log('fjkdsladja', vm.form)
                    }
                })
            });
        }
    }
</script>

<style scoped>
    .fileBox {
        display: none;
    }

    fieldset {
        padding: 5px 0px 20px 20px;
    }

    ul {
        padding: 0;
        overflow: hidden;
    }

    li {
        list-style: none;
    }
</style>
