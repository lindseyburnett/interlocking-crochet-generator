import React from "react";
import "./CopyField.scss";
import clipboardIcon from "../images/clipboard.svg";
import checkIcon from "../images/check.svg";

export default function CopyField(props) {
	const [isCopied, setCopied] = React.useState(false);
	const inputRef = React.useRef(null);

	const copyToClipboard = e => {
		inputRef.current.select();
		document.execCommand("copy");
		setCopied(true);
	};

	return (
		<div className="CopyField">
			<input type="text" value={props.value} readOnly />
			{
				document.queryCommandSupported("copy") &&
				<button onClick={copyToClipboard}>
					<img src={isCopied ? checkIcon : clipboardIcon} alt="copy" />
				</button>
			}
		</div>
	);
}