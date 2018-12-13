<template>
	<el-dialog
		append-to-body
	    title="钱包流水记录"
	    :visible.sync="options.visible"
	    width="60%"
	    center>

		<el-row type="flex" justify="space-between">
			<el-col :span="24">
				<el-form inline>
					<el-form-item>
						<DateRange :params="params"></DateRange>
					</el-form-item>
					<el-form-item>
						<el-button @click="list" type="primary">搜索</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>

		<el-table
			:data="tableData"
			border
			stripe
			style="width: 100%">
			<el-table-column type="index" label="序号" width="50" align="center"> </el-table-column>
			<el-table-column prop="createTime" label="时间" align="center" :formatter="renderTime"> </el-table-column>
			<el-table-column prop="billType" label="类型" align="center"> </el-table-column>
			<el-table-column prop="amount" label="金额" align="center"> </el-table-column>
			<el-table-column prop="balance" label="余额" align="center"> </el-table-column>
		</el-table>

		<Pagination :options="this" @list="list"></Pagination>
		<span slot="footer" class="dialog-footer" >
			<el-button @click="close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import api from "~/api";
	import {mapActions, mapGetters} from 'vuex'
	import MasterBaseInfo from './MasterBaseInfo'
	import Temp from '~/components/Temp'
	import OwnerCourse from './OwnerCourse'
	import OwnerAppoint from './OwnerAppoint'
	import OwnerQuestion from './OwnerQuestion'
	import moment from 'moment'
	const today = moment(new Date()).format('YYYY-MM-DD');
	export default {
		props: ['options'],
		components: {
			OwnerAppoint,
			OwnerQuestion,
			OwnerCourse,
			MasterBaseInfo,
			Temp
		},
		data() {
			return {
				tableData: [],
				params: {
					startYmd: today,
					endYmd: today,
					userId: ''
				},
				total: 0
			}
		},
		methods: {
			...mapActions('user', {
				apiGetUserWalletUsage: 'apiGetUserWalletUsage'
			}),
			close(tag) {
				this.$emit('close', tag)
			},
			list() {
				this.apiGetUserWalletUsage({
					params: this.params,
					callback: json => {
						this.tableData = json.rows;
						this.total = json.total;
					}
				})
			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					this.params.startYmd = today;
					this.params.endYmd = today;
					this.params.limit = 10;
					this.params.userId = this.options.row.id
					this.list()
				}
			}
		}
	}
</script>

