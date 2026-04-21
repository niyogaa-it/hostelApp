import React, { Component } from 'react';
//import Loader from "react-loader-spinner";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Button, FormGroup, ControlLabel } from 'react-bootstrap';
import axios from 'axios';

const validateLogin = Yup.object().shape({
	oldPassword: Yup.string().required('Please enter your old password'),
	//.min(8, "Password must be at least ${min} characters long"),
	newPassword: Yup.string().required('Please enter your new password'),
	//.min(8, "Password must be at least ${min} characters long"),
	confirmPassword: Yup.string()
		.required('Please enter your confirm password')
		.test('match', 'Confirm password do not match', function (confirmPassword) {
			return confirmPassword === this.parent.newPassword;
		}),
});

const initialValues = {
	oldPassword: '',
	newPassword: '',
	confirmPassword: '',
};

class UpdatePassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
		};
	}

	handleSubmitEvent = (values, actions, isSubmitting = true) => {
		/* console.log('aaaaaa');
    return false; */
		//const formData = new FormData();
		axios
			.post('http://10.0.10.222/project/dev/tty_portal/admconsole/mono_service/update_password/')
			.then((res) => {
				//console.log('==='+res.data);
				if (res.data.status == '401') {
					actions.setErrors(res.data.error);
					/* isSubmitting(false);
            this.state = {      
              isSubmitting: false
            }; 
            this.props.isSubmitting = false; */
					//console.log('>>>>'+isSubmitting);
				}
			})
			.catch((err) => {
				//actions.setErrors(err.msg);
				//this.state.oldPassword = err.msg;
			});
	};

	render() {
		const newInitialValues = Object.assign(initialValues, {
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
		});

		return (
			<div className="Login">
				<Formik
					initialValues={newInitialValues}
					validationSchema={validateLogin}
					onSubmit={this.handleSubmitEvent}
				>
					{({ values, errors, touched, isValid, isSubmitting }) => {
						return (
							<Form>
								<FormGroup controlId="oldPassword" bsSize="large">
									<ControlLabel>Old Password</ControlLabel>
									<Field
										name="oldPassword"
										type="password"
										className={`form-control`}
										placeholder="Enter old password"
										autoComplete="off"
									/>
									{errors.oldPassword && touched.oldPassword ? (
										<span className="errorMsg">{errors.oldPassword}</span>
									) : null}
								</FormGroup>
								<FormGroup controlId="newPassword" bsSize="large">
									<ControlLabel>New Password</ControlLabel>
									<Field
										name="newPassword"
										type="password"
										className={`form-control`}
										placeholder="Enter new password"
										autoComplete="off"
									/>
									{errors.newPassword && touched.newPassword ? (
										<span className="errorMsg">{errors.newPassword}</span>
									) : null}
								</FormGroup>
								<FormGroup controlId="confirmPassword" bsSize="large">
									<ControlLabel>Confirm Password</ControlLabel>
									<Field
										name="confirmPassword"
										type="password"
										className={`form-control`}
										placeholder="Enter confirm password"
										autoComplete="off"
									/>
									{errors.confirmPassword && touched.confirmPassword ? (
										<span className="errorMsg">{errors.confirmPassword}</span>
									) : null}
								</FormGroup>
								<Button
									className={`btn btn-default btn-lg`}
									type="submit"
									disabled={isValid ? false : true}
								>
									{isSubmitting ? 'Updating...' : 'Update'}
								</Button>
							</Form>
						);
					}}
				</Formik>
			</div>
		);
	}
}

export default UpdatePassword;
