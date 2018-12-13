<template>
	<div>
		<el-row type="flex" justify="space-between">
			<el-col :span="24">
				<el-form inline :size="size || ''">
					<el-form-item>
						<el-select v-model="params.masterId" placeholder="大师" :disabled="disableMaster">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in masters" :key="item.id" :label="item.nick" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select v-model="params.status" placeholder="状态">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in status" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-input v-model="params.query" clearable placeholder="约见人姓名，约见人手机"></el-input>
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
			<el-table-column prop="createTime" label="发起时间" align="center" :formatter="renderTime"> </el-table-column>
			<el-table-column prop="userNick" label="发起人" align="center"> </el-table-column>
			<el-table-column prop="userName" label="约见人姓名" align="center"> </el-table-column>
			<el-table-column prop="userPhone" label="约见人手机号" align="center" width="150"> </el-table-column>
			<el-table-column prop="masterNick" label="大师" align="center"> </el-table-column>
			<el-table-column prop="masterAppointCost" label="单价" align="center"> </el-table-column>
			<el-table-column prop="hours" label="约见时长" align="center"> </el-table-column>
			<el-table-column prop="totalCost" label="总金额" align="center"> </el-table-column>
			<el-table-column prop="startTime" label="约见时间" width="160" align="center" :formatter="renderTime"> </el-table-column>
			<el-table-column prop="statusName" label="状态" align="center" width="150" > </el-table-column>
			<el-table-column label="操作" align="center" >
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click="handleEdit(scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<Pagination :options="this" @list="list"></Pagination>
		<MeetDetail :options="modalObj" @close="closeModal"></MeetDetail>
	</div>
</template>

<script>
	import MeetDetail from './MeetDetail.vue'
	import {mapActions, mapGetters} from 'vuex'
	import api from '~/api'
	import {MMEET_STATUS} from '~/api/const'
	export default {
		props: ['masterId', 'isUser', 'size'],
		components: {
			MeetDetail
		},
		data() {
			return {
				params: {
					masterId: '',
					status: '',
					query: ''
				},
				modalObj: {
					modalTitle: '',
					visible: false,
					row: {},
					canChange: true
				},
				total: 0,
				tableData: [],
				status: []
			}
		},
		computed: {
			...mapGetters('master', {
				masters: 'getMasterList'
			}),
			disableMaster() {
				if (this.masterId && !this.isUser) {
					return true
				}
				return false
			}
		},
		methods: {
			...mapActions('master', {
				apiGetMasterList: 'apiGetMasterList'
			}),
			handleTableData(row) {
				return row.map(item => {
					if (item.status) {
						item.statusName = this.status.filter(ele => ele.id === item.status)[0].name;
					}
					let {master} = item;
					item.masterAppointCost = master.appointCost;
					item.userNick = item.user.nick;
					item.masterNick = item.master.nick;
					item.questionCost = item.master.questionCost;
					return item
				})
			},
			handleEdit(row) {
				this.modalObj = {
					modalTitle: '详情',
					visible: true,
					row: row,
					canChange: true
				}
			},
			closeModal(tag) {
				this.modalObj = {
					modalTitle: '',
					visible: false,
					row: {},
					canChange: true
				}
				if (tag === 'refresh') {
					this.list()
				}
			},
			list() {
				api.request({
					url: api.url.appoint.list,
					params: this.params,
					success: (json) => {
						this.tableData = this.handleTableData(json.rows);
						this.total = json.total;
					}
				})
			}
		},
		mounted() {
			this.status = MMEET_STATUS;
			if (this.masterId) {
				this.params.masterId = this.masterId
			}
			if (this.isUser) {
				this.params.masterId = ''
				this.params.userId = this.masterId
			}
			this.list();
			this.apiGetMasterList({})
		}
	}
</script>


