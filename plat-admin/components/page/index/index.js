import MyIndexBanner from "./IndexBanner"
import MyIndexScene from "./IndexScene"
import MyIndexSceneBanner from "./IndexSceneBanner"
import MyIndexSceneContent from "./IndexSceneContent"
import MyIndexSceneStorage from "./IndexSceneStorage"

import MyIndexBannerEditor from "./editor/IndexBannerEditor"
import MyIndexSceneEditor from "./editor/IndexSceneEditor"
import MyIndexSceneBannerEditor from "./editor/IndexSceneBannerEditor"
import MyIndexSceneContentEditor from "./editor/IndexSceneContentEditor"
import MyIndexSceneStorageEditor from "./editor/IndexSceneStorageEditor"

const IndexBannerEditor = {
    install: function (Vue) {
        Vue.component("IndexBannerEditor", MyIndexBannerEditor);
    }
};
const IndexBanner = {
    install: function (Vue) {
        Vue.component("IndexBanner", MyIndexBanner);
    }
};
const IndexScene = {
    install: function (Vue) {
        Vue.component("IndexScene", MyIndexScene);
    }
};
const IndexSceneEditor = {
    install: function (Vue) {
        Vue.component("IndexSceneEditor", MyIndexSceneEditor);
    }
};
const IndexSceneBannerEditor = {
    install: function (Vue) {
        Vue.component("IndexSceneBannerEditor", MyIndexSceneBannerEditor);
    }
};
const IndexSceneContentEditor = {
    install: function (Vue) {
        Vue.component("IndexSceneContentEditor", MyIndexSceneContentEditor);
    }
};
const IndexSceneStorageEditor = {
    install: function (Vue) {
        Vue.component("IndexSceneStorageEditor", MyIndexSceneStorageEditor);
    }
};
const IndexSceneBanner = {
    install: function (Vue) {
        Vue.component("IndexSceneBanner", MyIndexSceneBanner);
    }
};
const IndexSceneContent = {
    install: function (Vue) {
        Vue.component("IndexSceneContent", MyIndexSceneContent);
    }
};
const IndexSceneStorage = {
    install: function (Vue) {
        Vue.component("IndexSceneStorage", MyIndexSceneStorage);
    }
};

export {
    IndexSceneBanner, IndexSceneContent, IndexSceneStorage, IndexBanner, IndexScene,
    IndexBannerEditor, IndexSceneEditor, IndexSceneBannerEditor, IndexSceneContentEditor, IndexSceneStorageEditor
}
