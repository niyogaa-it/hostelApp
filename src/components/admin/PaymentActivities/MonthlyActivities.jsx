import React, { Component } from "react";
import moment from "moment";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import {
  Row,
  Col,
  ButtonToolbar,
  Button,
  Tooltip,
  OverlayTrigger,
  Modal,
} from "react-bootstrap";
//import { Label } from 'reactstrap';
import { Link } from "react-router-dom";
import swal from "sweetalert";

import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import { showErrorMessage } from "../../../shared/handle_error";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

function LinkWithTooltip({ id, children, href, tooltip, clicked }) {
  return (
    <OverlayTrigger
      overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
      placement="left"
      delayShow={300}
      delayHide={150}
      trigger={["hover"]}
    >
      <Link to={href} onClick={clicked}>
        {children}
      </Link>
    </OverlayTrigger>
  );
}

class Region extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      get_access_data: false,
      activePage: 1,
      totalCount: 0,
      itemPerPage: 20,
      regionDetails: [],
      regionflagId: 0,
      selectStatus: [
        { id: "0", name: "Inactive" },
        { id: "1", name: "Active" },
      ],
      showModal: false,
      search_region_name: "",
      search_region_code: "",
      search_status: "",
      remove_search: false,
      showModalLoader: false,
      studentName: "",
      //////////
      Invalid: false,
      paymentactivity: [],
      paymentactivitycount: 0,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.payment_activities == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(
        `https://api.ranimeyyammaihostel.org/admin/secure/plan/get_all_monthly_plan`
      )
        .then((res) => {
          this.setState({
            paymentactivity: res.data.result,
            paymentactivitycount: res.data.result.length,
          });
          // this.studentData();
        })
        .catch((err) => {
          console.log("err:", err);
          // showErrorMessage(err, this.props);
        });
    } else {
      this.setState({
        Invalid: true,
      });
    }
  }

  render() {
    const paymentStatus = () => (cell) => {
      // console.log("id==================", id);
      return (
        <>
          <div>
            {/* {console.log("paid value", cell)}; */}
            <div>
              {cell == null ? (
                <div style={{ marginTop: "4%" }}>
                  <span
                    style={{
                      padding: "0.5rem",
                      borderRadius: "5px",
                      backgroundColor: "#ffe0db",
                      color: "#ff3e1d",
                      fontWeight: "bold",
                      border: "none",
                    }}
                  >
                    Not Paid
                  </span>
                </div>
              ) : (
                <div style={{ marginTop: "4%" }}>
                  <span
                    style={{
                      padding: "0.5rem",
                      borderRadius: "5px",
                      backgroundColor: "#e8fadf",
                      color: "#71dd37",
                      fontWeight: "bold",
                      border: "none",
                    }}
                  >
                    Paid
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      );
    };

    const dateFormatting = () => (date) => {
      if (date === null) {
        return "Payment Due";
      } else {
        return moment(date).format("DD/MM/YYYY, h:mm:ss a");
      }

      // return (dateFormat(date, "dddd, dd/mm/yyyy"));
    };
    if (this.state.Invalid) return <Redirect to="/admin/dashboard" />;
    else {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section>
              <div className="row">
                <h3 className="col-xs-8" style={{ marginLeft: "15px" }}>
                  <span style={{ color: "#a5adb7" }}>Home / Payment / </span>
                  <span style={{ color: "#556a7d", fontWeight: "bold" }}>
                    Monthly Activity
                  </span>
                </h3>
              </div>
            </section>
            <section className="content">
              <div className="box">
                <div className="box-body">
                  <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                      <li className="tabButtonSec pull-right m-5">
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
                  <BootstrapTable
                    data={this.state.paymentactivity}
                    exportCSV
                    search={true}
                    pagination
                  >
                    <TableHeaderColumn
                      isKey
                      dataField="id"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Student Id
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="SFname"
                      className={"text-uppercase"}
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                    >
                      Student's Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="for_month"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      For Month
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="paid"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                      dataFormat={paymentStatus(this)}
                    >
                      Payment Status
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="paid_on"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                      dataFormat={dateFormatting(this)}
                    >
                      Paid on
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="payment_id"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                      //   dataFormat={dateFormatting(this)}
                    >
                      Payment Id
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="parking_fee"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Parking Fees
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="transportation_fee"
                      dataSort={true}
                      dataAlign="center"
                      width="190"
                      className={"text-uppercase"}
                    >
                      Transportation Fees
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="to_pay"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Total Fees To Pay
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="created_at"
                      dataFormat={dateFormatting(this)}
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Created at
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

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};
export default withRouter(connect(mapStateToProps)(Region));
