<template>
	<div>
		<el-row type="flex" justify="space-between">
			<el-col :span="18">
				<el-form inline>
					<el-form-item>
						<el-select v-model="params.enabled" placeholder="状态" style="width: 100%">
							<el-option v-for="item in enabled" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select v-model="params.role" placeholder="职务" style="width: 100%">
							<el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-input v-model="params.query" clearable placeholder="姓名，手机号"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="search">搜索</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="6" class="text_right">
				<el-button type="danger" @click="add">新增</el-button>
			</el-col>
		</el-row>
		<el-table
			:data="tableData"
			border
			stripe
			empty-text="暂无数据"
			style="width: 100%">
			<el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
			<el-table-column prop="code" label="工号" align="center"> </el-table-column>
			<el-table-column prop="nick" label="姓名" align="center"> </el-table-column>
			<el-table-column prop="phone" label="手机号" width="180" align="center"> </el-table-column>
			<el-table-column prop="role" label="职务" align="center" :formatter="formatRole"> </el-table-column>
			<el-table-column prop="enabled" label="状态" align="center" :formatter="formatStatus"> </el-table-column>
			<el-table-column label="操作" align="center" >
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row, 'detail')">详情</el-button>
					<el-button size="mini" type="primary" @click="handleEdit(scope.row, 'update')">修改</el-button>
				</template>
			</el-table-column>
		</el-table>

		<StaffAddModal :options="staffModal" @close="closeModal"></StaffAddModal>
		<no-ssr><Pagination :options="this" @list="list"></Pagination></no-ssr>
	</div>
</template>

<script>
	import api from '~/api'
	import StaffAddModal from './StaffAddModal.vue'
	export default {
		components: {
			StaffAddModal
		},
		data() {
			return {
				params: {
					enabled: '',
					role: '',
					query: ''
				},
				role: [{
					id: 'FINANCIAL',
					name: '管理员'
				}, {
					id: 'OPS',
					name: '普通员工'
				}],
				enabled: [{
					id: 'true',
					name: '在职'
				}, {
					id: 'false',
					name: '离职'
				}],
				total: 0,
				staffModal: {
					visible: false,
					modalTitle: '',
					canChange: true,
					staff: {}
				},
				tableData: []
			}
		},
		mounted() {
			this.list()
		},
		methods:{
			formatRole(row) {
				if (row.role) {
					return this.role.filter(item => item.id === row.role)[0].name
				}
				return ''
			},
			formatStatus(row) {
				if (row.enabled) {
					return '在职'
				}
				return '离职'
			},
			handleEdit(row, tag) {
				if (tag === 'detail') {
					this.staffModal = {
						visible: true,
						modalTitle: '员工详情',
						canChange: false,
						staff: row
					}
				} else if (tag === 'update') {
					this.staffModal = {
						visible: true,
						modalTitle: '修改员工信息',
						canChange: true,
						staff: row
					}
				}
			},
			closeModal(tag) {
				this.staffModal = {
					visible: false,
					modalTitle: '',
					canChange: true,
					staff: {}
				}
				if (tag === 'refresh') {
					this.list()
				}
			},
			list() {
				api.request({
					url: api.url.user.staff.list,
					params: this.params,
					success: (json) => {
						this.tableData = json.rows;
						this.total = json.total;
					}
				});
			},
			search() {
				this.list()
			},
			add() {
				this.staffModal = {
					visible: true,
					modalTitle: '新增员工',
					canChange: true,
					staff: {}
				}
			}
		}
	}
</script>
