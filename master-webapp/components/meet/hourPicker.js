// 
import BaseIdComp from "../common/idComponent"
import mixable from "../../utils/mixable"
import _map from "lodash/map"

@mixable(BaseIdComp)
class HourPicker extends React.PureComponent {
    constructor() {
        super()
        this.state = {};
    }

    initById() {
        if (this.props.readOnly) {
            return;
        }
        const id = this.getId();

        const cm = $("#" + id)

        cm.picker({
            cols: [{ values: _map(new Array(10), (item, index) => index + 1) }],
            toolbarTemplate: "<header class=\"bar bar-nav\">\
            <button class=\"button button-link pull-right close-picker\">确定</button>\
            <h1 class=\"title\">约见时长</h1>\
            </header>",
            onChange: (p) => {
                this.props.onChange && this.props.onChange({ target: { value: p.value } })
            }
        })
    }

    render() {
        return <input id={this.getId()} {...this.props} />
    }
}

export default HourPicker