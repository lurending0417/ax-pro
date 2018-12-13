<template>
    <el-dialog
        title="编辑短信模板"
        width="30%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-form :modal="params" label-width="80px">
            <el-form-item label="模板编号">
                <el-input v-model="params.code"></el-input>
            </el-form-item>
            <el-form-item label="模板名称">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="模板内容">
                <el-input type="textarea" v-model="params.template"></el-input>
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
                        code: this.options.json.code,
                        name: this.options.json.name,
                        template: this.options.json.template
                    }
                }
            }
        },
        methods: {
            submit() {
                let url;
                if (this.options.action === 'add') {
                    url = api.url.sms.template.add;
                } else {
                    this.params.templateId = this.params.id;
                    url = api.url.sms.template.edit;
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
