<template>
    <el-dialog
        title="编辑网关账户"
        width="30%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-form :modal="params" label-width="80px">
            <el-form-item label="短信网关">
                <el-select v-model="params.gatewayClassName">
                    <el-option
                        v-for="item in options.gateways"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="AppId">
                <el-input v-model="params.appId"></el-input>
            </el-form-item>
            <el-form-item label="AppSecret">
                <el-input v-model="params.appSecret"></el-input>
            </el-form-item>
            <el-form-item label="语音接口">
                <el-radio v-model="params.voice" :label="true" class="text-danger">是</el-radio>
                <el-radio v-model="params.voice" :label="false">否</el-radio>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close(false)">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </span>
    </el-dialog>
</template>


<script>

    import api from "~/api"

    export default {
        props: ['options'],
        data() {
            return {
                params: {},
                easyClose: true
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    this.params = {
                        id: this.options.json.id,
                        gatewayClassName: this.options.json.gatewayClassName,
                        appId: this.options.json.appId,
                        appSecret: this.options.json.appSecret,
                        voice: this.options.json.voice || false
                    }
                }
            }
        },
        methods: {
            submit() {
                let url;
                if (this.options.action === 'add') {
                    url = api.url.sms.gateway.account.add;
                } else {
                    this.params.accountId = this.params.id;
                    url = api.url.sms.gateway.account.edit;
                }
                delete this.params.id;
                api.request({
                    url: url,
                    params: this.params,
                    success: () => {
                        this.close(true);
                    }
                });
            },
            close(updated) {
                this.$emit("close", updated);
            }
        }

    }

</script>
