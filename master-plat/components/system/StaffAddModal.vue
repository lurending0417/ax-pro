<template>
	<el-dialog append-to-body
		:title="options.modalTitle"
		:visible.sync="options.visible"
		width="40%"
		center>
		<el-form label-position="center" label-width="80px" :model="form" :disabled="!options.canChange">
			<el-form-item label="工号">
				<el-input v-model="form.code"></el-input>
			</el-form-item>
			<el-form-item label="姓名">
				<el-input v-model="form.nick"></el-input>
			</el-form-item>
			<el-form-item label="手机号">
				<el-input v-model="form.phone"></el-input>
			</el-form-item>
			<el-form-item label="职务" prop="role" >
				<el-select v-model="form.role" placeholder="职务" style="width: 100%">
					<el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态">
				<el-radio v-model="form.enabled" :label="true">在职</el-radio>
				<el-radio v-model="form.enabled" :label="false">离职</el-radio>
			</el-form-item>
		</el-form>

		<span slot="footer" class="dialog-footer" v-if="options.canChange">
			<el-button @click="close">取 消</el-button>
			<el-button type="primary" @click="save">确 定</el-button>
		</span>
		<span slot="footer" class="dialog-footer" v-else>
			<el-button @click="close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import api from "~/api"
	import BaseForm from '~/util/formObj'
	export default {
		props: ['options'],
		data() {
			return {
				form: new BaseForm({
					code: '',
					nick: '',
					phone: '',
					role: '',
					enabled: true
				}),
				role: [{
					id: 'FINANCIAL',
					name: '管理员'
				}, {
					id: 'OPS',
					name: '普通员工'
				}],
			}
		},
		methods: {
			close(tag) {
				this.form.init({enabled: true});
				console.log('init form', this.form)
				this.$emit('close', tag)
			},
			save() {
				let staffId = this.options.staff.id;
				if (staffId) {
					api.request({
						url: api.url.user.staff.edit,
						params: {...this.form, staffId},
						success: (json) => {
							this.close('refresh')
						}
					});
				} else {
					api.request({
						url: api.url.user.staff.add,
						params: this.form,
						success: (json) => {
							this.close('refresh')
						}
					});
				}
			}
		},
		watch: {
			'options.visible': function (value) {
				let {staff} = this.options;
				if (value && staff.id) {
					let {id, nick, code, phone, role, enabled} = staff;
					this.form = new BaseForm({id, nick, code, phone, role, enabled})
				}
			}
		}
	}
</script>
