<template>
	<el-dialog append-to-body
		:title="options.modalTitle"
		:visible.sync="options.visible"
		width="35%"
		center>

		<el-row class="row m-b-m" type="flex">
			<span class="m-r-m"><strong>课程名称：</strong>{{options.row.name}}</span>
			<span class="m-r-m"><strong>课程类别：</strong>{{options.row.targetTypeName}}</span>
			<span class="m-r-m"><strong>大师：</strong>{{options.row.master}}</span>
		</el-row>

		<el-form label-position="left" label-width="80px" :model="form" class="form_style">
			<el-form-item label="编号">
				<el-input v-model="form.code"></el-input>
			</el-form-item>
			<el-form-item label="是否启用">
				<el-radio v-model="form.enabled" :label="true">启用</el-radio>
				<el-radio v-model="form.enabled" :label="false">停用</el-radio>
			</el-form-item>
		</el-form>

		<span slot="footer" class="dialog-footer" >
			<el-button @click="close">关闭</el-button>
			<el-button @click="save" type="primary">保存</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import api from "~/api";
	import BaseForm from '~/util/formObj'
	export default {
		props: ['options'],
		data() {
			return {
				form: new BaseForm({
					id: '',
					code: '',
					enabled: true
				})
			}
		},
		methods: {
			save() {
				api.request({
					url: api.url.page.index.course.edit,
					params: {...this.form},
					success: json => {
						this.close('refresh')
					}
				})
			},
			close(tag) {
				this.$emit('close', tag)
			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					this.form.init({enabled: true});
					let {code, enabled, id} = this.options.row;
					Object.assign(this.form, {code, enabled})
					this.form.id = id
				}
			}
		}
	}
</script>
