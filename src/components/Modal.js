import React from "react";
import "./Modal.scss";

export default function Modal(props) {
	return (
		<div className="Modal">
			<div className="Modal__overlay" onClick={props.handleCloseClick} />
			<div className="Modal__inner">
				<div className="Modal__close" onClick={props.handleCloseClick}>&times;</div>
				{props.children}
			</div>
		</div>
	);
}