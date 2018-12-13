<template>
    <el-dialog
        title="充值记录"
        width="50%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        append-to-body
        :before-close="close">
        <RechargeWallet ref="rechargeWallet" :options="listOptions"></RechargeWallet>
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
                        this.$refs.rechargeWallet.$emit("init");
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
