const fetch = (url, options) => {
	return new Promise((s, f) => {
		const { body, headers, ...others } = options;
		wx.request({
			url: url,
			success: (rs) => {
				s({
					text: () => rs.data
				})
			},
			fail: err => {
				f(err)
			},
			header: headers,
			data: body,
			...others
		})
	})
}

module.exports = fetch