<template>
    <el-dialog
        title="编辑网关路由规则"
        width="30%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-form :modal="params" label-width="80px">
            <el-form-item label="类型">
                <EnumSelect :params="params" field="billType" enum="smsBillType"></EnumSelect>
            </el-form-item>
            <el-form-item label="语音接口">
                <el-radio v-model="params.voice" :label="true" class="text-danger">是</el-radio>
                <el-radio v-model="params.voice" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="网关账户">
                <el-select v-model="params.accountId">
                    <el-option-group
                        v-for="group in gateways"
                        :key="group.name"
                        :label="group.name">
                        <el-option
                            v-for="item in group.accounts"
                            :key="item.id"
                            :label="item.appId"
                            :value="item.id">
                        </el-option>
                    </el-option-group>
                </el-select>
            </el-form-item>
            <el-form-item label="优先级">
                <el-input v-model="params.priority"></el-input>
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
    import {baseUtil} from "~/util"

    export default {
        props: ['options'],
        data() {
            return {
                params: {},
                gateways: [],
                easyClose: true
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    let json = this.options.json.router || {};
                    this.params = {
                        id: json.id,
                        billType: json.billType,
                        voice: json.voice || false,
                        accountId: json.accountId,
                        priority: json.priority || 0
                    };
                }
            }
        },
        beforeMount() {
            api.request({
                url: api.url.sms.gateway.account.list,
                success: (json) => {
                    let array = [];
                    baseUtil.getMetadata('smsGateway').forEach((gateway) => {
                        let temp = {
                            id: gateway.id,
                            name: gateway.name,
                            accounts: []
                        };
                        json.rows.forEach((account) => {
                            if (account.gatewayClassName === gateway.id) {
                                temp.accounts.push({
                                    id: account.id,
                                    appId: account.appId
                                });
                            }
                        });
                        array.push(temp);
                    });
                    this.gateways = array;
                }
            });
        },
        methods: {
            submit() {
                let url;
                if (this.options.action === 'add') {
                    url = api.url.sms.gateway.router.add;
                } else {
                    this.params.routerId = this.params.id;
                    url = api.url.sms.gateway.router.edit;
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
