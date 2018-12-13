<template>
	<el-dialog
		:title="options.modalTitle"
		:visible.sync="options.visible"
		width="60%"
		center
		:close-on-click-modal="false"
		append-to-body>

		<!--大师详情-->
		<div class="master_detail_wrap">
			<div class="master_avatar_wrap">
				<img :src="formData.avatar" alt="" style="width: 100px;">
			</div>
			<div class="master_tag_wrap">
				<div class="m-b-s">
					<span class="m-r-s"><i class="fa fa-user m-r-s" style="color: #409EFF"></i>{{formData.nick}}</span>
					<el-switch
						v-model="formData.enabled"
						active-color="#13ce66"
						inactive-color="#e3e3e3">
					</el-switch>
				</div>
				<div>
					<el-tag v-for="(tag, index) in formData.tags" :key="'tag'+index" closable type="success"
							@close="delTag(index)" class="m-r-s m-b-s" size="small">{{tag}}</el-tag>
					<el-input
						class="input-new-tag"
						v-if="inputVisible"
						v-model="inputValue"
						ref="saveTagInput"
						size="mini"
						style="width: 15%"
						@keyup.enter.native="handleInputConfirm"
						@blur="handleInputConfirm"
					></el-input>
					<el-button class="button-new-tag" size="mini" @click="showInput" v-else>+</el-button>
				</div>
			</div>
			<el-select size="small" v-model="formData.categoryId" placeholder="领域" style="width: 30%" class="m-b-s">
				<el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
		</div>

		<!--其他内容-->
		<el-form label-position="center" label-width="80px"  :model="formData">
			<el-form-item label="简介">
				<el-input v-model="formData.intro" type="textarea" rows="4" placeholder="大师简介，200字以内" maxlength="200"></el-input>
			</el-form-item>
			<el-form-item label="风采">
				<textarea ref="editor" v-model="formData.fengcai"></textarea>
			</el-form-item>
			<el-form-item label="开启课程">
				<el-switch
					v-model="formData.courseEnabled"
					active-color="#13ce66"
					inactive-color="#e3e3e3">
				</el-switch>
			</el-form-item>
		</el-form>

		<div>
			<div class="meet_detail">
				<el-card class="box-card" shadow="never">
					<div slot="header" class="text_center">
						<span class="m-r-s">约见业务</span>
						<el-switch
							v-model="formData.appointEnabled"
							active-color="#13ce66"
							inactive-color="#e3e3e3">
						</el-switch>
					</div>

					<el-form label-position="left" label-width="50px" inline>
						<el-form-item label="地址">
							<RegionSelect v-model="formData.districtCode"></RegionSelect>
						</el-form-item>
						<el-form-item label="费用">
							<el-input v-model="formData.appointCost" placeholder="元/小时"></el-input>
						</el-form-item>
						<el-form-item label="电话">
							<el-input v-model="formData.appointPhone"></el-input>
						</el-form-item>
					</el-form>
				</el-card>
			</div>

			<div class="meet_detail">
				<el-card class="box-card" shadow="never">
					<div slot="header" class="text_center">
						<span class="m-r-s">解惑业务</span>
						<el-switch
							v-model="formData.questionEnabled"
							active-color="#13ce66"
							inactive-color="#e3e3e3">
						</el-switch>
					</div>

					<el-form label-position="left" label-width="50px" inline>
						<el-form-item label="费用">
							<el-input v-model="formData.questionCost" placeholder="元/小时"></el-input>
						</el-form-item>
					</el-form>
				</el-card>
			</div>
		</div>

		<span slot="footer" class="dialog-footer" >
			<el-button @click="close">取消</el-button>
			<el-button type="primary" @click="save">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import api from "~/api"
	import BaseForm from '~/util/formObj'
	import {mapGetters, mapActions} from 'vuex'
	import {baseUtil} from '~/util'
	export default {
		props: ['options'],
		data() {
			return {
				inputVisible: false,
				inputValue: '',
				formData: new BaseForm({
					avatar: '/avatar.jpeg',
					nick: '张三丰',
					phone: '18408217559',
					categoryId: '',
					tags: ['和蔼', '仙风道骨', '开山祖师'],
					intro: '',
					fengcai: '用户简介',
					appointCost: '',
					appointPhone: '',
					appointEnabled: true,
					districtCode: '',
					enabled: true,
					courseEnabled: true,
					questionCost: '',
					questionEnabled: true
				}),
				model: [],
				imageUrl: '',
				preUrl: '',
				fullUrl: '',
				isChangeImgUrl: false,
				editorConfig: {
				},
				editor: null,
				category: []
			}
		},
		methods: {
			...mapActions('master', {
				apiGetMasterFc: 'apiGetMasterFc'
			}),
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.formData.tags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			delTag(index) {
				this.formData.tags.splice(index, 1)
			},
			save() {
				if (this.formData.tags.length > 0) {
					this.formData.tags = this.formData.tags.join();
				} else {
					this.formData.tags = ''
				}
				this.formData.fengcai = this.editor.getData();
				delete this.formData.subscribe;
				delete this.formData.score;
				delete this.formData.questionTimes;
				delete this.formData.master;
				delete this.formData.id;
				delete this.formData.followTimes;
				delete this.formData.follow;
				delete this.formData.categoryName;
				if (this.options.masterId) {
					api.request({
						url: api.url.user.master.edit,
						params: {...this.formData},
						success: json => {
							this.close('refresh')
						}
					})
				} else {
					api.request({
						url: api.url.user.master.add,
						params: {...this.formData},
						success: json => {
							this.close('refresh')
						}
					})
				}
			},
			getMasterFc() {
				this.apiGetMasterFc({
					params: {masterId: this.options.masterId},
					callback: json => {
						if (this.editor) {
							this.editor.setData(json.result)
						}
					}
				})
			},
			close(tag) {
				this.$emit('close', tag)
			},
			initPage() {
				this.formData.init({enabled: true, appointEnabled: true, courseEnabled: true, questionEnabled: true});
				let {nick, id, avatar} = this.options.row;
				this.formData.userId = id;
				Object.assign(this.formData, {nick, avatar})
			},
			createEditor() {
				CkEditor.create(this.$refs.editor)
					.then( editor => {
						this.editor = editor;
						editor.plugins.get('FileRepository').createUploadAdapter = (loader)=>{
							return new UploadAdapter(loader);
						};
					} )
					.catch( error => {
						console.error( error );
					} );
			}
 		},
		watch: {
			'options.visible': function (val) {
				if (val) {
					this.initPage()
					setTimeout(() => {
						if (!this.editor) {
							this.createEditor()
						} else {
							this.editor.setData('')
						}
					}, 0)
					if (this.options.masterId) {
						Object.assign(this.formData, this.options.row);
						this.getMasterFc()
						this.formData.masterId = this.options.masterId;
					}
				}
			}
		},
		mounted() {
			let {category} = baseUtil.getBasicInfo();
			this.category = category
		}
	}
	class UploadAdapter {
		constructor(loader) {
			this.loader = loader;
		}
		upload() {
			return new Promise((resolve, reject) => {
				const data = new FormData();
				const url = api.getBaseUrl() + '/attach'
				data.append('upload', this.loader.file);
				data.append('access-token', api.getToken());
				let xhrs = new XMLHttpRequest();
				xhrs.open('POST', url);
				xhrs.send(data);
				xhrs.onreadystatechange = function () {
					if (xhrs.readyState === 4 && xhrs.status === 200) {
						let response = JSON.parse(xhrs.responseText);
						if ( !response || !response.uploaded ) {
							return reject( response && response.error && response.error.message ? response.error.message : genericError );
						}
						resolve( {
							default: response.url
						})
					}
				};
			});
		}
		abort() {
		}
	}
</script>

<style scoped>
	.meet_detail{
		width: 83%;
		margin: 0 auto 20px auto;
	}
</style>
