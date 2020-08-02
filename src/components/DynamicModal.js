import React from "react";
import {MODAL_COMPONENTS} from "../constants";

// dynamically render a modal component depending on props.modalName
export default function DynamicModal(props) {
	const ModalToRender = MODAL_COMPONENTS[props.modalName];
	return <ModalToRender {...props} />
}