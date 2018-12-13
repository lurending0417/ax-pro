/**
 * 用户、大师头像组件
 */

import PropTypes  from "prop-types";

export default class Master_Avatar extends React.Component {
	render() {
		return (
			<div className="ma_content">
				<div className="ma_avatar">
					{(() => {
						if (this.props.hasStar) {
							return <div className="master-confirm-icon ma_master_confirm"/>
						}
						return null;
					})()}
				</div>
				{(() => {
					if (this.props.hasStar) {
						return (
							<div className="ma_right">
								<div className="ma_title fs-big">大师</div>
								<div className="ma_stars">
									{(() => {
										var content = [];
										for (var i = 0; i < this.props.stars; i++) {
											content.push(<div className="ma_star master-star-icon" key={`start-${i}`}/>);
										}
										return content;
									})()}
								</div>
							</div>
						);
					}
					return (
						<div className="ma_right">
							<div className="ma_title_blue fs-big">用户1</div>
						</div>
					);
				})()}
			</div>
		);
	}
}

Master_Avatar.propTypes = {
	stars: PropTypes.number,
	name: PropTypes.string,
	avatar: PropTypes.string,
	hasStar: PropTypes.bool
}
Master_Avatar.defaultProps = {
	stars: 5,
	hasStar: true
}