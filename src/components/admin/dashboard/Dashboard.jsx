import React, { Component } from 'react';
//import { Grid } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Link } from "react-router-dom";
import API from "../../../shared/admin-axios";
import { showErrorMessage } from "../../../shared/handle_error";
import Layout from '../layout/Layout';
import whitelogo from '../../../assets/images/drreddylogo_white.png';

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			subAdminList: [],
			usermangment: [],
			studentList: [],
			emergencyList: [],
			paymentactivity: [],
			userconut: 0,
			Invalid: false,
		};
	}

	state = {
		isLoading: true,
	};

	componentDidMount() {
		this.setState({ isLoading: false });

		API.get(`/admin/secure/sub/admin`)
			.then((res) => {
				this.setState({
					subAdminList: res.data.result_data.slice(0,3),
				});
			})
			.catch((err) => {
				console.log("err:", err);
			});


		API.get(`/admin/secure/leave/all`)
			.then((res) => {
				this.setState({
					usermangment: res.data.result.slice(0,3),
				});
			})
			.catch((err) => {
				console.log("err:", err);
			});

		API.get(`/admin/secure/student`)
			.then((res) => {
				this.setState({
					studentList: res.data.result_data.slice(0,3),
				});
			})
			.catch((err) => {
				console.log("err:", err);
			});

		API.get(`/admin/secure/recharge/payment/all`)
			.then((res) => {
				this.setState({
					paymentactivity: res.data.result.slice(0,3),
				});
			})
			.catch((err) => {
				console.log("err:", err);
			});

		API.get(`/admin/secure/emergency/all`)
			.then((res) => {
				this.setState({
					emergencyList: res.data.result.slice(0,3),
				});
			})
			.catch((err) => {
				console.log("err:", err);
			});

	}

	render() {
		if (this.state.isLoading) {
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
								<h3 className="col-xs-8" style={{ marginLeft: "15px" }}>
									<span style={{ color: "#556a7d", fontWeight: "bold" }}>
										Welcome to Rani Meyyammai Hostel
									</span>
								</h3>
							</div>
						</section>

						<section className="dasboard-content" style={{ padding: "20px" }}>
							<div className="row">
								<div className="col-md-12">
									<h4>Latest Sub Admin List</h4>
									<div
										className="box"
										style={{
											borderRadius: "0.5rem",
											boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
										}}
									>
										<div className="box-body">
											<BootstrapTable
												data={this.state.subAdminList}
											// search
											// pagination
											>
												<TableHeaderColumn
													isKey
													dataField="id"
													dataAlign="center"
													width="150"
												// dataFormat={custContent(this)}
												>
													ID
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="name"
													dataAlign="center"
													width="150"
												// dataFormat={custContent(this)}
												>
													NAME
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="phone_no"
													dataAlign="center"
													width="150"
												>
													PHONE
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="role"
													dataAlign="center"
													// dataFormat={userRole(this)}
													width="150"
												>
													ROLE
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="access"
													dataAlign="center"
													width="400"
													style="overflow: auto !important;"
												>
													PERMISSION
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="status"
													dataAlign="center"
													// dataFormat={custStatus(this)}
													width="150"
												>
													STATUS
												</TableHeaderColumn>
											</BootstrapTable>
											<div style={{ display: 'flex', justifyContent: 'end', marginTop: '15px' }}>
												<Link className="btn btn-primary" to="/admin/subadmin">View All</Link>
											</div>
										</div>
									</div>
								</div>

								<div className="col-md-12">
									<h4>Latest Leave Application List</h4>
									<div
										className="box"
										style={{
											borderRadius: "0.5rem",
											boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
										}}
									>
										<div className="box-body">
											<BootstrapTable
												data={this.state.usermangment}
											// exportCSV
											// search={true}
											// pagination
											>
												<TableHeaderColumn
													isKey
													dataField="id"
													dataSort={true}
													className={"text-uppercase"}
													width="180"
													dataAlign="center"
												>
													Ticket No
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="student_id"
													dataSort={true}
													className={"text-uppercase"}
													width="180"
													dataAlign="center"
												>
													Student ID
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="student_name"
													dataSort={true}
													className={"text-uppercase text-secondary"}
													width="180"
													dataAlign="center"
												>
													Student Name
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="reason"
													dataSort={true}
													className={"text-uppercase"}
													width="190"
													dataAlign="center"
												>
													Leave description
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="from"
													// dataFormat={dateFormatting(this)}
													dataSort={true}
													className={"text-uppercase"}
													width="180"
													dataAlign="center"
												>
													From
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="to"
													// dataFormat={dateFormatting(this)}
													dataSort={true}
													className={"text-uppercase"}
													width="180"
													dataAlign="center"
												>
													To
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="created_at"
													// dataFormat={dateFormatting(this)}
													dataSort={true}
													className={"text-uppercase"}
													width="180"
													dataAlign="center"
												>
													Created At
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="status"
													// dataFormat={activityStatus(this)}
													dataSort={true}
													className={"text-uppercase"}
													width="180"
													dataAlign="center"
												>
													Status
												</TableHeaderColumn>
											</BootstrapTable>
											<div style={{ display: 'flex', justifyContent: 'end', marginTop: '15px' }}>
												<Link className="btn btn-primary" to="/admin/leave_application">View All</Link>
											</div>
										</div>
									</div>
								</div>

								<div className="col-md-12">
									<h4>Latest Registered Student List</h4>
									<div
										className="box"
										style={{
											borderRadius: "0.5rem",
											boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
										}}
									>
										<div className="box-body">
											<BootstrapTable
												data={this.state.studentList}
											// data={
											// 	this.state.filterValue == "approved"
											// 		? this.state.approvedData
											// 		: this.state.filterValue == "not approved"
											// 			? this.state.notapprovedData
											// 			: this.state.filterValue == "rejected"
											// 				? this.state.rejectedData
											// 				: this.state.usermangment
											// }
											// exportCSV
											// csvFileName="Student-details.csv"
											// search={true}
											// pagination={true}
											// options={paginationOptions}
											>
												<TableHeaderColumn
													width="70"
													isKey
													dataField="student_id"
													dataSort={true}
													className={"text-uppercase"}
													dataAlign="center"
													csvHeader="Student ID"
												>
													Id
												</TableHeaderColumn>
												<TableHeaderColumn
													width="150"
													dataField="SFname"
													className={"text-uppercase"}
													dataSort={true}
													dataAlign="center"
													// csvFormat={this.csvFormatterNull}
													csvHeader="Student Name"
												>
													Student's Name
												</TableHeaderColumn>
												<TableHeaderColumn
													width="100"
													dataField="SmobNo"
													dataSort={true}
													className={"text-uppercase"}
													dataAlign="center"
													// csvFormat={this.csvFormatterNull}
													csvHeader="Phone No."
												>
													Phone No
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="building_name"
													dataSort={true}
													className={"text-uppercase"}
													width="100"
													dataAlign="center"
													// csvFormat={this.csvFormatterNull}
													csvHeader="Buliding Name"
												>
													Building Name
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="room_id"
													dataSort={true}
													className={"text-uppercase"}
													width="100"
													dataAlign="center"
													// csvFormat={this.csvFormatterNull}
													csvHeader="Room No."
												>
													Room No.
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="LocGuardName"
													className={"text-uppercase"}
													width="120"
													dataSort={true}
													dataAlign="center"
													// csvFormat={this.csvFormatterNull}
													csvHeader="Gaurdian Name"
												>
													Guardian Name
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="SmobNo"
													className={"text-uppercase"}
													width="100"
													dataSort={true}
													dataAlign="center"
													// csvFormat={this.csvFormatterNull}
													csvHeader="Phone No."
												>
													Phone No
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="food_preference"
													className={"text-uppercase"}
													width="90"
													dataSort={true}
													dataAlign="center"
													// csvFormat={this.csvFormatterNull}
													csvHeader="Food Preference"
												>
													Food Preference
												</TableHeaderColumn>
												<TableHeaderColumn
													// dataFormat={docLabel(this)}
													dataField="docs_name"
													className={"text-uppercase"}
													width="110"
													dataSort={true}
													dataAlign="center"
													// csvFormat={this.csvFormatterNull}
													csvHeader="Document Name"
												>
													Doc Name
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="docs_image"
													className={"text-uppercase"}
													width="110"
													dataSort={true}
													// dataFormat={viewDocs(this)}
													dataAlign="center"
													// csvFormat={this.csvFormatterNull}
													csvHeader="View Document"
												>
													View Docs
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="parking_name"
													className={"text-uppercase"}
													width="90"
													dataSort={true}
													dataAlign="center"
													// csvFormat={this.csvFormatterNull}
													csvHeader="Parking Name"
												>
													Parking Name
												</TableHeaderColumn>

												<TableHeaderColumn
													dataField="parking_id"
													className={"text-uppercase"}
													width="100"
													dataSort={true}
													dataAlign="center"
													// csvFormat={this.csvFormatterNull}
													csvHeader="Parking Slot Id"
												>
													Slot ID of Parking
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="occupancy"
													className={"text-uppercase"}
													width="120"
													dataSort={true}
													dataAlign="center"
													// csvFormat={this.csvFormatterNull}
													csvHeader="Occupancy"
												>
													Occupancy
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="is_approved"
													className={"text-uppercase"}
													width="180"
													dataSort={true}
													// dataFormat={custStatus(this, this.id)}
													dataAlign="center"
													// filter={{
													// 	type: "SelectFilter",
													// 	options: statusType,
													// 	defaultValue: "New",
													// 	delay: 1000,
													// 	placeholder: "Filter by Status",
													// }}
													// csvFormat={this.csvFormatterStatus}
													csvHeader="Status"
												>
													Status
												</TableHeaderColumn>
											</BootstrapTable>
											<div style={{ display: 'flex', justifyContent: 'end', marginTop: '15px' }}>
												<Link className="btn btn-primary" to="/admin/view_student">View All</Link>
											</div>
										</div>
									</div>
								</div>

								<div className="col-md-12">
									<h4>Latest Payment List</h4>
									<div
										className="box"
										style={{
											borderRadius: "0.5rem",
											boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
										}}
									>
										<div className="box-body">
											<BootstrapTable
												data={this.state.paymentactivity}
											// exportCSV
											// search={true}
											// pagination
											>
												<TableHeaderColumn
													isKey
													dataField="id"
													dataSort={true}
													dataAlign="center"
													className={"text-uppercase"}
													width="150"
												>
													Student Id
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="student_name"
													dataSort={true}
													dataAlign="center"
													className={"text-uppercase"}
													width="150"
												>
													Student Name
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="payment_id"
													dataSort={true}
													dataAlign="center"
													className={"text-uppercase"}
													width="150"
												>
													Payment ID
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="amount"
													dataSort={true}
													dataAlign="center"
													className={"text-uppercase"}
													width="150"
												>
													Amount
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="type"
													dataSort={true}
													dataAlign="center"
													className={"text-uppercase"}
													width="150"
												>
													Type
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="created_at"
													// dataFormat={dateFormatting(this)}
													dataSort={true}
													dataAlign="center"
													className={"text-uppercase"}
													width="150"
												>
													Created at
												</TableHeaderColumn>
											</BootstrapTable>
											<div style={{ display: 'flex', justifyContent: 'end', marginTop: '15px' }}>
												<Link className="btn btn-primary" to="/admin/payment_activities">View All</Link>
											</div>
										</div>
									</div>
								</div>

								<div className="col-md-12 mb-5">
									<h4>Latest Emergency List</h4>
									<div
										className="box"
										style={{
											borderRadius: "0.5rem",
											marginBottom: "60px",
											boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
										}}
									>
										<div className="box-body">
											<BootstrapTable
											data={this.state.emergencyList}
											//  exportCSV
											// search={true}
											// pagination
											>
												<TableHeaderColumn
													isKey
													dataField="id"
													className={"text-uppercase"}
													dataSort={true}
													width="170"
													dataAlign="center"
												// dataFormat={custContent(this)}
												>
													Ticket Number
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="student_id"
													className={"text-uppercase"}
													dataSort={true}
													width="170"
													dataAlign="center"
												// dataFormat={custContent(this)}
												>
													Student Id
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="student_name"
													className={"text-uppercase"}
													dataSort={true}
													width="170"
													dataAlign="center"
												>
													Student Name
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="issue_category"
													className={"text-uppercase"}
													dataSort={true}
													width="170"
													dataAlign="center"
												>
													Issue Category
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="issue_des"
													className={"text-uppercase"}
													dataSort={true}
													width="220"
													dataAlign="center"
												>
													Issue Description
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="comment"
													className={"text-uppercase"}
													dataSort={true}
													width="220"
													dataAlign="center"
												>
													Comment
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="created_at"
													className={"text-uppercase"}
													dataSort={true}
													width="170"
													dataAlign="center"
												// dataFormat={dateFormatting(this)}
												>
													Created At
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="updated_at"
													className={"text-uppercase"}
													dataSort={true}
													width="170"
													dataAlign="center"
												// dataFormat={dateFormatting(this)}
												>
													Updated At
												</TableHeaderColumn>
												<TableHeaderColumn
													dataField="status"
													className={"text-uppercase"}
													dataSort={true}
													width="170"
													dataAlign="center"
												// dataFormat={custStatus(this)}
												>
													Status
												</TableHeaderColumn>
											</BootstrapTable>
											<div style={{ display: 'flex', justifyContent: 'end', marginTop: '15px' }}>
												<Link className="btn btn-primary" to="/admin/emergency">View All</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					</div>
				</Layout>
			);
		}
	}
}

export default Dashboard;
