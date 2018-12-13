<template>
    <div>
        <div class="line-cls">
            <KeyValueCom :title="'当前客户手机号：'" :value="telephone"></KeyValueCom>
        </div>
        <div v-if="leaseOrRetail === 'lease'">
            <LeaseList></LeaseList>
        </div>
        <div v-else-if="leaseOrRetail === 'retail'">
            <div v-if="isSmart">
                <ConsumeList></ConsumeList>
            </div>
            <div v-else>
                <RetailList></RetailList>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-offset-10" style="text-align: right;padding-right: 15px;">
                <button class="btn-success btn" @click="clickBack">返回</button>
            </div>
        </div>
    </div>
</template>

<script>
    import LeaseList from './LeaseList'
    import RetailList from './RetailList'
    import KeyValueCom from '~/components/KeyValueCom'
    import ConsumeList from './ConsumeList'
    import { baseUtil } from '~/util'
    import {mapGetters} from 'vuex';
    export default {
        props: ['passed'],
        components: {
            KeyValueCom,
            LeaseList,
            ConsumeList,
            RetailList
        },
        data() {
            return {
                isSmart: false
            }
        },
        computed: {
            ...mapGetters('userManage/userList', {
                leaseOrRetail: 'getLeaseOrRetail',
                telephone: 'getTelephone'
            })
        },
        methods: {
            clickBack() {
                this.passed.changeCurrCpn('UserListMain')
            }
        },
        mounted() {
            let merchant = baseUtil.getMerchant();
            if (this.leaseOrRetail === 'retail' && merchant) {
                if (merchant.version === 'SMART') {
                    this.isSmart = true
                } else {
                    this.isSmart = false
                }
            }
        }
    }
</script>
