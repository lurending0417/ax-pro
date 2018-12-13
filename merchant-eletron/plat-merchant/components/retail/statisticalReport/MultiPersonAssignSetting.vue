<template>
    <div>
        <div class="modal-body">
            <div class="line-cls">
                <label class="checkbox-inline clearPadding">
                    <input type="radio" name="byEqual" :value="true" v-model="form.byEqual">平均分配</label>
                <label class="checkbox-inline">
                    <input type="radio" name="byEqual" :value="false" v-model="form.byEqual">自定义分配</label>
            </div>
            <div v-if="!form.byEqual">
                <textarea class="form-control" v-model="form.customRule" rows="5">{{form.customRule}}</textarea>
                <fieldset style="padding: 0 15px;">
                    <legend>多人业绩分配自定义说明</legend>
                    <div>
                        在上方文本框中输入业绩分配规则，每一行为1条规则，如：
                    </div>
                    <div>1=100%</div>
                    <div>2=50%+50%</div>
                    <div>3=33%+33%+33%</div>
                </fieldset>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" @click="asure">确定</button>
            <button class="btn btn-success" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'refreshRule'],
        data() {
            return {
                form: {
                    byEqual: false,
                    customRule: ''
                }
            }
        },
        computed: {
            ...mapGetters('retail/statisticalReport/statisticalRetail', {
                getTeamRule: 'getTeamRule'
            })
        },
        methods: {
            ...mapActions('retail/statisticalReport/statisticalRetail', {
                apiPostTeamRule: 'apiPostTeamRule'
            }),
            asure() {
                this.apiPostTeamRule({
                    params: {
                        ...this.form
                    },
                    callback: () => {
                        this.close()
                    }
                })
            },
            close() {
                this.refreshRule()
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.form = {...this.getTeamRule}
            })
        }
    }
</script>
