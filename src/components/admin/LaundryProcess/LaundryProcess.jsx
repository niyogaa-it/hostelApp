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
import whitelogo from "../../../assets/images/drreddylogo_white.png";
import API from "../../../shared/admin-axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Cloth from "./Cloth";

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
      Invalid: false,
      cloths: [],
      edit: false,
    };
    this.click = this.click.bind(this);
  }

  click(status, id, action) {
    this.setState({ isLoading: true });
    API.post(`/admin/secure/laundry/update`, { id: id, status: action })
      .then((response) => {
        this.setState({ data: response.data, isLoading: false });
        this.componentDidMount();
      })
      .catch((err) => {
        this.setState({ data: err, isLoading: false });
      });
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.laundary_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/laundry/all`)
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
  handleClose = () => {
    this.setState({
      edit: false,
    });
  };
  render() {
    const statusFormat = () => (status) => {
      return status === "1" ? (
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
            Pending
          </span>
        </div>
      ) : status === "2" ? (
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
            Accepted
          </span>
        </div>
      ) : status === "3" ? (
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
            Laundry Done
          </span>
        </div>
      ) : status === "4" ? (
        <div style={{ marginTop: "4%" }}>
          <span
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#e7e7ff ",
              color: "#883495",
              fontWeight: "bold",
            }}
          >
            Dispatched
          </span>
        </div>
      ) : status === "5" ? (
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
            Delivered
          </span>
        </div>
      ) : (
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
            Unknown
          </span>
        </div>
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
              fontWeight: "bold",
            }}
          >
            Accept
          </Button>
        </div>
      ) : status === "1" ? (
        <span
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => {
              this.setState({
                edit: true,
                cloths: JSON.parse(usermangment.cloths_json),
              });
              // console.log("Row of action", cloths);
            }}
            style={{
              color: "blue",
              display: "flex",
              fontWeight: "bold",
            }}
          >
            View
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
            onClick={() => this.click(status, usermangment.id, 3)}
            disabled={this.state.isLoading || status === "3"}
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#fff2d6",
              color: "#ffab00",
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            Laundry Done
          </Button>
          <Button
            onClick={() => {
              this.setState({
                edit: true,
                cloths: JSON.parse(usermangment.cloths_json),
              });
              // console.log("Row of action", cloths);
            }}
            style={{
              color: "blue",
              display: "flex",
              fontWeight: "bold",
            }}
          >
            View
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
                    Home /{" "}
                    <b style={{ color: "#566a7f" }}>Laundry Process List</b>
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
                      dataSort={true}
                      className={"text-uppercase"}
                      dataField="laundry_token"
                      width="120"
                      dataAlign="center"
                    >
                      Token No
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataSort={true}
                      className={"text-uppercase"}
                      dataField="student_id"
                      width="120"
                      dataAlign="center"
                    >
                      Student ID
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataSort={true}
                      className={"text-uppercase"}
                      dataField="student_name"
                      width="120"
                      dataAlign="center"
                    >
                      Student Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataSort={true}
                      className={"text-uppercase"}
                      dataField="floor"
                      width="120"
                      dataAlign="center"
                    >
                      Room ID
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataSort={true}
                      className={"text-uppercase"}
                      dataField="no_cloth"
                      width="120"
                      dataAlign="center"
                    >
                      No. of Cloth
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataSort={true}
                      className={"text-uppercase"}
                      dataField="status"
                      dataFormat={statusFormat(this)}
                      width="120"
                      dataAlign="center"
                    >
                      Status
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataSort={true}
                      className={"text-uppercase"}
                      dataField="status"
                      dataFormat={actionFormat(this)}
                      width="250"
                      dataAlign="center"
                    >
                      Action
                    </TableHeaderColumn>
                  </BootstrapTable>
                </div>
              </div>
            </section>
          </div>
          <Cloth
            cloths={this.state.cloths}
            edit={this.state.edit}
            handleClose={this.handleClose}
          />
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
