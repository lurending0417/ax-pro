<template>
    <div>
        <div class="modal-body">
            <TableCpn :heads="[
                    {propName:'createTime',name:'发布日期'},
                    {propName:'templateName',name:'标题'},
                    {propName:'sendCount',name:'发送人数'},
                    {propName:'content',name:'发送对象条件'}
                ]" :items="tableView">
            </TableCpn>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
    import TableCpn from '~/components/Table'
    import {mapActions} from 'vuex'
    import {ButtonWithModalEvent} from '~/components/ButtonWithModalEvent'
    import {dateUtil, baseUtil, constUtil} from '~/util'

    export default {
        props: ['CONST_CLICK_MODAL', 'CONST_CLOSE_MODAL'],
        components: {
            TableCpn
        },
        data() {
            return {
                tableView: []
            }
        },
        methods: {
            ...mapActions('userManage/notice', {
                apiGetRecord: 'apiGetMessageTemplateSendRecord'
            }),
            close() {
                ButtonWithModalEvent.$emit(this.CONST_CLOSE_MODAL)
            },
            handleBirth(number) {
                let birth = '';
                let temp = number.toString()
                if (temp.length === 3) {
                    birth += temp[0] + '月';
                    if (temp[1] === '0') {
                        birth += temp[2] + '日';
                    } else {
                        birth += temp[1] + temp[2] + '日';
                    }
                } else if (temp.length === 4) {
                    if (temp[0] === '0') {
                        birth += temp[1] + '月';
                    } else {
                        birth += temp[0] + temp[1] + '月';
                    }
                    if (temp[2] === '0') {
                        birth += temp[3] + '日';
                    } else {
                        birth += temp[2] + temp[3] + '日';
                    }
                }
                return birth
            }
        },
        mounted() {
            ButtonWithModalEvent.$off(this.CONST_CLICK_MODAL)
            ButtonWithModalEvent.$on(this.CONST_CLICK_MODAL, () => {
                // 获取数据
                this.apiGetRecord((data) => {
                    this.tableView = data.map(item => {
                        item.createTime = dateUtil.pattern(new Date(item.createTime), 'yyyy-MM-dd HH:mm:ss')
                        item.content = ''
                        let condition = {};
                        if (item.conditions) {
                            condition = JSON.parse(item.conditions)
                        }

                        // 注册日期
                        let hasRegDateStart = false
                        if (condition['regDateStart']) {
                            item.content += '注册日期：' + condition['regDateStart'];
                            hasRegDateStart = true
                        }
                        if (condition['regDateEnd']) {
                            if (hasRegDateStart) {
                                item.content += '至' + condition['regDateEnd'] + '；';
                            } else {
                                item.content += '注册日期至' + condition['regDateEnd'] + '；';
                            }
                        }

                        // 年龄
                        let hasAgeStart = false;
                        if (condition.ageStart) {
                            item.content += '年龄：' + condition['ageStart'];
                            hasAgeStart = true;
                        }
                        if (condition.ageEnd) {
                            if (hasAgeStart) {
                                item.content += '至' + condition['ageEnd'] + '；';
                            } else {
                                item.content += '年龄至：' + condition['ageEnd'] + '；';
                            }
                        }
                        // 生日
                        let hasBirthStart = false;
                        if (condition.birthStart) {
                            let birthStart = this.handleBirth(condition['birthStart'])
                            item.content += '生日：' + birthStart;
                            hasBirthStart = true;
                        }
                        if (condition.birthEnd) {
                            let birthEnd = this.handleBirth(condition['birthEnd'])
                            if (hasBirthStart) {
                                item.content += '至' + birthEnd + '；';
                            } else {
                                item.content += '生日至：' + birthEnd + '；';
                            }
                        }
                        if (condition.gender) {
                            let gender = condition['gender'].split(',');
                            gender = gender.map(ele => {
                                return constUtil._CONST_USER_GENDER.find(g => g.value === ele).name
                            })
                            item.content += '性别：' + gender.join() + '；';
                        }
                        if (condition.storeId) {
                            let stores = condition['storeId'].split(',');
                            stores = stores.map(ele => {
                                return baseUtil.getNameFromPropId('stores', ele)
                            })
                            item.content += '门店：' + stores.join() + '；';
                        }
                        return item
                    })
                })
            })
        }
    }
</script>
