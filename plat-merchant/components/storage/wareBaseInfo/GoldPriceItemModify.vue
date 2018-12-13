<template>
    <form class="form-horizontal goldPrice" style="margin-top: 16px">
        <div class="form-group">
            <label class="col-sm-2 control-label">金属：</label>
            <div class="col-sm-2"><span>{{params.metalName}}</span></div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">当前金价：</label>
            <div class="col-sm-2" v-if="params.retailPrice"><span>{{params.retailPrice}}元/g</span></div>
            <div class="col-sm-2" v-else><span></span></div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">修改为：</label>
            <div class="col-sm-3">
                <input type="text" class="form-control" @change="resetRetailPrice">
            </div>
            <div class="col-sm-1 unit"><span>元/g</span></div>
        </div>

        <div class="modal-footer">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="modify()">确定</button>
        </div>
    </form>
</template>


<script>
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    import { mapMutations, mapActions } from 'vuex'

    export default {
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'params', 'refreshTable'],
        data () {
            return {}
        },
        methods: {
            ...mapMutations('storage/warebaseinfo/goldPriceItemModify', {
                resetInfo: 'resetInfo',
                resetMetalId: 'resetMetalId',
                resetRetailPrice: 'resetRetailPrice'
            }),
            ...mapActions('storage/warebaseinfo/goldPriceItemModify', {
                modifyRetailPrice: 'modifyRetailPrice'
            }),
            closeModal (name) {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL, name)
                this.refreshTable()
            },
            modify (name) {
                this.resetMetalId(this.params.metalId)
                this.modifyRetailPrice(() => {
                    this.closeModal(name)
                })
            }
        },
        mounted () {}
    }
</script>

<style>
    .unit {
        float: left;
    }

    .goldPrice span {
        line-height: 30px;
    }
</style>
