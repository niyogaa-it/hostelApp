import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
//import Loader from "react-loader-spinner";
import { Row, Col, ButtonToolbar, Button, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../../../shared/admin-axios';
import { Formik, Field, Form, FieldArray, FieldProps, getIn } from 'formik';
import * as Yup from 'yup';
import swal from 'sweetalert';
import Layout from '../layout/Layout';
import whitelogo from '../../../assets/images/drreddylogo_white.png';
import Select from 'react-select';
import { htmlDecode } from '../../../shared/helper';
import { showErrorMessage } from '../../../shared/handle_error';
import { getSuperAdmin, getAdminGroup } from '../../../shared/helper';

/*For Tooltip*/
function LinkWithTooltip({ id, children, href, tooltip, clicked }) {
	return (
		<OverlayTrigger
			overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
			placement="top"
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
		</div>
	);
};

const validateSlaDetails = Yup.object().shape({
	slaMap: Yup.array().of(
		Yup.object().shape({
			status_1: Yup.string().required('Please select a value'),
			status_2: Yup.string().required('Please select a value'),
			status_3: Yup.string().required('Please select a value'),
			// status_4: Yup.string()
			// .required("Please select a value"),
		})
	),
});

const initialValues = {
	slaMap: [
		{
			status_1: '',
			employees_1: [],
			status_2: '',
			employees_2: [],
			status_3: '',
			employees_3: [],
			employee_name: [],
			name: 'BM',
		},
		{
			status_1: '',
			employees_1: [],
			status_2: '',
			employees_2: [],
			status_3: '',
			employees_3: [],
			employee_name: [],
			name: 'CSC Technical',
		},
		{
			status_1: '',
			employees_1: [],
			status_2: '',
			employees_2: [],
			status_3: '',
			employees_3: [],
			employee_name: [],
			name: 'CSC Commercial',
		},
		{
			status_1: '',
			employees_1: [],
			status_2: '',
			employees_2: [],
			status_3: '',
			employees_3: [],
			employee_name: [],
			name: 'RA',
		},
		{
			status_1: '',
			employees_1: [],
			status_2: '',
			employees_2: [],
			status_3: '',
			employees_3: [],
			employee_name: [],
			name: 'Others',
		},
	],
};

// const validateSlaDetails = Yup.object().shape({
//   status_1: Yup.string()
//     .required("Please select a value"),
//   status_2: Yup.string()
//   .required("Please select a value"),
//   status_3: Yup.string()
//     .required("Please select a value"),
// });

// const Input = ({ field, form: { errors } }: FieldProps) => {
//   const errorMessage = getIn(errors, field.name);

//   return (
//     <>
//       <TextField {...field} />
//       {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
//     </>
//   );
// };

class Sla extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			slaArr: [],
			slaDetails: [],
			slaflagId: 0,
			showModal: false,
			isOwnBmType: [
				{ id: '0', name: 'No' },
				{ id: '1', name: 'Yes' },
			],
			get_access_data: false,
		};
	}

	componentDidMount() {
		//this.getSlaList();
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
			this.getSlaList();
		} else {
			const adminGroup = getAdminGroup(localStorage.admin_token);
			API.get(`/api/adm_group/single_access/${adminGroup}/${'SLA_NOTIFICATION_TYPE_MANAGEMENT'}`)
				.then((res) => {
					this.setState({
						access: res.data.data,
						get_access_data: true,
					});

					if (res.data.data.view === true) {
						this.getSlaList();
					} else {
						this.props.history.push('/admin/dashboard');
					}
				})
				.catch((err) => {
					showErrorMessage(err, this.props);
				});
		}
	}

	getSlaList() {
		API.get('/api/sla')
			.then((res) => {
				this.setState({
					slaArr: res.data.data,
					isLoading: false,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	getIndividualSla(id, callBack) {
		this.getEmployeeList();
		this.setState({ idmaster: id });
		API.get(`/api/sla/details/${id}`)
			.then((res) => {
				this.setState({
					slaDetails: res.data.data,
				});
				let result_data = res.data.data;
				let status_arr = [];
				let employees_arr = [];
				console.log('Status', result_data[1][0]);
				console.log('Length', Object.keys(result_data).length);
				if (Object.keys(result_data).length > 0) {
					for (let index = 1; index <= Object.keys(result_data).length; index++) {
						// let key = index;
						// if(index == 4)
						//     key = 5;

						status_arr.push(result_data[index]);
					}
				}

				this.setState({
					status_map: status_arr,
				});

				// initialValues.slaMap = [ { status_1: status_arr.length > 0 ? status_arr[0][0].status : "", employees_1: [],status_2: status_arr.length > 0 ? status_arr[0][1].status : "", employees_2: [],status_3: status_arr.length > 0 ? status_arr[0][2].status : "", employees_3: []},
				//     { status_1: status_arr.length > 0 ? status_arr[1][0].status : "", employees_1: [],status_2: status_arr.length > 0 ? status_arr[1][1].status : "", employees_2: [],status_3: status_arr.length > 0 ? status_arr[1][2].status : "", employees_3: []},
				//     { status_1: status_arr.length > 0 ? status_arr[2][0].status : "", employees_1: [],status_2: status_arr.length > 0 ? status_arr[2][1].status : "", employees_2: [],status_3: status_arr.length > 0 ? status_arr[2][2].status : "", employees_3: []},
				//     { status_1: status_arr.length > 0 ? status_arr[3][0].status : "", employees_1: [],status_2: status_arr.length > 0 ? status_arr[3][1].status : "", employees_2: [],status_3: status_arr.length > 0 ? status_arr[3][2].status : "", employees_3: []}
				//   ];

				// console.log("IKT",initialValues);

				// if(res.data.data[`${id}.1`][0].status == 1)
				// this.setState({isOwnBm : true});

				// if(res.data.data[`${id}.2`][0].status == 1)
				// this.setState({isOwnBm1 : true});

				// if(res.data.data[`${id}.3`][0].status == 1)
				// this.setState({isOwnBm2 : true});
				// let employees_1 = [];
				// let emplyees_1_sel = [];
				// for (let index = 0; index < res.data.data[`${id}.1`].length; index++) {
				//   if(res.data.data[`${id}.1`][index].employee_id != null)
				//   {
				//     emplyees_1_sel.push(parseInt(res.data.data[`${id}.1`][index].employee_id));
				//     employees_1.push({value : parseInt(res.data.data[`${id}.1`][index].employee_id),label : res.data.data[`${id}.1`][index].first_name+" "+res.data.data[`${id}.1`][index].last_name})
				//   }

				// }

				// let employees_2 = [];
				// let emplyees_2_sel = [];
				// for (let index = 0; index < res.data.data[`${id}.2`].length; index++) {
				//   if(res.data.data[`${id}.2`][index].employee_id != null)
				//   {
				//     emplyees_2_sel.push(parseInt(res.data.data[`${id}.2`][index].employee_id));
				//     employees_2.push({value : parseInt(res.data.data[`${id}.2`][index].employee_id),label : res.data.data[`${id}.2`][index].first_name+" "+res.data.data[`${id}.2`][index].last_name})
				//   }

				// }

				// let employees_3 = [];
				// let emplyees_3_sel = [];
				// for (let index = 0; index < res.data.data[`${id}.3`].length; index++) {
				//   if(res.data.data[`${id}.3`][index].employee_id != null)
				//   {
				//     emplyees_3_sel.push(parseInt(res.data.data[`${id}.3`][index].employee_id));
				//     employees_3.push({value : parseInt(res.data.data[`${id}.3`][index].employee_id),label : res.data.data[`${id}.3`][index].first_name+" "+res.data.data[`${id}.3`][index].last_name})
				//   }

				// }

				// this.setState({
				//   employees_1: employees_1,
				//   emplyees_1_sel : emplyees_1_sel,
				//   emplyees_2_sel : emplyees_2_sel,
				//   emplyees_2_sel : emplyees_2_sel,
				//   employees_2: employees_2,
				//   employees_3: employees_3
				// });

				//console.log(this.state);
				callBack();
			})
			.catch((err) => {
				console.log(err);
			});
	}
	getEmployeeList = () => {
		API.get('/api/employees/all')
			.then((res) => {
				var myEmployee = [];
				for (let index = 0; index < res.data.data.length; index++) {
					const element = res.data.data[index];
					myEmployee.push({
						value: element['employee_id'],
						label: htmlDecode(element['first_name'] + '' + element['last_name']),
					});
				}
				this.setState({ employeeList: myEmployee });
			})
			.catch((err) => {
				showErrorMessage(err, this.props);
			});
	};

	modalCloseHandler = () => {
		this.setState({ slaflagId: 0 });
		this.setState({ showModal: false });
	};

	modalShowHandler = (event, id) => {
		event.preventDefault();
		this.setState({ slaflagId: id, isOwnBm: [] });
		this.getIndividualSla(id, () => this.setState({ showModal: true }));
	};

	handleSubmitEvent = (values, actions) => {
		let valuesForm = values.slaMap;

		//  [
		//   {
		//   employees_1: [],
		//   employees_2: [],
		//   employees_3: [],
		//   status_1: "0",
		//   status_2: "1",
		//   status_3: "0"
		//   },
		//   {
		//   employees_1: [89],
		//   employees_2: [],
		//   employees_3: [88, 87],
		//   status_1: "1",
		//   status_2: "0",
		//   status_3: "1"
		//   },
		//   {
		//   employees_1: [],
		//   employees_2: [],
		//   employees_3: [],
		//   status_1: "0",
		//   status_2: "0",
		//   status_3: "0"
		//   },
		//   {
		//   employees_1: [90],
		//   employees_2: [],
		//   employees_3: [],
		//   status_1: "1",
		//   status_2: "0",
		//   status_3: "0"
		//   }

		//   ];
		let status = [];
		let employees = [];
		for (let index = 0; index < valuesForm.length; index++) {
			console.log('loop', valuesForm[index]);

			status.push([
				valuesForm[index].status_1,
				valuesForm[index].status_2,
				valuesForm[index].status_3,
			]);
			// status[index].push(valuesForm.slaMap[index].status_2);
			// status[index].push(valuesForm.slaMap[index].status_3);

			employees.push([
				valuesForm[index].employees_1 === undefined ? [] : valuesForm[index].employees_1,
				valuesForm[index].employees_2 === undefined ? [] : valuesForm[index].employees_2,
				valuesForm[index].employees_3 === undefined ? [] : valuesForm[index].employees_3,
			]);
		}

		const id = this.state.idmaster;
		// this.state.slaDetails[1.1].id;
		API.post(`/api/sla/edit/${id}`, { employees, status })
			.then((res) => {
				this.modalCloseHandler();
				actions.setSubmitting(true);
				swal({
					closeOnClickOutside: false,
					title: 'Success',
					text: 'Record updated successfully.',
					icon: 'success',
				}).then(() => {
					this.getSlaList();
					this.setState({ idmaster: 0 });
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
	};

	onChangeAdminType = (event, index) => {
		// console.log("event",);
		// var name = event.target.name;
		// var lastChar = name[name.length -1];
		// if(lastChar == '1')
		// {
		//   this.setState({:true});
		// }
		// let ind =isOwnBm[index];
		// console.log(ind)
		// if (event.target.value === '1') {
		//   this.setState({isOwnBm[index]:true});
		// }else{
		//   this.setState({isOwnBm0:false});
		//   //this.setState({ selectedRoleList: "", selectedRole: "" });
		// }
	};

	// onChangeAdminType1 = (event) => {
	//   console.log(event.target.value);
	//   if (event.target.value === '1') {
	//     this.setState({isOwnBm1:true});
	//   }else{
	//     this.setState({isOwnBm1:false});
	//     //this.setState({ selectedRoleList: "", selectedRole: "" });
	//   }
	// }

	// onChangeAdminType2 = (event) => {
	//   console.log(event.target.value);
	//   if (event.target.value === '1') {
	//     this.setState({isOwnBm2:true});
	//   }else{
	//     this.setState({isOwnBm2:false});
	//     //this.setState({ selectedRoleList: "", selectedRole: "" });
	//   }
	// }

	// onChangeAdminType3 = (event) => {
	//   console.log(event.target.value);
	//   if (event.target.value === '1') {
	//     this.setState({isOwnBm3:true});
	//   }else{
	//     this.setState({isOwnBm3:false});
	//     //this.setState({ selectedRoleList: "", selectedRole: "" });
	//   }
	// }

	renderShowsTotal = (start, to, total) => {
		return (
			<span className="pageShow">
				Showing {start} to {to}, of {total} records
			</span>
		);
	};

	render() {
		const paginationOptions = {
			page: 1, // which page you want to show as default
			sizePerPageList: [
				{
					text: '20',
					value: 20,
				},
				{
					text: '40',
					value: 40,
				},
				{
					text: 'All',
					value: this.state.slaArr.length > 0 ? this.state.slaArr.length : 1,
				},
			], // you can change the dropdown list for size per page
			sizePerPage: 20, // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 3, // the pagination bar size.
			prePage: 'Prev', // Previous page button text
			nextPage: 'Next', // Next page button text
			firstPage: 'First', // First page button text
			lastPage: 'Last', // Last page button text
			paginationShowsTotal: this.renderShowsTotal, // Accept bool or function
			paginationPosition: 'bottom', // default is bottom, top and both is all available
			// hideSizePerPage: true //> You can hide the dropdown for sizePerPage
			// alwaysShowAllBtns: true // Always show next and previous button
			// withFirstAndLast: false //> Hide the going to First and Last page button
		};

		const { slaDetails, idmaster, status_map } = this.state;
		const newInitialValues = Object.assign(initialValues, {
			name: '',
			slaMap: [
				{
					status_1: status_map != undefined ? status_map[0][0].status.toString() : '',
					employees_1: [],
					status_2: status_map != undefined ? status_map[0][1].status.toString() : '',
					employees_2: [],
					status_3: status_map != undefined ? status_map[0][2].status.toString() : '',
					employees_3: status_map != undefined ? status_map[0][2].employee : [],
					employee_name:
						status_map != undefined && typeof status_map[0][2].employee_name != undefined
							? status_map[0][2].employee_name
							: [],
					name: 'BM',
				},
				{
					status_1: status_map != undefined ? status_map[1][0].status.toString() : '',
					employees_1: [],
					status_2: status_map != undefined ? status_map[1][1].status.toString() : '',
					employees_2: [],
					status_3: status_map != undefined ? status_map[1][2].status.toString() : '',
					employees_3: status_map != undefined ? status_map[1][2].employee : [],
					employee_name:
						status_map != undefined && typeof status_map[1][2].employee_name != undefined
							? status_map[1][2].employee_name
							: [],
					name: 'CSC Technical',
				},
				{
					status_1: status_map != undefined ? status_map[4][0].status.toString() : '',
					employees_1: [],
					status_2: status_map != undefined ? status_map[4][1].status.toString() : '',
					employees_2: [],
					status_3: status_map != undefined ? status_map[4][2].status.toString() : '',
					employees_3: status_map != undefined ? status_map[4][2].employee : [],
					employee_name:
						status_map != undefined && typeof status_map[4][2].employee_name != undefined
							? status_map[4][2].employee_name
							: [],
					name: 'CSC Commercial',
				},
				{
					status_1: status_map != undefined ? status_map[2][0].status.toString() : '',
					employees_1: [],
					status_2: status_map != undefined ? status_map[2][1].status.toString() : '',
					employees_2: [],
					status_3: status_map != undefined ? status_map[2][2].status.toString() : '',
					employees_3: status_map != undefined ? status_map[2][2].employee : [],
					employee_name:
						status_map != undefined && typeof status_map[2][2].employee_name != undefined
							? status_map[2][2].employee_name
							: [],
					name: 'RA',
				},
				{
					status_1: status_map != undefined ? status_map[3][0].status.toString() : '',
					employees_1: [],
					status_2: status_map != undefined ? status_map[3][1].status.toString() : '',
					employees_2: [],
					status_3: status_map != undefined ? status_map[3][2].status.toString() : '',
					employees_3: status_map != undefined ? status_map[3][2].employee : [],
					employee_name:
						status_map != undefined && typeof status_map[3][2].employee_name != undefined
							? status_map[3][2].employee_name
							: [],
					name: 'Others',
				},
			],
			// status_1: this.state.status_1 || +this.state.status_1 === 0 ? this.state.status_1.toString() : '',
			// employees_1 : this.state.emplyees_1_sel,
			// status_2: this.state.status_2 || +this.state.status_2 === 0 ? this.state.status_2.toString() : '',
			// employees_2 : this.state.emplyees_2_sel,
			// status_3: this.state.status_3 || +this.state.status_3 === 0 ? this.state.status_3.toString() : '',
			// employees_3 : this.state.emplyees_3_sel
		});
		console.log('newInitialValues', newInitialValues);
		const validateAdmin = Yup.object().shape({
			/* frontend_sla: Yup.string()
      .required("Please enter SLA")
      .matches(/^([0-9])$/, "Invalid Frontend SLA"),
      backend_sla: Yup.string()
      .required("Please enter SLA")
      .matches(/^([0-9])$/, "Invalid Backend SLA") */
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
										SLA Notification Type
										<small />
									</h1>
								</div>
							</div>
						</section>
						<section className="content">
							<div className="box">
								<div className="box-body">
									<BootstrapTable
										data={this.state.slaArr}
										pagination={true}
										options={paginationOptions}
										striped={true}
										hover={true}
									>
										<TableHeaderColumn isKey dataField="value" dataSort={true}>
											Name
										</TableHeaderColumn>
										{this.state.access.edit === true ? (
											<TableHeaderColumn
												dataField="id"
												dataFormat={actionFormatter(this)}
												dataAlign=""
											>
												Action
											</TableHeaderColumn>
										) : null}
									</BootstrapTable>

									{/* ======= Add/Edit Admin ======== */}

									<Modal
										show={this.state.showModal}
										onHide={() => this.modalCloseHandler()}
										backdrop="static"
									>
										<Formik
											initialValues={newInitialValues}
											validationSchema={validateSlaDetails}
											onSubmit={this.handleSubmitEvent}
										>
											{({
												values,
												errors,
												touched,
												isValid,
												isSubmitting,
												setFieldValue,
												setFieldTouched,
												handleChange,
											}) => {
												{
													console.log('Error', errors, 'validate', validateSlaDetails);
												}

												return (
													<Form>
														<Modal.Header closeButton>
															<Modal.Title>
																{this.state.slaflagId > 0 ? 'Edit' : 'Add'} SLA Notification
															</Modal.Title>
														</Modal.Header>
														<Modal.Body>
															<Row>
																<Col xs={12} sm={12} md={12}>
																	<div className="form-group">
																		<label>{this.state.status_map[1][0].value}</label>
																	</div>
																</Col>
															</Row>
															<FieldArray name="slaMap">
																{/* {({ push, remove }) => ( */}
																<div>
																	{values.slaMap.map((p, index) => {
																		return (
																			<div className="contBox">
																				<Row>
																					<Col xs={12} sm={12} md={12}>
																						<div className="form-group">
																							<label>{values.slaMap[index].name}</label>
																						</div>
																					</Col>
																				</Row>
																				<Row>
																					<Col xs={6} sm={6} md={4}>
																						<div className="form-group">
																							<label>
																								L + 1<span className="impField">*</span>
																							</label>
																							<Field
																								name={`slaMap[${index}].status_1`}
																								component="select"
																								className={`selectArowGray form-control`}
																								autoComplete="off"
																								value={values.slaMap[index].status_1}
																								onChange={(e) => {
																									handleChange(e);
																								}}
																							>
																								<option key="-1" value="">
																									Select
																								</option>
																								{this.state.isOwnBmType.map((status, i) => (
																									<option key={i} value={status.id}>
																										{status.name}
																									</option>
																								))}
																							</Field>
																							{/* {errors && errors.slaMap && typeof errors.slaMap[index].status_1 !== 'undefined' && errors.slaMap[index].length > 0 ? (
                                        <span className="errorMsg">
                                          {errors.slaMap[index].status_1}
                                        </span>
                                      ) : null} */}
																						</div>
																					</Col>
																					<Col xs={6} sm={6} md={4}>
																						<div className="form-group">
																							<label>
																								L + 2<span className="impField">*</span>
																							</label>
																							<Field
																								name={`slaMap[${index}].status_2`}
																								component="select"
																								className={`selectArowGray form-control`}
																								autoComplete="off"
																								value={values.slaMap[index].status_2}
																								onChange={(e) => {
																									handleChange(e);
																								}}
																							>
																								<option key="-1" value="">
																									Select
																								</option>
																								{this.state.isOwnBmType.map((status, i) => (
																									<option key={i} value={status.id}>
																										{status.name}
																									</option>
																								))}
																							</Field>
																							{/* {errors && errors.slaMap && typeof errors.slaMap[index].status_2 !== 'undefined' && errors.slaMap[index].length > 0? (
                                        <span className="errorMsg">
                                          {errors.slaMap[index].status_2}
                                        </span>
                                      ) : null} */}
																						</div>
																					</Col>
																					<Col xs={6} sm={6} md={4}>
																						<div className="form-group">
																							<label>
																								L + 3<span className="impField">*</span>
																							</label>
																							<Field
																								name={`slaMap[${index}].status_3`}
																								component="select"
																								className={`selectArowGray form-control`}
																								autoComplete="off"
																								value={values.slaMap[index].status_3}
																								onChange={(e) => {
																									handleChange(e);
																								}}
																							>
																								<option key="-1" value="">
																									Select
																								</option>
																								{this.state.isOwnBmType.map((status, i) => (
																									<option key={i} value={status.id}>
																										{status.name}
																									</option>
																								))}
																							</Field>
																							{/* {errors && errors.slaMap && typeof errors.slaMap[index].status_3 !== 'undefined' && errors.slaMap[index].length > 0? (
                                          <span className="errorMsg">
                                            {errors.slaMap[index].status_3}
                                          </span>
                                        ) : null} */}
																						</div>
																					</Col>
																				</Row>

																				{/* <Row>                                    
                                  <Col xs={6} sm={6} md={4}>
                                    <div className="form-group">
                                      <label>L + 2
                                        <span className="impField">*</span>
                                      </label>
                                      <Field
                                        name={`slaMap[${index}].status_2`}
                                        component="select"
                                        className={`selectArowGray form-control`}
                                        autoComplete="off"
                                        value={values.slaMap[index].status_2}
                                        onChange={e => { handleChange(e); }}
                                      >
                                        <option key="-1" value="">
                                          Select
                                        </option>
                                        {this.state.isOwnBmType.map(
                                          (status, i) => (
                                            <option key={i} value={status.id}>
                                              {status.name}
                                            </option>
                                          )
                                        )}
                                      </Field>
                                      {errors && errors.slaMap && typeof errors.slaMap[index].status_2 !== 'undefined' && errors.slaMap[index].length > 0? (
                                        <span className="errorMsg">
                                          {errors.slaMap[index].status_2}
                                        </span>
                                      ) : null}
                                    </div>
                                  </Col>
                                  
                                </Row> */}

																				{/* <Row>                                    
                                  <Col xs={6} sm={6} md={3}>
                                    <div className="form-group">
                                      <label>L + 3
                                        <span className="impField">*</span>
                                      </label>
                                      <Field
                                        name={`slaMap[${index}].status_3`}
                                        component="select"
                                        className={`selectArowGray form-control`}
                                        autoComplete="off"
                                        value={values.slaMap[index].status_3}
                                        onChange={e => { handleChange(e); }}
                                      >
                                        <option key="-1" value="">
                                          Select
                                        </option>
                                        {this.state.isOwnBmType.map(
                                          (status, i) => (
                                            <option key={i} value={status.id}>
                                              {status.name}
                                            </option>
                                          )
                                        )}
                                      </Field>
                                        {errors && errors.slaMap && typeof errors.slaMap[index].status_3 !== 'undefined' && errors.slaMap[index].length > 0? (
                                          <span className="errorMsg">
                                            {errors.slaMap[index].status_3}
                                          </span>
                                        ) : null}
                                    </div>
                                  </Col>
                                </Row> */}
																				<Row>
																					<Col xs={6} sm={6} md={12}>
																						<div className="form-group">
																							<label></label>
																							{console.log(
																								this.state.employeeList,
																								'-----------------------'
																							)}
																							<Select
																								isMulti
																								name={`slaMap[${index}].employees_3[]`}
																								options={this.state.employeeList}
																								className="basic-multi-select"
																								classNamePrefix="select"
																								onChange={(evt) =>
																									setFieldValue(
																										`slaMap[${index}].employees_3`,
																										[].slice.call(evt).map((val) => val.value)
																									)
																								}
																								placeholder="Other Employees"
																								onBlur={() =>
																									setFieldTouched(`slaMap[${index}].employees_3`)
																								}
																								defaultValue={
																									typeof slaMap !== undefined > 0
																										? values.slaMap[index].employee_name
																										: []
																								}
																								/* defaultValue={
                                            this.state.selectedCompList
                                          } */
																							/>
																							{/* {errors.employees_3 && touched.employees_3 ? (
                                          <span className="errorMsg">
                                            {errors.employees_3}
                                          </span>
                                        ) : null} */}
																						</div>
																					</Col>
																				</Row>
																				{errors.message ? (
																					<Row>
																						<Col xs={12} sm={12} md={12}>
																							<span className="errorMsg">{errors.message}</span>
																						</Col>
																					</Row>
																				) : null}
																			</div>
																		);
																	})}
																</div>
															</FieldArray>
															{/* <pre>{JSON.stringify(values, null, 2)}</pre>
                          <pre>{JSON.stringify(errors, null, 2)}</pre> */}
														</Modal.Body>
														<Modal.Footer>
															<button
																className={`btn btn-success btn-sm ${
																	isValid ? 'btn-custom-green' : 'btn-disable'
																} m-r-10`}
																type="submit"
																disabled={isValid ? false : true}
															>
																{this.state.slaflagId > 0
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

export default Sla;
