import moment from "moment"
import { isIos } from "../utils/platform";


(0, () => {
	setTimeout(() => {
		if (!process.browser) return;
		$.modal.prototype.defaults.modalButtonOk = "确定"
		$.modal.prototype.defaults.modalButtonCancel = "取消"

		const width = document.body.clientWidth * window.devicePixelRatio;

		// let fs = null;
		// // if (width <= 750) 
		// {
		// 	// fs = "22.08px"
		// 	// if (width <= 640) {
		// 	// 	fs = "20px"
		// 	// }
		// 	fs = document.body.clientWidth / 18.75;
		// 	$("html").css("font-size", fs + "px !important")
		// }


		//router

		// 修改 避免ios 签名 遇到微信出现签名错误
		$.router.pushState = function (url, id) {
			if (url.substr(0, 1) === "#") {
				url = "";
			}
			history.pushState({ url: url, id: id }, "", url);
		}

		$.router.backTo = function (backId) {
			const me = $.router;
			if (!backId) {
				return me.back();
			}

			var currentPage = me.getCurrentPage();
			var newPage = $(backId);
			if (!newPage[0]) return;
			me.pushForward({ url: location.href, pageid: "#" + currentPage[0].id, id: me.getCurrentStateID(), animation: null });
			me.setCurrentStateID(backId);
			me.animatePages(newPage, currentPage, true, null);
		}

		// datetimepicker
		$.fn.datetimePicker1 = function (params) {
			return this.each(function () {
				if (!this) return;



				var today = params.defaultValue ? new Date(params.defaultValue) : new Date();
				var minDay = new Date(params.minValue || "2018/01/01");
				var maxDay = new Date(Date.now() + 365 * 24 * 3600 * 1000)
				const minYear = minDay.getFullYear();
				const maxYear = maxDay.getFullYear();
				var minDayStr = moment(minDay).format("YYYY MM DD HH mm");
				var maxDayStr = moment(maxDay).format("YYYY MM DD HH mm");

				var getDays = function (max) {
					var days = [];
					for (var i = 1; i <= (max || 31); i++) {
						days.push(i < 10 ? "0" + i : i);
					}
					return days;
				};

				var getDaysByMonthAndYear = function (month, year) {
					var int_d = new Date(year, parseInt(month) + 1 - 1, 1);
					var d = new Date(int_d - 1);
					return getDays(d.getDate());
				};

				var formatNumber = function (n) {
					return n < 10 ? "0" + n : "" + n;
				};

				var initMonthes = ("01 02 03 04 05 06 07 08 09 10 11 12").split(" ");

				var initYears = (function () {
					var arr = [];
					for (var i = minYear; i <= maxYear; i++) { arr.push(i); }
					return arr;
				})();

				const getColIndex = index => {
					if (index == 3)
						return 4;
					if (index == 4)
						return 6;
					return index;
				}


				var defaults = {
					rotateEffect: false,  //为了性能
					value: [formatNumber(today.getFullYear()), formatNumber(today.getMonth() + 1), formatNumber(today.getDate()), formatNumber(today.getHours()), formatNumber(today.getMinutes())],
					onChange: function (picker, values, displayValues) {
						console.log("change1--->")
						var days = getDaysByMonthAndYear(picker.cols[1].value, picker.cols[0].value);
						var currentValue = picker.cols[2].value;
						if (currentValue > days.length) currentValue = days.length;
						var cv = values.join(" ")
						if (cv > maxDayStr) {
							maxDayStr.split(" ").forEach((v, index) => {
								picker.cols[getColIndex(index)].setValue(v);
							})
							return;
						}
						if (cv < minDayStr) {
							minDayStr.split(" ").forEach((v, index) => {
								picker.cols[getColIndex(index)].setValue(v);
							})
							return;
						}
						// if()

						picker.cols[2].setValue(currentValue);
					},

					formatValue: function (p, values, displayValues) {
						return displayValues[0] + "-" + values[1] + "-" + values[2] + " " + values[3] + ":" + values[4];
					},

					cols: [
						// Years
						{
							values: initYears
						},
						// Months
						{
							values: initMonthes
						},
						// Days
						{
							values: getDays()
						},

						// Space divider
						{
							divider: true,
							content: "  "
						},
						// Hours
						{
							values: (function () {
								var arr = [];
								for (var i = 0; i <= 23; i++) { arr.push(formatNumber(i)); }
								return arr;
							})()
						},
						// Divider
						{
							divider: true,
							content: ":"
						},
						// Minutes
						{
							values: (function () {
								var arr = [];
								for (var i = 0; i <= 59; i++) { arr.push(formatNumber(i)); }
								return arr;
							})()
						}
					]
				};

				params = params || {};
				var inputValue = $(this).val();
				if (params.value === undefined && inputValue !== "") {
					params.value = [].concat(inputValue.split(" ")[0].split(/-|\//g), inputValue.split(" ")[1].split(":"));
				}

				var p = $.extend(defaults, params);
				$(this).picker(p);

				// 添加修改属性的
				$(this).data("datetimePicker_update", function (newConfig) {
					// 修改最大 最小
					if (newConfig.maxValue) {
						maxDayStr = newConfig.maxValue.replace(/-|\/|:/g, " ")
					}
					if (newConfig.minValue) {
						minDayStr = newConfig.minValue.replace(/-|\/|:/g, " ")
					}
				})
			});
		};

		// ios 弹性 滚动
		if (isIos()) {
			$("body").delegate(".page .content>div", "touchstart", (evt) => {
				// 修复微信的黑色弹性滚动与ios冲突问题
				var scrollEle = evt.currentTarget;
				const scrollTop = scrollEle.scrollTop;
				const scrollHeight = scrollEle.scrollHeight;
				const height = scrollEle.offsetHeight;
				let scrollTopTo;

				// 顶部
				scrollTopTo = Math.max(scrollTop, 1);

				// 底部
				if (scrollTopTo === scrollHeight - height) {
					scrollTopTo--;
				}

				if (scrollTop != scrollTopTo) {
					scrollEle.scrollTop = scrollTopTo;
				}
			});
		}




		//scrollTo
		$.fn.getScrollParent = function () {
			const me = $(this);
			const isParentScroll = function (el) {
				if (!el)
					return null;
				if (el.scrollTop()) {
					return el
				}
				if (el.scrollHeight() > el.height())
					return el;
				return isParentScroll(el.parent())
			}

			return isParentScroll(me.parent())
		}
		$.fn.scrollTo = function (options) {
			var defaults = {
				rand: 0,
				toT: 0,    //滚动目标位置
				durTime: 250,  //过渡动画时间
				delay: 30,     //定时器时间
				callback: null   //回调函数
			};

			if (options.toT && typeof options.toT != "number") {
				const el = $(options.toT);
				const scrollParent = options.parent || $("body .page-current>.page-main>.page-body>.content>div");
				if (!scrollParent || !scrollParent[0]) {
					return;
				}

				const r1 = el[0].getBoundingClientRect();
				const r2 = scrollParent[0].getBoundingClientRect();
				// 物理相对高度+已经滚动的+ 随机
				const rh = r1.top - r2.top + scrollParent[0].scrollTop - options.rand;
				options.toT = rh;

				console.log("toT->" + options.toT)

				scrollParent.scrollTo(options);
				return;
			}

			var opts = $.extend(defaults, options),
				timer = null,
				_this = this,
				curTop = _this.scrollTop(),//滚动条当前的位置
				subTop = opts.toT - curTop,    //滚动条目标位置和当前位置的差值
				index = 0,
				dur = Math.round(opts.durTime / opts.delay),
				smoothScroll = function (t) {
					index++;
					var per = Math.round(subTop / dur);
					if (index >= dur) {
						_this.scrollTop(t);
						window.clearInterval(timer);
						if (opts.callback && typeof opts.callback == "function") {
							opts.callback();
						}
						return;
					} else {
						_this.scrollTop(curTop + index * per);
					}
				};
			timer = window.setInterval(function () {
				smoothScroll(opts.toT);
			}, opts.delay);
			return _this;
		};
		$("body").delegate(".backToTop", "click", function () {
			$("body .page-current>.page-main>.page-body>.content>div").scrollTo({ toT: 0, durTime: 250 });
		})

		$.scrollTop = () => {
			$("body .page-current>.page-main>.page-body>.content>div").scrollTo({ toT: 0, durTime: 250 });
		}

	}, 0)
})()

