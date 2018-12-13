<template>
	<el-dialog
		title="用户详情"
		:visible.sync="options.visible"
		width="60%"
		center
		append-to-body>

		<el-tabs type="border-card" v-model="activeTab">
			<el-tab-pane v-for="(item,index) in tabs" :key="index+'tab'" :label="item.label" :name="item.alias">
				<component v-if="item.alias === activeTab " :formData="userForm" :isUser="true" @beforeClose="close" v-bind:is="item.component"></component>
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
	import Temp from '~/components/Temp'
	import UserBaseInfo from './UserBaseInfo'
	import OwnerAppoint from './OwnerAppoint'
	import OwnerCourse from './OwnerCourse'
	import OwnerQuestion from './OwnerQuestion'
	export default {
		props: ['options'],
		components: {
			UserBaseInfo,
			OwnerAppoint,
			OwnerCourse,
			OwnerQuestion,
			Temp
		},
		data() {
			return {
				activeTab: 'baseInfo',
				tabs: [{
					label: '基本资料',
					alias: 'baseInfo',
					component: 'UserBaseInfo'
				}, {
					label: '已解锁课程列表',
					alias: 'course',
					component: 'OwnerCourse'
				}, {
					label: '解惑列表',
					alias: 'question',
					component: 'OwnerQuestion'
				}, {
					label: '约见列表',
					alias: 'appoint',
					component: 'OwnerAppoint'
				}, {
					label: '悬赏列表',
					alias: 'wanted',
					component: 'Temp'
				}],
				userForm: {}
			}
		},
		methods: {
			close(tag) {
				this.$emit('close', tag)
			}
		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					this.activeTab = 'baseInfo'
					this.userForm = {};
					this.userForm = this.options.row
				}
			}
		}
	}
</script>

