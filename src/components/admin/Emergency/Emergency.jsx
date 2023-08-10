import React, { Component } from "react";
import Pagination from "react-js-pagination";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import moment from "moment";
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

const initialValues = {
  comment: "",
};
const validateStopFlag = Yup.object().shape({
  comment: Yup.string().required("Please enter comment"),
});
class Region extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      get_access_data: false,

      showModal: false,

      remove_search: false,
      showModalLoader: false,
      Invalid: false,
      usermangment: [],
      userconut: 0,
      status_id: "",
      emergency_id: 0,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.emergency_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/emergency/all`)
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
  statusreject = (id, code) => {
    let data = {
      id: id,
      status: "0",
    };

    API.post(`/admin/secure/emergency/resolved`, data)
      .then((res) => {
        console.log("res:", res);
        this.componentDidMount();
      })
      .catch((err) => {
        console.log("err:", err);
        // showErrorMessage(err, this.props);
      });
  };
  statusaccept = (id, code) => {
    let data = {
      id: id,
      status: "2",
    };

    API.post(`/admin/secure/emergency/resolved`, data)
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
    this.setState({ showModal: false, emergency_id: 0, status_id: "" });
  };

  handleSubmitEvent = (values, actions) => {
    let data = {
      id: this.state.emergency_id,
      status: this.state.status_id,
      comment: values.comment,
    };
    //  return;
    API.post(`/admin/secure/emergency/resolved`, data)
      .then((res) => {
        console.log("res:", res);

        this.modalCloseHandler();
        swal({
          closeOnClickOutside: false,
          title: "Success",
          text: "Status updated successfully.",
          icon: "success",
        }).then(() => {
          this.componentDidMount();
        });
      })
      .catch((err) => {
        console.log("err:", err);
        // showErrorMessage(err, this.props);
      });
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
    const custStatus = () => (cell) => {
      return (
        <div>
          {cell == "0" ? (
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
              REJECTED
            </span>
          ) : cell == "2" ? (
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
              RESOLVED
            </span>
          ) : (
            <span
              style={{
                padding: "0.5rem",
                borderRadius: "5px",
                backgroundColor: "#fff2d6",
                color: "#ffab00",
                fontWeight: "bold",
                border: "none",
              }}
            >
              PENDING
            </span>
          )}
        </div>
      );
    };
    const actionFormatter = (refObj) => (cell, id) => {
      return (
        <div className="actionStyle">
          {/* {cell == "2" ? ( */}
          <div>
            <Button
              style={{
                padding: "0.5rem",
                borderRadius: "5px",
                backgroundColor: "#e8fadf",
                color: "#71dd37",
                fontWeight: "bold",
                border: "none",
              }}
              onClick={() => {
                // refObj.statusaccept(id.id, id.status);
                this.setState({
                  showModal: true,
                  emergency_id: id.id,
                  status_id: 2,
                });
              }}
              disabled={cell == "2" ? true : false}
            >
              ADDRESSED
            </Button>
            <Button
              style={{
                padding: "0.5rem",
                borderRadius: "5px",
                backgroundColor: "#ffe0db",
                color: "#ff3e1d",
                fontWeight: "bold",
                border: "none",
              }}
              onClick={() => {
                //   refObj.statusreject(id.id, id.status, 3);
                this.setState({
                  showModal: true,
                  emergency_id: id.id,
                  status_id: 0,
                });
              }}
              disabled={cell == "0" ? true : false}
            >
              REJECT
            </Button>
          </div>
        </div>
      );
    };

    const dateFormatting = () => (date) => {
      return moment(date).format("DD/MM/YYYY, h:mm:ss a");
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
                    Emergency List
                  </span>
                </h3>
              </div>
            </section>
            <section className="content">
              <div className="box">
                <div className="box-body">
                  <BootstrapTable
                    data={this.state.usermangment}
                    //  exportCSV
                    search={true}
                    pagination
                  >
                    <TableHeaderColumn
                      isKey
                      dataField="id"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="170"
                      dataAlign="center"
                      // dataFormat={custContent(this)}
                    >
                      Ticket Number
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="student_id"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="170"
                      dataAlign="center"
                      // dataFormat={custContent(this)}
                    >
                      Student Id
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="student_name"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="170"
                      dataAlign="center"
                    >
                      Student Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="issue_category"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="170"
                      dataAlign="center"
                    >
                      Issue Category
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="issue_des"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="220"
                      dataAlign="center"
                    >
                      Issue Description
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="comment"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="220"
                      dataAlign="center"
                    >
                      Comment
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="created_at"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="170"
                      dataAlign="center"
                      dataFormat={dateFormatting(this)}
                    >
                      Created At
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="updated_at"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="170"
                      dataAlign="center"
                      dataFormat={dateFormatting(this)}
                    >
                      Updated At
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="status"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="170"
                      dataAlign="center"
                      dataFormat={custStatus(this)}
                    >
                      Status
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="status"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="170"
                      dataAlign="center"
                      dataFormat={actionFormatter(this, this.a)}
                    >
                      Action
                    </TableHeaderColumn>
                  </BootstrapTable>

                  {/* ======= Add/Edit ======== */}
                  <Modal
                    show={this.state.showModal}
                    onHide={() => this.modalCloseHandler()}
                    backdrop="static"
                  >
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validateStopFlag}
                      onSubmit={this.handleSubmitEvent}
                    >
                      {({ values, errors, touched, isValid, isSubmitting }) => {
                        return (
                          <Form>
                            <Modal.Header closeButton>
                              <Modal.Title>
                                {" "}
                                Add Feedback for{" "}
                                {this.state.status_id == 0
                                  ? "Rejecting"
                                  : "Addressing"}
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="contBox">
                                <Row>
                                  <Col xs={12} sm={12} md={12}>
                                    <div className="form-group">
                                      <label>
                                        Add Comment
                                        <span className="impField">*</span>
                                      </label>
                                      <Field
                                        name="comment"
                                        type="text"
                                        className={`form-control`}
                                        placeholder="Enter comment"
                                        autoComplete="off"
                                        value={values.comment}
                                      />
                                      {errors.comment && touched.comment ? (
                                        <span className="errorMsg">
                                          {errors.comment}
                                        </span>
                                      ) : null}
                                    </div>
                                  </Col>
                                </Row>

                                <Row></Row>
                                {errors.message ? (
                                  <Row>
                                    <Col xs={12} sm={12} md={12}>
                                      <span className="errorMsg">
                                        {errors.message}
                                      </span>
                                    </Col>
                                  </Row>
                                ) : (
                                  ""
                                )}
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <button
                                className={`btn btn-success btn-sm ${
                                  isValid ? "btn-custom-green" : "btn-disable"
                                } mr-2`}
                                type="submit"
                                disabled={isValid ? false : false}
                              >
                                {this.state.regionflagId > 0
                                  ? isSubmitting
                                    ? "Updating..."
                                    : "Update"
                                  : isSubmitting
                                  ? "Submitting..."
                                  : "Submit"}
                              </button>
                              <button
                                onClick={(e) => this.modalCloseHandler()}
                                className={`btn btn-danger btn-sm`}
                                type="button"
                              >
                                Close
                              </button>
                            </Modal.Footer>
                          </Form>
                        );
                      }}
                    </Formik>
                  </Modal>
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
