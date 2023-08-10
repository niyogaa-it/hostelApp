import React, { Component } from "react";
import Pagination from "react-js-pagination";
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
import { Breadcrumb } from "react-bootstrap";

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

const actionFormatter = (refObj) => (cell, id) => {
  return (
    <div
      className="actionStyle d-flex"
      style={{
        justifyContent: "center",
      }}
    >
      <Button
        style={{
          border: "none",
          background: "#e7f9df",
          color: "#8cde5e",
          fontWeight: "bold",
          borderRadius: "5px",
        }}
        onClick={() => {
          refObj.statuschange(id.id, id.status);
        }}
      >
        SEEN
      </Button>
    </div>
  );
};

const descriptionlinebreak = (item) => {
  return (
    <>
      <span style={{ whiteSpace: "pre-line" }}>{item}</span>
    </>
  );
};
const custStatus = () => (cell) => {
  if (cell === 1) {
    return (
      <div
        className="d-flex"
        style={{
          justifyContent: "center",
        }}
      >
        <Button
          style={{
            border: "none",
            background: "#ffdfd6",
            color: "#ed7660",
            fontWeight: "bold",
            borderRadius: "5px",
          }}
        >
          REJECT
        </Button>
      </div>
    );
  } else if (cell === 2) {
    return (
      <div
        className="d-flex"
        style={{
          justifyContent: "center",
        }}
      >
        <Button
          style={{
            border: "none",
            background: "#e7f9df",
            color: "#8cde5e",
            fontWeight: "bold",
            borderRadius: "5px",
          }}
        >
          SEEN
        </Button>
      </div>
    );
  } else if (cell === 0) {
    return (
      <div
        className="d-flex"
        style={{
          justifyContent: "center",
        }}
      >
        <Button
          style={{
            border: "none",
            background: "#fff2d7",
            color: "#f1b73c",
            fontWeight: "bold",
            borderRadius: "5px",
          }}
        >
          UNSEEN
        </Button>
      </div>
    );
  }
};

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      get_access_data: false,
      totalCount: 0,
      itemPerPage: 20,
      regionDetails: [],
      regionflagId: 0,
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
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.notification_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/notification/all`)
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

  statuschange = (id, code) => {
    console.log("code:", code);

    let data = {
      id: id,
      status: 2,
    };

    API.post(`/admin/secure/notification/update`, data)
      .then((res) => {
        console.log("res:", res);
        this.componentDidMount();
      })
      .catch((err) => {
        console.log("err:", err);
        // showErrorMessage(err, this.props);
      });
  };

  modalCloseHandler = () => {
    this.setState({ regionflagId: 0 });
    this.setState({ showModal: false });
  };

  confirmDelete = (event, id) => {
    event.preventDefault();
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.deleteRegion(id);
      }
    });
  };

  deleteRegion = (id) => {
    if (id) {
      API.delete(`/api/feed/delete_region/${id}`)
        .then((res) => {
          swal({
            closeOnClickOutside: false,
            title: "Success",
            text: "Record deleted successfully.",
            icon: "success",
          }).then(() => {
            this.setState({ activePage: 1 });
            this.getRegionList(this.state.activePage);
          });
        })
        .catch((err) => {
          if (err.data.status === 3) {
            this.setState({ closeModal: true });
            showErrorMessage(err, this.props);
          }
        });
    }
  };

  downloadXLSX = (e) => {
    e.preventDefault();

    API.get(`/api/feed/region_list/download?page=1`, { responseType: "blob" })
      .then((res) => {
        let url = window.URL.createObjectURL(res.data);
        let a = document.createElement("a");
        a.href = url;
        a.download = "region.xlsx";
        a.click();
      })
      .catch((err) => {
        showErrorMessage(err, this.props);
      });
  };

  checkHandler = (event) => {
    //console.log("this is event:::",event);
    event.preventDefault();
  };

  render() {
    const dateFormatting = () => (date) => {
      return moment(date).format("dddd, DD/MM/YYYY");
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
                  <span style={{ color: "#a5adb7" }}>Home / </span>
                  <span style={{ color: "#556a7d", fontWeight: "bold" }}>
                    Notification
                  </span>
                </h3>
              </div>
            </section>
            <section className="content">
              <div className="box">
                <div className="box-body" style={{ whiteSpace: "pre-line" }}>
                  <BootstrapTable
                    data={this.state.usermangment}
                    search={true}
                    pagination
                    exportCSV
                  >
                    <TableHeaderColumn
                      isKey
                      dataField="id"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      // dataFormat={custContent(this)}
                    >
                      TICKET NO
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="student_id"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      // dataFormat={custContent(this)}
                    >
                      STUDENT ID
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="student_name"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                    >
                      STUDENT NAME
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="title"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                    >
                      TITLE
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="des"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      dataFormat={descriptionlinebreak}
                    >
                      DESCRIPTION
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="created_at"
                      dataFormat={dateFormatting(this)}
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                    >
                      Created at
                    </TableHeaderColumn>
                    {/*    <TableHeaderColumn
                      dataField="status"
                      dataFormat={custStatus(this)}
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                    >
                      STATUS
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="action"
                      dataFormat={actionFormatter(this)}
                      export={false}
                      dataAlign="center"
                      width="150"
                    >
                      ACTION
                    </TableHeaderColumn> */}
                  </BootstrapTable>
                </div>
                <section>
                  <div>
                    <span
                      style={{
                        marginLeft: "15px",
                        marginBottom: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {/* Showing {this.state.userconut} entries */}
                    </span>
                  </div>
                </section>
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

export default withRouter(connect(mapStateToProps)(Notification));
