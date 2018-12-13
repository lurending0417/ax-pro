<template>
    <el-dialog
        title="编辑场景内容"
        width="30%"
        :visible.sync="options.visible"
        :close-on-click-modal="easyClose"
        :close-on-press-escape="easyClose"
        append-to-body
        :before-close="close">
        <el-form :model="params" label-width="80px">
            <el-form-item label="编号">
                <el-input v-model="params.code"></el-input>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="库存ID">
                <el-input v-model="params.storageId"></el-input>
            </el-form-item>
            <el-form-item label="图片文件">
                <el-upload class="upload-demo" ref="upload" :file-list="files" :action="reqUrl" :auto-upload="false" :data="params" :on-success="success" :on-error="error" :on-change="fileChange" :before-remove="fileChange" :multiple="true" :show-file-list="true" :limit="limit">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
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

    import {LoadingEvent} from "../../../common/LoadingEvent";

    export default {
        props: ['options'],
        data() {
            return {
                params: {},
                easyClose: true,
                limit: 1,
                reqUrl: '',
                files: [],
                list: '',
                show: '',
                file: ''
            }
        },
        watch: {
            'options.visible': function (value) {
                if (value) {
                    this.params = {
                        id: this.options.json.id,
                        sceneId: this.options.json.sceneId,
                        code: this.options.json.code,
                        name: this.options.json.name,
                        storageId: this.options.json.storageId,
                        enabled: this.options.json.enabled,
                        'access-token': baseUtil.getAccessToken()
                    };
                }
                if (this.options.action === 'add') {
                    this.reqUrl = api.url.page.index.scene.content.add.toString();
                } else {
                    this.reqUrl = api.url.page.index.scene.content.edit.toString();
                }
                this.files = [];
            }
        },
        methods: {
            fileChange(file, list) {
                this.files = list;
            },
            submit() {
                if (this.options.action === 'edit') {
                    this.params.contentId = this.params.id;
                }
                delete this.params.id;
                let uploader = this.$refs.upload;
                if (this.files.length > 0) {
                    LoadingEvent.$emit("mask");
                    uploader.submit();
                } else {
                    api.request({
                        url: this.reqUrl,
                        method: 'post',
                        params: this.params,
                        success: () => {
                            this.close(true);
                        }
                    });
                }
            },
            success(json) {
                LoadingEvent.$emit("unmask");
                if (json.status == 200) {
                    this.close(true);
                } else {
                    Message.error(json.message || '操作失败');
                }
            },
            error(json) {
                Message.error(json.message || '操作失败');
            },
            close(updated) {
                this.$emit("close", updated);
            }
        }
    }
</script>
