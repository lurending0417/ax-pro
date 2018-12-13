<template>
	<el-dialog
		:title="options.modalTitle"
		:visible.sync="options.visible"
		width="40%"
		center
		append-to-body>
		<el-form label-position="center" v-if="isUpdateModal"
				 label-width="80px" :model="form" class="form_style" >
			<el-form-item label="约见时间">
				<el-date-picker
					v-model="form.startTime"
					type="datetime"
					placeholder="选择日期时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="约见地点">
				<el-input v-model="form.appointAddr"></el-input>
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="form.content" type="textarea"></el-input>
			</el-form-item>
		</el-form>

		<el-form label-position="center" label-width="80px" class="form_style" v-else >
			<el-form-item label="原因">
				<el-input v-model="reason" type="textarea"></el-input>
			</el-form-item>
		</el-form>

		<span slot="footer" class="dialog-footer">
			<el-button @click="close">关闭</el-button>
			<el-button @click="sure" type="primary">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import BaseForm from '~/util/formObj'
	import api from '~/api'
	export default {
		props: ['options'],
		data() {
			let form = new BaseForm({
				startTime: '',
				appointAddr: '',
				content: ''
			})
			return {
				form: form,
				reason: ''
			}
		},
		computed:{
			isUpdateModal() {
				return this.options.tag === 'update'
			}
		},
		methods: {
			close(tag) {
				this.$emit('close', tag)
			},
			sure() {
				if (this.isUpdateModal) {
					this.form.startTime = this.form.startTime.getTime()
					api.request({
						url: api.url.appoint.edit,
						params: {
							appointId: this.options.appointId,
							startTime: this.form.startTime,
							userName: '',
							userPhone: '',
							content: this.form.content
						},
						success: (json) => {
							this.close('refresh')
						}
					})
				} else {
					api.request({
						url: api.url.appoint.cancel,
						params: {
							appointId: this.options.appointId,
							reason: this.reason
						},
						success: (json) => {
							this.close('refresh')
						}
					})
				}
			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					this.form.init()
					this.reason = ''
				}
			}
		}
	}
</script>
