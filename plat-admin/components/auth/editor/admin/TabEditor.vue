<template>
    <el-dialog
        title="编辑选项卡"
        width="35%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-form :model="params" label-width="100px">
            <el-form-item label="选项卡编号">
                <el-input v-model="params.code"></el-input>
            </el-form-item>
            <el-form-item label="选项卡名称">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="选项卡别名">
                <el-input v-model="params.alias"></el-input>
            </el-form-item>
            <el-form-item label="ICON图标">
                <el-input v-model="params.icon"></el-input>
            </el-form-item>
            <el-form-item label="UI组件名">
                <el-input v-model="params.uiComponent"></el-input>
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
                    let json = this.options.json || {};
                    this.params = {
                        id: json.id,
                        code: json.code,
                        name: json.label,
                        alias: json.alias,
                        icon: json.icon,
                        uiComponent: json.uiComponent,
                        enabled: json.enabled,
                        pageId: this.options.pageId
                    }
                }
            }
        },
        methods: {
            submit() {
                let url;
                if (this.options.action === 'add') {
                    url = api.url.auth.admin.page.tab.add;
                } else {
                    url = api.url.auth.admin.page.tab.edit;
                    this.params.tabId = this.params.id;
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
