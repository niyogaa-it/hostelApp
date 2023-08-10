import React, { Component } from "react";
import moment from "moment";
import dateFormat from "dateformat";
import Pagination from "react-js-pagination";
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
import { Formik, Field, Form } from "formik";
import swal from "sweetalert";
import * as Yup from "yup";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

class Region extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
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

      //////////
      Invalid: false,
      usermangment: [],
      userconut: 0,
    };
    this.click = this.click.bind(this);
  }

  confirmClick = (event, status, id, action) => {
    event.preventDefault();
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to change this leave status",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.click(status, id, action);
      }
    });
  };

  click(status, id, action) {
    console.log("status>>>", status);
    console.log("id>>>", id);
    console.log("action>>>", action);
    // return;
    this.setState({ isLoading: true });
    if (status === 2) {
      API.post(`/admin/secure/leave/update`, { id: id, status: action })
        .then((response) => {
          this.setState({ data: response.data, isLoading: false });
          this.componentDidMount();
        })
        .catch((err) => {
          this.setState({ data: err, isLoading: false });
        });
    }
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.warden_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/leave/all`)
        .then((res) => {
          this.setState({
            usermangment: res.data.result,
            userconut: res.data.result.length,
          });
        })
        .catch((err) => {
          console.log("err:", err);
        });
    } else {
      this.setState({
        Invalid: true,
      });
    }
  }

  render() {
    const activityStatus = () => (status) => {
      return status === 0 ? (
        <div style={{ marginTop: "4%" }}>
          <span
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#ffe0db",
              color: "#ff3e1d",
              fontWeight: "bold",
            }}
          >
            Rejected
          </span>
        </div>
      ) : status === 1 ? (
        <div style={{ marginTop: "4%" }}>
          <span
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#fff2d6",
              color: "#ffab00",
              fontWeight: "bold",
            }}
          >
            Pending Parent Approval
          </span>
        </div>
      ) : status === 2 ? (
        <div style={{ marginTop: "4%" }}>
          <span
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#fff2d6",
              color: "#ffab00",
              fontWeight: "bold",
            }}
          >
            Guardian Approved
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
            }}
          >
            Approved
          </span>
        </div>
      );
    };
    const statusAction = () => (status, usermangment) => {
      return status === 2 ? (
        <span
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={(e) => this.confirmClick(e, status, usermangment.id, 3)}
            disabled={this.state.isLoading}
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#e8fadf",
              color: "#71dd37",
              border: "none",
              fontWeight: "bold",
            }}
          >
            Approve
          </Button>
          <Button
            onClick={(e) => this.confirmClick(e, status, usermangment.id, 0)}
            disabled={this.state.isLoading}
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#ffe0db",
              color: "#ff3e1d",
              border: "none",
              fontWeight: "bold",
            }}
          >
            Reject
          </Button>
        </span>
      ) : status === 0 ? (
        <span
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            disabled
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#ffe0db",
              color: "#ff3e1d",
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            Rejected
          </Button>
        </span>
      ) : status === 3 ? (
        <div style={{ marginTop: "4%" }}>
          <span
            disabled
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#e8fadf",
              color: "#71dd37",
              fontWeight: "bold",
            }}
          >
            Approved
          </span>
        </div>
      ) : null;
    };

    const dateFormatting = () => (date) => {
      return moment(date).format("DD/MM/YYYY, h:mm:ss a");
    };
    if (this.state.Invalid) return <Redirect to="/admin/dashboard" />;
    else {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section
              className="content-header"
              style={{ padding: "30px 15px 15px 15px" }}
            >
              <div className="row">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <h1 style={{ color: "#a1acb8" }}>
                    Home / Warden /{" "}
                    <b style={{ color: "#566a7f" }}>Leave List</b>
                    <small />
                  </h1>
                </div>
              </div>
            </section>
            <section className="content">
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
                    exportCSV
                    search={true}
                    pagination
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
                      dataFormat={dateFormatting(this)}
                      dataSort={true}
                      className={"text-uppercase"}
                      width="180"
                      dataAlign="center"
                    >
                      From
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="to"
                      dataFormat={dateFormatting(this)}
                      dataSort={true}
                      className={"text-uppercase"}
                      width="180"
                      dataAlign="center"
                    >
                      To
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="created_at"
                      dataFormat={dateFormatting(this)}
                      dataSort={true}
                      className={"text-uppercase"}
                      width="180"
                      dataAlign="center"
                    >
                      Created At
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="status"
                      dataFormat={activityStatus(this)}
                      dataSort={true}
                      className={"text-uppercase"}
                      width="180"
                      dataAlign="center"
                    >
                      Status
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="status"
                      dataFormat={statusAction(this)}
                      dataSort={true}
                      className={"text-uppercase"}
                      width="180"
                      dataAlign="center"
                    >
                      Action
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
