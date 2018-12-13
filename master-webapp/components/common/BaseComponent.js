import reactMix from "../../utils/mixable"
import TimerMix from "react-timer-mixin"

import fetchable from "../../utils/enhance"


@reactMix(TimerMix)
@fetchable
class BaseComponent extends React.PureComponent {
	constructor(props) {
		super(props)
	}
}

export default BaseComponent