import React from "react";
import Modal from "./Modal";

export default function ShareModal(props) {
	return (
		<Modal handleCloseClick={props.handleCloseClick}>
			<p>Copy this link to share your pattern!</p>
			<input type="text" value={props.shareLink} readOnly />
		</Modal>
	);
}