<template>
	<el-dialog append-to-body
		:title="options.modalTitle"
		:visible.sync="options.visible"
		width="50%"
		center>
		<el-table
			:data="tableData"
			border
			stripe
			empty-text="暂无数据"
			style="width: 100%">
			<el-table-column type="index" label="序号" width="60" align="center"> </el-table-column>
			<el-table-column prop="auditTime" label="提现时间" align="center" width="160" :formatter="renderTime"> </el-table-column>
			<el-table-column prop="userName" label="提现人" align="center"> </el-table-column>
			<el-table-column prop="amount" label="提现金额" align="center"> </el-table-column>
			<el-table-column prop="failMsg" label="备注" align="center"> </el-table-column>
			<el-table-column prop="statusName" label="状态" align="center" v-if="isDetailList"> </el-table-column>
			<el-table-column label="操作" align="center"  width="160">
				<template slot-scope="scope">
					<span v-if="scope.row.status === 'WAIT_AUDIT'">
						<el-button size="mini" type="success" @click="access(scope.row)">通过</el-button>
						<el-button size="mini" @click="reject(scope.row)">驳回</el-button>
					</span>
				</template>
			</el-table-column>
		</el-table>

		<Pagination :options="this" @list="list"></Pagination>

		<WithdrawReject :options="modalObj" @close="closeModal"></WithdrawReject>

		<span slot="footer" class="dialog-footer">
			<el-button @click="close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import WithdrawReject from './WithdrawReject'
	import {mapActions} from 'vuex'
	import api from '~/api'
	import {WITHDRAW_STATUS} from '~/api/const'
	export default {
		components: {
			WithdrawReject
		},
		props: ['options'],
		data() {
			return {
				tableData: [],
				total: 0,
				params: {
					billYmd: '',
					userId: '',
					status: ''
				},
				modalObj: {
					visible: false,
					row: {}
				}
			}
		},
		computed: {
			isDetailList() {
				return this.options.modalTitle === '提现明细表'
			}
		},
		methods: {
			...mapActions('account', {
				apiWithdrawAudit: 'apiWithdrawAudit'
			}),
			access(row) {
				this.apiWithdrawAudit({
					params: {
						withdrawId: row.id,
						approve: true
					},
					callback: () => {
						this.close('refresh')
					}
				})
			},
			reject(row) {
				this.modalObj = {
					visible: true,
					row
				}
			},
			close(tag) {
				this.$emit('close', tag)
			},
			closeModal(tag) {
				this.modalObj = {
					visible: false,
					row: {}
				}
				if (tag === 'refresh') {
					this.params.billYmd = ''
					this.params.status = 'WAIT_AUDIT'
					this.list()
				}
			},
			list() {
				api.request({
					url: api.url.account.query,
					params: this.params,
					success: json => {
						this.tableData = json.rows.map(item => {
							item.userName = item.user.nick
							if (item.status)
								item.statusName = WITHDRAW_STATUS.filter(ele => ele.id === item.status)[0].name
							return item
						});
						this.total = json.total
					}
				})
			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					if (!this.isDetailList) { // 只看待审核
						this.params.billYmd = ''
						this.params.status = 'WAIT_AUDIT'
					} else {
						this.params.status = ''
						this.params.billYmd = this.options.row.billYmd
					}
					this.list()
				}
			}
		}
	}
</script>

<style>
	.testStyle{
		color: #8c939d;
		font-size: 16px;
		text-align: center;
		height:30px;
		line-height: 30px;
	}
</style>
