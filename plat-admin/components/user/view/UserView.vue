<template>
    <el-dialog
        title="用户档案"
        width="80%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        append-to-body
        :before-close="close">
        <el-tabs v-model="activeTab" type="card">
            <el-tab-pane v-for="(tab,index) in tabs" :key="index" :name="tab.alias" :label="tab.name">
                <component v-bind:is="tab.component" :name="tab.alias" ref="tabComponent" :options="tabOptions"></component>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
</template>

<script>

    import {renderUtil} from "~/util"

    export default {
        props: ["options"],
        data() {
            return {
                easyClose: true,
                tabs: [{
                    name: '基本信息',
                    alias: 'basicInfo',
                    component: 'UserBasicInfo'
                }, {
                    name: '试戴订单',
                    alias: 'leaseRecord',
                    component: 'LeaseRecord'
                }, {
                    name: '钱包账户',
                    alias: 'walletTran',
                    component: 'WalletTran'
                }, {
                    name: '黄金账户',
                    alias: 'goldTran',
                    component: 'MutableTran'
                }],
                tabOptions: {},
                activeTab: '',
            }
        },
        watch: {
            activeTab(value) {
                if (!value) {
                    return;
                }
                renderUtil.renderTab(this);
            },
            'options.visible': function (value) {
                if (value) {
                    this.tabOptions = {
                        customerId: this.options.userId
                    };
                    renderUtil.resetTab(this);
                }
            }
        },
        methods: {
            close() {
                this.$emit("close");
            },
        }
    }
</script>
