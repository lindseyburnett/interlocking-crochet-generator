import React from "react";
import "./SettingsForm.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";

// TODO: make number field go up by 2 at a time

// TODO: rerenders if settings tab is open every time you try to draw, which spikes the latency
// can we fix that? maybe force the tab back to Pattern if you draw, or prevent the form from rerendering?

// might also be a good time to start pushing to git?
// figure out how to access the repo create-react-app builds for you

export default function SettingsForm(props) {
	return (
		<div className="SettingsForm">
			<Formik
				initialValues={{
					rows: 25
				}}
				validate={values => {
					const errors = {};
					const rows = parseInt(values.rows);

					if(rows < 3) errors.rows = "Must be at least 3";
					else if(rows > 99) errors.rows = "Must be less than 100";
					else if(rows % 2 === 0) errors.rows = "Must be odd";

					return errors;
				}}
				onSubmit={props.handleSubmit}
			>
				<Form>
					<Field type="number" name="rows" min="3" max="99" step="2" />
					<ErrorMessage name="rows" component="div" />
					<button type="submit">Apply</button>
				</Form>
			</Formik>
		</div>
	);
}