<template>
	<el-menu
		:default-active="defaultKey"
		:unique-opened="true"
		class="el-menu-vertical-demo"
		@select="handleSelect"
		:router="true">
		<el-submenu v-for="(page,pageIndex) in pages" :key="'page'+pageIndex" :index="page.route">
			<template slot="title">
				<i :class="page.icon"></i>
				<span>{{page.name}}</span>
			</template>
			<el-menu-item v-for="(sub,subIndex) in page.sub" :key="'sub' + subIndex" :index="sub.route">
				<span slot="title">{{sub.name}}</span>
			</el-menu-item>
		</el-submenu>
	</el-menu>
</template>

<script>
	import {authUtil} from "~/util"
	import {mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		data() {
			return {
				defaultKey: '/welcome',
				pages: []
			}
		},
		watch: {
			defaultKey(val) {
				this.resetCrumb(this.getCrumb(val))
			}
		},
		created() {
			this.defaultKey = this.$router.currentRoute.fullPath;
			this.pages = authUtil.getAuthorizedPages();
		},
		methods: {
			...mapMutations('auth', {
				resetCrumb: 'resetCrumb'
			}),
			handleSelect(key) {
				this.defaultKey = key;
			},
			getCrumb(key) {
				let pages = this.pages;
				let crumb = {};
				for (let i = 0, len = pages.length; i < len; i++) {
					let firstKey = key.split('/')[1];
					let firstRoute = pages[i].route.split('/')[1];
					if (firstKey === firstRoute) {
						crumb.mainTitle = pages[i].name;
						for (let j = 0, jLen = pages[i].sub.length; j < jLen; j++) {
							if (key === pages[i].sub[j].route) {
								crumb.secondTitle = pages[i].sub[j].name;
								break;
							}
						}
						break;
					}
				}
				return crumb
			}
		}
	}
</script>

<style scoped>
	.el-menu {
		height: 100%;
	}
</style>

