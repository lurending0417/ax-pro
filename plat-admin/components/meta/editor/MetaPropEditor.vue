<template>
    <el-dialog
        title="编辑参数"
        width="35%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        append-to-body
        :before-close="close">
        <el-form :model="params" label-width="80px">
            <el-form-item label="参数编号">
                <el-input v-model="params.code"></el-input>
            </el-form-item>
            <el-form-item label="参数名称">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="参数类型">
                <el-radio-group v-model="params.inputType">
                    <el-radio label="INPUT">文本框</el-radio>
                    <el-radio label="RADIO">单选框</el-radio>
                    <el-radio label="CHECKBOX">复选框</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="预设值">
                <el-input v-model="params.preValues"></el-input>
            </el-form-item>
            <el-form-item label="必填状态">
                <el-radio-group v-model="params.required">
                    <el-radio :label="true">必填</el-radio>
                    <el-radio :label="false">选填</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="前端筛选">
                <el-radio-group v-model="params.filterable">
                    <el-radio :label="true">支持</el-radio>
                    <el-radio :label="false">不支持</el-radio>
                </el-radio-group>
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

        props: ["options"],
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
                        code: this.options.json.code,
                        name: this.options.json.name,
                        inputType: this.options.json.inputType || "INPUT",
                        preValues: this.options.json.preValues,
                        required: this.options.json.required,
                        filterable: this.options.json.filterable,
                        enabled: this.options.json.enabled,
                    }
                    if (this.options.action == 'add') {
                        this.params.type = this.options.type;
                        this.params.targetId = this.options.targetId;
                    } else {
                        this.params.fieldId = this.options.json.id;
                    }
                }
            }
        },
        methods: {
            submit() {
                let url;
                if (this.options.action === 'add') {
                    url = api.url.goods.property.field.add;
                } else {
                    url = api.url.goods.property.field.edit;
                }
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
