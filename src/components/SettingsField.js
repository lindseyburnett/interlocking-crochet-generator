import React from "react";
import "./SettingsField.scss";
import { Field, ErrorMessage } from "formik";

export default function SettingsField(props) {
	return (
		<label className="SettingsField">
			{props.label || props.name.charAt(0).toUpperCase() + props.name.slice(1)}
			<Field {...props.fieldProps} name={props.name} />
			<ErrorMessage name={props.name} component="div" className="SettingsField__error" />
		</label>
	);
}