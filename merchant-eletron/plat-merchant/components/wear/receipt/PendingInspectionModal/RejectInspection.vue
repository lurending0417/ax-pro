<template>
    <div>
        <div class="modal-body">
            <form class="form-horizontal" style="margin-top: 16px">
                <div class="form-group">
                    <label class="col-sm-2 control-label">损坏说明</label>
                    <div class="col-sm-8">
                        <textarea class="form-control"
                                  v-model="form.remark">{{form.remark}}</textarea>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">扣款金额</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" v-model="form.forfeit">
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer footer_btn" style="text-align: center">
            <button type="button" class="btn btn-w-m btn-info" @click="asure">确定</button>
            <button type="button" class="btn btn-w-m btn-info" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'

    export default {
        props: ['validateParams', 'refreshTable'],
        data() {
            return {
                form: {
                    remark: '',
                    forfeit: ''
                },
                propData: {}
            }
        },
        methods: {
            ...mapActions('wear/wearRecords', {
                apiLeasingInspection: 'apiLeasingInspection'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.validateParams.CONST_CLOSE_MODAL)
                this.refreshTable()
            },
            asure() {
                let vm = this;
                let {storageSerial, passed} = vm.propData;
                this.apiLeasingInspection({
                    callBack: () => {
                        ButtonWithModalEvent.$emit(vm.validateParams.CONST_CLOSE_MODAL)
                        vm.refreshTable()
                    },
                    params: {...this.form, storageSerial, passed}
                });
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.validateParams.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.validateParams.CONST_CLICK_MODAL, (obj) => {
                this.form = {
                    remark: '',
                    forfeit: ''
                };
                this.propData = obj;
            });
        }
    }
</script>
