<template>
	<el-dialog
		title="驳回"
		:visible.sync="options.visible"
		width="30%"
		center
		append-to-body>
		<el-form label-position="center" label-width="40px">
			<el-form-item label="原因">
				<el-input style="width: 100%" v-model="reason" type="textarea"></el-input>
			</el-form-item>
		</el-form>

		<span slot="footer" class="dialog-footer">
			<el-button @click="access" type="primary">确定</el-button>
			<el-button @click="close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {mapActions} from 'vuex'
	export default {
		props: ['options'],
		data() {
			return {
				tableData: [{
					createTime: 'dddd',
					code: 23
				}],
				reason: ''
			}
		},
		methods: {
			...mapActions('account', {
				apiWithdrawAudit: 'apiWithdrawAudit'
			}),
			access() {
				this.apiWithdrawAudit({
					params: {
						withdrawId: this.options.row.id,
						approve: false,
						failMsg: this.reason
					},
					callback: json => {
						this.close('refresh')
					}
				})
			},
			close(tag) {
				this.$emit('close', tag)
			}
		}
	}
</script>
