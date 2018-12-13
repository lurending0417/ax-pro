<template>
    <el-dialog
        title="编辑功能"
        width="40%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-form :model="params" label-width="80px">
            <el-form-item label="功能编号">
                <el-input v-model="params.code"></el-input>
            </el-form-item>
            <el-form-item label="功能名称">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="功能别名">
                <el-input v-model="params.alias"></el-input>
            </el-form-item>
            <el-form-item label="请求方法">
                <el-select v-model="params.method">
                    <el-option value="GET"></el-option>
                    <el-option value="POST"></el-option>
                    <el-option value="PUT"></el-option>
                    <el-option value="DELETE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="请求地址">
                <el-input v-model="params.uri"></el-input>
            </el-form-item>
            <el-form-item label="终端类型">
                <el-checkbox-group v-model="params.clients">
                    <el-checkbox v-for="client in clients" :label="client.id" :key="client.id">{{client.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="支持版本">
                <el-checkbox-group v-model="params.versions">
                    <el-checkbox v-for="version in versions" :label="version.id" :key="version.id">{{version.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="启用状态">
                <el-radio-group v-model="params.enabled">
                    <el-radio :label="true">启用</el-radio>
                    <el-radio :label="false" class="text-danger">已停用</el-radio>
                </el-radio-group>
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
                easyClose: true,
            }
        },
        computed: {
            clients: () => {
                return baseUtil.getEnum('client');
            },
            versions: () => {
                return baseUtil.getEnum('version');
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    let json = this.options.json || {}
                    this.params = {
                        id: json.id,
                        code: json.code,
                        name: json.label,
                        alias: json.alias,
                        method: json.method,
                        uri: json.uri,
                        clients: (json.clients && json.clients.split(',')) || [],
                        versions: (json.versions && json.versions.split(',')) || [],
                        enabled: json.enabled,
                        groupId: json.groupId || this.options.groupId
                    }
                }
            }
        },
        methods: {
            submit() {
                let url;
                if (this.options.action === 'add') {
                    url = api.url.auth.action.add;
                } else {
                    url = api.url.auth.action.edit;
                    this.params.actionId = this.params.id;
                }
                delete this.params.id;
                api.request({
                    url: url,
                    params: this.params,
                    success: () => {
                        this.close(true);
                    }
                })
            },
            close(updated) {
                this.$emit("close", updated);
            }
        }
    }

</script>
