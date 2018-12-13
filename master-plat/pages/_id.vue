<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
			<el-breadcrumb-item>{{getCrumb.mainTitle}}</el-breadcrumb-item>
			<el-breadcrumb-item>{{getCrumb.secondTitle}}</el-breadcrumb-item>
		</el-breadcrumb>


		<el-card class="box-card">

			<el-tabs v-model="activeTab">
				<el-tab-pane v-for="(item,index) in tabs" :label="item.name" :name="item.alias" :key="'tab'+index">
					<component v-if="activeTab === item.alias" v-bind:is="item.component" :name="item.alias" ref="tabComponent" style="min-height:500px;"></component>
					<div v-else></div>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>


<script>
	import {authUtil, renderUtil} from "~/util"
	import {mapGetters, mapMutations, mapActions} from 'vuex'

	import TestEditor from '~/components/testEditor'
	import Temp from '~/components/Temp'

	// affair-course
	import VideoMange from '~/components/affair/course/VideoMange'
	import SingleCourseManage from '~/components/affair/course/SingleCourseManage'
	import SeriesCourseManage from '~/components/affair/course/SeriesCourseManage'
	import UpCourseManage from '~/components/affair/course/UpCourseManage'

	// affair-question
	import QuestionManage from '~/components/affair/question/QuestionManage'

	// affair-meet
	import MeetManage from '~/components/affair/meet/MeetManage'

	// client-master
	import MasterManage from '~/components/client/MasterManage'
	import UserManage from '~/components/client/UserManage'

	// account
	import Withdraw from '~/components/account/Withdraw'

	// system
	import StaffManage from '~/components/system/StaffManage'
	import BannerManage from '~/components/system/BannerManage'
	import HotMasterManage from '~/components/system/HotMasterManage'
	import HotCourseManage from '~/components/system/HotCourseManage'
	export default {
		components: {
			TestEditor,
			Temp,
			VideoMange,
			SingleCourseManage,
			SeriesCourseManage,
			UpCourseManage,
			StaffManage,
			QuestionManage,
			MeetManage,
			MasterManage,
			UserManage,
			HotMasterManage,
			HotCourseManage,
			BannerManage,
			Withdraw
		},
		data() {
			return {
				activeTab: '',
				tabs: []
			};
		},
		asyncData (context) {
			console.log('context', context)
			if (process.server) {
				console.log('server')
			}
			return {test: 233}
		},
		computed: {
			...mapGetters('auth', {
				getCrumb: 'getCrumb'
			})
		},
		created() {
			let tabs = authUtil.getAuthorizedTabs(this.$router.currentRoute.fullPath);
			this.tabs = tabs;
			if (tabs.length > 0) {
				this.activeTab = tabs[0].alias;
			}
		}
	};


</script>
