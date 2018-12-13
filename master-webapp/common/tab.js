export const data = [
    {
        title: "首页",
        href: "/index/home",
        navId: "home",
        cls: "tab-icon-home"
    }, {
        title: "大师",
        href: "/index/master",
        cls: "tab-icon-master",
        navId: "master"
    }, {
        title: "学习",
        href: "/index/learn",
        cls: "tab-icon-study",
        navId: "learn"
    }, {
        title: "消息",
        href: "/index/message",
        cls: "tab-icon-msg",
        navId: "msg",
        badge: 3
    }, {
        title: "我的",
        href: "/index/my",
        cls: "tab-icon-my",
        navId: "my"
    }
]

export const showFooter = href => {
    if (!href) {
        return true;
    }
    const index = data.findIndex(item => item.href == href);
    // console.log("footer" + href + "--" + index);
    return index != -1
}
