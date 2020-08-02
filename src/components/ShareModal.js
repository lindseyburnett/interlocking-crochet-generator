import React from "react";
import Modal from "./Modal";
import CopyField from "./CopyField";

export default function ShareModal(props) {
	return (
		<Modal className="ShareModal" handleCloseClick={props.handleCloseClick}>
			<p>Copy this link to share your pattern!</p>
			<CopyField value={props.shareLink} />
		</Modal>
	);
}