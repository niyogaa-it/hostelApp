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
	description: '',
	code: '',
	status: '',
};

class PaymentTerms extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			activePage: 1,
			totalCount: 0,
			itemPerPage: 20,
			ptermsDetails: [],
			ptermsflagId: 0,
			selectStatus: [
				{ id: '0', name: 'Inactive' },
				{ id: '1', name: 'Active' },
			],
			showModal: false,
			showModalLoader: false,
			get_access_data: false,
		};
	}

	componentDidMount() {
		//this.getPtermsList();
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
			this.getPtermsList();
		} else {
			const adminGroup = getAdminGroup(localStorage.admin_token);
			API.get(`/api/adm_group/single_access/${adminGroup}/${'PAYMENT_TERMS_MANAGEMENT'}`)
				.then((res) => {
					this.setState({
						access: res.data.data,
						get_access_data: true,
					});

					if (res.data.data.view === true) {
						this.getPtermsList();
					} else {
						this.props.history.push('/admin/dashboard');
					}
				})
				.catch((err) => {
					showErrorMessage(err, this.props);
				});
		}
	}

	getPtermsList(page = 1) {
		API.get(`/api/feed/pterms_list?page=${page}`)
			.then((res) => {
				this.setState({
					pterms: res.data.data,
					count: res.data.count_pterms,
					isLoading: false,
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

	handlePageChange = (pageNumber) => {
		this.setState({ activePage: pageNumber });
		this.getPtermsList(pageNumber > 0 ? pageNumber : 1);
	};

	modalShowHandler = (event, id) => {
		if (id) {
			event.preventDefault();
			API.get(`/api/feed/get_pterms/${id}`)
				.then((res) => {
					this.setState({
						ptermsDetails: res.data.data,
						ptermsflagId: id,
						isLoading: false,
						showModal: true,
					});
					//console.log(res.data.data)
				})
				.catch((err) => {
					showErrorMessage(err, this.props);
				});
		} else {
			this.setState({
				ptermsDetails: [],
				ptermsflagId: 0,
				showModal: true,
			});
		}
	};

	modalCloseHandler = () => {
		this.setState({ ptermsflagId: 0 });
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
			description: toTitleCase(values.description),
			code: values.code.toUpperCase(),
			status: values.status,
		};

		if (this.state.ptermsflagId) {
			this.setState({ showModalLoader: true });
			const id = this.state.ptermsflagId;
			API.put(`/api/feed/update_pterms/${id}`, post_data)
				.then((res) => {
					this.modalCloseHandler();
					swal({
						closeOnClickOutside: false,
						title: 'Success',
						text: 'Record updated successfully.',
						icon: 'success',
					}).then(() => {
						this.setState({ showModalLoader: false });
						this.getPtermsList(this.state.activePage);
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
			API.post('/api/feed/add_pterms', post_data)
				.then((res) => {
					this.modalCloseHandler();
					swal({
						closeOnClickOutside: false,
						title: 'Success',
						text: 'Record added successfully.',
						icon: 'success',
					}).then(() => {
						this.setState({ activePage: 1, showModalLoader: false });
						this.getPtermsList(this.state.activePage);
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
				this.deletePterms(id);
			}
		});
	};

	deletePterms = (id) => {
		if (id) {
			API.delete(`/api/feed/delete_pterms/${id}`)
				.then((res) => {
					swal({
						closeOnClickOutside: false,
						title: 'Success',
						text: 'Record deleted successfully.',
						icon: 'success',
					}).then(() => {
						this.setState({ activePage: 1 });
						this.getPtermsList(this.state.activePage);
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

	render() {
		const { ptermsDetails } = this.state;
		const newInitialValues = Object.assign(initialValues, {
			description: ptermsDetails.description ? htmlDecode(ptermsDetails.description) : '',
			code: ptermsDetails.code ? htmlDecode(ptermsDetails.code) : '',
			status:
				ptermsDetails.status || +ptermsDetails.status === 0 ? ptermsDetails.status.toString() : '',
		});
		const validateStopFlag = Yup.object().shape({
			description: Yup.string()
				.min(2, 'Description must be at least 2 characters')
				.max(50, 'Description must be at most 50 characters')
				.required('Please enter description'),
			code: Yup.string()
				.min(2, 'Code must be at least 2 characters')
				.max(10, 'Code must be at most 10 characters')
				.required('Please enter code'),
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
								<div className="col-lg-9 col-sm-6 col-xs-12">
									<h1>
										Payment Terms
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
												<i className="fas fa-plus m-r-5" /> Add Payment Terms
											</button>
										</div>
									) : null}
									<div className="clearfix"></div>
								</div>
							</div>
						</section>
						<section className="content">
							<div className="box">
								<div className="box-body">
									<BootstrapTable data={this.state.pterms}>
										<TableHeaderColumn isKey dataField="description" dataFormat={custContent(this)}>
											Description
										</TableHeaderColumn>
										<TableHeaderColumn dataField="code" dataFormat={custContent(this)}>
											Code
										</TableHeaderColumn>
										<TableHeaderColumn dataField="status" dataFormat={custStatus(this)}>
											Status
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
																{this.state.ptermsflagId > 0 ? 'Edit' : 'Add'} Payment Terms
															</Modal.Title>
														</Modal.Header>
														<Modal.Body>
															<div className="contBox">
																<Row>
																	<Col xs={12} sm={12} md={12}>
																		<div className="form-group">
																			<label>
																				Description<span className="impField">*</span>
																			</label>
																			<Field
																				name="description"
																				type="text"
																				className={`form-control`}
																				placeholder="Enter description"
																				autoComplete="off"
																				value={values.description}
																			/>
																			{errors.description && touched.description ? (
																				<span className="errorMsg">{errors.description}</span>
																			) : null}
																		</div>
																	</Col>
																</Row>
																<Row>
																	<Col xs={12} sm={12} md={12}>
																		<div className="form-group">
																			<label>
																				Code<span className="impField">*</span>
																			</label>
																			<Field
																				name="code"
																				type="text"
																				className={`form-control`}
																				placeholder="Enter code"
																				autoComplete="off"
																				value={values.code}
																			/>
																			{errors.code && touched.code ? (
																				<span className="errorMsg">{errors.code}</span>
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
																{this.state.ptermsflagId > 0
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
export default PaymentTerms;
