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
import ReactHtmlParser from 'react-html-parser';

class ErrLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
		};
	}

	componentDidMount() {
		this.setState({ isLoading: false });
	}

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
										Error Log Details
										<small />
									</h1>
								</div>
								<div className="col-lg-3 col-sm-6 col-xs-12">
									<button
										type="button"
										className="btn btn-warning btn-sm btn-custom-green pull-right"
										onClick={(e) =>
											this.props.history.push({
												pathname: `/admin/error_log`,
											})
										}
									>
										<i className="fas fa-back m-r-5" /> Back
									</button>
								</div>
							</div>
						</section>
						<section className="content">
							<div className="box">
								<div className="box-body">
									{ReactHtmlParser(
										this.props.location.state.details.replace(/(\r\n|\n|\r)/gm, '<br/>')
									)}
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
