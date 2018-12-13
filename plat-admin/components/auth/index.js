import MyActionEditor from "./editor/ActionEditor"
import MyActionGroupEditor from "./editor/ActionGroupEditor"
import MyPageGroupEditor from "./editor/PageGroupEditor"
import MyPageEditor from "./editor/PageEditor"
import MyTabEditor from "./editor/TabEditor"
import MyRoleGroupEditor from "./editor/RoleGroupEditor"
import MyRoleEditor from "./editor/RoleEditor"
import MyDutyEditor from "./editor/DutyEditor"
import MyActionTree from "./ActionTree"
import MyDutyTpl from "./DutyTpl"
import MyPageTree from "./PageTree"
import MyRoleTplTree from "./RoleTplTree"
import MyAdminPageTree from "./AdminPageTree"
import MyAdminRoleTree from "./AdminRoleTree"
import MyAdminPageEditor from "./editor/admin/PageEditor"
import MyAdminPageGroupEditor from "./editor/admin/PageGroupEditor"
import MyAdminRoleEditor from "./editor/admin/RoleEditor"
import MyAdminRoleGroupEditor from "./editor/admin/RoleGroupEditor"
import MyAdminTabEditor from "./editor/admin/TabEditor"

const AdminRoleTree = {
    install: function (Vue) {
        Vue.component("AdminRoleTree", MyAdminRoleTree);
    }
};

const AdminPageTree = {
    install: function (Vue) {
        Vue.component("AdminPageTree", MyAdminPageTree);
    }
};

const RoleTplTree = {
    install: function (Vue) {
        Vue.component("RoleTplTree", MyRoleTplTree);
    }
};

const PageTree = {
    install: function (Vue) {
        Vue.component("PageTree", MyPageTree);
    }
};

const DutyTpl = {
    install: function (Vue) {
        Vue.component("DutyTpl", MyDutyTpl);
    }
};

const ActionTree = {
    install: function (Vue) {
        Vue.component("ActionTree", MyActionTree);
    }
};


const ActionEditor = {
    install: function (vue) {
        vue.component("ActionEditor", MyActionEditor);
    }
};
const ActionGroupEditor = {
    install: function (vue) {
        vue.component("ActionGroupEditor", MyActionGroupEditor)
    }
};
const PageGroupEditor = {
    install: function (vue) {
        vue.component("PageGroupEditor", MyPageGroupEditor)
    }
};
const PageEditor = {
    install: function (vue) {
        vue.component("PageEditor", MyPageEditor)
    }
};
const TabEditor = {
    install: function (vue) {
        vue.component("TabEditor", MyTabEditor)
    }
};
const RoleGroupEditor = {
    install: function (vue) {
        vue.component("RoleGroupEditor", MyRoleGroupEditor);
    }
};
const RoleEditor = {
    install: function (vue) {
        vue.component("RoleEditor", MyRoleEditor);
    }
};
const DutyEditor = {
    install: function (vue) {
        vue.component("DutyEditor", MyDutyEditor);
    }
};
const AdminPageEditor = {
    install: function (Vue) {
        Vue.component("AdminPageEditor", MyAdminPageEditor);
    }
};
const AdminPageGroupEditor = {
    install: function (Vue) {
        Vue.component("AdminPageGroupEditor", MyAdminPageGroupEditor);
    }
};
const AdminRoleEditor = {
    install: function (Vue) {
        Vue.component("AdminRoleEditor", MyAdminRoleEditor);
    }
};
const AdminRoleGroupEditor = {
    install: function (Vue) {
        Vue.component("AdminRoleGroupEditor", MyAdminRoleGroupEditor);
    }
};
const AdminTabEditor = {
    install: function (Vue) {
        Vue.component("AdminTabEditor", MyAdminTabEditor);
    }
};


export {
    ActionTree, DutyTpl, PageTree, RoleTplTree, AdminPageTree, AdminRoleTree,
    ActionGroupEditor, ActionEditor, PageGroupEditor, PageEditor, TabEditor, RoleGroupEditor, RoleEditor, DutyEditor,
    AdminPageGroupEditor, AdminPageEditor, AdminTabEditor, AdminRoleGroupEditor, AdminRoleEditor
}
