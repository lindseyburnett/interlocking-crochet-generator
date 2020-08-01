import React from "react";
import { Formik, Form, useFormikContext } from "formik";
import SettingsField from "./SettingsField";
import {SETTINGS_DATA} from "../constants";
import "./SettingsForm.scss";

function ColorSwitchButton(props) {
	const {values, setFieldValue} = useFormikContext();

	return (
		<button type="button" onClick={() => handleColorSwitchClick(values.bgColor, values.fgColor, setFieldValue)}>Switch</button>
	);
}

function handleColorSwitchClick(bg, fg, setFieldValue) {
	setFieldValue("fgColor", bg);
	setFieldValue("bgColor", fg);
}

export default function SettingsForm(props) {
	const settingsRows = SETTINGS_DATA.map((dataRow, i) => (
		<div className="SettingsForm__row" key={i}>
			{Object.keys(dataRow).map(settingKey => {
				const settingData = dataRow[settingKey];
				if(settingData.customComponent && settingData.customComponent === "ColorSwitchButton") {
					return <ColorSwitchButton key={settingKey} />
				} else {
					return (
						<SettingsField 
							name={settingKey} 
							key={settingKey} 
							label={settingData.label} 
							fieldProps={settingData.fieldProps} 
						/>
					)
				}
			})}
		</div>
	));

	return (
		<div className="SettingsForm">
			<Formik
				initialValues={props.settings}
				validate={values => {
					const errors = {};
					Object.keys(values).forEach(settingKey => {
						SETTINGS_DATA.forEach(dataRow => {
							if(dataRow[settingKey] && dataRow[settingKey].validation) {
								dataRow[settingKey].validation.forEach(validationFunc => {
									const error = validationFunc(values[settingKey]);
									if(error) errors[settingKey] = error;
								});
							}
						});
					});

					return errors;
				}}
				onSubmit={props.handleSubmit}
			>
				<Form>
					{settingsRows}
					<button type="submit">Apply</button>
				</Form>
			</Formik>
		</div>
	);
}