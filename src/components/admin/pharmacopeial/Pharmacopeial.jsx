import React, { Component } from 'react';
import Pagination from 'react-js-pagination';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Row, Col, ButtonToolbar, Button, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap';
//import { Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import swal from 'sweetalert';
import * as Yup from 'yup';

import Layout from '../layout/Layout';
import whitelogo from '../../../assets/images/drreddylogo_white.png';
import API from '../../../shared/admin-axios';
import { showErrorMessage } from '../../../shared/handle_error';
import { htmlDecode } from '../../../shared/helper';
import { getSuperAdmin, getAdminGroup } from '../../../shared/helper';

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

const actionFormatter = (refObj) => (cell) => {
	//console.log(refObj.state.access)
	return (
		<div className="actionStyle">
			{refObj.state.access.edit === true ? (
				<LinkWithTooltip
					tooltip="Click to Edit"
					href="#"
					clicked={(e) => refObj.modalShowHandler(e, cell)}
					id="tooltip-1"
				>
					<i className="far fa-edit" />
				</LinkWithTooltip>
			) : null}
			{refObj.state.access.delete === true ? (
				<LinkWithTooltip
					tooltip="Click to Delete"
					href="#"
					clicked={(e) => refObj.confirmDelete(e, cell)}
					id="tooltip-1"
				>
					<i className="far fa-trash-alt" />
				</LinkWithTooltip>
			) : null}
		</div>
	);
};

const custStatus = () => (cell) => {
	return cell === 1 ? 'Active' : 'Inactive';
};

const custContent = () => (cell) => {
	return htmlDecode(cell);
};

const initialValues = {
	pharmacopeial_name: '',
	status: '',
};

class pharmacopeial extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			get_access_data: false,
			activePage: 1,
			totalCount: 0,
			itemPerPage: 20,
			pharmacopeialDetails: [],
			pharmacopeialflagId: 0,
			selectStatus: [
				{ id: '0', name: 'Inactive' },
				{ id: '1', name: 'Active' },
			],
			showModal: false,
			search_pharmacopeial_name: '',
			search_status: '',
			remove_search: false,
			showModalLoader: false,
		};
	}

	componentDidMount() {
		const superAdmin = getSuperAdmin(localStorage.admin_token);

		if (superAdmin === 1) {
			this.setState({
				access: {
					view: true,
					add: true,
					edit: true,
					delete: true,
				},
				get_access_data: true,
			});
			this.getPharmacopiealList();
		} else {
			const adminGroup = getAdminGroup(localStorage.admin_token);
			API.get(`/api/adm_group/single_access/${adminGroup}/${'PHARMACOPEIAL_MANAGEMENT'}`)
				.then((res) => {
					this.setState({
						access: res.data.data,
						get_access_data: true,
					});

					if (res.data.data.view === true) {
						this.getPharmacopiealList();
					} else {
						this.props.history.push('/admin/dashboard');
					}
				})
				.catch((err) => {
					showErrorMessage(err, this.props);
				});
		}
	}
	clearSearch = () => {
		document.getElementById('pharmacopeial_name').value = '';
		document.getElementById('status').value = '';

		this.setState(
			{
				search_pharmacopeial_name: '',
				search_status: '',
				remove_search: false,
			},
			() => {
				this.getPharmacopiealList();
				this.setState({ activePage: 1 });
			}
		);
	};
	getPharmacopiealList(page = 1) {
		let pharmacopeial_name = this.state.search_pharmacopeial_name;
		let status = this.state.search_status;
		API.get(
			`/api/feed/Pharmacopeial_list?page=${page}&pharmacopeial_name=${encodeURIComponent(
				pharmacopeial_name
			)}&status=${encodeURIComponent(status)}`
		)
			.then((res) => {
				this.setState({
					pharmacopeial: res.data.data,
					count: res.data.count_pharmacopeial,
					isLoading: false,
					search_pharmacopeial_name: pharmacopeial_name,
					search_status: status,
				});
			})
			.catch((err) => {
				this.setState({
					isLoading: false,
				});
				showErrorMessage(err, this.props);
			});
		this.setState({
			isLoading: false,
		});
	}
	pharmacopiealSearch = (e) => {
		e.preventDefault();

		var pharmacopeial_name = document.getElementById('pharmacopeial_name').value;
		var status = document.getElementById('status').value;

		if (pharmacopeial_name === '' && status === '') {
			return false;
		}

		API.get(
			`/api/feed/Pharmacopeial_list?page=1&pharmacopeial_name=${encodeURIComponent(
				pharmacopeial_name
			)}&status=${encodeURIComponent(status)}`
		)
			.then((res) => {
				this.setState({
					pharmacopeial: res.data.data,
					count: res.data.count_pharmacopeial,
					isLoading: false,
					search_pharmacopeial_name: pharmacopeial_name,
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
	handlePageChange = (pageNumber) => {
		this.setState({ activePage: pageNumber });
		this.getPharmacopiealList(pageNumber > 0 ? pageNumber : 1);
	};

	modalShowHandler = (event, id) => {
		if (id) {
			event.preventDefault();
			API.get(`/api/feed/get_Pharmacopeial/${id}`)
				.then((res) => {
					this.setState({
						pharmacopeialDetails: res.data.data,
						pharmacopeialflagId: id,
						isLoading: false,
						showModal: true,
					});
				})
				.catch((err) => {
					showErrorMessage(err, this.props);
				});
		} else {
			this.setState({
				pharmacopeialDetails: [],
				pharmacopeialflagId: 0,
				showModal: true,
			});
		}
	};

	modalCloseHandler = () => {
		this.setState({ pharmacopeialflagId: 0 });
		this.setState({ showModal: false });
	};

	handleSubmitEvent = (values, actions) => {
		const toTitleCase = (phrase) => {
			return phrase
				.toLowerCase()
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
		};

		const post_data = {
			pharmacopeial_name: values.pharmacopeial_name,
			status: values.status,
		};

		if (this.state.pharmacopeialflagId) {
			this.setState({ showModalLoader: true });
			const id = this.state.pharmacopeialflagId;
			API.put(`/api/feed/update_Pharmacopeial/${id}`, post_data)
				.then((res) => {
					this.modalCloseHandler();
					swal({
						closeOnClickOutside: false,
						title: 'Success',
						text: 'Record updated successfully.',
						icon: 'success',
					}).then(() => {
						this.setState({ showModalLoader: false });
						this.getPharmacopiealList(this.state.activePage);
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
			this.setState({ showModalLoader: true });
			API.post('/api/feed/add_Pharmacopeial', post_data)
				.then((res) => {
					this.modalCloseHandler();
					swal({
						closeOnClickOutside: false,
						title: 'Success',
						text: 'Record added successfully.',
						icon: 'success',
					}).then(() => {
						this.setState({ activePage: 1, showModalLoader: false });
						this.getPharmacopiealList(this.state.activePage);
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
				this.deletepharmacopeial(id);
			}
		});
	};

	deletepharmacopeial = (id) => {
		if (id) {
			API.delete(`/api/feed/delete_Pharmacopeial/${id}`)
				.then((res) => {
					swal({
						closeOnClickOutside: false,
						title: 'Success',
						text: 'Record deleted successfully.',
						icon: 'success',
					}).then(() => {
						this.setState({ activePage: 1 });
						this.getPharmacopiealList(this.state.activePage);
					});
				})
				.catch((err) => {
					if (err.data.status === 3) {
						this.setState({ closeModal: true });
						showErrorMessage(err, this.props);
					}
				});
		}
	};

	downloadXLSX = (e) => {
		e.preventDefault();

		API.get(`/api/feed/Pharmacopeial_list/download?page=1`, { responseType: 'blob' })
			.then((res) => {
				let url = window.URL.createObjectURL(res.data);
				let a = document.createElement('a');
				a.href = url;
				a.download = 'pharmacopeial.xlsx';
				a.click();
			})
			.catch((err) => {
				showErrorMessage(err, this.props);
			});
	};

	checkHandler = (event) => {
		event.preventDefault();
	};

	render() {
		const { pharmacopeialDetails } = this.state;
		const newInitialValues = Object.assign(initialValues, {
			pharmacopeial_name: pharmacopeialDetails.pharmacopeial_name
				? htmlDecode(pharmacopeialDetails.pharmacopeial_name)
				: '',
			status:
				pharmacopeialDetails.status || +pharmacopeialDetails.status === 0
					? pharmacopeialDetails.status.toString()
					: '',
		});
		const validateStopFlag = Yup.object().shape({
			pharmacopeial_name: Yup.string()
				.min(2, 'pharmacopeial name must be at least 2 characters')
				.max(200, 'pharmacopeial name must be at most 200 characters')
				.required('Please enter pharmacopeial name'),
			status: Yup.string()
				.trim()
				.required('Please select status')
				.matches(/^[0|1]$/, 'Invalid status selected'),
		});

		if (this.state.isLoading === true || this.state.get_access_data === false) {
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
				<Layout {...this.props}>
					<div className="content-wrapper">
						<section className="content-header">
							<div className="row">
								<div className="col-lg-12 col-sm-12 col-xs-12">
									<h1>
										Manage pharmacopeial
										<small />
									</h1>
								</div>
								<div className="col-lg-12 col-sm-12 col-xs-12 topSearchSection">
									{this.state.access.add === true ? (
										<div className="">
											<button
												type="button"
												className="btn btn-info btn-sm"
												onClick={(e) => this.modalShowHandler(e, '')}
											>
												<i className="fas fa-plus m-r-5" /> Add Pharmacopeial
											</button>
										</div>
									) : null}
									<form className="form">
										<div className="">
											<input
												className="form-control"
												name="pharmacopeial_name"
												id="pharmacopeial_name"
												placeholder="Filter by pharmacopeial name"
											/>
										</div>

										<div className="">
											<select name="status" id="status" className="form-control">
												<option value="">Select status</option>
												<option value="1">Active</option>
												<option value="0">Inactive</option>
											</select>
										</div>

										<div className="">
											<input
												type="submit"
												value="Search"
												className="btn btn-warning btn-sm"
												onClick={(e) => this.pharmacopiealSearch(e)}
											/>
											{this.state.remove_search ? (
												<a onClick={() => this.clearSearch()} className="btn btn-danger btn-sm">
													{' '}
													Remove{' '}
												</a>
											) : null}
										</div>
										<div className="clearfix"></div>
									</form>
									<div className="clearfix"></div>
								</div>
							</div>
						</section>
						<section className="content">
							<div className="box">
								<div className="box-body">
									<div className="nav-tabs-custom">
										<ul className="nav nav-tabs">
											<li className="tabButtonSec pull-right">
												{this.state.count > 0 ? (
													<span onClick={(e) => this.downloadXLSX(e)}>
														<LinkWithTooltip
															tooltip={`Click here to download excel`}
															href="#"
															id="tooltip-my"
															clicked={(e) => this.checkHandler(e)}
														>
															<i className="fas fa-download"></i>
														</LinkWithTooltip>
													</span>
												) : null}
											</li>
										</ul>
									</div>

									<BootstrapTable data={this.state.pharmacopeial}>
										<TableHeaderColumn
											isKey
											dataField="pharmacopeial_name"
											dataFormat={custContent(this)}
										>
											Name
										</TableHeaderColumn>
										<TableHeaderColumn dataField="status" dataFormat={custStatus(this)}>
											Status
										</TableHeaderColumn>
										<TableHeaderColumn
											dataField="display_add_date"
											editable={false}
											expandable={false}
										>
											Date Added
										</TableHeaderColumn>
										{this.state.access.edit === true || this.state.access.delete === true ? (
											<TableHeaderColumn dataField="id" dataFormat={actionFormatter(this)}>
												Action
											</TableHeaderColumn>
										) : null}
									</BootstrapTable>

									{this.state.count > this.state.itemPerPage ? (
										<Row>
											<Col md={12}>
												<div className="paginationOuter text-right">
													<Pagination
														activePage={this.state.activePage}
														itemsCountPerPage={this.state.itemPerPage}
														totalItemsCount={this.state.count}
														itemClass="nav-item"
														linkClass="nav-link"
														activeClass="active"
														onChange={this.handlePageChange}
													/>
												</div>
											</Col>
										</Row>
									) : null}

									{/* ======= Add/Edit ======== */}
									<Modal
										show={this.state.showModal}
										onHide={() => this.modalCloseHandler()}
										backdrop="static"
									>
										<Formik
											initialValues={newInitialValues}
											validationSchema={validateStopFlag}
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
																{this.state.pharmacopeialflagId > 0 ? 'Edit' : 'Add'} pharmacopeial
															</Modal.Title>
														</Modal.Header>
														<Modal.Body>
															<div className="contBox">
																<Row>
																	<Col xs={12} sm={12} md={12}>
																		<div className="form-group">
																			<label>
																				Pharmacopeial Name<span className="impField">*</span>
																			</label>
																			<Field
																				name="pharmacopeial_name"
																				type="text"
																				className={`form-control`}
																				placeholder="Enter name"
																				autoComplete="off"
																				value={values.pharmacopeial_name}
																			/>
																			{errors.pharmacopeial_name && touched.pharmacopeial_name ? (
																				<span className="errorMsg">
																					{errors.pharmacopeial_name}
																				</span>
																			) : null}
																		</div>
																	</Col>
																</Row>
																<Row>
																	<Col xs={12} sm={12} md={12}>
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
																} mr-2`}
																type="submit"
																disabled={isValid ? false : false}
															>
																{this.state.pharmacopeialflagId > 0
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
								</div>
							</div>
						</section>
					</div>
				</Layout>
			);
		}
	}
}
export default pharmacopeial;
