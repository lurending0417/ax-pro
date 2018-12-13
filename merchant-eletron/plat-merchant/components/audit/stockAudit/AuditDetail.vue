<template>
    <div>
        <table class="table table-bordered" style="width: 90%;margin:10px auto">
            <thead>
            <tr>
                <th>序号</th>
                <th>姓名</th>
                <th>操作时间</th>
                <th>是否通过</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in getAuditTransactions">
                <td>{{index + 1}}</td>
                <td>{{item.creatorId}}</td>
                <td>{{item.createTime }}</td>
                <td>{{item.result === 'APPROVED' ? '通过' : '不通过'}}</td>
            </tr>
            <tr>
                <td colspan="4">备注:</td>
            </tr>
            </tbody>
        </table>
        <div class="modal-footer" style="text-align: center;">
            <slot name="btn"></slot>
            <button type="button" class="btn btn-primary" @click="add">关闭</button>
        </div>
    </div>
</template>

<script>
    // import { mapActions, mapGetters, mapMutations } from 'vuex'
    import {mapActions, mapGetters} from 'vuex'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent';

    export default {
        components: {},
        props: ['CONST_CLOSE_MODAL', 'CONST_CLICK_MODAL', 'item'],
        data() {
            return {
                form: {
                    withdrawals: '',
                    abstract: '',
                    pwd: ''
                }
            }
        },
        computed: {
            ...mapGetters('audit/stockAudit/auditDetail', {
                getAuditTransactions: 'getAuditTransactions'
            })
        },
        methods: {
            ...mapActions('audit/stockAudit/auditDetail', {
                auditTransactionGet: 'auditTransactionGet'
            }),
            // ...mapMutations('retail/offlineRetail/retailRecycleBillMain', {
            //     resetMainPageParams: 'resetMainPageParams',
            //     resetRetailRecycleBills: 'resetRetailRecycleBills',
            //     resetRetailRecycleBillItem: 'resetRetailRecycleBillItem'
            // })
            add() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL);
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                this.auditTransactionGet(this.item.recordId)
            });
        }
    }
</script>

<style scoped>
    .body_top {
        display: flex;
    }
</style>
