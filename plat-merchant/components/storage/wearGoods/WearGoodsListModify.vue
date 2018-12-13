<template>
    <div>
        <div class="modal-body">
            <div class="form-group" style="overflow:hidden;display:flex; align-items: center">
                <label class="col-sm-4 control-label">押金</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" v-model="form.depositPrice" @blur="judgeNumLength">
                </div>
                <div class="col-sm-2">
                    <span>元</span>
                </div>
            </div>
            <div class="form-group" style="overflow:hidden;display:flex; align-items: center">
                <label class="col-sm-4 control-label">日租金</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" v-model="form.rentPrice" @blur="judgeNumLength">
                </div>
                <div class="col-sm-2">
                    <span>元</span>
                </div>
            </div>
        </div>
        <div class="modal-footer" style="text-align: center">
            <button type="button" class="btn btn-w-m btn-info" @click="close">确定</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions} from 'vuex'

    export default {
        props: ['item', 'CONST_CLOSE_MODAL', 'refreshTable', 'CONST_CLICK_MODAL'],
        data() {
            return {
                form: {
                    depositPrice: '',
                    rentPrice: ''
                }
            }
        },
        methods: {
            ...mapActions('storage/wearStorage/wearGoodsMain', {
                apiLeaseConfigModify: 'apiLeaseConfigModify'
            }),
            close() {
                let vm = this;
                if (parseFloat(vm.form.depositPrice) < 0 || parseFloat(vm.form.rentPrice) < 0) {
                    alert('押金或租金不能小于0');
                    this.initForm()
                    return;
                }
                vm.form.storageIds = vm.item.id;
                vm.form.status = vm.item.status;
                this.apiLeaseConfigModify({
                    params: vm.form,
                    callBack() {
                        ButtonWithModalEvent.$emit(vm.CONST_CLOSE_MODAL)
                        vm.refreshTable()
                    }
                })
            },
            initForm() {
                let {depositPrice, rentPrice} = this.item;
                this.form.depositPrice = depositPrice + '';
                this.form.rentPrice = rentPrice + '';
            },
            judgeNumLength() {
                let str = event.target.value;
                let arr = str.split('.');
                if (arr.length === 2 && arr[1].length > 2) {
                    alert('小数点后最多保留两位小数，请重新输入')
                    this.initForm()
                    return true
                }
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.initForm()
            });
        }
    }
</script>

<style scoped>
    .fileBox {
        display: none;
    }

    ul {
        padding: 0;
        overflow: hidden;
    }

    li {
        list-style: none;
    }

    .imgList {
        float: left;
        margin-right: 20px;
    }

    .addPic:hover {
        cursor: pointer;
    }

    .last_li {
        margin-top: 20px;
        float: left;
    }
</style>
