import React from "react";
import {MODAL_COMPONENTS} from "../constants";

export default function ActiveModal(props) {
	const ModalToRender = MODAL_COMPONENTS[props.modalName];
	return <ModalToRender {...props} />
}