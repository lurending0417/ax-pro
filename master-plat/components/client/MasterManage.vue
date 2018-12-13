<template>
	<div>
		<el-row type="flex" justify="space-between" class="m-b-s">
			<el-col :span="24" class="text_right">
				<el-button type="danger" @click="add">新增</el-button>
			</el-col>
		</el-row>

		<el-table
			:data="tableData"
			border
			stripe
			style="width: 100%">
			<el-table-column type="index" label="序号" width="50" align="center"> </el-table-column>
			<el-table-column prop="nick" label="大师昵称" align="center"> </el-table-column>
			<el-table-column prop="phone" label="大师手机" align="center"> </el-table-column>
			<el-table-column prop="categoryName" label="领域" align="center"> </el-table-column>
			<el-table-column prop="score" label="评星" align="center"> </el-table-column>
			<el-table-column prop="followTimes" label="粉丝数" align="center"> </el-table-column>
			<el-table-column label="操作" align="center" >
				<template slot-scope="scope">
					<el-button size="mini" @click="viewDetail(scope.row)">详情</el-button>
					<el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
				</template>
			</el-table-column>
		</el-table>

		<Pagination :options="this" @list="list"></Pagination>

		<MasterAddModal :options="modalObj" @close="handleClose"></MasterAddModal>
		<MasterAddDetail :options="modalDetailObj" @close="handleDetailClose"></MasterAddDetail>
		<MasterDetail :options="modalBaseObj" @close="handleBaseClose"></MasterDetail>
	</div>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
	import MasterAddModal from './MasterAddModal.vue'
	import MasterAddDetail from './MasterAddDetail'
	import MasterDetail from './MasterDetail'
	export default {
		components: {
			MasterAddModal,
			MasterDetail,
			MasterAddDetail
		},
		data() {
			return {
				params: {},
				modalObj: {
					visible: false
				},
				modalDetailObj: {
					visible: false,
					modalTitle: '',
					row: {},
					masterId: ''
				},
				modalBaseObj: {
					visible: false
				}
			}
		},
		computed: {
			...mapGetters('master', {
				tableData: 'getMasterList',
				total: 'getMastersTotal',
			})
		},
		methods: {
			...mapActions('master', {
				apiGetMasterList: 'apiGetMasterList'
			}),
			viewDetail(row) {
				this.modalBaseObj = {
					visible: true,
					modalTitle: '大师详情',
					row
				}
			},
			handleBaseClose() {
				this.modalBaseObj = {
					visible: false,
					modalTitle: '',
					row: {}
				}
			},
			handleEdit(row) {
				this.modalDetailObj = {
					visible: true,
					modalTitle: '修改大师信息',
					row,
					masterId: row.id
				}
			},
			handleClose(tag) {
				this.modalObj.visible = false;
				if (tag) {
					this.list()
				}
			},
			handleDetailClose(tag) {
				this.modalDetailObj = {
					visible: false,
					modalTitle: '',
					row: {},
					masterId: ''
				}
				if (tag === 'refresh') {
					this.list()
				}
			},
			list() {
				this.apiGetMasterList(this.params)
			},
			add() {
				this.modalObj.visible = true;
			}
		},
		mounted() {
			this.list()
		}
	}
</script>
