import React, { Component } from 'react';
import Layout from '../layout/Layout';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
//import Loader from "react-loader-spinner";
import { Row, Col, ButtonToolbar, Button, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../../../shared/admin-axios';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import swal from 'sweetalert';
//import DashboardSearch from "./DashboardSearch";
import whitelogo from '../../../assets/images/drreddylogo_white.png';
import { showErrorMessage } from '../../../shared/handle_error';
import Pagination from 'react-js-pagination';
import { htmlDecode, inArray } from '../../../shared/helper';
import { getSuperAdmin, getAdminGroup } from '../../../shared/helper';

/*For Tooltip*/
function LinkWithTooltip({ id, children, href, tooltip, clicked }) {
	return (
		<OverlayTrigger
			overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
			placement="left"
			delayShow={300}
			delayHide={150}
			trigger={['hover']}
		>
			<Link to={href} onClick={clicked}>
				{children}
			</Link>
		</OverlayTrigger>
	);
}
/*For Tooltip*/

const actionFormatter = (refObj) => (cell, row) => {
	if (row.super_admin === 1) {
		return null;
	} else {
		return (
			<div className="actionStyle">
				<LinkWithTooltip
					tooltip="Click to Edit"
					href="#"
					clicked={(e) => refObj.modalShowHandler(e, cell)}
					id="tooltip-1"
				>
					<i className="far fa-edit" />
				</LinkWithTooltip>

				<LinkWithTooltip
					tooltip="Click to Delete"
					href="#"
					clicked={(e) => refObj.confirmDelete(e, cell)}
					id="tooltip-1"
				>
					<i className="far fa-trash-alt" />
				</LinkWithTooltip>
			</div>
		);
	}
};

const initialValues = {
	first_name: '',
	last_name: '',
	username: '',
	email: '',
	group_id: '',
	password: '',
	is_admin: '',
};

const initialGroupValues = {
	group_name: '',
};

const __htmlDecode = (refObj) => (cell) => {
	return htmlDecode(cell);
};

const admGrp = (refObj) => (cell, row) => {
	if (row.super_admin === 1) {
		return 'Super Admin';
	} else {
		//return cell;
		return (
			<LinkWithTooltip
				tooltip="Click to Edit"
				href="#"
				id="tooltip-1"
				clicked={(e) => refObj.checkHandler(e, row.group_id)}
			>
				{cell}
			</LinkWithTooltip>
		);
	}
};

const managerDetails = (refObj) => (cell, row) => {
	if (row.manager_first_name != null && row.manager_last_name != null) {
		return `${row.manager_first_name} ${row.manager_last_name}`;
	} else {
		return '-';
	}
};

const admStatus = () => (cell) => {
	return cell === 1 ? 'Active' : 'Inactive';
};

const loginDate = (refObj) => (cell) => {
	if (cell === null) {
		return '-';
	} else {
		return cell;
	}
};

class AdminList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			admins: [],
			adminDetails: [],
			groupList: [],
			managerList: [],
			roleList: [],
			adminflagId: 0,
			showModal: false,

			activePage: 1,
			totalCount: 0,
			itemPerPage: 20,
			showModalLoader: false,
			selectStatus: [
				{ id: '0', name: 'Inactive' },
				{ id: '1', name: 'Active' },
			],
			showGroupModal: false,
			search_first_name: '',
			search_last_name: '',
			search_email: '',
			search_status: '',
			search_group: '',
		};
	}

	checkHandler = (event, id) => {
		event.preventDefault();
		API.get(`/api/adm_group/sections/${id}`)
			.then((res) => {
				this.setState({
					sectionList: res.data.data.access_permission,
					groupName: res.data.data.group_name,
					groupFlagId: id,
					showGroupModal: true,
				});
			})
			.catch((err) => {
				showErrorMessage(err, this.props);
			});
	};

	modalCloseGroupHandler = () => {
		this.setState({ showGroupModal: false });
	};

	componentDidMount() {
		const superAdmin = getSuperAdmin(localStorage.admin_token);
		if (superAdmin === 1) {
			this.getAdminList();
			this.groupList();
		} else {
			this.props.history.push('/admin/dashboard');
		}
	}

	handlePageChange = (pageNumber) => {
		this.setState({ activePage: pageNumber });
		this.getAdminList(pageNumber > 0 ? pageNumber : 1);
	};

	getAdminList(page = 1) {
		let first_name = this.state.search_first_name;
		let last_name = this.state.search_last_name;
		let email = this.state.search_email;
		let group = this.state.search_group;
		let status = this.state.search_status;

		API.get(
			`/api/adm?page=${page}&first_name=${encodeURIComponent(
				first_name
			)}&last_name=${encodeURIComponent(last_name)}&email=${encodeURIComponent(
				email
			)}&group=${encodeURIComponent(group)}&status=${encodeURIComponent(status)}`
		)
			.then((res) => {
				console.log(res.data.data);
				this.setState({
					admins: res.data.data,
					count_user: res.data.count_user,
					isLoading: false,
				});
			})
			.catch((err) => {
				this.setState({
					isLoading: false,
				});
				showErrorMessage(err, this.props);
			});
	}

	getIndividualAdmin(id) {
		API.get(`/api/adm/details/${id}`)
			.then((res) => {
				this.setState({
					adminDetails: res.data.data,
					showModal: true,
				});
			})
			.catch((err) => {
				showErrorMessage(err, this.props);
			});
	}

	groupList() {
		API.get('/api/adm/groups')
			.then((res) => {
				this.setState({
					groupList: res.data.data,
					isLoading: false,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	managerList(id = 0) {
		API.get(`/api/adm/admin_users/${id}`)
			.then((res) => {
				this.setState({
					managerList: res.data.data,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	modalCloseHandler = () => {
		this.setState({ adminflagId: 0 });
		this.setState({ showModal: false });
	};

	modalShowHandler = (event, id) => {
		this.groupList();
		if (id) {
			this.managerList(id);
			event.preventDefault();
			this.setState({ adminflagId: id });
			this.getIndividualAdmin(id);
		} else {
			this.managerList();
			this.setState({ adminDetails: [] });
			this.setState({ showModal: true });
		}
	};

	handleSubmitEvent = (values, actions) => {
		if (this.state.adminflagId) {
			const post_data = {
				first_name: values.first_name,
				last_name: values.last_name,
				username: values.username,
				email: values.email,
				group_id: values.group_id,
				status: values.status,
				manager_id: values.manager_id,
			};
			this.setState({ showModalLoader: true });
			const id = this.state.adminflagId;
			API.put(`/api/adm/update/${id}`, post_data)
				.then((res) => {
					this.modalCloseHandler();
					swal({
						closeOnClickOutside: false,
						title: 'Success',
						text: 'Record updated successfully.',
						icon: 'success',
					}).then(() => {
						this.setState({ showModalLoader: false });
						this.getAdminList(this.state.activePage);
					});
				})
				.catch((err) => {
					this.setState({ showModalLoader: false });
					if (err.data.status === 3) {
						this.setState({
							showModal: false,
						});
						showErrorMessage(err, this.props);
					} else {
						actions.setErrors(err.data.errors);
						actions.setSubmitting(false);
					}
				});
		} else {
			const post_data = {
				first_name: values.first_name,
				last_name: values.last_name,
				username: values.username,
				email: values.email,
				group_id: values.group_id,
				password: values.password,
				status: values.status,
				manager_id: values.manager_id,
			};
			this.setState({ showModalLoader: true });
			API.post('/api/adm', post_data)
				.then((res) => {
					this.modalCloseHandler();
					swal({
						closeOnClickOutside: false,
						title: 'Success',
						text: 'Record added successfully.',
						icon: 'success',
					}).then(() => {
						this.setState({ activePage: 1, showModalLoader: false });
						this.getAdminList(this.state.activePage);
					});
				})
				.catch((err) => {
					this.setState({ showModalLoader: false });
					if (err.data.status === 3) {
						this.setState({
							showModal: false,
						});
						showErrorMessage(err, this.props);
					} else {
						actions.setErrors(err.data.errors);
						actions.setSubmitting(false);
					}
				});
		}
	};

	confirmDelete = (event, id) => {
		event.preventDefault();
		swal({
			closeOnClickOutside: false,
			title: 'Are you sure?',
			text: 'Once deleted, you will not be able to recover this!',
			icon: 'warning',
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				this.deleteAdmin(id);
			}
		});
	};

	deleteAdmin = (id) => {
		API.delete(`/api/adm/${id}`)
			.then((res) => {
				swal({
					closeOnClickOutside: false,
					title: 'Success',
					text: 'Record deleted successfully.',
					icon: 'success',
				}).then(() => {
					this.setState({ activePage: 1 });
					this.getAdminList(this.state.activePage);
				});
			})
			.catch((err) => {
				if (err.data.status === 3) {
					this.setState({ closeModal: true });
					showErrorMessage(err, this.props);
				}
			});
	};

	renderShowsTotal = (start, to, total) => {
		return (
			<span className="pageShow">
				Showing {start} to {to}, of {total} records
			</span>
		);
	};

	getHtml = () => {
		let html = [];

		for (let index = 0; index < this.state.sectionList.length; index++) {
			let checkbox = [];
			const element = this.state.sectionList[index];
			let checkbox_arr = element.access_param.split(',');

			for (let j = 0; j < checkbox_arr.length; j++) {
				const elementNew = checkbox_arr[j];
				let indexOF = element.checkBoxes.findIndex((person) => {
					return person.key == elementNew;
				});
				checkbox.push(
					<div className="form-group checText" key={`${j}${index}`}>
						<input
							type="checkbox"
							name="view_region"
							value="1"
							checked={element.checkBoxes[indexOF].value}
							onChange={(e) => {
								this.toggleChange(e, elementNew, index);
							}}
						/>
						<label>
							{elementNew === 'V' && element.view_ac_name}
							{elementNew === 'A' && element.add_ac_name}
							{elementNew === 'E' && element.edit_ac_name}
							{elementNew === 'D' && element.delete_ac_name}
						</label>
					</div>
				);
			}

			html.push(
				<Row key={index}>
					<Col xs={12} sm={12} md={12}>
						<div className="form-group listBox">
							<label className="listHead">
								{element.section_desc}
								<span className="impField">*</span>
							</label>
							{checkbox}
						</div>
					</Col>
				</Row>
			);
		}
		//console.log('section_list',this.state.sectionList);
		return html;
	};

	toggleChange = (event, value, index) => {
		let prevState = this.state.sectionList;

		let indexOF = prevState[index].checkBoxes.findIndex((person) => {
			return person.key == value;
		});

		prevState[index].checkBoxes[indexOF].value = event.target.checked;

		//AUTO CHECK VIEW

		let indexOFView = prevState[index].checkBoxes.findIndex((person) => {
			return person.key == 'V';
		});
		let indexOFAdd = prevState[index].checkBoxes.findIndex((person) => {
			return person.key == 'A';
		});
		let indexOFEdit = prevState[index].checkBoxes.findIndex((person) => {
			return person.key == 'E';
		});
		let indexOFDelete = prevState[index].checkBoxes.findIndex((person) => {
			return person.key == 'D';
		});

		if (inArray(value, ['A', 'E', 'D'])) {
			if (
				prevState[index].checkBoxes[indexOFAdd].value === true ||
				prevState[index].checkBoxes[indexOFEdit].value === true ||
				prevState[index].checkBoxes[indexOFDelete].value === true
			) {
				prevState[index].checkBoxes[indexOFView].value = true;
			}
		}
		if (value == 'V') {
			if (prevState[index].checkBoxes[indexOFView].value === false) {
				prevState[index].checkBoxes[indexOFAdd].value = false;
				prevState[index].checkBoxes[indexOFEdit].value = false;
				prevState[index].checkBoxes[indexOFDelete].value = false;
			}
		}

		this.setState({ sectionList: prevState });
	};

	handleSubmitGroupEvent = (values, actions) => {
		const post_data = {
			group_name: values.group_name,
			access_permission: JSON.stringify(this.state.sectionList),
		};

		this.setState({ showModalLoader: true });
		const id = this.state.groupFlagId;
		API.put(`/api/adm_group/${id}`, post_data)
			.then((res) => {
				this.modalCloseHandler();
				swal({
					closeOnClickOutside: false,
					title: 'Success',
					text: 'Record updated successfully.',
					icon: 'success',
				}).then(() => {
					this.setState({ showModalLoader: false, showGroupModal: false });
					this.getAdminList(this.state.activePage);
				});
			})
			.catch((err) => {
				this.setState({ showModalLoader: false });
				if (err.data.status === 3) {
					this.setState({
						showGroupModal: false,
					});
					showErrorMessage(err, this.props);
				} else {
					actions.setErrors(err.data.errors);
					actions.setSubmitting(false);
				}
			});
	};

	downloadXLSX = (e) => {
		e.preventDefault();

		API.get(`/api/adm/download?page==1`, { responseType: 'blob' })
			.then((res) => {
				let url = window.URL.createObjectURL(res.data);
				let a = document.createElement('a');
				a.href = url;
				a.download = 'admin.xlsx';
				a.click();
			})
			.catch((err) => {
				showErrorMessage(err, this.props);
			});
	};

	checkHandlerDown = (event) => {
		event.preventDefault();
	};

	custSearch = (e) => {
		e.preventDefault();
		var first_name = document.getElementById('first_name').value;
		var last_name = document.getElementById('last_name').value;
		var email = document.getElementById('email').value;
		var group = document.getElementById('group').value;
		var status = document.getElementById('status').value;

		if (first_name === '' && last_name === '' && email === '' && group === '' && status === '') {
			return false;
		}

		API.get(
			`/api/adm?page=1&first_name=${encodeURIComponent(first_name)}&last_name=${encodeURIComponent(
				last_name
			)}&email=${encodeURIComponent(email)}&group=${encodeURIComponent(
				group
			)}&status=${encodeURIComponent(status)}`
		)
			.then((res) => {
				this.setState({
					admins: res.data.data,
					count_user: res.data.count_user,
					isLoading: false,
					search_first_name: first_name,
					search_last_name: last_name,
					search_email: email,
					search_group: group,
					search_status: status,
					remove_search: true,
					activePage: 1,
				});
			})
			.catch((err) => {
				this.setState({
					isLoading: false,
				});
				showErrorMessage(err, this.props);
			});
	};

	clearSearch = () => {
		document.getElementById('first_name').value = '';
		document.getElementById('last_name').value = '';
		document.getElementById('email').value = '';
		document.getElementById('group').value = '';
		document.getElementById('status').value = '';

		this.setState(
			{
				search_first_name: '',
				search_last_name: '',
				search_email: '',
				search_status: '',
				search_group: '',
				remove_search: false,
			},
			() => {
				this.getAdminList();
				this.groupList();
				this.setState({ activePage: 1 });
			}
		);
	};

	render() {
		const { adminDetails } = this.state;

		const newInitialValues = Object.assign(initialValues, {
			first_name: adminDetails.first_name ? htmlDecode(adminDetails.first_name) : '',
			last_name: adminDetails.last_name ? htmlDecode(adminDetails.last_name) : '',
			username: adminDetails.username ? htmlDecode(adminDetails.username) : '',
			email: adminDetails.email ? htmlDecode(adminDetails.email) : '',
			group_id: adminDetails.group_id ? adminDetails.group_id.toString() : '',
			manager_id: adminDetails.manager_id ? adminDetails.manager_id.toString() : '',
			role: adminDetails.role_id ? adminDetails.role_id.toString() : '',
			password: '',
			status:
				adminDetails.status || +adminDetails.status === 0 ? adminDetails.status.toString() : '',
		});

		let validateAdmin = null;
		if (this.state.adminflagId > 0) {
			validateAdmin = Yup.object().shape({
				first_name: Yup.string()
					.trim()
					.required('Please enter first name')
					.min(1, 'First name can be minimum 1 characters long')
					.matches(
						/^[A-Za-z0-9\s]*$/,
						'Invalid first name format! Only alphanumeric and spaces are allowed'
					)
					.max(30, 'First name can be maximum 30 characters long'),
				last_name: Yup.string()
					.trim()
					.required('Please enter last name')
					.min(1, 'Last name can be minimum 1 characters long')
					.matches(
						/^[A-Za-z0-9\s]*$/,
						'Invalid last name format! Only alphanumeric and spaces are allowed'
					)
					.max(30, 'Last name can be maximum 30 characters long'),
				email: Yup.string()
					.trim()
					.required('Please enter email')
					.email('Invalid email')
					.max(80, 'Email can be maximum 80 characters long'),
				username: Yup.string()
					.trim()
					.required('Please enter username')
					.min(4, 'Username can be minimum 4 characters long')
					.matches(/^[A-Za-z0-9]*$/, 'Invalid username format! Only alphanumeric are allowed')
					.max(12, 'Username can be maximum 12 characters long'),
				group_id: Yup.string().trim().required('Please select admin group'),
				status: Yup.string()
					.trim()
					.required('Please select status')
					.matches(/^[0|1]$/, 'Invalid status selected'),
			});
		} else {
			validateAdmin = Yup.object().shape({
				first_name: Yup.string()
					.trim()
					.required('Please enter first name')
					.min(1, 'First name can be minimum 1 characters long')
					.matches(
						/^[A-Za-z0-9\s]*$/,
						'Invalid first name format! Only alphanumeric and spaces are allowed'
					)
					.max(30, 'First name can be maximum 30 characters long'),
				last_name: Yup.string()
					.trim()
					.required('Please enter last name')
					.min(1, 'Last name can be minimum 1 characters long')
					.matches(
						/^[A-Za-z0-9\s]*$/,
						'Invalid last name format! Only alphanumeric and spaces are allowed'
					)
					.max(30, 'Last name can be maximum 30 characters long'),
				email: Yup.string()
					.trim()
					.required('Please enter email')
					.email('Invalid email')
					.max(80, 'Email can be maximum 80 characters long'),
				username: Yup.string()
					.trim()
					.required('Please enter username')
					.min(4, 'Username can be minimum 4 characters long')
					.matches(/^[A-Za-z0-9]*$/, 'Invalid username format! Only alphanumeric are allowed')
					.max(12, 'Username can be maximum 12 characters long'),
				group_id: Yup.string().trim().required('Please select admin group'),
				password: Yup.string()
					.required('Please enter password')
					.min(8, 'Password can be minimum 8 characters long')
					.max(12, 'Password can be maximum 12 characters long'),
				status: Yup.string()
					.trim()
					.required('Please select status')
					.matches(/^[0|1]$/, 'Invalid status selected'),
			});
		}

		//===========Group===============

		const { groupName } = this.state;
		const newInitialGroupValues = Object.assign(initialGroupValues, {
			group_name: groupName ? htmlDecode(groupName) : '',
		});
		const validateStopFlag = Yup.object().shape({
			group_name: Yup.string()
				.min(2, 'Group name must be at least 2 characters')
				.max(200, 'Group name must be at most 200 characters')
				.required('Please enter group name'),
		});

		if (this.state.isLoading === true) {
			return (
				<>
					<div className="loderOuter">
						<div className="loading_reddy_outer">
							<div className="loading_reddy">
								<img src={whitelogo} alt="logo" />
							</div>
						</div>
					</div>
				</>
			);
		} else {
			return (
				<>
					<Layout {...this.props}>
						<div className="content-wrapper">
							<section className="content-header">
								<div className="row">
									<div className="col-lg-9 col-sm-6 col-xs-12">
										<h1>
											Admin Users
											<small />
										</h1>
									</div>
									<div className="col-lg-12 col-sm-12 col-xs-12 topSearchSection">
										<button
											type="button"
											className="btn btn-warning btn-sm btn-custom-green pull-right"
											onClick={(e) => this.modalShowHandler(e, '')}
										>
											<i className="fas fa-plus m-r-5" /> Add Admin
										</button>

										<form className="form">
											<div className="">
												<input
													className="form-control"
													name="first_name"
													id="first_name"
													placeholder="Filter by first name"
												/>
											</div>

											<div className="">
												<input
													className="form-control"
													name="last_name"
													id="last_name"
													placeholder="Filter by last name"
												/>
											</div>
											<div className="">
												<input
													className="form-control"
													name="email"
													id="email"
													placeholder="Filter by email"
												/>
											</div>

											<div>
												<select name="group" id="group" className="form-control">
													<option value="">Select Group</option>
													{this.state.groupList.map((group, i) => (
														<option key={i} value={group.group_id}>
															{group.group_name}
														</option>
													))}
												</select>
											</div>
											<div className="">
												<select name="status" id="status" className="form-control">
													<option value="">Status</option>
													<option value="1">Active</option>
													<option value="0">Inactive</option>
												</select>
											</div>

											{
												<div className="">
													<input
														type="submit"
														value="Search"
														className="btn btn-warning btn-sm"
														onClick={(e) => this.custSearch(e)}
													/>
													{this.state.remove_search ? (
														<a onClick={() => this.clearSearch()} className="btn btn-danger btn-sm">
															{' '}
															Remove{' '}
														</a>
													) : null}
												</div>
											}
											<div className="clearfix"></div>
										</form>
									</div>
									<div className="clearfix"></div>
								</div>
							</section>
							{/* <DashboardSearch groupList={this.state.groupList} /> */}
							<section className="content">
								<div className="box">
									<div className="box-body">
										<div className="nav-tabs-custom">
											<ul className="nav nav-tabs">
												<li className="tabButtonSec pull-right">
													{this.state.count_user > 0 ? (
														<span onClick={(e) => this.downloadXLSX(e)}>
															<LinkWithTooltip
																tooltip={`Click here to download excel`}
																href="#"
																id="tooltip-my"
																clicked={(e) => this.checkHandlerDown(e)}
															>
																<i className="fas fa-download"></i>
															</LinkWithTooltip>
														</span>
													) : null}
												</li>
											</ul>
										</div>

										<BootstrapTable data={this.state.admins}>
											<TableHeaderColumn
												isKey
												dataField="first_name"
												dataFormat={__htmlDecode(this)}
											>
												First Name
											</TableHeaderColumn>

											<TableHeaderColumn dataField="last_name" dataFormat={__htmlDecode(this)}>
												Last Name
											</TableHeaderColumn>

											<TableHeaderColumn dataField="email" dataFormat={__htmlDecode(this)}>
												Email
											</TableHeaderColumn>

											<TableHeaderColumn
												dataField="manager_first_name"
												dataFormat={managerDetails(this)}
											>
												Manager
											</TableHeaderColumn>

											<TableHeaderColumn dataField="group_name" dataFormat={admGrp(this)}>
												Group
											</TableHeaderColumn>
											<TableHeaderColumn
												dataField="display_login_date"
												dataFormat={loginDate(this)}
											>
												Last Login Time
											</TableHeaderColumn>
											<TableHeaderColumn dataField="status" dataFormat={admStatus(this)}>
												Status
											</TableHeaderColumn>

											<TableHeaderColumn dataField="id" dataFormat={actionFormatter(this)}>
												Action
											</TableHeaderColumn>
										</BootstrapTable>
										{this.state.count_user > 20 ? (
											<Row>
												<Col md={12}>
													<div className="paginationOuter text-right">
														<Pagination
															activePage={this.state.activePage}
															itemsCountPerPage={this.state.itemPerPage}
															totalItemsCount={this.state.count_user}
															itemClass="nav-item"
															linkClass="nav-link"
															activeClass="active"
															onChange={this.handlePageChange}
														/>
													</div>
												</Col>
											</Row>
										) : null}

										{/* ======= Add/Edit Admin ======== */}

										<Modal
											show={this.state.showModal}
											onHide={() => this.modalCloseHandler()}
											backdrop="static"
										>
											<Formik
												initialValues={newInitialValues}
												validationSchema={validateAdmin}
												onSubmit={this.handleSubmitEvent}
											>
												{({ values, errors, touched, isValid, isSubmitting }) => {
													return (
														<Form>
															{this.state.showModalLoader === true ? (
																<div className="loading_reddy_outer">
																	<div className="loading_reddy">
																		<img src={whitelogo} alt="loader" />
																	</div>
																</div>
															) : (
																''
															)}
															<Modal.Header closeButton>
																<Modal.Title>
																	{this.state.adminflagId > 0 ? 'Edit' : 'Add'} Admin
																</Modal.Title>
															</Modal.Header>
															<Modal.Body>
																<div className="contBox">
																	<Row>
																		<Col xs={12} sm={6} md={6}>
																			<div className="form-group">
																				<label>
																					First Name
																					<span className="impField">*</span>
																				</label>
																				<Field
																					name="first_name"
																					type="text"
																					className={`form-control`}
																					placeholder="Enter first name"
																					autoComplete="off"
																				/>
																				{errors.first_name && touched.first_name ? (
																					<span className="errorMsg">{errors.first_name}</span>
																				) : null}
																			</div>
																		</Col>
																		<Col xs={12} sm={6} md={6}>
																			<div className="form-group">
																				<label>
																					Last Name
																					<span className="impField">*</span>
																				</label>
																				<Field
																					name="last_name"
																					type="text"
																					className={`form-control`}
																					placeholder="Enter last name"
																					autoComplete="off"
																				/>
																				{errors.last_name && touched.last_name ? (
																					<span className="errorMsg">{errors.last_name}</span>
																				) : null}
																			</div>
																		</Col>
																	</Row>
																	<Row>
																		<Col xs={12} sm={6} md={6}>
																			<div className="form-group">
																				<label>
																					Username
																					<span className="impField">*</span>
																				</label>
																				<Field
																					name="username"
																					type="text"
																					className={`form-control`}
																					placeholder="Enter username"
																					autoComplete="off"
																				/>
																				{errors.username && touched.username ? (
																					<span className="errorMsg">{errors.username}</span>
																				) : null}
																			</div>
																		</Col>
																		<Col xs={12} sm={6} md={6}>
																			<div className="form-group">
																				<label>
																					Email
																					<span className="impField">*</span>
																				</label>
																				<Field
																					name="email"
																					type="text"
																					className={`form-control`}
																					placeholder="Enter email"
																					autoComplete="off"
																				/>
																				{errors.email && touched.email ? (
																					<span className="errorMsg">{errors.email}</span>
																				) : null}
																			</div>
																		</Col>
																	</Row>
																	<Row>
																		{this.state.adminflagId === 0 ? (
																			<Col xs={12} sm={6} md={6}>
																				<div className="form-group">
																					<label>
																						Password
																						<span className="impField">*</span>
																					</label>
																					<Field
																						name="password"
																						type="password"
																						className={`form-control`}
																						placeholder="Enter password"
																						autoComplete="off"
																					/>
																					{errors.password && touched.password ? (
																						<span className="errorMsg">{errors.password}</span>
																					) : null}
																				</div>
																			</Col>
																		) : (
																			''
																		)}
																		<Col xs={12} sm={6} md={6}>
																			<div className="form-group">
																				<label>
																					Group
																					<span className="impField">*</span>
																				</label>
																				<Field
																					name="group_id"
																					component="select"
																					className={`selectArowGray form-control`}
																					autoComplete="off"
																					value={values.group_id}
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
																				{errors.group_id && touched.group_id ? (
																					<span className="errorMsg">{errors.group_id}</span>
																				) : null}
																			</div>
																		</Col>
																	</Row>

																	<Row>
																		<Col xs={12} sm={6} md={6}>
																			<div className="form-group">
																				<label>Manager</label>
																				<Field
																					name="manager_id"
																					component="select"
																					className={`selectArowGray form-control`}
																					autoComplete="off"
																					value={values.manager_id}
																				>
																					<option key="-1" value="">
																						Select
																					</option>
																					{this.state.managerList.map((manager, i) => (
																						<option key={i} value={manager.id}>
																							{manager.name}
																						</option>
																					))}
																				</Field>
																				{errors.manager_id && touched.manager_id ? (
																					<span className="errorMsg">{errors.manager_id}</span>
																				) : null}
																			</div>
																		</Col>

																		<Col xs={12} sm={6} md={6}>
																			<div className="form-group">
																				<label>
																					Status
																					<span className="impField">*</span>
																				</label>
																				<Field
																					name="status"
																					component="select"
																					className={`selectArowGray form-control`}
																					autoComplete="off"
																					value={values.status}
																				>
																					<option key="-1" value="">
																						Select
																					</option>
																					{this.state.selectStatus.map((status, i) => (
																						<option key={i} value={status.id}>
																							{status.name}
																						</option>
																					))}
																				</Field>
																				{errors.status && touched.status ? (
																					<span className="errorMsg">{errors.status}</span>
																				) : null}
																			</div>
																		</Col>
																	</Row>

																	{errors.message ? (
																		<Row>
																			<Col xs={12} sm={12} md={12}>
																				<span className="errorMsg">{errors.message}</span>
																			</Col>
																		</Row>
																	) : (
																		''
																	)}
																</div>
															</Modal.Body>
															<Modal.Footer>
																<button
																	className={`btn btn-success btn-sm ${
																		isValid ? 'btn-custom-green' : 'btn-disable'
																	} m-r-10`}
																	type="submit"
																	disabled={isValid ? false : true}
																>
																	{this.state.adminflagId > 0
																		? isSubmitting
																			? 'Updating...'
																			: 'Update'
																		: isSubmitting
																		? 'Submitting...'
																		: 'Submit'}
																</button>
																<button
																	onClick={(e) => this.modalCloseHandler()}
																	className={`btn btn-danger btn-sm`}
																	type="button"
																>
																	Close
																</button>
															</Modal.Footer>
														</Form>
													);
												}}
											</Formik>
										</Modal>

										{/* Group Modal */}

										<Modal
											show={this.state.showGroupModal}
											onHide={() => this.modalCloseGroupHandler()}
											backdrop="static"
										>
											<Formik
												initialValues={newInitialGroupValues}
												validationSchema={validateStopFlag}
												onSubmit={this.handleSubmitGroupEvent}
											>
												{({ values, errors, touched, isValid, isSubmitting }) => {
													return (
														<Form>
															{this.state.showModalLoader === true ? (
																<div className="loading_reddy_outer">
																	<div className="loading_reddy">
																		<img src={whitelogo} alt="loader" />
																	</div>
																</div>
															) : (
																''
															)}
															<Modal.Header closeButton>
																<Modal.Title>
																	{this.state.groupFlagId > 0 ? 'Edit' : 'Add'} Group
																</Modal.Title>
															</Modal.Header>
															<Modal.Body>
																<div className="contBox listSection">
																	<Row>
																		<Col xs={12} sm={12} md={12}>
																			<div className="form-group">
																				<label>
																					Group Name
																					<span className="impField">*</span>
																				</label>
																				<Field
																					name="group_name"
																					type="text"
																					className={`form-control`}
																					placeholder="Enter name"
																					autoComplete="off"
																					value={values.group_name}
																				/>
																				{errors.group_name && touched.group_name ? (
																					<span className="errorMsg">{errors.group_name}</span>
																				) : null}
																			</div>
																		</Col>
																	</Row>
																	<div className="listBody">
																		{this.state.sectionList &&
																			this.state.sectionList.length > 0 &&
																			this.getHtml()}
																	</div>
																	{errors.message ? (
																		<Row>
																			<Col xs={12} sm={12} md={12}>
																				<span className="errorMsg">{errors.message}</span>
																			</Col>
																		</Row>
																	) : (
																		''
																	)}
																</div>
															</Modal.Body>
															<Modal.Footer>
																<button
																	className={`btn btn-success btn-sm ${
																		isValid ? 'btn-custom-green' : 'btn-disable'
																	} mr-2`}
																	type="submit"
																	disabled={isValid ? false : false}
																>
																	{this.state.groupFlagId > 0
																		? isSubmitting
																			? 'Updating...'
																			: 'Update'
																		: isSubmitting
																		? 'Submitting...'
																		: 'Submit'}
																</button>
																<button
																	onClick={(e) => this.modalCloseGroupHandler()}
																	className={`btn btn-danger btn-sm`}
																	type="button"
																>
																	Close
																</button>
															</Modal.Footer>
														</Form>
													);
												}}
											</Formik>
										</Modal>
									</div>
								</div>
							</section>
						</div>
					</Layout>
				</>
			);
		}
	}
}

export default AdminList;
