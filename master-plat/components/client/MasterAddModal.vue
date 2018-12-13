<template>
	<el-dialog append-to-body
		title="新增大师"
		:visible.sync="options.visible"
		width="60%"
		center>

		<el-row type="flex" justify="space-between">
			<el-col :span="24">
				<el-form inline size="small">
					<el-form-item>
						<el-input v-model="params.query" placeholder="昵称，手机"></el-input>
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
			empty-text="暂无数据"
			style="width: 100%">
			<el-table-column type="index" align="center" width="50"></el-table-column>
			<el-table-column prop="nick" label="用户昵称" align="center"> </el-table-column>
			<el-table-column prop="master" label="是否为大师" align="center" :formatter="formatIsMaster"> </el-table-column>
			<el-table-column prop="vip" label="是否为会员" align="center" :formatter="formatBool"> </el-table-column>
			<el-table-column prop="updateTime" label="会员到期时间" align="center" > </el-table-column>
			<el-table-column label="操作" align="center" width="250" >
				<template slot-scope="scope">
					<el-button v-if="!scope.row.master" size="mini" type="success" @click="handleEdit(scope.row)">成为大师</el-button>
					<!--<el-button size="mini" @click="viewUserDetail(scope.row)">详情</el-button>-->
				</template>
			</el-table-column>
		</el-table>

		<Pagination :options="this" @list="list"></Pagination>

		<MasterAddDetail :options="modalObj" @close="handleClose"></MasterAddDetail>
		<!--<UserDetail :options="modalDetailObj" @close="handleDetailClose"></UserDetail>-->

		<span slot="footer" class="dialog-footer" >
			<el-button @click="close">关闭</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import api from "~/api";
	import {mapActions, mapGetters} from 'vuex'
	import MasterAddDetail from './MasterAddDetail'
//	import UserDetail from './UserDetail'
	export default {
		props: ['options'],
		components: {
			MasterAddDetail
//			UserDetail
		},
		data() {
			return {
				params: {
					query: ''
				},
				modalObj: {
					visible: false,
					modalTitle: '',
					row: {}
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
			viewUserDetail(row) {
				this.modalDetailObj = {
					visible: true,
					modalTitle: '用户详情',
					row
				};
			},
			handleDetailClose() {
				this.modalDetailObj = {
					visible: false,
					modalTitle: '',
					row: {}
				};
			},
			formatBool(row) {
				return row.vip ? '是' : '否'
			},
			formatIsMaster(row) {
				return row.master ? '是' : '否'
			},
			handleEdit(row) {
				this.modalObj = {
					visible: true,
					modalTitle: '成为大师',
					row
				}
			},
			handleClose(tag) {
				this.modalObj = {
					visible: false,
					modalTitle: '',
					row: {}
				}
				if (tag === 'refresh') {
					this.list()
				}
			},
			close() {
				this.$emit('close', 'refresh')
			},
			list() {
				this.apiGetUserList(this.params)
			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					this.params.limit = 10;
					this.list()
				}
			}
		}
	}
</script>
