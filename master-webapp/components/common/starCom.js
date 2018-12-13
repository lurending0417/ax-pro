
/**
 * 评价弹窗（选星）
 *  <>-----}|------------------------------->
 *
 */
import Stores  from "../../data/stores";
import MessageStore from "../../data/stores/message";

const QuestionStore = Stores.QuestionStore;

export default function (billType, billId) {
    const modalParam = $.modal({
        title: "评价",
        text: `<div class="star_group" id="starGroup">
					<i class="star-tint-icon" data-index="1"></i>
					<i class="star-tint-icon" data-index="2"></i>
					<i class="star-tint-icon" data-index="3"></i>
					<i class="star-tint-icon" data-index="4"></i>
					<i class="star-tint-icon" data-index="5"></i>
				</div>
				<div class="score fs-big" id="scoreWrap">
					5.0
				</div>
				<div class="btn_wrap">
					<button class="button submit_btn_cls fs-normal" id="submitBtn">提交</button>
				</div>`
    })
    const $modal = $(modalParam);
    const $score = $modal.find("#scoreWrap")[0];
    $modal.find("#starGroup").on("click", "i", function () {
        const index = this.dataset.index;
        // 改变分数
        $score.innerHTML = this.dataset.index + ".0";
        // 改变class
        const remindIcon = $(this).parent().children("i");
        const class1 = "star-tint-icon";
        const class2 = "star-grey-icon";
        for (let i = 0; i < remindIcon.length; i++) {
            if (i < index) {
                $(remindIcon[i]).attr("class", class1)
            } else {
                $(remindIcon[i]).attr("class", class2)
            }
        }
    })

    $modal.find("#submitBtn").on("click", function () {
        const params = {
            billType,
            billId,
            score: parseInt($score.innerText)
        };
        MessageStore.postEvaluate({
            params,
            callback: (rs) => {
                $.toast("评价成功");
                // 评分完成, Store 刷新
                switch (billType) {
                  case "QUESTION":
                    QuestionStore.questionEvaluate();
                    break;
                  default:
                    break;
                }
                setTimeout(() => {
                    $.closeModal()
                }, 2000)

                console.log("评分为：", $score.innerText, params)
            }
        }).catch(err => {})
    })
}