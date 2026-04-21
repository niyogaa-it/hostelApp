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


const actionFormatter = (refObj) => (cell) => {
  //console.log(refObj.state.access)
  return (
    <div className="actionStyle">
      {/* {refObj.state.access.edit === true ? ( */}
      <LinkWithTooltip
        tooltip="Click to Edit"
        href="#"
        clicked={(e) => refObj.modalShowHandler(e, cell)}
        id="tooltip-1"
      >
        <i className="far fa-edit" />
      </LinkWithTooltip>
      {/* ) : null} */}
      {/* {refObj.state.access.delete === true ? ( */}
      <LinkWithTooltip
        tooltip="Click to Delete"
        href="#"
        clicked={(e) => refObj.confirmDelete(e, cell)}
        id="tooltip-1"
      >
        <i className="far fa-trash-alt" />
      </LinkWithTooltip>
      {/* ) : null} */}
    </div>
  );
};


// const custStatus = () => (cell) => {
//   if (cell === 1) {
//     return <div className="text-success">Active</div>;
//   } else {
//     return <div className="text-danger">Inactive</div>;
//   }
// };

// const custContent = () => (cell) => {
//   return htmlDecode(cell);
// };

const initialValues = {
  region_name: "",
  status: "",
};

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

      //////////

      checkroomlist: [],
      roomcount: 0,
    };
  }

  componentDidMount() {
    API.get(`/admin/secure/room/room_list`)
      .then((res) => {
        this.setState({
          checkroomlist: res.data.result_data,
          roomcount: res.data.result_data.length,
        });
      })
      .catch((err) => {
        console.log("err:", err);
        // showErrorMessage(err, this.props);
      });
  }

  getRegionList(page = 1) {
    let region_name = this.state.search_region_name;
    let region_code = this.state.search_region_code;
    let status = this.state.search_status;
    API.get(
      `/api/feed/region_list?page=${page}&region_name=${encodeURIComponent(
        region_name
      )}&region_code=${encodeURIComponent(
        region_code
      )}&status=${encodeURIComponent(status)}`
    )
      .then((res) => {
        this.setState({
          region: res.data.data,
          count: res.data.count_region,
          isLoading: false,
          search_region_name: region_name,
          search_region_code: region_code,
          search_status: status,
        });
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
        showErrorMessage(err, this.props);
      });
    this.setState({
      isLoading: false,
    });
  }


  modalShowHandler = (event, id) => {
    if (id) {
      event.preventDefault();
      API.get(`/api/feed/get_region/${id}`)
        .then((res) => {
          this.setState({
            regionDetails: res.data.data,
            regionflagId: id,
            isLoading: false,
            showModal: true,
          });
        })
        .catch((err) => {
          showErrorMessage(err, this.props);
        });
    } else {
      this.setState({
        regionDetails: [],
        regionflagId: 0,
        showModal: true,
      });
    }
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


  checkHandler = (event) => {
    //console.log("this is event:::",event);
    event.preventDefault();
  };

  render() {
    const { regionDetails } = this.state;
    const newInitialValues = Object.assign(initialValues, {
      region_name: regionDetails.region_name
        ? htmlDecode(regionDetails.region_name)
        : "",
      region_code: regionDetails.region_code
        ? htmlDecode(regionDetails.region_code)
        : "",
      status:
        regionDetails.status || +regionDetails.status === 0
          ? regionDetails.status.toString()
          : "",
    });
    // const validateStopFlag = Yup.object().shape({
    //   region_name: Yup.string()
    //     .min(2, "Region name must be at least 2 characters")
    //     .max(200, "Region name must be at most 200 characters")
    //     .required("Please enter region name"),
    //   region_code: Yup.string()
    //     .max(200, "Region code must be at most 10 characters")
    //     .required("Please enter region code"),
    //   status: Yup.string()
    //     .trim()
    //     .required("Please select status")
    //     .matches(/^[0|1]$/, "Invalid status selected"),
    // });

    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <div className="row">
              <div className="col-lg-12 col-sm-12 col-xs-12">
                <h1>
                  Home / Master Data / Room List
                  <small />
                </h1>
              </div>

            </div>
          </section>
          <section className="content">
            <div className="box">
              <div className="box-body">
                <BootstrapTable data={this.state.checkroomlist}>
                  <TableHeaderColumn
                    isKey
                    dataField="id"
                  // dataFormat={custContent(this)}
                  >
                    Room ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="room_number"
                  // dataFormat={custContent(this)}
                  >
                    Room number
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="building_name">
                    Building name
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="Is_alloted">Is alloted</TableHeaderColumn>
                  <TableHeaderColumn dataField="occupancy">Occupancy</TableHeaderColumn>
                  <TableHeaderColumn dataField="floor">Floor</TableHeaderColumn>
                  <TableHeaderColumn dataField="room_type">Room type</TableHeaderColumn>
                  <TableHeaderColumn dataField="toilet_type">Toilet type</TableHeaderColumn>
                  <TableHeaderColumn dataField="role" dataFormat={actionFormatter(this)}

                  >Actions</TableHeaderColumn>
                </BootstrapTable>

                {/* ======= Add/Edit ======== */}
                {/* <Modal
                    show={this.state.showModal}
                    onHide={() => this.modalCloseHandler()}
                    backdrop="static"
                  >
                    <Formik
                      initialValues={newInitialValues}
                      validationSchema={validateStopFlag}
                      onSubmit={this.handleSubmitEvent}
                    >
                      {({ values, errors, touched, isValid, isSubmitting }) => {
                        return (
                          <Form>
                            {this.state.showModalLoader === true ? (
                              <div className="loading_reddy_outer">
                                <div className="loading_reddy">
                                  <img src={whitelogo} alt="loader" />
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            <Modal.Header closeButton>
                              <Modal.Title>
                                {this.state.regionflagId > 0 ? "Edit" : "Add"}{" "}
                                Region
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="contBox">
                                <Row>
                                  <Col xs={12} sm={12} md={12}>
                                    <div className="form-group">
                                      <label>
                                        Region Name
                                        <span className="impField">*</span>
                                      </label>
                                      <Field
                                        name="region_name"
                                        type="text"
                                        className={`form-control`}
                                        placeholder="Enter name"
                                        autoComplete="off"
                                        value={values.region_name}
                                      />
                                      {errors.region_name &&
                                      touched.region_name ? (
                                        <span className="errorMsg">
                                          {errors.region_name}
                                        </span>
                                      ) : null}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xs={12} sm={12} md={12}>
                                    <div className="form-group">
                                      <label>
                                        Region Code
                                        <span className="impField">*</span>
                                      </label>
                                      <Field
                                        name="region_code"
                                        type="text"
                                        className={`form-control`}
                                        placeholder="Enter code"
                                        autoComplete="off"
                                        value={values.region_code}
                                      />
                                      {errors.region_code &&
                                      touched.region_code ? (
                                        <span className="errorMsg">
                                          {errors.region_code}
                                        </span>
                                      ) : null}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xs={12} sm={12} md={12}>
                                    <div className="form-group">
                                      <label>
                                        Status
                                        <span className="impField">*</span>
                                      </label>
                                      <Field
                                        name="status"
                                        component="select"
                                        className={`selectArowGray form-control`}
                                        autoComplete="off"
                                        value={values.status}
                                      >
                                        <option key="-1" value="">
                                          Select
                                        </option>
                                        {this.state.selectStatus.map(
                                          (status, i) => (
                                            <option key={i} value={status.id}>
                                              {status.name}
                                            </option>
                                          )
                                        )}
                                      </Field>
                                      {errors.status && touched.status ? (
                                        <span className="errorMsg">
                                          {errors.status}
                                        </span>
                                      ) : null}
                                    </div>
                                  </Col>
                                </Row>
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
                  </Modal> */}
              </div>
            </div>
          </section>
        </div>
      </Layout>
    );
    // }
  }
}
export default Region;
