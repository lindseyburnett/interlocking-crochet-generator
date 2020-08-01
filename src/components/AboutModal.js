import React from "react";
import "./AboutModal.scss";

export default function AboutModal(props) {
	return (
		<div className="AboutModal">
			<div className="AboutModal__overlay" onClick={props.handleCloseClick} />
			<div className="AboutModal__inner">
				<div className="AboutModal__close" onClick={props.handleCloseClick}>&times;</div>
				<h1>About ICG</h1>
				<p>Interlocking Crochet Generator, by Mooglegirl</p>
				<p>Please don't sell patterns created in this tool. If you post any, credit is highly appreciated!</p>
				<p>Find a bug? Email me at <a href="mailto:crochetgeneratorcontact@gmail.com">crochetgeneratorcontact@gmail.com</a></p>
				<p className="AboutModal__small">Made in ReactJS. <a target="_blank" rel="noopener noreferrer" href="https://github.com/Mooglegirl/interlocking-crochet-generator">Source code</a></p>
			</div>
		</div>
	);
}