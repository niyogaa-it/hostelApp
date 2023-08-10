import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Button, Tooltip, OverlayTrigger, Modal } from "react-bootstrap";
import swal from "sweetalert";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import "./table.css";

const statusType = {
  0: "Not Approved",
  1: "Approved",
  2: "Rejected",
  3: "Inactive",
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
      filterValue: "",
      approvedData: [],
      notapprovedData: [],
      rejectedData: [],
      Invalid: false,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.student_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/student`)
        .then((res) => {
          this.setState({
            usermangment: res.data.result_data,
            userconut: res.data.result_data.length,
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

  statusdeactive = (id, code, reason= null) => {
    let data = {
      id: id,
      status: "3",
      reason: reason
    };

    API.put(`/admin/secure/create/student/deactivate/${id}`, data)
      .then((res) => {
        console.log("res:", res);
        this.componentDidMount();
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };

  deactivateAlert = (id, code) => {
    setTimeout(()=>{
      document.getElementsByClassName("swal-button--confirm")[0].disabled = true;
    },10);
    
    var textarea = document.createElement("textarea");
    textarea.rows = 4;
    textarea.className = "swal-content__textarea";
    textarea.placeholder = "Please provide a reason for deactivating account...";
    textarea.onkeyup = function (e) {
      if(this.value){
        document.getElementsByClassName("swal-button--confirm")[0].disabled = false;
      }else{
        document.getElementsByClassName("swal-button--confirm")[0].disabled = true;
        textarea.classList.add("border-danger");

      }
      swal.setActionValue({
        confirm: this.value,
      });
    };
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "Once deactivated,it will not be activate then!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      content: textarea
    }).then((willDelete) => {
      if (typeof willDelete == "string") {
        this.statusdeactive(id, code,willDelete);
     }
      // console.log("willDelete:", willDelete);
      // if (willDelete) {
      //   this.statusdeactive(id, code);
      // }
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

  handleViewPlan = (id) => {
    console.log("id:", id);
    window.location.href = `/admin/view_plan/${id}`;
  };
  handleEditPlan = (id) => {
    console.log("id:", id);
    window.location.href = `/admin/edit_plan/${id}`;
  };

  handleMonthlyPlan = (id) => {
    console.log("id:", id);
    window.location.href = `/admin/monthly_plan/${id}`;
  };

  handleFilter = (event) => {
    console.log("not approved data", event.target.value);
    this.setState({ filterValue: event.target.value });
    if (event.target.value === "approved") {
      this.setState({
        approvedData: [...this.state.usermangment].filter((a) => {
          return a.is_approved == "1";
        }),
      });
    } else if (event.target.value === "not approved") {
      this.setState({
        notapprovedData: [...this.state.usermangment].filter((a) => {
          return a.is_approved == "0";
        }),
      });
    } else if (event.target.value === "rejected") {
      this.setState({
        rejectedData: [...this.state.usermangment].filter((a) => {
          return a.is_approved == "2";
        }),
      });
    } else if (event.target.value === "inactive") {
      this.setState({
        inactiveData: [...this.state.usermangment].filter((a) => {
          return a.is_approved == "3";
        }),
      });
    } else {
      return this.state.usermangment;
    }
  };

  imageModalShowHandler = (url) => {
    this.setState({ thumbNailModal: true, url: url });
  };
  imageModalCloseHandler = () => {
    this.setState({ thumbNailModal: false, url: "" });
  };
  csvFormatterStatus(cell, row) {
    return cell == "0"
      ? "Not Approved"
      : // `${row}`
      cell == "1"
      ? "Approved"
      : cell == "2"
      ? "Rejected"
      : "Inactive";
  }
  csvFormatterNull(cell) {
    return cell == null ? "" : cell;
  }
  render() {
    const paginationOptions = {
			page: 1, // which page you want to show as default
			sizePerPageList: [
				{
					text: '5',
					value: 5,
				},
				{
					text: '10',
					value: 10,
				},
        {
					text: '20',
					value: 20,
				},
        {
					text: '50',
					value: 50,
				},
        {
					text: '100',
					value: 100,
				},
				{
					text: 'All',
					value: this.state.userconut > 0 ? this.state.userconut : 1,
				},
			], // you can change the dropdown list for size per page
			sizePerPage: 5, // which size per page you want to locate as default
			pageStartIndex: 1, // where to start counting the pages
			paginationSize: 6, // the pagination bar size.
			prePage: 'Prev', // Previous page button text
			nextPage: 'Next', // Next page button text
			firstPage: 'First', // First page button text
			lastPage: 'Last', // Last page button text
			paginationPosition: 'bottom', // default is bottom, top and both is all available
			// hideSizePerPage: true //> You can hide the dropdown for sizePerPage
			// alwaysShowAllBtns: true // Always show next and previous button
			// withFirstAndLast: false //> Hide the going to First and Last page button
		};

    const custStatus = () => (cell, id) => {
      return (
        <>
          <div className="actionStyle">
            <div className="d-flex justify-content-evenly">
              {cell == "3" ? (
                <div style={{ marginTop: "4%", cursor: "pointer" }}>
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
                    data-toggle="tooltip" data-placement="right" title={id.deactive_reason}
                  >
                    INACTIVE
                  </div>
                </div>
              ) : cell == "2" ? (
                <div style={{ marginTop: "4%", cursor: "pointer" }}>
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
                    data-toggle="tooltip" data-placement="right" title={id.reject_reason}
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
              {id.plan_id != null && id.monthly == null? (
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
                ) : null
              }

              {id.plan_id != null && id.monthly != null? (
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
                        onClick={() => this.handleMonthlyPlan(id.student_id)}
                      >
                        EDIT PLAN
                      </Button>
                      </>
                  ) : null
              }
              
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
          {id.is_approved == "1" || id.is_approved == "0" ? (
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
                onClick={() => {
                  window.open(
                    `/admin/view_student_profile/${id.student_id}`,
                    "_blank"
                  );
                }}
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
                onClick={() => {
                  window.open(
                    `/admin/view_student_profile/${id.student_id}`,
                    "_blank"
                  );
                }}
              >
                VIEW
              </Button>

              {/* <Button
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
              </Button> */}
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
                    Students List
                  </span>
                </h3>
              </div>
            </section>
            <section className="content">
              <div className="box">
                <div className="box-body">
                  <BootstrapTable
                    data={
                      this.state.filterValue == "approved"
                        ? this.state.approvedData
                        : this.state.filterValue == "not approved"
                        ? this.state.notapprovedData
                        : this.state.filterValue == "rejected"
                        ? this.state.rejectedData
                        : this.state.usermangment
                    }
                    exportCSV
                    csvFileName="Student-details.csv"
                    search={true}
                    pagination={true}
										options={paginationOptions}
                  >
                    <TableHeaderColumn
                      width="70"
                      isKey
                      dataField="student_id"
                      dataSort={true}
                      className={"text-uppercase"}
                      dataAlign="center"
                      csvHeader="Student ID"
                    >
                      Id
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      width="150"
                      dataField="SFname"
                      className={"text-uppercase"}
                      dataSort={true}
                      dataAlign="center"
                      csvFormat={this.csvFormatterNull}
                      csvHeader="Student Name"
                    >
                      Student's Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      width="100"
                      dataField="SmobNo"
                      dataSort={true}
                      className={"text-uppercase"}
                      dataAlign="center"
                      csvFormat={this.csvFormatterNull}
                      csvHeader="Phone No."
                    >
                      Phone No
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="building_name"
                      dataSort={true}
                      className={"text-uppercase"}
                      width="100"
                      dataAlign="center"
                      csvFormat={this.csvFormatterNull}
                      csvHeader="Buliding Name"
                    >
                      Building Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="room_id"
                      dataSort={true}
                      className={"text-uppercase"}
                      width="100"
                      dataAlign="center"
                      csvFormat={this.csvFormatterNull}
                      csvHeader="Room No."
                    >
                      Room No.
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="LocGuardName"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      csvFormat={this.csvFormatterNull}
                      csvHeader="Gaurdian Name"
                    >
                      Guardian Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="SmobNo"
                      className={"text-uppercase"}
                      width="100"
                      dataSort={true}
                      dataAlign="center"
                      csvFormat={this.csvFormatterNull}
                      csvHeader="Phone No."
                    >
                      Phone No
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="food_preference"
                      className={"text-uppercase"}
                      width="90"
                      dataSort={true}
                      dataAlign="center"
                      csvFormat={this.csvFormatterNull}
                      csvHeader="Food Preference"
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
                      csvFormat={this.csvFormatterNull}
                      csvHeader="Document Name"
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
                      csvFormat={this.csvFormatterNull}
                      csvHeader="View Document"
                    >
                      View Docs
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="parking_name"
                      className={"text-uppercase"}
                      width="90"
                      dataSort={true}
                      dataAlign="center"
                      csvFormat={this.csvFormatterNull}
                      csvHeader="Parking Name"
                    >
                      Parking Name
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="parking_id"
                      className={"text-uppercase"}
                      width="100"
                      dataSort={true}
                      dataAlign="center"
                      csvFormat={this.csvFormatterNull}
                      csvHeader="Parking Slot Id"
                    >
                      Slot ID of Parking
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="occupancy"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      csvFormat={this.csvFormatterNull}
                      csvHeader="Occupancy"
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
                      filter={{
                        type: "SelectFilter",
                        options: statusType,
                        defaultValue: "New",
                        delay: 1000,
                        placeholder: "Filter by Status",
                      }}
                      csvFormat={this.csvFormatterStatus}
                      csvHeader="Status"
                    >
                      Status
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="reject_reason"
                      className={"text-uppercase d-none"}
                      width="220"
                      dataAlign="center"
                      csvFormat={this.csvFormatterNull}
                      csvHeader="Reason"
                      hidden="true"
                      csvExport={true} 
                      export={true}
                    >
                      Reason
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="is_approved"
                      className={"text-uppercase"}
                      width="220"
                      dataSort={true}
                      dataFormat={actionFormatter(this, this.a)}
                      dataAlign="center"
                      export={false}
                      csvFormat={this.csvFormatterNull}
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
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(Region));
