<template>
    <el-dialog
        title="编辑黄金"
        width="35%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        :before-close="close">
        <el-form :model="params" label-width="80px">
            <el-form-item label="名称">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="重量">
                <el-input v-model="params.weight">
                    <template slot="append">g</template>
                </el-input>
            </el-form-item>
            <el-form-item label="工费">
                <el-input v-model="params.processingCharges">
                    <template slot="append">¥/g</template>
                </el-input>
            </el-form-item>
            <el-form-item label="纯度">
                <el-input v-model="params.purity"></el-input>
            </el-form-item>
            <el-form-item label="尺寸">
                <el-input v-model="params.dimension"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="params.description"></el-input>
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
                    this.params = {
                        id: this.options.json.id,
                        name: this.options.json.name,
                        weight: this.options.json.weight,
                        processingCharges: this.options.json.processingCharges,
                        purity: this.options.json.purity,
                        dimension: this.options.json.dimension,
                        description: this.options.json.description,
                        enabled: this.options.json.enabled
                    }
                }
            }
        },
        methods: {
            submit() {
                let url;
                if (this.options.action === 'add') {
                    url = api.url.physical.gold.add;
                } else {
                    this.params.goldId = this.params.id;
                    url = api.url.physical.gold.edit;
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
