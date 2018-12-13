<template>
	<div>
		<el-row type="flex" justify="space-between">
			<el-col :span="24">
				<el-form inline @submit.native.prevent>
					<el-form-item>
						<el-input v-model="params.query" clearable placeholder="昵称，手机号" @keydown.enter.native="list"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="list">搜索</el-button>
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
			<el-table-column prop="nick" label="用户昵称" align="center"> </el-table-column>
			<el-table-column prop="phone" label="用户手机" align="center"> </el-table-column>
			<el-table-column prop="createTime" label="注册时间" align="center" :formatter="renderTime" width="180"> </el-table-column>
			<el-table-column prop="userType" label="用户性质" align="center" :formatter="formatVip" width="100"> </el-table-column>
			<el-table-column prop="vipExpireYmd" label="会员到期时间" align="center" :formatter="renderTime" width="180"> </el-table-column>
			<el-table-column label="操作" align="center" >
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<Pagination :options="this" @list="list"></Pagination>

		<UserDetail :options="modalDetailObj" @close="handleDetailClose"></UserDetail>
	</div>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
	import UserDetail from './UserDetail'
	export default {
		components: {
			UserDetail
		},
		data() {
			return {
				params: {
					query: ''
				},
				modalDetailObj: {
					visible: false,
					modalTitle: '',
					row: {}
				}
			}
		},
		computed: {
			...mapGetters('user', {
				tableData: 'getUserList',
				total: 'getTotal'
			})
		},
		methods: {
			...mapActions('user', {
				apiGetUserList: 'apiGetUserList'
			}),
			formatVip(row) {
				if (row.master) {
					return '大师'
				}
				if (row.vip) {
					return '会员'
				}
				return '普通用户'
			},
			handleEdit(row) {
				this.modalDetailObj = {
					visible: true,
					modalTitle: '用户信息',
					row
				}
			},
			handleDetailClose(tag) {
				this.modalDetailObj = {
					visible: false,
					modalTitle: '',
					row: {}
				};
				if (tag === 'refresh') {
					this.list()
				}
			},
			list() {
				this.apiGetUserList(this.params)
			}
		},
		mounted() {
			this.list()
		}
	}
</script>
