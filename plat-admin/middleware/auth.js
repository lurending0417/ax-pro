import {authUtil, baseUtil} from "~/util"

export default function (context) {

    if (!process.browser) {
        return;
    }

    if (!authUtil.isAuthorized(context.route.path)) {
        context.redirect("/");
    }

    context.userAgent = process.server ? context.req.headers['user-agent'] : navigator.userAgent;


}
