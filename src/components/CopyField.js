import React from "react";
import "./CopyField.scss";
import clipboardIcon from "../images/clipboard.svg";
import checkIcon from "../images/check.svg";

export default class CopyField extends React.Component {
	constructor(props) {
		super(props);
		this.state = { copied: false };

		this.copyToClipboard = this.copyToClipboard.bind(this);
	}
	
	copyToClipboard() {
		window.navigator.clipboard.writeText(this.props.value);
		this.setState({ copied: true });
	}

	render() {
		return (
			<div className="CopyField">
				<input type="text" value={this.props.value} readOnly />
				<button onClick={this.copyToClipboard}>
					<img src={this.state.copied ? checkIcon : clipboardIcon} alt="copy" />
				</button>
			</div>
		);
	}
}