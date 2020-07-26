import React from "react";
import "./SettingsForm.scss";
import { Formik, Form } from "formik";
import SettingsField from "./SettingsField";

export default function SettingsForm(props) {
	return (
		<div className="SettingsForm">
			<Formik
				initialValues={props.settings}
				validate={values => {
					const errors = {};
					const rows = parseInt(values.rows);
					const cols = parseInt(values.cols);
					const squareSize = parseInt(values.squareSize);

					if(rows < 3) errors.rows = "Must be at least 3";
					else if(rows > 99) errors.rows = "Must be less than 100";
					else if(rows % 2 === 0) errors.rows = "Must be odd";

					if(cols < 3) errors.cols = "Must be at least 3";
					else if(cols > 99) errors.cols = "Must be 99 or less";
					else if(cols % 2 === 0) errors.cols = "Must be odd";

					if(squareSize < 6) errors.squareSize = "Must be at least 6";
					else if(squareSize > 50) errors.squareSize = "Must be 50 or less";

					return errors;
				}}
				onSubmit={props.handleSubmit}
			>
				<Form>
					<div className="SettingsForm__row">
						<SettingsField name="bgColor" label="Background" fieldProps={{ type: "color" }} />
						<SettingsField name="fgColor" label="Foreground" fieldProps={{ type: "color" }} />
					</div>
					<div className="SettingsForm__row">
						<SettingsField name="rows" label="Rows" fieldProps={{
								type: "number",
								min: "3",
								max: "99",
								step: "2"
							}}
						/>
						<SettingsField name="cols" label="Columns" fieldProps={{
								type: "number",
								min: "3",
								max: "99",
								step: "2"
							}}
						/>
						<SettingsField name="squareSize" label="Square Size" fieldProps={{
								type: "number",
								min: "6",
								max: "50"
							}}
						/>
					</div>
					<div className="SettingsForm__row">
						<SettingsField name="showDetailedView" label="Detailed View" fieldProps={{ type: "checkbox" }} />
						<SettingsField name="showGrid" label="Grid" fieldProps={{ type: "checkbox" }} />
					</div>

					<button type="submit">Apply</button>
				</Form>
			</Formik>
		</div>
	);
}