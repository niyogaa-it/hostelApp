import React, { Component } from "react";
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
import { Link } from "react-router-dom";
import swal from "sweetalert";
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
const initialValues = {
  region_name: "",
  status: "",
};

const viewDocs = (refObj) => (cell, row) => {
  return (
    <>
      {" "}
      {row.docs_image && (
        <div
          style={{
            width: "100px",
            height: "100px",
            overflow: "hidden",
          }}
        >
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="button-tooltip-2">Click to view this image</Tooltip>
            }
          >
            <img
              src={cell}
              alt="Doc Image"
              width="100%"
              onClick={(e) => refObj.imageModalShowHandler(row.docs_image)}
            ></img>
          </OverlayTrigger>
        </div>
      )}
    </>
  );
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
      thumbNailModal: false,
      usermangment: [],
      userconut: 0,
      show: false,
      url: "",
    };
  }

  componentDidMount() {
    API.get(`/admin/secure/student`)
      .then((res) => {
        this.setState({
          usermangment: res.data.result_data,
          userconut: res.data.result_data.length,
        });
      })
      .catch((err) => {
        console.log("err:", err);
        // showErrorMessage(err, this.props);
      });
  }

  statusdeactive = (id, code) => {
    let data = {
      id: id,
      status: "3",
    };

    API.get(`/admin/secure/create/student/deactivate/${id}`, data)
      .then((res) => {
        console.log("res:", res);
        this.componentDidMount();
      })
      .catch((err) => {
        console.log("err:", err);
        // showErrorMessage(err, this.props);
      });
  };
  deactivateAlert = (id, code) => {
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "Once deactivated,it will not be activate then!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      console.log("willDelete:", willDelete);
      if (willDelete) {
        this.statusdeactive(id, code);
      }
    });
  };

  downloadApplicationForm = (id) => {
    window.open(
      `${process.env.REACT_APP_API_URL}/admin/un/secure/create/profile/download_application_form/${id}`,
      "_blank"
    );
  };

  checkHandler = (event) => {
    event.preventDefault();
  };
  handleSetPlan = (id) => {
    console.log("id:", id);
    window.location.href = `/admin/set_plan/${id}`;
  };
  // handleSetPlan = (id) => {
  //   console.log("id:", id);
  //   window.location.href = `/admin/set_plan/${id}`;
  // };
  handleViewPlan = (id) => {
    console.log("id:", id);
    window.location.href = `/admin/view_plan/${id}`;
  };
  handleEditPlan = (id) => {
    console.log("id:", id);
    window.location.href = `/admin/edit_plan/${id}`;
  };

  imageModalShowHandler = (url) => {
    this.setState({ thumbNailModal: true, url: url });
  };
  imageModalCloseHandler = () => {
    this.setState({ thumbNailModal: false, url: "" });
  };

  render() {
    const { regionDetails } = this.state;
    const custStatus = () => (cell, id) => {
      return (
        <>
          <div className="actionStyle">
            <div className="d-flex justify-content-evenly">
              {cell == "3" ? (
                <div style={{ marginTop: "4%" }}>
                  <div
                    style={{
                      padding: "0.5rem",
                      borderRadius: "5px",
                      backgroundColor: "#ffe0db",
                      color: "#ff3e1d",
                      fontWeight: "bold",
                      border: "none",
                      width: "fit-content",
                    }}
                  >
                    INACTIVE
                  </div>
                </div>
              ) : cell == "2" ? (
                <div style={{ marginTop: "4%" }}>
                  <div
                    style={{
                      padding: "0.5rem",
                      borderRadius: "5px",
                      backgroundColor: "#ffe0db",
                      color: "#ff3e1d",
                      fontWeight: "bold",
                      border: "none",
                      width: "fit-content",
                    }}
                  >
                    REJECTED
                  </div>
                </div>
              ) : cell == "1" ? (
                <div className="ml-5" style={{ marginTop: "4%" }}>
                  <div
                    style={{
                      padding: "0.5rem",
                      borderRadius: "5px",
                      backgroundColor: "#e8fadf",
                      color: "#71dd37",
                      fontWeight: "bold",
                      border: "none",
                      width: "fit-content",
                    }}
                  >
                    APPROVED
                  </div>
                </div>
              ) : (
                <div className="ml-5" style={{ marginTop: "4%" }}>
                  <div
                    style={{
                      padding: "0.5rem",
                      borderRadius: "5px",
                      backgroundColor: "#fff2d6",
                      color: "#ffab00",
                      fontWeight: "bold",
                      border: "none",
                      width: "fit-content",
                    }}
                  >
                    NOT APPROVED
                  </div>
                </div>
              )}

              <div className="ml-5" style={{ marginTop: "4%" }}>
                {id.plan_id == null && id.is_approved == 1 ? (
                  <Button
                    style={{
                      padding: "0.5rem",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      border: "none",
                      cursor: "pointer",
                      width: "fit-content",
                      backgroundColor: "#ffe0db",
                      color: "#ff3e1d",
                    }}
                    onClick={() => this.handleSetPlan(id.student_id)}
                  >
                    SET PLAN
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="ml-5" style={{ marginTop: "4%" }}>
              {id.plan_id != null ? (
                <>
                  {" "}
                  <Button
                    style={{
                      padding: "0.5rem",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      border: "none",
                      cursor: "pointer",
                      width: "fit-content",
                      color: "#03c3ec",
                    }}
                    onClick={() => this.handleViewPlan(id.student_id)}
                  >
                    VIEW PLAN
                  </Button>
                  <Button
                    style={{
                      padding: "0.5rem",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      border: "none",
                      cursor: "pointer",
                      width: "fit-content",
                    }}
                    onClick={() => this.handleEditPlan(id.student_id)}
                  >
                    EDIT PLAN
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </>
      );
    };
    const docLabel = () => (cell) => {
      return cell == "addhar_card"
        ? "Aadhar Card"
        : cell == "voter_id"
        ? "Voter ID"
        : cell == "pan_Card"
        ? "Pan Card"
        : null;
    };

    const actionFormatter = (refObj) => (cell, id) => {
      return (
        <div>
          {id.is_approved == "1" ? (
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
                onClick={() => this.downloadApplicationForm(id.student_id)}
              >
                PRINT FORM
              </Button>
            </div>
          ) : null}
          {cell == "1" ? (
            <div>
              <Button
                style={{
                  borderRadius: "5px",
                  padding: "0.5rem",
                  color: "#03c3ec",
                  backgroundColor: "#d7f5fc",
                  border: "none",
                  margin: "3%",
                }}
                onClick={() =>
                  (window.location.href = `/admin/view_student_profile/${id.student_id}`)
                }
              >
                VIEW
              </Button>
              <Button
                style={{
                  borderRadius: "5px",
                  padding: "0.5rem",
                  color: "#883495",
                  backgroundColor: "#d7f5fc",
                  border: "none",
                  margin: "3%",
                }}
                onClick={() =>
                  (window.location.href = `/admin/edit_student/${id.student_id}`)
                }
                disabled={cell == "1" ? false : true}
              >
                EDIT
              </Button>
              <Button
                style={{
                  padding: "0.5rem",
                  borderRadius: "5px",
                  backgroundColor: "#ffe0db",
                  color: "#ff3e1d",

                  border: "none",
                  margin: "3%",
                }}
                onClick={() => {
                  refObj.deactivateAlert(id.student_id, id.status);
                }}
                disabled={cell == "1" ? false : true}
              >
                DEACTIVATE
              </Button>
            </div>
          ) : (
            <div>
              <Button
                style={{
                  borderRadius: "5px",
                  padding: "0.4rem",
                  color: "#03c3ec",
                  backgroundColor: "#d7f5fc",
                  border: "none",
                  margin: "3%",
                }}
                onClick={() =>
                  (window.location.href = `/admin/view_student_profile/${id.student_id}`)
                }
              >
                VIEW
              </Button>

              <Button
                style={{
                  borderRadius: "5px",
                  padding: "0.4rem",
                  color: "#883495",
                  backgroundColor: "#d7f5fc",
                  border: "none",
                  margin: "3%",
                }}
                disabled
              >
                EDIT
              </Button>
              <Button
                style={{
                  padding: "0.5rem",
                  borderRadius: "5px",
                  backgroundColor: "#ffe0db",
                  color: "#ff3e1d",
                  fontWeight: "bold",
                  border: "none",
                  margin: "3%",
                }}
                disabled
              >
                DEACTIVATE
              </Button>
            </div>
          )}
        </div>
      );
    };

    const viewDocs11 = () => (id) => {
      return id ? (
        <div
          className="d-flex"
          style={{
            justifyContent: "center",
            alignItem: "center",
            cursor: "pointer",
          }}
        >
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="button-tooltip-2">Click to view this image</Tooltip>
            }
          >
            <img
              src={id}
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              style={{ width: "200px", height: "50px" }}
              onClick={() => {
                this.setState({
                  show: true,
                });
              }}
            />
          </OverlayTrigger>
          <Modal
            show={this.state.show}
            onClick={() => {
              this.setState({ show: false });
            }}
          >
            <Modal.Header
              closeButton
              onClick={() => {
                this.setState({ show: false });
              }}
            >
              <Modal.Title>Document Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <figure>
                <img src={id} alt="Document Image" width={550} />
              </figure>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  this.setState({ show: false });
                }}
                style={{ color: "blue" }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : null;
    };

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

    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section>
            <div className="row">
              <h3 className="col-xs-8" style={{ marginLeft: "15px" }}>
                <span style={{ color: "#a5adb7" }}>Home / </span>
                <span style={{ color: "#556a7d", fontWeight: "bold" }}>
                  Students List
                </span>
              </h3>
            </div>
          </section>
          <section className="content">
            <div className="box">
              <div className="box-body">
                <BootstrapTable
                  data={this.state.usermangment}
                  exportCSV
                  search={true}
                  pagination
                >
                  <TableHeaderColumn
                    width="70"
                    isKey
                    dataField="student_id"
                    dataSort={true}
                    className={"text-uppercase"}
                    dataAlign="center"
                  >
                    Id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="150"
                    dataField="SFname"
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                  >
                    Student's Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="100"
                    dataField="SmobNo"
                    dataSort={true}
                    className={"text-uppercase"}
                    dataAlign="center"
                  >
                    Phone No
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="building_name"
                    dataSort={true}
                    className={"text-uppercase"}
                    width="100"
                    dataAlign="center"
                  >
                    Building Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="room_id"
                    dataSort={true}
                    className={"text-uppercase"}
                    width="100"
                    dataAlign="center"
                  >
                    Room No.
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="LocGuardName"
                    className={"text-uppercase"}
                    width="120"
                    dataSort={true}
                    dataAlign="center"
                  >
                    Gaurdian Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="SmobNo"
                    className={"text-uppercase"}
                    width="100"
                    dataSort={true}
                    dataAlign="center"
                  >
                    Phone No
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="food_preference"
                    className={"text-uppercase"}
                    width="90"
                    dataSort={true}
                    dataAlign="center"
                  >
                    Food Preference
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataFormat={docLabel(this)}
                    dataField="docs_name"
                    className={"text-uppercase"}
                    width="110"
                    dataSort={true}
                    dataAlign="center"
                  >
                    Doc Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="docs_image"
                    className={"text-uppercase"}
                    width="110"
                    dataSort={true}
                    dataFormat={viewDocs(this)}
                    dataAlign="center"
                  >
                    View Docs
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="parking_name"
                    className={"text-uppercase"}
                    width="90"
                    dataSort={true}
                    dataAlign="center"
                  >
                    Parking Name
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField="parking_id"
                    className={"text-uppercase"}
                    width="100"
                    dataSort={true}
                    dataAlign="center"
                  >
                    Slot ID of Parking
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="occupancy"
                    className={"text-uppercase"}
                    width="120"
                    dataSort={true}
                    dataAlign="center"
                  >
                    Occupancy
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="is_approved"
                    className={"text-uppercase"}
                    width="180"
                    dataSort={true}
                    dataFormat={custStatus(this, this.id)}
                    dataAlign="center"
                  >
                    Status
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="is_approved"
                    className={"text-uppercase"}
                    width="220"
                    dataSort={true}
                    dataFormat={actionFormatter(this, this.a)}
                    dataAlign="center"
                    export={false}
                  >
                    Action
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
          </section>
        </div>
        <Modal
          show={this.state.thumbNailModal}
          onHide={() => this.imageModalCloseHandler()}
          backdrop="static"
        >
          <Modal.Header closeButton>Document Image</Modal.Header>
          <Modal.Body>
            <figure>
              <img
                src={this.state.url}
                alt="Document Image"
                width={550}
                height={400}
              />
            </figure>
          </Modal.Body>
        </Modal>
      </Layout>
    );
    // }
  }
}
export default Region;
