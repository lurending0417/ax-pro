<template>
    <div>
        <div class="row">
            <div class="col-lg-2" style="font-weight: bold;width: 10%;">黄金赠送规则：</div>
            <ol class="col-lg-10">
                <li>为提升商户线下零售业绩，提高用户黏度，易戴易美为商户提供了面向用户赠送黄金的营销工具。</li>
                <li>黄金赠送规则由商户自行定义。用户在线下消费后，系统会按照该规则向用户赠金，同时也会向该用户的推荐者赠送50%的黄金。</li>
                <li>所赠送的黄金从商户的营销金中扣除。</li>
            </ol>
        </div>
        <div class="row">
            <div class="col-lg-offset-10 col-lg-2" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-danger'],
                                btnName: '新增'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                titleName:'新增',
                                modalClasses: ['modal-lg']
                            }">
                    <PresentRuleAdd slot="main"
                                    :addModalParams="{
                                        CONST_CLICK_MODAL: CONST_CLICK_MODAL,
                                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                        refresh: refresh
                    }">
                    </PresentRuleAdd>
                </ButtonWithModal>
            </div>
        </div>
        <TableCpn :heads="[
            {propName:'createTime',name:'创建时间'},
            {propName:'material',name:'材质'},
            {propName:'store',name:'参与店铺'},
            {propName:'benchmark',name:'赠送比例'},
            {propName:'creatorName',name:'操作人'},
            {propName:'status',name:'状态'},
            {tag:'BUTTON',name:'操作'}
            ]" :items="getGoldPresentRuleList">
            <div v-for="(item,index) in getGoldPresentRuleList" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-success'],
                                btnName: '修改'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+index+'modify',
                                titleName:'修改'
                            }">
                    <PresentRuleAdd slot="main"
                                    :addModalParams="{
                                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                        CONST_CLICK_MODAL: CONST_CLICK_MODAL+index+'modify',
                                        refresh: refresh,
                                        item: item
                    }">
                    </PresentRuleAdd>
                </ButtonWithModal>
            </div>
        </TableCpn>
    </div>
</template>

<script>
    import ButtonWithModal from '~/components/ButtonWithModal'
    import {mapActions, mapGetters} from 'vuex'
    import TableCpn from '~/components/Table'
    import PresentRuleAdd from '~/components/active/presentGold/PresentRuleAdd'
    import uuid from 'uuid'

    export default {
        components: {
            TableCpn,
            ButtonWithModal,
            PresentRuleAdd
        },
        computed: {
            ...mapGetters('active/presentGold', {
                getGoldPresentRuleList: 'getGoldPresentRuleList'
            })
        },
        data() {
            return {
                CONST_CLICK_MODAL: uuid(),
                CONST_CLOSE_MODAL: uuid()
            }
        },
        methods: {
            ...mapActions('active/presentGold', {
                apiGetGoldPresentRuleList: 'apiGetGoldPresentRuleList'
            }),
            refresh() {
                this.apiGetGoldPresentRuleList()
            }
        },
        mounted() {
            this.apiGetGoldPresentRuleList()
        }
    }
</script>
