<template>
	<div>
		<el-row type="flex" justify="space-between">
			<el-col :span="12">
				<el-form inline>
					<el-form-item>
						<el-select v-model="params.enabled" placeholder="是否启用" style="width: 100%">
							<el-option label="全部" value=""></el-option>
							<el-option label="启用" :value="true"></el-option>
							<el-option label="停用" :value="false"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="list">搜索</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="12" class="text_right">
				<el-button type="danger" @click="add">新增</el-button>
			</el-col>
		</el-row>

		<el-table
			:data="tableData"
			border
			stripe
			empty-text="暂无数据"
			style="width: 100%">
			<el-table-column prop="code" label="编号" align="center"> </el-table-column>
			<el-table-column prop="nick" label="大师昵称" align="center"> </el-table-column>
			<el-table-column prop="phone" label="大师手机" align="center" > </el-table-column>
			<el-table-column prop="categoryName" label="领域" align="center" > </el-table-column>
			<el-table-column prop="enabled" label="是否启用" align="center" :formatter="formatStatus"> </el-table-column>
			<el-table-column label="操作" align="center" width="250" >
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click="handleEdit(scope.row, 'update')">修改</el-button>
					<el-button size="mini" @click="handleDelete(scope.row, 'delete')">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<HotMasterAdd :options="modalObj" @close="closeModal"></HotMasterAdd>

		<HotMasterUpdate :options="modalUpdateObj" @close="closeUpdateModal"></HotMasterUpdate>
	</div>
</template>

<script>
	import api from '~/api'
	import HotMasterAdd from './HotMasterAdd.vue'
	import HotMasterUpdate from './HotMasterUpdate.vue'
	import {mapActions} from 'vuex'
	export default {
		components: {
			HotMasterAdd,
			HotMasterUpdate
		},
		data() {
			return {
				tableData: [{
					title: 'banner1'
				}],
				modalObj: {
					visible: false,
					modalTitle: ''
				},
				modalUpdateObj: {
					visible: false,
					modalTitle: '',
					row: {}
				},
				params: {
					enabled: ''
				}
			}
		},
		methods: {
			...mapActions('master', {
				apiGetCategoryList: 'apiGetCategoryList',
				apiGetMasterList: 'apiGetMasterList'
			}),
			formatStatus(row) {
				if (row.enabled) {
					return '启用'
				}
				return '停用'
			},
			add() {
				this.modalObj = {
					visible: true,
					modalTitle: '新增推荐大师'
				}
			},
			handleDelete(row) {
				api.request({
					params: {id: row.id},
					url: api.url.page.index.master.del,
					success: (json) => {
						this.list()
					}
				})
			},
			handleEdit(row) {
				this.modalUpdateObj = {
					visible: true,
					modalTitle: '修改推荐大师编号',
					row
				}
			},
			viewHistory(row) {

			},
			list() {
				api.request({
					params: this.params,
					url: api.url.page.index.master.list,
					success: (json) => {
						this.tableData = json.rows;
					}
				})
			},
			closeModal(tag) {
				this.modalObj = {
					visible: false,
					modalTitle: ''
				}
				if (tag === 'refresh') {
					this.list()
				}
			},
			closeUpdateModal(tag) {
				this.modalUpdateObj = {
					visible: false,
					modalTitle: '',
					row: {}
				}
				if (tag === 'refresh') {
					this.list()
				}
			}
		},
		mounted() {
			this.list();
			this.apiGetMasterList()
		}
	}
</script>
