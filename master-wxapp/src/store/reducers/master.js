import { master } from '../../common/actionType'
import { category as categoryType} from '../../common/actionType'

const init = {
    masterList: [],
    categoryList: [],
    chooseCategoryIndex: 0
}

export default (state = init, { type, payload }) => {
    switch (type) {
        case master.list: {
            state.masterList = payload.rows
            break;
        }
        case categoryType.list: {
            state.categoryList = payload.rows;
            break;
        }
        case categoryType.chooseCategoryIndex: {
            console.log('change index reducer')
            state.chooseCategoryIndex = payload.chooseCategoryIndex;
            break;
        }
    }
    return state;
}