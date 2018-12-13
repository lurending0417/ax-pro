<template>
    <el-dialog
        title="线下充值记录"
        width="70%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        append-to-body
        :before-close="close">
        <RechargeWalletOffline ref="rechargeWalletOffline" :options="listOptions"></RechargeWalletOffline>
    </el-dialog>
</template>

<script>
    export default {
        props: ["options"],
        data() {
            return {
                easyClose: true,
                listOptions: {
                    ownerId: this.options ? this.options.ownerId : ''
                }
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    setTimeout(() => {
                        this.$refs.rechargeWalletOffline.$emit("init");
                    }, 10);
                }
            },
            'options.ownerId': function (value) {
                this.listOptions.ownerId = value;
            }
        },
        methods: {
            close() {
                this.$emit("close");
            }
        }
    }
</script>
