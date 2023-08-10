import React, { Component } from "react";
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
import API from "../../../shared/admin-axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

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
      activePage: 1,
      totalCount: 0,
      itemPerPage: 20,

      regionflagId: 0,
      selectStatus: [
        { id: "0", name: "Inactive" },
        { id: "1", name: "Active" },
      ],
      showModal: false,
      search_region_name: "",
      search_region_code: "",
      search_status: "",
      status_id: "",
      remove_search: false,
      showModalLoader: false,
      Invalid: false,
      usermangment: [],
      userconut: 0,
      help_id: 0,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.help_quieres == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/feedback/all`)
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

  modalCloseHandler = () => {
    this.setState({ showModal: false, help_id: 0, status_id: "" });
  };

  handleSubmitEvent = (values, actions) => {
    let data = {
      id: this.state.help_id,
      status: this.state.status_id,
      comment: values.comment,
    };
    API.post(`/admin/secure/feedback/resolved`, data)
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

  render() {
    const custStatus = () => (cell) => {
      return (
        <div>
          {cell == "1" ? (
            <span
              style={{
                border: "none",
                backgroundColor: "#fff2d6",
                color: "#ffab00",
                fontWeight: "bold",
                borderRadius: "5px",
              }}
            >
              PENDING
            </span>
          ) : (
            <span
              style={{
                border: "none",
                backgroundColor: "#e8fadf",
                color: "#71dd37",
                fontWeight: "bold",
                borderRadius: "5px",
              }}
            >
              ADDRESSED
            </span>
          )}
        </div>
      );
    };
    const actionFormatter = (refObj) => (cell, id) => {
      return (
        <div className="actionStyle">
          <div>
            <Button
              style={{
                border: "none",
                backgroundColor: "#e8fadf",
                color: "#71dd37",
                fontWeight: "bold",
                borderRadius: "5px",
              }}
              onClick={() => {
                this.setState({
                  showModal: true,
                  help_id: id.id,
                  status_id: 0,
                });
              }}
              disabled={cell == "1" ? false : true}
            >
              APPROVE
            </Button>
            <Button
              style={{
                border: "none",
                backgroundColor: "#fff2d6",
                color: "#ffab00",
                fontWeight: "bold",
                borderRadius: "5px",
              }}
              onClick={() => {
                this.setState({
                  showModal: true,
                  help_id: id.id,
                  status_id: 1,
                });
              }}
              disabled={cell == "0" ? false : true}
            >
              REJECT
            </Button>
          </div>
        </div>
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
            <section>
              <div className="row">
                <h3 className="col-xs-8" style={{ marginLeft: "15px" }}>
                  <span style={{ color: "#a5adb7" }}>Home / </span>
                  <span style={{ color: "#556a7d", fontWeight: "bold" }}>
                    Help Queries
                  </span>
                </h3>
              </div>
            </section>
            <section className="content">
              <div className="box">
                <div className="box-body">
                  <BootstrapTable
                    data={this.state.usermangment}
                    // exportCSV
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
                    >
                      Ticket Number
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="student_id"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="170"
                      dataAlign="center"
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
                      dataField="help_category"
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
                      dataField="comment"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="220"
                      dataAlign="center"
                    >
                      Comment
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="status"
                      className={"text-uppercase"}
                      dataSort={true}
                      width="170"
                      dataAlign="center"
                      export={false}
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
                                  ? "Aproving"
                                  : "Rejecting"}
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
