import React from "react";
import Modal from "./Modal";

export default function AboutModal(props) {
	return (
		<Modal handleCloseClick={props.handleCloseClick}>
			<h1>About ICG</h1>
			<p>Interlocking Crochet Generator, by Mooglegirl</p>
			<p>Patterns are written assuming you know the basics of interlocking crochet, also called mosaic crochet, interlocking filet crochet, and intermeshing crochet.</p>
			<p>
				The starting row for the foreground color uses a long chain method, instead of two separate meshes, for maximum flexibility for the bottom rows.
				If you like, you can start with two meshes instead, although the finished product might not look exactly the same as the grid you draw.
			</p>
			<p><strong>Please don't sell patterns created in this tool.</strong> If you post any, credit is highly appreciated!</p>
			<p>Find a bug? Email me at <a href="mailto:crochetgeneratorcontact@gmail.com">crochetgeneratorcontact@gmail.com</a></p>
			<p className="Modal__footer">Made in ReactJS. <a target="_blank" rel="noopener noreferrer" href="https://github.com/Mooglegirl/interlocking-crochet-generator">Source code</a></p>
		</Modal>
	);
}