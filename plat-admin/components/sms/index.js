import MySmsGatewayAccountEditor from "./editor/SmsGatewayAccountEditor"
import MySmsTemplateEditor from "./editor/SmsTemplateEditor"
import MyRandSms from "./RandSms"
import MySmsGatewayAccount from "./SmsGatewayAccount"
import MySmsGatewayRouter from "./SmsGatewayRouter"
import MySmsGatewayRecord from "./SmsGatewayRecord"
import MySmsTemplate from "./SmsTemplate"
import MyTemplateSms from "./TemplateSms"
import MySmsGatewayRouterEditor from "./editor/SmsGatewayRouterEditor"

const SmsGatewayAccountEditor = {
    install: function (Vue) {
        Vue.component("SmsGatewayAccountEditor", MySmsGatewayAccountEditor);
    }
};
const SmsTemplateEditor = {
    install: function (Vue) {
        Vue.component("SmsTemplateEditor", MySmsTemplateEditor);
    }
};
const SmsGatewayRouterEditor = {
    install: function (Vue) {
        Vue.component("SmsGatewayRouterEditor", MySmsGatewayRouterEditor);
    }
};

const RandSms = {
    install: function (Vue) {
        Vue.component("RandSms", MyRandSms);
    }
};

const SmsGatewayAccount = {
    install: function (Vue) {
        Vue.component("SmsGatewayAccount", MySmsGatewayAccount);
    }
};
const SmsGatewayRouter = {
    install: function (Vue) {
        Vue.component("SmsGatewayRouter", MySmsGatewayRouter);
    }
};
const SmsGatewayRecord = {
    install: function (Vue) {
        Vue.component('SmsGatewayRecord', MySmsGatewayRecord);
    }
};

const SmsTemplate = {
    install: function (Vue) {
        Vue.component("SmsTemplate", MySmsTemplate);
    }
};

const TemplateSms = {
    install: function (Vue) {
        Vue.component("TemplateSms", MyTemplateSms);
    }
};

export {
    RandSms, SmsGatewayAccount, SmsGatewayRouter, SmsGatewayRecord, SmsTemplate, TemplateSms,
    SmsGatewayAccountEditor, SmsGatewayRouterEditor, SmsTemplateEditor
}
