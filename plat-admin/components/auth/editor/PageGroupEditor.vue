<template>
    <el-dialog
        title="编辑页面分组"
        width="25%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-form :model="params" label-width="80px">
            <el-form-item label="分组编号">
                <el-input v-model="params.code"></el-input>
            </el-form-item>
            <el-form-item label="分组名称">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="ICON图标">
                <el-input v-model="params.icon"></el-input>
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
                easyClose: true
            }
        },
        computed: {
            versions: () => {
                return baseUtil.getEnum('version')
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    let json = this.options.json || {};
                    console.log(json);
                    this.params = {
                        id: json.id,
                        code: json.code,
                        name: json.label,
                        icon: json.icon,
                        versions: (json.versions && json.versions.split(',')) || [],
                        enabled: json.enabled
                    }
                }
            }
        },
        methods: {
            submit() {
                let url;
                if (this.options.action === 'add') {
                    url = api.url.auth.page.group.add;
                } else {
                    url = api.url.auth.page.group.edit;
                    this.params.groupId = this.params.id;
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
