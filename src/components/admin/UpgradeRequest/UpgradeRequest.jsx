import React, { Component } from "react";
import moment from "moment";
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
      // isLoading: true,
      data: "",
      isLoading: false,
      get_access_data: false,
      activePage: 1,
      totalCount: 0,
      itemPerPage: 20,
      selectStatus: [
        { id: "0", name: "Inactive" },
        { id: "1", name: "Active" },
      ],
      showModal: false,
      search_status: "",
      remove_search: false,
      showModalLoader: false,
      Invalid: false,
      usermangment: [],
      userconut: 0,
    };
    this.click = this.click.bind(this);
  }

  click(status, id) {
    this.setState({ isLoading: true });
    if (status === 2) {
      API.post(`/admin/secure/upgrade/`, { id: id, status: 0 })
        .then((response) => {
          this.setState({ data: response.data, isLoading: false });
          this.componentDidMount();
        })
        .catch((err) => {
          this.setState({ data: err, isLoading: false });
        });
    } else {
      API.post(`/admin/secure/upgrade/`, { id: id, status: 2 })
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
      this.props.auth.userToken.permissions.update_meal == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/upgrade/all`)
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
      ) : status === 2 ? (
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
      ) : (
        <span
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            backgroundColor: "#fff2d6",
            color: "#ffab00",
            fontWeight: "bold",
          }}
        >
          Pending
        </span>
      );
    };
    const statusAction = () => (status, usermangment) => {
      return status === 2 ? (
        <Button
          onClick={() => this.click(status, usermangment.id)}
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
      ) : (
        <Button
          onClick={() => this.click(status, usermangment.id)}
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
      );
    };

    const dateFormatting = () => (date) => {
      return moment(date).format("dddd, DD/MM/YYYY");
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
                    Home / <b style={{ color: "#566a7f" }}>Upgrade Request</b>
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
                      className={"text-uppercase"}
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                    >
                      Id
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="student_id"
                      dataSort={true}
                      dataAlign="center"
                      className={"text-uppercase"}
                      width="150"
                    >
                      Student ID
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
                      dataField="request_type"
                      dataSort={true}
                      dataAlign="center"
                      className={"text-uppercase"}
                      width="150"
                    >
                      Request Type
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="request_value"
                      dataSort={true}
                      dataAlign="center"
                      className={"text-uppercase"}
                      width="150"
                    >
                      Request Value
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="status"
                      dataSort={true}
                      dataAlign="center"
                      className={"text-uppercase"}
                      width="150"
                      dataFormat={activityStatus(this)}
                    >
                      Status
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="status"
                      dataSort={true}
                      dataAlign="center"
                      className={"text-uppercase"}
                      width="150"
                      dataFormat={statusAction(this)}
                    >
                      Action
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="created_at"
                      dataFormat={dateFormatting(this)}
                      dataSort={true}
                      dataAlign="center"
                      className={"text-uppercase"}
                      width="150"
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
