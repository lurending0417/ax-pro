//index.js
//获取应用实例
import {
    connect
} from '../../../libs/wx-redux/connect.js'
import scrollAble from '../../../components/common/refreshAndMore/index'
import { category as categoryType } from '../../../common/actionType'
import { master , sys} from '../../../common/api'

Page(scrollAble(connect({
    data: (state) => {
        let {masterList, categoryList, chooseCategoryIndex} = state.master;
        return {
            masterList: masterList,
            categoryList: categoryList,
            chooseCategoryIndex: chooseCategoryIndex,
            api: master.list
        }
    },
    action: dispatch => ({
        getCategory: function () {
            return new Promise((resolve, reject) => {
                console.log('getCategory')
                dispatch({
                    type: 'CallApi',
                    payload: {
                        api: sys.category.get,
                        body: {},
                        success: (result) => {
                            let rows = result.rows;
                            dispatch({
                                type: categoryType.list,
                                payload: {
                                    rows: rows
                                }
                            })
                            if (rows.length > 0) {
                                dispatch({
                                    type: categoryType.chooseCategoryIndex,
                                    payload: {
                                        chooseCategoryIndex: 0
                                    }
                                })
                            }
                            resolve()
                        }
                    }
                })
            })


        }
    }),
    // list 查询
    getQuery: function () {
        let categoryId = '';
        let index = this.data.chooseCategoryIndex;
        if (this.data.categoryList.length > 0) {
            categoryId = this.data.categoryList[index].id
        }
        return {
            categoryId
        }
    },
    refreshList() {
        this.getList(0)
    },
    onReady() {
        this.getCategory().then(() => {
            this.getList(0)
        });
    }
})))