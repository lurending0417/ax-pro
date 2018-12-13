import Immutable from 'immutable'
import { Loading } from '../../common/actionType';

export default (state = { loading: false, loadingCount: 0 }, { type, payload }) => {
    switch (type) {
        case Loading: {
            let { loadingCount } = state;
            loadingCount = loadingCount + (payload ? 1 : -1)
            if (loadingCount < 0) loadingCount = 0;
            return {
                loadingCount,
                loading: true,//loadingCount > 0
            }
        }
    }
    return state;
}