import Vuex from 'vuex'
import auth from './auth/auth'
import master from './master'
import user from './user'
import account from './account'

export default () => new Vuex.Store({
    modules: {
		auth,
		master,
		account,
		user
    }
});
