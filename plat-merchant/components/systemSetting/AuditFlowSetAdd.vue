<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <label class="col-sm-2 control-label">审批单据类型</label>
            <div class="col-sm-3">
                <select class="form-control" v-model="form.auditType">
                    <option :value="type.value" v-for="type in auditType">{{type.name}}</option>
                </select>
            </div>
        </div>
        <div class="form-group" v-for="(i,n) in startDutyIdNum">
            <label class="col-sm-2 control-label">提交岗位{{n + 1}}</label>
            <div class="col-sm-2">
                <div class="select_wrap">
                    <select class="form-control" ref="startDutyId" v-model="i.value">
                        <option v-for="(duty,index) in dutyList" :value="duty.id">{{duty.name}}</option>
                    </select>
                    <i v-if="n>0" class="fa fa-times-circle fa-lg del_btn" style="color: #ed5565; cursor: pointer;"
                       @click="delStartDutyItem(n)"></i>
                </div>
            </div>
        </div>
        <div class="form-group" v-for="(i, index) in auditNodeDutyIdsNum" v-if="auditNodeDutyIdsNum.length>0">
            <label class="col-sm-2 control-label">审核节点{{index + 1}}</label>
            <div class="add_btn col-sm-9">
                <div class="select_wrap" v-for="j in i.auditNodes" style="margin-right: 10px;">
                    <select class="form-control" ref="auditNodes" :ref="'auditNode'+i.id" v-model="j.value">
                        <option v-for="(duty,index) in dutyList" :value="duty.id">{{duty.name}}</option>
                    </select>
                    <i class="fa fa-times-circle fa-lg del_btn" @click="clickMin(j.id, i.id)"
                       style="color: #ed5565; cursor: pointer;"></i>
                </div>
                <i class="fa fa-plus" style="color: green; cursor: pointer;" @click="clickPlus(i.id)"
                   :data-parid="i.id"></i>
            </div>
        </div>
        <div class="form-group" style="text-align: left;padding-left: 80px">
            <button type="button" class="btn btn-danger btn-sm" @click="addStartDutyIds" style="margin-right:20px">
                添加提交岗位
            </button>
            <button type="button" class="btn btn-danger btn-sm" @click="addNodeDutyIds">添加审核节点</button>
        </div>
        <div class="modal-footer" style="text-align: center">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="clickSave">保存并提交</button>
            <button type="button" class="btn btn-primary" @click="close">关闭</button>
        </div>
    </form>
</template>


<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    // import InventoryBillItem from '~/components/storage/stock/InventoryBillItem'
    import {mapActions, mapGetters} from 'vuex'
    import {constUtil, objectUtil} from '~/util'
    import api from '~/api'
    // import { TableEvent } from '~/components/TableEvent'

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'item'],
        data() {
            return {
                form: {
                    auditType: '',
                    nodeDutyIds: '', // 节点岗
                    startDutyIds: '' // 提交岗
                },
                auditType: constUtil._CONST_AUDIT_TYPE,
                jobs: [],
                startDutyIdNum: [{ // 提交岗的数量
                    id: 1,
                    value: ''
                }],
                auditNodeDutyIdsNum: [{ // 审核节点的数量
                    id: 1,
                    auditNodes: [{// 审核节点岗位的数量
                        id: 1,
                        value: ''
                    }]
                }]
            }
        },
        computed: {
            ...mapGetters('systemSetting/auditFlowSet', {
                dutyList: 'dutyList'
            })
        },
        methods: {
            ...mapActions('systemSetting/auditFlowSet', {
                auditFlowSetListAdd: 'auditFlowSetListAdd',
                auditFlowSetListUpdate: 'auditFlowSetListUpdate',
                auditFlowSetListGet: 'auditFlowSetListGet'
            }),
            clickSave() {
                let refs = this.$refs;
                // 提交岗位获取
                let dutys = '';
                refs.startDutyId.forEach((i, index) => {
                    if (index !== refs.startDutyId.length - 1) {
                        dutys += i.value + ','
                    } else {
                        dutys += i.value
                    }
                })
                // 审核节点获取
                let nodes = '';
                let auditNodeDutyIds = this.auditNodeDutyIdsNum;
                let parLen = auditNodeDutyIds.length;
                auditNodeDutyIds.forEach((parItem, parIndex) => {
                    let len = parItem.auditNodes.length;
                    parItem.auditNodes.forEach((item, index) => {
                        nodes += item.value;
                        nodes += (index === len - 1) ? '' : ','
                    })
                    nodes += (parIndex === parLen - 1) ? '' : '|'
                })
                this.form.startDutyIds = dutys;
                this.form.nodeDutyIds = nodes;
                let that = this;
                if (this.item) { // 修改页面
                    delete this.form.auditType;
                    this.form.flowId = this.item.id;
                    this.auditFlowSetListUpdate({
                        callback: () => {
                            ButtonWithModalEvent.$emit(that.CONST_CLOSE_MODAL);
                            that.auditFlowSetListGet();
                        },
                        sendParams: that.form
                    });
                } else {
                    this.auditFlowSetListAdd({
                        callback: () => {
                            ButtonWithModalEvent.$emit(that.CONST_CLOSE_MODAL);
                            that.auditFlowSetListGet();
                        },
                        sendParams: that.form
                    });
                }
                console.log('form', this.form)
            },
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            addStartDutyIds() { // 添加提交岗位
                let obj = this.addObjInArr(this.startDutyIdNum)
                this.startDutyIdNum.push(obj);
            },
            delStartDutyItem(index) { // 删除提交岗
                this.startDutyIdNum.splice(index, 1);
            },
            addNodeDutyIds() { // 添加审批节点
                let len = this.auditNodeDutyIdsNum.length;
                let id = this.auditNodeDutyIdsNum[len - 1].id + 1;
                this.auditNodeDutyIdsNum.push({ // 审核节点的数量
                    id,
                    auditNodes: [{// 审核节点岗位的数量
                        id: 1,
                        value: this.dutyList[0].id
                    }]
                });
            },
            clickPlus(parid) {
                let parIndex = 0;
                this.auditNodeDutyIdsNum.forEach((parItem, parI) => {
                    if (parItem.id === parid) {
                        parIndex = parI;
                    }
                })
                if (this.auditNodeDutyIdsNum[parIndex].auditNodes.length < 6) {
                    console.log('parIndex', parIndex);
                    let obj = this.addObjInArr(this.auditNodeDutyIdsNum[parIndex].auditNodes)
                    this.auditNodeDutyIdsNum[parIndex].auditNodes.push(obj);
                }
            },
            clickMin(id, parid) {
                console.log('id', id);
                console.log('parid', parid);
                let index = 0;
                let parIndex = 0;
                this.auditNodeDutyIdsNum.forEach((parItem, parI) => {
                    if (parItem.id === parid) {
                        parIndex = parI;
                    }
                })
                console.log('parIndex', parIndex);
                this.auditNodeDutyIdsNum[parIndex].auditNodes.forEach((item, i) => {
                    if (item.id === id) {
                        index = i
                    }
                })
                console.log('delete', index);
                console.log('delete====', this.auditNodeDutyIdsNum);
                if (this.auditNodeDutyIdsNum.length === 1 && this.auditNodeDutyIdsNum[parIndex].auditNodes.length === 1) {
                    alert('至少有一个审核节点！');
                } else {
                    this.auditNodeDutyIdsNum[parIndex].auditNodes.splice(index, 1)
                    if (this.auditNodeDutyIdsNum[parIndex].auditNodes.length === 0) {
                        this.auditNodeDutyIdsNum.splice(parIndex, 1);
                    }
                }
            },
            addObjInArr(arr) {
                let len = arr.length
                let id = arr[len - 1].id + 1
                return {
                    id, value: this.dutyList[0].id
                }
            },
            initModifyPage() {
                this.auditFlowNodeListGet({
                    flowId: this.item.id,
                    callback: (arr) => {
                        this.auditNodeDutyIdsNum = [];
                        arr.forEach((item, index) => {
                            let auditNodes = [];
                            item.nodeDutyIds$.forEach((i, n) => {
                                let temp = {};
                                if (i) {
                                    temp = {
                                        id: n + 1,
                                        value: i.id
                                    }
                                } else {
                                    temp = {
                                        id: n + 1,
                                        value: ''
                                    }
                                }
                                auditNodes.push(temp)
                            })
                            this.auditNodeDutyIdsNum.push({
                                id: index + 1,
                                auditNodes
                            })
                        })
                    }
                });
                objectUtil.replaceSameFieldsValue(this.item, this.form);
                this.startDutyIdNum = [];
                this.item.startDutyIds$.forEach((item, index) => {
                    let temp = {}
                    if (item) {
                        temp = {
                            id: index + 1,
                            value: item.id
                        }
                    } else {
                        temp = {
                            id: index + 1,
                            value: ''
                        }
                    }
                    this.startDutyIdNum.push(temp)
                })
            },
            // 获取审核节点
            auditFlowNodeListGet(param) {
                let {flowId, callback} = param;
                let dutyList = this.dutyList;
                let auditFlowNodeList = [];
                api.request({
                    url: api.consts._AUDIT_NODE_LIST_GET,
                    params: {
                        flowId
                    },
                    success(data) {
                        auditFlowNodeList = data.rows;
                        auditFlowNodeList.map(item => {
                            // 将审批节点分割成数组
                            item.nodeDutyIds$ = [];
                            item.dutyIds.split(',').forEach((i) => {
                                item.nodeDutyIds$.push(dutyList.find(duty => duty.id === i))
                            });
                            return item
                        })
                        callback(auditFlowNodeList)
                    },
                    fail(error) {
                        alert(error.message)
                    }
                })
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                if (this.item) { // 修改页面
                    this.initModifyPage();
                } else {
                    this.auditNodeDutyIdsNum[0].auditNodes[0].value = this.dutyList[0].id;
                    this.startDutyIdNum[0].value = this.dutyList[0].id;
                }
            });
        }
    }
</script>

<style scoped>
    .select_item {
        width: 50%;
        margin: 50px auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .add_btn {
        display: flex;
        align-items: center;
    }

    .select_wrap {
        position: relative;
    }

    .del_btn {
        position: absolute;
        top: -5px;
        right: -5px;
    }
</style>
