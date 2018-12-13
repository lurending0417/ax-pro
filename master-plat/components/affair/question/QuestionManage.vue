<template>
	<div>
		<el-row type="flex" justify="space-between">
			<el-col :span="24">
				<el-form inline :size="size || ''">
					<!--<el-form-item>-->
						<!--<no-ssr><DateRange :params="params"></DateRange></no-ssr>-->
					<!--</el-form-item>-->
					<el-form-item v-if="!disableMaster">
						<el-select v-model="params.masterId" placeholder="大师">
							<el-option v-for="item in masters" :key="item.id" :label="item.nick" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<!--<el-form-item>-->
						<!--<el-select v-model="params.categoryId" placeholder="大师领域">-->
							<!--<el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id"></el-option>-->
						<!--</el-select>-->
					<!--</el-form-item>-->
					<!--<el-form-item>-->
						<!--<el-input v-model="params.query" clearable placeholder="昵称，手机号"></el-input>-->
					<!--</el-form-item>-->
					<el-form-item>
						<el-button type="primary" @click="list">搜索</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<!--<el-row>-->
			<!--<el-col :span="24">-->
				<!--<el-form inline>-->
					<!--<el-form-item>-->
						<!--<el-input v-model="params.query" clearable placeholder="昵称，手机号"></el-input>-->
					<!--</el-form-item>-->
					<!--<el-form-item>-->
						<!--<el-button type="primary" @click="list">搜索</el-button>-->
					<!--</el-form-item>-->
				<!--</el-form>-->
			<!--</el-col>-->
		<!--</el-row>-->

		<el-table
			:data="tableData"
			border
			stripe
			style="width: 100%">
			<el-table-column type="index" label="序号" width="50" align="center"> </el-table-column>
			<!--<el-table-column prop="questionNick" label="提问者昵称" align="center"> </el-table-column>-->
			<!--<el-table-column prop="questionTel" label="提问者手机号" align="center"> </el-table-column>-->
			<el-table-column prop="masterNick" label="大师姓名" align="center"> </el-table-column>
			<el-table-column prop="categoryName" label="大师领域" align="center" :formatter="formatCat"> </el-table-column>
			<el-table-column prop="statusName" label="解惑状态" align="center"> </el-table-column>
			<!--<el-table-column prop="contentNum" label="待转化语音条数" align="center" width="150"> </el-table-column>-->
			<el-table-column label="操作" align="center" >
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click="handleEdit(scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<Pagination :options="this" @list="list"></Pagination>
		<QuestionDetail :options="modalObj" @close="closeModal"></QuestionDetail>
	</div>
</template>

<script>
	import QuestionDetail from './QuestionDetail.vue'
	import {QUESTION_STATUS} from '~/api/const'
	import {mapActions, mapGetters} from 'vuex'
	import api from '~/api'
	import {baseUtil} from '~/util'
	export default {
		props: ['masterId', 'size'],
		components: {
			QuestionDetail
		},
		data() {
			return {
				params: {
//					startYmd: '',
//					endYmd: '',
					categoryId: '',
					masterId: ''
				},
				modalObj: {
					modalTitle: '',
					visible: false,
					row: {},
					canChange: true
				},
				total: 0,
				tableData: [],
				category: []
			}
		},
		computed: {
			...mapGetters('master', {
				masters: 'getMasterList'
			}),
			disableMaster() {
				if (this.masterId) {
					return true
				}
				return false
			}
		},
		methods: {
			...mapActions('master', {
				apiGetMasterList: 'apiGetMasterList'
			}),
			formatCat(row) {
				return row.master.categoryName
			},
			handleTableData(row) {
				return row.map(item => {
					if (item.status) {
						item.statusName = QUESTION_STATUS.filter(ele => ele.id === item.status)[0].name;
					}
					item.masterNick = item.master.nick;
					item.questionCost = item.master.questionCost;
					return item
				})
			},
			handleEdit(row) {
				this.modalObj = {
					modalTitle: '解惑详情',
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
					url: api.url.question.recognition.list,
					params: this.params,
					success: (json) => {
						this.tableData = this.handleTableData(json.rows);
						this.total = json.total;
					}
				})
			},
		},
		mounted() {
			if (this.masterId) {
				this.params.masterId = this.masterId
			}
			this.list();
			let {category} = baseUtil.getBasicInfo();
			this.category = category;
			this.apiGetMasterList()
		}
	}
</script>
