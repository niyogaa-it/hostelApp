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
import { showErrorMessage } from "../../../shared/handle_error";
import { htmlDecode } from "../../../shared/helper";
import { getSuperAdmin, getAdminGroup } from "../../../shared/helper";
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

const actionFormatter = (refObj) => (cell, row) => {
  return (
    <div className="actionStyle">
      <div
        className="d-flex"
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: "4%",
        }}
      >
        <button
        onClick={(e) => refObj.handleEditAdmin(e, row.user_id)}
        style={{
          padding: "0.5rem",
          borderRadius: "5px",
          backgroundColor: "#d7f5fc",
          color: "#883495",
          fontWeight: "bold",
          border: "none",
          margin: "3%"
        }}
        >
          EDIT
        </button>
      </div>
      {row.status == 0 && row.role != "admin" ? (
        <div
          className="d-flex"
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "4%",
          }}
        >
          <Button
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#e8fadf",
              color: "#71dd37",
              fontWeight: "bold",
              border: "none",
              float: "center",
            }}
            onClick={(e) => {
              refObj.statusChangeSwal(e, row.user_id, 1);
            }}
          >
            ACTIVATE
          </Button>
        </div>
      ) : null}

      {row.status == 1 && row.role != "admin" ? (
        <div
          className="d-flex"
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "4%",
          }}
        >
          <Button
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#ffe0db",
              color: "#ff3e1d",
              fontWeight: "bold",
              border: "none",
              align: "center",
            }}
            onClick={(e) => {
              refObj.statusChangeSwal(e, row.user_id, 0);
            }}
          >
            DEACTIVATE
          </Button>
        </div>
      ) : null}

      {row.role == "admin" ? (
        <div
          className="d-flex"
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "4%",
          }}
        >
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
            ADMIN
          </span>
        </div>
      ) : null}
    </div>
  );
};

const custStatus = (refObj) => (cell, row) => {
  return (
    <>
      {" "}
      {cell == 1 ? (
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
            Active
          </span>
        </div>
      ) : (
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
            INACTIVE
          </span>
        </div>
      )}
    </>
  );
};

const userRole = () => (role) => {
  if (role !== "") {
    return (
      <div style={{ marginTop: "4%" }}>
        <span
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            backgroundColor: "#e8fadf",
            fontWeight: "bold",
            color: "#71dd37",
          }}
        >
          {role.toUpperCase()}
        </span>
      </div>
    );
  } else {
    return null;
  }
};

class Region extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      subAdminList: [],
      userconut: 0,
      Invalid: false,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.room_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/sub/admin`)
        .then((res) => {
          this.setState({
            subAdminList: res.data.result_data,
            userconut: res.data.result_data.length,
          });
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

  statusChangeSwal = (event, id, status) => {
    event.preventDefault();
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to change this sub admin status?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.statusChange(id, status);
      }
    });
  };

  handleEditAdmin = (event, id) => {
    console.log("id:", id);
    window.location.href = `/admin/subadmin/edit/${id}`;
  };

  statusChange = (id, status) => {
    if (id) {
      API.post(`/admin/secure/sub/admin/status/`, {
        id: id,
        status: status,
      })
        .then((res) => {
          if (res.data.status == 200) {
            swal({
              closeOnClickOutside: false,
              title: "Success",
              text: "Status updated successfully.",
              icon: "success",
            }).then(() => {
              this.componentDidMount();
            });
          }
        })
        .catch((err) => {
          showErrorMessage(err, this.props);
        });
    }
  };

  render() {
    const columnHover = (cell, row, enumObject, rowIndex) => {
      return cell
    }

    if (this.state.Invalid) return <Redirect to="/admin/dashboard" />;
    else {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section className="content-header">
              <div className="row">
                <h3 className="col-xs-8" style={{ marginLeft: "15px" }}>
                  <span style={{ color: "#a5adb7" }}>
                    Home / User Management /{" "}
                  </span>
                  <span style={{ color: "#556a7d", fontWeight: "bold" }}>
                    Sub Admin list
                  </span>
                </h3>
              </div>
            </section>
            <section className="content">
              <div className="box">
                <div className="box-body">
                  <BootstrapTable
                    data={this.state.subAdminList}
                    search
                    pagination
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
                      dataField="email"
                      dataAlign="center"
                      width="150"
                      columnTitle={columnHover}
                    >
                      EMAIL
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
                      dataFormat={userRole(this)}
                      width="150"
                    >
                      ROLE
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="access"
                      dataAlign="center"
                      width="150"
                    >
                      PERMISSION
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="status"
                      dataAlign="center"
                      dataFormat={custStatus(this)}
                      width="150"
                    >
                      STATUS
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="role"
                      dataAlign="center"
                      dataFormat={actionFormatter(this)}
                      width="150"
                    >
                      ACTION
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
