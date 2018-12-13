<template>
	<el-dialog append-to-body
		:title="options.modalTitle"
		:visible.sync="options.visible"
		width="60%"
		center>
		<el-tabs type="border-card" v-model="activeTab">
			<el-tab-pane v-for="(item,index) in tabs" :key="index+'tab'" :label="item.label" :name="item.alias">
				<component v-if="item.alias === activeTab " :formData="params" @beforeClose="close" v-bind:is="item.component"></component>
				<div v-else></div>
			</el-tab-pane>
		</el-tabs>

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
				activeTab: 'baseInfo',
				tabs: [{
					label: '基本资料',
					alias: 'baseInfo',
					component: 'MasterBaseInfo'
				}, {
					label: '所属课程',
					alias: 'course',
					component: 'OwnerCourse'
				}, {
					label: '所属解惑',
					alias: 'question',
					component: 'OwnerQuestion'
				}, {
					label: '所属约见',
					alias: 'appoint',
					component: 'OwnerAppoint'
				}, {
					label: '所属悬赏',
					alias: 'wanted',
					component: 'Temp'
				}],
				params: {},
				modalObj: {
					visible: false,
					modalTitle: '',
					row: {}
				}
			}
		},
		methods: {
			...mapActions('master', {
				apiGetMasterFc: 'apiGetMasterFc'
			}),
			close(tag) {
				console.log('close')
				this.$emit('close', tag)
			},
			getMasterFc() {
				this.apiGetMasterFc({
					params: {masterId: this.options.row.id},
					callback: json => {
						this.params = {};
						this.params = this.options.row
						this.params.fengcai = json.result
					}
				})
			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					this.activeTab = 'baseInfo'
					this.getMasterFc()
				}
			}
		}
	}
</script>

