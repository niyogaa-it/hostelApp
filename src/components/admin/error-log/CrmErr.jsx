import React, { Component } from 'react';
import Pagination from 'react-js-pagination';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';

import { Link } from 'react-router-dom';

import Layout from '../layout/Layout';
import whitelogo from '../../../assets/images/drreddylogo_white.png';
import API from '../../../shared/admin-axios';
import { showErrorMessage } from '../../../shared/handle_error';
import { htmlDecode } from '../../../shared/helper';
import { getSuperAdmin, getAdminGroup } from '../../../shared/helper';

const custColumn = (refObj) => (cell) => {
	return "<textarea style='width: 385px; height: 150px;'>" + htmlDecode(cell) + '</textarea>';
};

class CrmErr extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			activePage: 1,
			totalCount: 0,
			itemPerPage: 20,
			get_access_data: false,
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
			this.getCrmErrList();
		} else {
			const adminGroup = getAdminGroup(localStorage.admin_token);
			API.get(`/api/adm_group/single_access/${adminGroup}/${'CRM_ERRLOG_MANAGEMENT'}`)
				.then((res) => {
					this.setState({
						access: res.data.data,
						get_access_data: true,
					});

					if (res.data.data.view === true) {
						this.getCrmErrList();
					} else {
						this.props.history.push('/admin/dashboard');
					}
				})
				.catch((err) => {
					showErrorMessage(err, this.props);
				});
		}
	}

	getCrmErrList(page = 1) {
		API.get(`/api/feed/crm_err?page=${page}`)
			.then((res) => {
				this.setState({
					crm_err: res.data.data,
					count: res.data.count_crm_err,
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
		this.getCrmErrList(pageNumber > 0 ? pageNumber : 1);
	};

	render() {
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
										Crm Error Log
										<small />
									</h1>
								</div>
							</div>
						</section>
						<section className="content">
							<div className="box">
								<div className="box-body">
									<BootstrapTable data={this.state.crm_err}>
										<TableHeaderColumn isKey dataField="request" dataFormat={custColumn(this)}>
											Request
										</TableHeaderColumn>
										<TableHeaderColumn dataField="response" dataFormat={custColumn(this)}>
											Response
										</TableHeaderColumn>
										<TableHeaderColumn dataField="type" width={'8%'}>
											Direction
										</TableHeaderColumn>
										<TableHeaderColumn dataField="display_add_date" width={'15%'}>
											Date Added
										</TableHeaderColumn>
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
								</div>
							</div>
						</section>
					</div>
				</Layout>
			);
		}
	}
}
export default CrmErr;
