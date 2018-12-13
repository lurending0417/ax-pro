<template>
    <form class="form-horizontal" style="margin-top: 16px">
        <div class="form-group">
            <label class="col-sm-2 control-label">审批单据类型</label>
            <div class="col-sm-3">
                <select class="form-control" v-model="form.auditType" disabled>
                    <option :value="type.value" v-for="type in auditType">{{type.name}}</option>
                </select>
            </div>
        </div>
        <div class="form-group" v-for="(i,index) in form.startDutyIds$">
            <label class="col-sm-2 control-label">提交岗位{{index + 1}}</label>
            <div class="col-sm-2">
                <select class="form-control" :value="i.id" disabled>
                    <option v-for="(duty,index) in dutyList" :value="duty.id">{{duty.name}}</option>
                </select>
            </div>
        </div>
        <div class="form-group" v-for="(i,index) in getAuditFlowNodeList">
            <label class="col-sm-2 control-label">审核节点{{index + 1}}</label>
            <div class="add_btn col-sm-9">
                <div class="select_wrap" v-for="j in i.nodeDutyIds$" style="margin-right: 10px;">
                    <select class="form-control" ref="auditNodes" :ref="'auditNode'+i.id" :value="j.id" disabled>
                        <option v-for="(duty,index) in dutyList" :value="duty.id">{{duty.name}}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="modal-footer" style="text-align: center">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="close">关闭</button>
        </div>
    </form>
</template>


<script>
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {mapActions, mapGetters} from 'vuex'
    import {constUtil, objectUtil} from '~/util'

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL', 'item'],
        data() {
            return {
                form: {
                    auditType: '',
                    startDutyIds$: [] // 获取到的提交岗
                },
                auditType: constUtil._CONST_AUDIT_TYPE,
                jobs: [],
                startDutyIdNum: [{ // 提交岗的数量
                    id: 1
                }],
                auditNodeDutyIdsNum: [{ // 审核节点的数量
                    id: 1,
                    auditNodes: [{// 审核节点岗位的数量
                        id: 1
                    }]
                }]
            }
        },
        computed: {
            ...mapGetters('systemSetting/auditFlowSet', {
                dutyList: 'dutyList',
                getAuditFlowNodeList: 'getAuditFlowNodeList'
            })
        },
        methods: {
            ...mapActions('systemSetting/auditFlowSet', {
                auditFlowSetListAdd: 'auditFlowSetListAdd',
                auditFlowNodeListGet: 'auditFlowNodeListGet',
                auditFlowSetListGet: 'auditFlowSetListGet'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.auditFlowNodeListGet(this.item.id);
                objectUtil.replaceSameFieldsValue(this.item, this.form);
                console.log('this.form', this.form)
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
