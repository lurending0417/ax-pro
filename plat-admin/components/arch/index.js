import MyPlatEmployee from "./PlatEmployee"
import MyPlatEmployeeEditor from "./editor/PlatEmployeeEditor"

const PlatEmployeeEditor = {
    install: function (Vue) {
        Vue.component("PlatEmployeeEditor", MyPlatEmployeeEditor);
    }
};

const PlatEmployee = {
    install: function (Vue) {
        Vue.component("PlatEmployee", MyPlatEmployee);
    }
};

export {
    PlatEmployee, PlatEmployeeEditor
}
