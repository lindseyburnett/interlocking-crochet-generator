import React from "react";
import "./DoubleCollapseToggle.scss";

import collapseLeftIcon from "../images/collapse-left.svg";
import collapseRightIcon from "../images/collapse-right.svg";
import expandLeftIcon from "../images/expand-left.png";
import expandRightIcon from "../images/expand-right.png";

export default function DoubleCollapseToggle(props) {
	return (
		<div className="DoubleCollapseToggle">
		  <div 
		  	className={`DoubleCollapseToggle__toggle  DoubleCollapseToggle__toggle--left  ${props.isLeftCollapsed ? "DoubleCollapseToggle__toggle--collapsed" : ""}`}
		  	onClick={props.handleLeftBtnClick}
		  >
		  	<img 
		  		src={props.isLeftCollapsed ? expandLeftIcon : collapseLeftIcon} 
		  		alt="collapse left" 
		  		title={`${props.isLeftCollapsed ? "Expand" : "Collapse"} Grid ([)`}
		  	/>
		  </div>
		  <div 
		  	className={`DoubleCollapseToggle__toggle  DoubleCollapseToggle__toggle--right  ${props.isRightCollapsed ? "DoubleCollapseToggle__toggle--collapsed" : ""}`}
		  	onClick={props.handleRightBtnClick}
		  >
		  	<img 
		  		src={props.isRightCollapsed ? expandRightIcon : collapseRightIcon} 
		  		alt="collapse right" 
		  		title={`${props.isRightCollapsed ? "Expand" : "Collapse"} Pattern (])`}
		  	/>
		  </div>
		</div>
	);
}