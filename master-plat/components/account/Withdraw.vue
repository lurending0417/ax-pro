<template>
	<div>
		<el-row type="flex" justify="space-between">
			<el-col :span="12">
				<el-form inline>
					<el-form-item>
						<DateRange :params="params"></DateRange>
					</el-form-item>
					<el-form-item>
						<el-button @click="list" type="primary">搜索</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="12" class="text_right">
				<el-form inline>
					<el-form-item>
						<el-button type="primary" @click="viewList">待审核明细</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<el-table
			:data="tableData"
			border
			stripe
			empty-text="暂无数据"
			show-summary
			style="width: 100%">
			<el-table-column prop="billYmd" label="日期" align="center"> </el-table-column>
			<el-table-column prop="totalCount" label="笔数" align="center"> </el-table-column>
			<el-table-column prop="totalAmount" label="总金额" align="center"> </el-table-column>
			<el-table-column prop="toAuditCount" label="待审核笔数" align="center"> </el-table-column>
			<el-table-column prop="toAuditAmount" label="待审核金额" align="center"> </el-table-column>
			<el-table-column prop="doneCount" label="已支付笔数" align="center"> </el-table-column>
			<el-table-column prop="doneAmount" label="已支付金额" align="center"> </el-table-column>
			<el-table-column label="操作" align="center" >
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row)">明细</el-button>
				</template>
			</el-table-column>
		</el-table>

		<PendingReview :options="modalObj" @close="closeModal"></PendingReview>

		<Pagination :options="this" @list="list"></Pagination>
	</div>
</template>

<script>
	import PendingReview from './PendingReview.vue'
	import api from '~/api'
	export default {
		components: {
			PendingReview
		},
		data() {
			return {
				tableData: [{
					createTime: 'dddd',
					code: 23
				}],
				params: {
					startYmd: '',
					endYmd: ''
				},
				total: 0,
				modalObj: {
					modalTitle: '',
					visible: false,
					row: {}
				}
			}
		},
		methods: {
			handleEdit(row) {
				this.modalObj = {
					visible: true,
					modalTitle: '提现明细表',
					row
				}
			},
			viewList() {
				this.modalObj = {
					visible: true,
					modalTitle: '待审核列表',
					row: {}
				}
			},
			list() {
				api.request({
					url: api.url.account.stat,
					params: this.params,
					success: json => {
						this.tableData = json.rows;
						this.total = json.total;
					}
				})
			},
			closeModal() {
				this.modalObj = {
					visible: false,
					modalTitle: ''
				}
			}
		},
		mounted() {
			this.list()
		}
	}
</script>
