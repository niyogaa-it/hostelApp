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

const PlanFilter = {
  OneTime: "One Time",
  MealChange: "Meal Change",
  RoomChange: "Room Change",
  TermChange: "Term Change",
};
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
      paymenthistory: [],
      paymenthistorycount: 0,
      Invalid: false,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.payment_activities == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(
        `https://api.ranimeyyammaihostel.org/admin/secure/plan/get_all_plan_history`
      )
        .then((res) => {
          this.setState({
            paymenthistory: res.data.result,
            paymenthistorycount: res.data.result.length,
          });
          // this.studentData();
        })
        .catch((err) => {
          console.log("err:", err);
          showErrorMessage(err, this.props);
        });
    } else {
      this.setState({
        Invalid: true,
      });
    }
  }
  csvFormatterNull(cell) {
    return cell == null ? "" : cell;
  }
  csvDateFormatter(cell) {
    if (cell === null) {
      return "Payment Due";
    } else {
      return moment(cell).format("DD/MM/YYYY, h:mm:ss a");
    }
  }
  csvFormatterPlan(cell) {
    return cell == "OneTime"
      ? "One Time"
      : // `${row}`
      cell == "RoomChange"
      ? "Room Change"
      : cell == "Term Change"
      ? "Term Change"
      : cell == "Meal Change"
      ? "Meal Change"
      : "";
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
    const planFormat = () => (cell) => {
      return (
        <>
          <div className="actionStyle text-center">
            {cell == "OneTime" ? (
              <p className="text-center">One Time</p>
            ) : cell == "MealChange" ? (
              <p className="text-center">Meal Change</p>
            ) : cell == "RoomChange" ? (
              <p className="text-center">Room Change</p>
            ) : cell == "TermChange" ? (
              <p className="text-center">Term change</p>
            ) : null}
          </div>
        </>
      );
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
                  Payment History
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
                  data={this.state.paymenthistory}
                  exportCSV
                  search={true}
                  pagination
                  csvFileName="payment-history.csv"
                >
                  <TableHeaderColumn
                    isKey
                    dataField="plan_id"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Plan ID"
                  >
                    Plan Id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="id"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="100"
                    className={"text-uppercase"}
                    csvHeader="Student ID"
                  >
                    Student Id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="SFname"
                    csvFormat={this.csvFormatterNull}
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                    width="100"
                    csvHeader="Student Name"
                  >
                    Student's Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="plan_type"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="100"
                    className={"text-uppercase"}
                    dataFormat={planFormat(this, this.id)}
                    filter={{
                      type: "SelectFilter",
                      options: PlanFilter,
                      defaultValue: "New",
                      delay: 1000,
                      placeholder: "Filter",
                    }}
                    csvHeader="Plan Type"
                  >
                    Plan Type
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="paid"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    dataFormat={paymentStatus(this)}
                    csvHeader="Payment Status"
                  >
                    Payment Status
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="paid_on"
                    dataSort={true}
                    dataAlign="center"
                    width="90"
                    className={"text-uppercase"}
                    dataFormat={dateFormatting(this)}
                    csvFormat={this.csvDateFormatter}
                    csvHeader="Paid on"
                  >
                    Paid on
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="meal_type"
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Meal Type"
                    csvFormat={this.csvFormatterNull}
                  >
                    Meal Type
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="meal"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Meal Fees"
                  >
                    Meal
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="addmission_fee"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Admission fees"
                  >
                    Admission Fees
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="admisson_kit"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Admission Kit"
                  >
                    Admission Kit
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="caution_deposit"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Caution Deposit"
                  >
                    Caution Deposit
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="cultural_fees"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Cultural Fees"
                  >
                    Cultural Fees
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="parking"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Parking Fees"
                  >
                    Parking Fees
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="laundry"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Laundry Fees"
                  >
                    Laundry
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="transportation"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Transportation Fees"
                  >
                    Transportation Fees
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="monthly_other_fees"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Other Fees"
                  >
                    Other Fees
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="room_rent"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Room Rent"
                  >
                    Room Rent
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="total"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Total Fees"
                  >
                    Total Fees
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="to_pay"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="To Pay"
                  >
                    To Pay
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="created_at"
                    csvFormat={this.csvDateFormatter}
                    dataFormat={dateFormatting(this)}
                    dataSort={true}
                    dataAlign="center"
                    width="150"
                    className={"text-uppercase"}
                    csvHeader="Created at"
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
