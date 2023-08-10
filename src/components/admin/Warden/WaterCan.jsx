import React, { Component } from "react";
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
      Invalid: false,
      usermangment: [],
      userconut: 0,
    };
    this.click = this.click.bind(this);
  }

  click(status, id, action) {
    this.setState({ isLoading: true });
    if (status === "1") {
      API.post(`/admin/secure/water/delivered`, { id: id, status: action })
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
      API.get(`/admin/secure/water/can/all`)
        .then((res) => {
          this.setState({
            usermangment: res.data.result,
            userconut: res.data.result.length,
          });
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
    const statusFormat = () => (status) => {
      return status === "1" ? (
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
      ) : status === "2" ? (
        <span
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            backgroundColor: "#e8fadf",
            color: "#71dd37",
            fontWeight: "bold",
          }}
        >
          Delivered
        </span>
      ) : (
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
      );
    };
    const actionFormat = () => (status, usermangment) => {
      return status === "1" ? (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            onClick={() => this.click(status, usermangment.id, 2)}
            disabled={this.state.isLoading}
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#e8fadf",
              color: "#71dd37",
              border: "none",
            }}
          >
            Deliver
          </Button>
          <Button
            onClick={() => this.click(status, usermangment.id, 0)}
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
        </div>
      ) : status === "2" ? (
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
              backgroundColor: "#e8fadf",
              color: "#71dd37",
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            Delivered
          </Button>
        </span>
      ) : (
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
      );
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
                    <b style={{ color: "#566a7f" }}>Water Can List</b>
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
                      dataSort
                      className={"text-uppercase"}
                      width="120"
                      dataAlign="center"
                      dataField="id"
                    >
                      Token no
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataSort
                      className={"text-uppercase"}
                      width="120"
                      dataAlign="center"
                      dataField="student_id"
                    >
                      Student ID
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataSort
                      className={"text-uppercase"}
                      width="120"
                      dataAlign="center"
                      dataField="student_name"
                    >
                      Student Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataSort
                      className={"text-uppercase"}
                      width="120"
                      dataAlign="center"
                      dataField="room_id"
                    >
                      Room ID
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataSort
                      className={"text-uppercase"}
                      width="120"
                      dataAlign="center"
                      dataField="status"
                      dataFormat={statusFormat(this)}
                    >
                      Status
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataSort
                      className={"text-uppercase"}
                      width="120"
                      dataAlign="center"
                      dataField="status"
                      dataFormat={actionFormat(this)}
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
