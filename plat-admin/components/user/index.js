import MyUser from "./User"
import MyUserView from "./view/UserView"
import MyUserBasicInfo from "./view/UserBasicInfo"


const User = {
    install: function (Vue) {
        Vue.component("User", MyUser);
    }
};
const UserView = {
    install: function (Vue) {
        Vue.component("UserView", MyUserView);
    }
};
const UserBasicInfo = {
    install: function (Vue) {
        Vue.component('UserBasicInfo', MyUserBasicInfo);
    }
};


export {
    User, UserView, UserBasicInfo
}
