import MyMetalEditor from "./editor/MetalEditor"
import MyGemEditor from "./editor/GemEditor"
import MyCategoryEditor from "./editor/CategoryEditor";
import MyCraftEditor from "./editor/CraftEditor"
import MyMetaPropEditor from "./editor/MetaPropEditor"
import MyMetaPropList from "./MetaProp"
import MyCategory from "./Category"
import MyCraft from "./Craft"
import MyGem from "./Gem"
import MyMetal from "./Metal"

const CategoryEditor = {
    install: function (Vue) {
        Vue.component('CategoryEditor', MyCategoryEditor);
    }
};
const MetalEditor = {
    install: function (Vue) {
        Vue.component("MetalEditor", MyMetalEditor);
    }
};
const GemEditor = {
    install: function (vue) {
        vue.component("GemEditor", MyGemEditor);
    }
};
const CraftEditor = {
    install: function (vue) {
        vue.component("CraftEditor", MyCraftEditor);
    }
};
const MetaPropList = {
    install: function (vue) {
        vue.component("MetaPropList", MyMetaPropList);
    }
};
const MetaPropEditor = {
    install: function (vue) {
        vue.component("MetaPropEditor", MyMetaPropEditor);
    }
};

const Category = {
    install: function (Vue) {
        Vue.component("Category", MyCategory);
    }
};

const Craft = {
    install: function (Vue) {
        Vue.component("Craft", MyCraft);
    }
};

const Gem = {
    install: function (Vue) {
        Vue.component("Gem", MyGem);
    }
};
const Metal = {
    install: function (Vue) {
        Vue.component("Metal", MyMetal);
    }
};


export {
    Category, Craft, Gem, Metal,
    MetalEditor, GemEditor, CategoryEditor, CraftEditor, MetaPropList, MetaPropEditor
};
