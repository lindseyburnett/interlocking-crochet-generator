import React from "react";
import Modal from "./Modal";

export default function AboutModal(props) {
	return (
		<Modal handleCloseClick={props.handleCloseClick}>
			<h1>About ICG</h1>
			<p>Interlocking Crochet Generator, by Mooglegirl</p>
			<p>Please don't sell patterns created in this tool. If you post any, credit is highly appreciated!</p>
			<p>Find a bug? Email me at <a href="mailto:crochetgeneratorcontact@gmail.com">crochetgeneratorcontact@gmail.com</a></p>
			<p className="Modal__footer">Made in ReactJS. <a target="_blank" rel="noopener noreferrer" href="https://github.com/Mooglegirl/interlocking-crochet-generator">Source code</a></p>
		</Modal>
	);
}