<template>
    <div>
        <div class="modal-body">
            <label>备注</label>
            <textarea class="form-control" :disabled="!getCanChange" v-model="item.remark"></textarea>
        </div>
        <div class="modal-footer" style="text-align: center">
            <button type="button" class="btn btn-primary" @click="asure">确定</button>
        </div>
    </div>
</template>

<script>
    import { ButtonWithModalEvent } from '~/components/ButtonWithModalEvent'
    export default {
        props: ['item', 'CONST_CLOSE_MODAL', 'getCanChange', 'CONST_CLICK_MODAL'],
        methods: {
            asure() {
                console.log(this.item);
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            }
        }
    }
</script>
