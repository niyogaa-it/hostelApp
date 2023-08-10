import React, { Component } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Button, FormGroup, ControlLabel } from 'react-bootstrap';
import axios from 'axios';
import swal from 'sweetalert';
import Layout from '../layout/Layout';

const validateLogin = Yup.object().shape({
	firstName: Yup.string()
		.required('Please enter first name')
		.min(2, 'First name must be at least ${min} characters long'),
	lastName: Yup.string()
		.required('Please enter last name')
		.min(2, 'Last name must be at least ${min} characters long'),
	group: Yup.string().required('Please select admin group'),
	admStatus: Yup.string()
		.required('Please select status')
		.matches(/^[0|1]$/, 'Invalid status selected'),
	newPassword: Yup.lazy((value) =>
		!value
			? Yup.string()
			: Yup.string()
					.min(8, 'Password must be at least 8 characters')
					.required('Password is required')
	),
	confirmPassword: Yup.string().test(
		'match',
		'Confirm password do not match',
		function (confirmPassword) {
			return confirmPassword === this.parent.newPassword;
		}
	),
});

const initialValues = {
	firstName: '',
	lastName: '',
	group: '',
	admStatus: '',
};

class MyAccount extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			adminDetails: [],
			groupList: [],
			admStatus: [
				{ id: '0', name: 'Inactive' },
				{ id: '1', name: 'Active' },
			],
		};
	}

	componentDidMount() {
		this.getAdmin();
		this.groupList();
	}

	getAdmin() {
		const id = 1;
		axios
			.get(`http://10.0.10.222/project/dev/tty_portal/admconsole/mono_service/get_admin/id/${id}`)
			.then((res) => {
				this.setState({
					adminDetails: res && res.data && res.data.admin ? res.data.admin : null,
				});
				console.log(this.state.adminDetails);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	groupList() {
		axios
			.get('http://10.0.10.222/project/dev/tty_portal/admconsole/mono_service/get_group_list')
			.then((res) => {
				this.setState({
					groupList: res && res.data && res.data.group ? res.data.group : null,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleSubmitEvent = (values, actions, isSubmitting = true) => {
		const formData = new FormData();
		var url = 'http://10.0.10.222/project/dev/tty_portal/admconsole/mono_service/add_update_admin/';
		const id = '1';
		formData.append('id', id);
		formData.append('Stat', 'True');

		for (const key in values) {
			formData.append(key, values[key]);
		}

		axios
			.post(url, formData)
			.then((res) => {
				swal({
					closeOnClickOutside: false,
					title: 'Success',
					text: res.data.message,
					icon: 'success',
				}).then(() => {
					window.location.reload();
				});
			})
			.catch((err) => {});
	};

	render() {
		const { adminDetails } = this.state;

		const newInitialValues = Object.assign(initialValues, {
			firstName: adminDetails.first_name ? adminDetails.first_name : '',
			lastName: adminDetails.last_name ? adminDetails.last_name : '',
			group: adminDetails.group_id ? adminDetails.group_id : '',
			admStatus: adminDetails.status ? adminDetails.status : '',
		});

		return (
			<Layout>
				<div className="Login">
					<Formik
						initialValues={newInitialValues}
						validationSchema={validateLogin}
						onSubmit={this.handleSubmitEvent}
					>
						{({ values, errors, touched, isValid, isSubmitting }) => {
							return (
								<Form>
									<FormGroup controlId="firstName" bsSize="large">
										<label>
											First Name<span className="impField">*</span>
										</label>
										<Field
											name="firstName"
											type="text"
											className={`form-control`}
											placeholder="Enter first name"
											autoComplete="off"
										/>
										{errors.firstName && touched.firstName ? (
											<span className="errorMsg">{errors.firstName}</span>
										) : null}
									</FormGroup>
									<FormGroup controlId="lastName" bsSize="large">
										<label>
											Last Name<span className="impField">*</span>
										</label>
										<Field
											name="lastName"
											type="text"
											className={`form-control`}
											placeholder="Enter last name"
											autoComplete="off"
										/>
										{errors.lastName && touched.lastName ? (
											<span className="errorMsg">{errors.lastName}</span>
										) : null}
									</FormGroup>
									<FormGroup controlId="oldPassword" bsSize="large">
										<ControlLabel>Group</ControlLabel>
										<Field
											name="group"
											component="select"
											className={`selectArowGray form-control`}
											autoComplete="off"
											value={values.group}
										>
											<option key="-1" value="">
												Select
											</option>
											{this.state.groupList.map((group, i) => (
												<option key={i} value={group.group_id}>
													{group.group_name}
												</option>
											))}
										</Field>
										{errors.group && touched.group ? (
											<span className="errorMsg">{errors.group}</span>
										) : null}
									</FormGroup>
									<FormGroup controlId="status" bsSize="large">
										<label>
											Status<span className="impField">*</span>
										</label>
										<Field
											name="admStatus"
											component="select"
											className={`selectArowGray form-control`}
											autoComplete="off"
											value={values.admStatus}
										>
											<option key="-1" value="">
												Select
											</option>
											{this.state.admStatus.map((status, i) => (
												<option key={i} value={status.id}>
													{status.name}
												</option>
											))}
										</Field>
										{errors.admStatus && touched.admStatus ? (
											<span className="errorMsg">{errors.admStatus}</span>
										) : null}
									</FormGroup>
									<FormGroup controlId="newPassword" bsSize="large">
										<label>New Password</label>
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
										<label>Confirm Password</label>
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
			</Layout>
		);
	}
}

export default MyAccount;
