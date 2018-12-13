import { combineReducers } from 'redux'

import user from './user'
import loading from './loading'
import home from './home'
import cert from './cert'
import msg from './msg'
import master from './master'

export default combineReducers({
    user, loading, home, cert, msg, master
})