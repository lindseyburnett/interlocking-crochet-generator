import React from "react";
import "./DrawingGridRowNums.scss";

export default function DrawingGridRowNums(props) {
	const numSpans = props.nums.map(num => <span key={num}>{num}</span>);

	return (
		<div className={`DrawingGridRowNums  ${props.truncated ? "DrawingGridRowNums--truncated" : ""}`}>
			<div className="DrawingGridRowNums__col  DrawingGridRowNums__col--left">{numSpans}</div>
			<div className="DrawingGridRowNums__col">{numSpans}</div>
		</div>
	);
}