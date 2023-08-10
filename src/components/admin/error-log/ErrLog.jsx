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

const custStatus = () => (cell) => {
	return cell === 1 ? 'Open' : 'Closed';
};

const custContentCreate = () => (cell, row) => {
	let cre_name = `${htmlDecode(row.created_by_f_name)} ${htmlDecode(row.created_by_l_name)} (${
		row.created_by_emp_desig_name
	})`;
	return cre_name;
};

const custContentClosed = () => (cell, row) => {
	let clo_name = '-';
	if (row.closed_by_id > 0) {
		clo_name = `${htmlDecode(row.closed_by_f_name)} ${htmlDecode(row.closed_by_l_name)} (${
			row.closed_by_emp_desig_name
		})`;
	}
	return clo_name;
};

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

const tooltipDescription = (refObj) => (cell, row) => {
	return (
		<LinkWithTooltip
			tooltip={`${cell}`}
			href="#"
			id="tooltip-1"
			clicked={(e) => {
				e.preventDefault();
				refObj.getFileContent(row.fileName);
			}}
		>
			{cell}
		</LinkWithTooltip>
	);
};

class ErrLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			activePage: 1,
			totalCount: 0,
			itemPerPage: 20,

			search_name: '',
			remove_search: false,
			get_access_data: false,
		};
	}

	componentDidMount() {
		//this.getPausedSlaList();
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
			this.getPausedSlaList();
		} else {
			const adminGroup = getAdminGroup(localStorage.admin_token);
			API.get(`/api/adm_group/single_access/${adminGroup}/${'ERRLOG_MANAGEMENT'}`)
				.then((res) => {
					this.setState({
						access: res.data.data,
						get_access_data: true,
					});

					if (res.data.data.view === true) {
						this.getPausedSlaList();
					} else {
						this.props.history.push('/admin/dashboard');
					}
				})
				.catch((err) => {
					showErrorMessage(err, this.props);
				});
		}
	}

	getPausedSlaList(page = 1) {
		API.get(`/api/feed/error_log?page=${page}`)
			.then((res) => {
				this.setState({
					error_log: res.data.data,
					count: res.data.count_error_log,
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
		this.getPausedSlaList(pageNumber > 0 ? pageNumber : 1);
	};

	slaSearch = (e) => {
		e.preventDefault();

		var task_reference = document.getElementById('task_reference').value;

		if (task_reference === '') {
			return false;
		}

		API.get(`/api/feed/error_log?page=1`)
			.then((res) => {
				this.setState({
					error_log: res.data.data,
					count: res.data.count_error_log,
					isLoading: false,
					search_name: task_reference,
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
		document.getElementById('task_reference').value = '';

		this.setState(
			{
				search_name: '',
				remove_search: false,
			},
			() => {
				this.getPausedSlaList();
				this.setState({ activePage: 1 });
			}
		);
	};

	getFileContent = (fileName) => {
		API.get(`/api/feed/error_log/${fileName}`)
			.then((res) => {
				this.props.history.push({
					pathname: `/admin/error_log_details`,
					state: { details: res.data.data },
				});

				console.log('res', res.data.data);
			})
			.catch((err) => {
				this.setState({
					isLoading: false,
				});
				showErrorMessage(err, this.props);
			});
	};

	render() {
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
				<Layout {...this.props}>
					<div className="content-wrapper">
						<section className="content-header">
							<div className="row">
								<div className="col-lg-9 col-sm-6 col-xs-12">
									<h1>
										Site Error Log
										<small />
									</h1>
								</div>
								{/* <div className="col-lg-12 col-sm-12 col-xs-12 topSearchSection">
                  <form className="form">
                    <div className="">
                      <input
                        className="form-control"
                        name="task_reference"
                        id="task_reference"
                        placeholder="Task reference"
                      />
                    </div>

                    <div className="">
                      <input
                        type="submit"
                        value="Search"
                        className="btn btn-warning btn-sm"
                        onClick={(e) => this.slaSearch(e)}
                      />
                      {this.state.remove_search ? <a onClick={() => this.clearSearch()} className="btn btn-danger btn-sm"> Remove </a> : null}
                    </div>
                  </form>
                </div> */}
							</div>
						</section>
						<section className="content">
							<div className="box">
								<div className="box-body">
									<BootstrapTable data={this.state.error_log}>
										<TableHeaderColumn isKey dataField="name" dataFormat={tooltipDescription(this)}>
											Generated Files
										</TableHeaderColumn>
									</BootstrapTable>
								</div>
							</div>
						</section>
					</div>
				</Layout>
			);
		}
	}
}
export default ErrLog;
