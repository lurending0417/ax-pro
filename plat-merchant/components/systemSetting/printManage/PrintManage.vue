<template>
    <div>
        <div class="row">
            <div class="col-md-4">
                <input type="text" class="form-control" style="display: inline-block; max-width: 150px" placeholder="模板名称"
                       v-model="query$">
                <button class="btn btn-info" style="margin: 0 10px 3px" @click="search()">搜索</button>
            </div>
            <div class="col-md-7" style="text-align: right"></div>
            <div class="col-md-1" style="text-align: right">
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-danger'],
                                btnName: '新增'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'add',
                                titleName: '新增模板'
                            }">
                    <AddTemplate slot="main"
                                      :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                                      :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'add'"
                                      :refreshTable="search"
                    ></AddTemplate>
                </ButtonWithModal>
            </div>
        </div>

        <TableCpn :heads="[
                    {propName: 'name', name: '名称'},
                    {propName: 'pureType', name: '素/非素'},
                    {propName: 'priceTypeName', name: '定价方式'},
                    {propName: 'metalName', name: '金属'},
                    {propName: 'gemName', name: '宝石'},
                    {propName: 'categoryName', name: '品类'},
                    {tag:'BUTTON',name: '操作'}
                ]"
                  :items="getTemplates">
            <div v-for="(item,index) in getTemplates" :slot="'BUTTON'+index">
                <ButtonWithModal
                    :btnProps="{
                        btnClasses: ['btn btn-primary btn-sm'],
                        btnName: '修改'
                    }"
                    :modalProps="{
                        CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                        CONST_CLICK_MODAL: CONST_CLICK_MODAL + index,
                        titleName: '修改模板'
                    }"
                >
                    <AddTemplate
                        slot="main"
                        :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                        :CONST_CLICK_MODAL="CONST_CLICK_MODAL + index"
                        :refreshTable="search"
                        :item="item"
                    >
                    </AddTemplate>
                </ButtonWithModal>
                <span style="margin: 0 5px;">
                    <button class="btn btn-danger btn-sm" @click="deleteItem(item)">删除</button>
                </span>
                <ButtonWithModal
                    :btnProps="{
                                btnClasses: ['btn btn-info btn-sm'],
                                btnName: '历史'
                            }"
                    :modalProps="{
                                CONST_CLOSE_MODAL: CONST_CLOSE_MODAL,
                                CONST_CLICK_MODAL: CONST_CLICK_MODAL+'history'+index,
                                titleName: '历史',
                                modalClasses: ['modal-lg']
                            }">
                    <History slot="main"
                             :CONST_CLOSE_MODAL="CONST_CLOSE_MODAL"
                             :CONST_CLICK_MODAL="CONST_CLICK_MODAL+'history'+index"
                             :params="item">
                    </History>
                </ButtonWithModal>
            </div>
        </TableCpn>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import TableCpn from '~/components/Table'
    import uuid from 'uuid'
    import ButtonWithModal from '~/components/ButtonWithModal'
    import AddTemplate from '~/components/systemSetting/printManage/AddTemplate'
    import History from '~/components/storage/wareBaseInfo/History'

    export default {
        components: {
            TableCpn,
            ButtonWithModal,
            AddTemplate,
            History
        },
        data () {
            return {
                query$: '',
                CONST_CLOSE_MODAL: uuid(),
                CONST_CHANGE_PAGE: uuid(),
                CONST_CLICK_MODAL: uuid(),
                CONST_RESTORE: uuid()
            }
        },
        computed: {
            ...mapGetters('systemSetting/templateManage', {
                getTemplates: 'getTemplates'
            })
        },
        methods: {
            ...mapActions('systemSetting/templateManage', {
                apiGetTemplateList: 'apiGetTemplateList',
                apiDelTemplate: 'apiDelTemplate'
            }),
            search (query) {
                let params = {
                    query: this.query$
                }
                if (query) {
                    params.query = query
                }
                this.apiGetTemplateList(params);
            },
            deleteItem(item) {
                this.apiDelTemplate({
                    params: {
                        templateId: item.id
                    },
                    callback: data => {
                        this.search()
                    }
                })
            }
        },
        beforeMount() {
            this.search();
        }
    }
</script>
