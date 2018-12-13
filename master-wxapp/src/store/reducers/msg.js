import Immutable from 'immutable'

import { message as msgAction } from '../../common/actionType'

const init = Immutable.fromJS({
    count: {
        ['COMMENT']: 0,
        ['AGREE']: 0,
        ['WANTED']: 0
    }
})

export default (state = init, { type, payload }) => {
    switch (type) {
        case msgAction.Count: {
            payload.result.types.forEach(item => {
                state = state.setIn(['count', item.id], item.count)
            })
        }
    }

    return state;
}