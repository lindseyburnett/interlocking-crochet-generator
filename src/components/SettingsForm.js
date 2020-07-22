import React from "react";
import "./SettingsForm.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";

function SettingsField(props) {
	return (
		<label className="SettingsForm__field">
			{props.name.charAt(0).toUpperCase() + props.name.slice(1)}
			<Field {...props.fieldProps} name={props.name} />
			<ErrorMessage name={props.name} component="div" className="SettingsForm__error" />
		</label>
	);
}

export default function SettingsForm(props) {
	return (
		<div className="SettingsForm">
			<Formik
				initialValues={{
					rows: props.initRows,
					cols: props.initCols
				}}
				validate={values => {
					const errors = {};
					const rows = parseInt(values.rows);
					const cols = parseInt(values.cols);

					if(rows < 3) errors.rows = "Must be at least 3";
					else if(rows > 99) errors.rows = "Must be less than 100";
					else if(rows % 2 === 0) errors.rows = "Must be odd";

					if(cols < 3) errors.cols = "Must be at least 3";
					else if(cols > 99) errors.cols = "Must be less than 100";
					else if(cols % 2 === 0) errors.cols = "Must be odd";

					return errors;
				}}
				onSubmit={props.handleSubmit}
			>
				<Form>
					<div className="SettingsForm__row">
						<SettingsField name="rows" fieldProps={{
								type: "number",
								min: "3",
								max: "99",
								step: "2"
							}}
						/>
						<SettingsField name="cols" fieldProps={{
								type: "number",
								min: "3",
								max: "99",
								step: "2"
							}}
						/>
					</div>
					<button type="submit">Apply</button>
				</Form>
			</Formik>
		</div>
	);
}