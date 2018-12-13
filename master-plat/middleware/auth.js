export default function (context) {

	if (!process.browser) {
		return;
	}

	context.userAgent = process.server ? context.req.headers['user-agent'] : navigator.userAgent;

}
