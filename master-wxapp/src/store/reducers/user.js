import Immutable from 'immutable'
import {
    UserRefresh, user as UserAction
} from '../../common/actionType'

const initialState = Immutable.fromJS({
    token: '',
    hasUserInfo: false,
    userInfo: {
        age: '100',
        nickName: '',
        avatarUrl: '',
    },
    categories: [],// 大师类别
    wxInfo: { //微信用户信息
        avatar: ''
    },
    signed: { // 签到信息
        checkCount: 0,
        helpCount: 0
    }
})


export default (state = initialState, {
    type,
    payload
}) => {
    switch (type) {
        case 'FakeToken': {
            return state.set('token', 'f287f1631aeb4ef0a78dd7390affef68')
        }
        case UserRefresh:
            {
                return state.mergeIn(['userInfo'], payload.result)
            }
        case "ChangeName":
            {
                state = state.set('hasUserInfo', true)
                return state.mergeIn(['userInfo'], payload.result)
            }
        case UserAction.loginSucc: {
            state = state.set('token', payload.result.token)
            state = state.set('categories', payload.result.categories)
            return state.mergeIn(['userInfo'], payload.result.user)
        }
        case UserAction.wxUser: {
            return state.mergeIn(['wxInfo'], payload.result)
        }
        case UserAction.signedInfo: {
            return state.mergeIn(['signed'], payload.result)
        }
    }
    return state;
}