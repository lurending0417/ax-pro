<template>
	<div>
		<div class="text_right" style="margin-bottom: 10px;">
			<el-button type="danger" @click="add">新增</el-button>
		</div>

		<el-table
			:data="tableData"
			border
			stripe
			empty-text="暂无数据"
			style="width: 100%">
			<el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
			<el-table-column prop="name" label="课程名称" width="100" align="center"> </el-table-column>
			<el-table-column prop="regularPrice" label="原价" width="100" align="center"> </el-table-column>
			<el-table-column prop="retailPrice" label="现价" width="100" align="center"> </el-table-column>
			<el-table-column prop="type" label="分类" width="100" align="center" :formatter="formatFun"> </el-table-column>
			<el-table-column prop="master" label="大师" width="100" align="center"> </el-table-column>
			<el-table-column prop="isUp" label="是否单独上架" :formatter="formatIsUp" width="180" align="center"> </el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row, 'detail')">详情</el-button>
					<el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row, 'update')">修改</el-button>
					<el-button v-if="scope.row.isUp" size="mini" type="success" @click="shelf(scope.$index, scope.row)">上架</el-button>
				</template>
			</el-table-column>
		</el-table>

		<no-ssr><Pagination :options="this" @list="list"></Pagination></no-ssr>
		<SingleCourseAddModal :options="modalObj" @close="closeModal"></SingleCourseAddModal>


		<!--拖拽上传文件-->

		<!--<div @dragenter="dragEnter()" @dragleave="dragLeave()" @dragover="dragOver" @drop="dropDown" class="drag_cls">-->
			<!--将文件拖拽到此处-->
			<!--<img :src="url" alt="" style="width:100px;"/>-->
		<!--</div>-->

		<!--audioContext-->
		<div class="drag_cls" @mouseenter="hoverFunc">
		</div>
	</div>
</template>

<script>
	import SingleCourseAddModal from './SingleCourseAddModal.vue'
	export default {
		components: {
			SingleCourseAddModal
		},
		data() {
			return {
				url: '',
				params: {},
				modalObj: {
					modalTitle: '',
					visible: false,
					row: {},
					canChange: true
				},
				total: 0,
				tableData: []
			}
		},
		methods: {
			accept() {
				this.tableData = [];
			},
			hoverFunc() {
				let AudioContext = window.AudioContext || window.webkitAudioContext;
				let audioContext = new AudioContext();
				let oscillator = audioContext.createOscillator(); // 音调
				let gainNode = audioContext.createGain(); // 音量
				oscillator.connect(gainNode);
				gainNode.connect(audioContext.destination)
				oscillator.type = 'sine';
				oscillator.frequency.value = 196.00;
				gainNode.gain.setValueAtTime(0, audioContext.currentTime);
				gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
				oscillator.start(audioContext.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
				oscillator.stop(audioContext.currentTime + 1)
			},
			createAudio(raw) {
				let AudioContext = window.AudioContext || window.webkitAudioContext;
				let audioContext = new AudioContext();
				let audioBufferSourceNode = audioContext.createBufferSource();
				let analyserNode = audioContext.createAnalyser();
				analyserNode.fftSize = 256;
				audioBufferSourceNode.connect(analyserNode)
				analyserNode.connect(audioContext.destination)
				audioContext.decodeAudioData(raw, (buffer) => {
					audioBufferSourceNode.buffer = buffer;
					audioBufferSourceNode.start(0);
				})
			},
			createMenu(ctx) {
				//格式化请求连接
				var url = util.format(that.apiURL.createMenu,that.apiDomain,data);
				//使用 Post 请求创建微信菜单
				that.requestPost(url,JSON.stringify(menus)).then(function(data){
					//将结果打印
					console.log(data);
				});
			},
			dragEnter() {
				console.log('drag enter')
			},
			dragLeave() {
				console.log('drag leave')
			},
			dragOver(event) {
				event.preventDefault()
			},
			dropDown(event) {
				event.preventDefault()
				let data = event.dataTransfer.files;
//				this.url = URL.createObjectURL(data[0]);
				let fileReader = new FileReader();
				fileReader.readAsDataURL(data[0]);
				fileReader.onloadend = (event) => {
					this.url = event.target.result
					console.log('url0', this.url)
				}
			},
			formatFun(row) {
				this.text = '';
				console.log('this.text', text)
			},
			formatIsUp(row) {
				if (row.isUp) {
					return '是'
				}
				return '否'
			},
			handleEdit(index, row, tag) {
				let temp = {
					modalTitle: '',
					visible: true,
					row: row,
					canChange: true
				}
				switch (tag) {
					case 'detail' : {
						temp.modalTitle = '课程详情';
						temp.canChange = false; break
					}
					case 'update' : {
						temp.modalTitle = '修改课程'; break
					}
				}
				this.modalObj = temp
			},
			add() {
				this.modalObj = {
					modalTitle: '新增课程',
					visible: true,
					row: {},
					canChange: true
				}
			},
			closeModal() {
				this.modalObj = {
					modalTitle: '',
					visible: false,
					row: {},
					canChange: true
				}
			},
			list() {
			}
		}
	}
</script>

<style scoped>
	.drag_cls{
		width:100px;
		height: 100px;
		border: 1px solid #409EFF;
	}
</style>
