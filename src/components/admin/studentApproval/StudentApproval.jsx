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
//import { Label } from 'reactstrap';
import { Link } from "react-router-dom";
import swal from "sweetalert";

import Layout from "../layout/Layout";
import whitelogo from "../../../assets/images/drreddylogo_white.png";
import API from "../../../shared/admin-axios";
import { showErrorMessage } from "../../../shared/handle_error";

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

class StudentApproval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      usermangment: [],
      userconut: 0,
    };
  }

  componentDidMount() {
    API.get(`/admin/secure/request/student`)
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

  confirmStatusAccept = (event, id) => {
    event.preventDefault();
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "Please select room allocation type",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      //buttons: ['Manual', 'Automatic'],
      buttons: {
        cancel: {
          text: "Cancel",
          visible: true,
          className: "buttonstyle",
        },
        Manual: {
          text: "Manual",
          visible: true,
          className: "swal-button swal-button--cancel",
        },

        Automatic: {
          text: "Automatic",
          visible: true,
          className: "swal-button swal-button--confirm swal-button--danger",
        },
      },
    }).then((willDelete) => {
      if (willDelete == "Automatic") {
        this.statusaccept(id);
      } else if (willDelete == "Manual") {
        window.location.href = `/admin/assign_room/${id}`;
      }
    });
  };
  confirmStatusReject = (event, id) => {
    event.preventDefault();
    setTimeout(()=>{
      document.getElementsByClassName("swal-button--confirm")[0].disabled = true;
    },10);
    
    var textarea = document.createElement("textarea");
    textarea.rows = 4;
    textarea.className = "swal-content__textarea";
    textarea.placeholder = "Type the reason of rejection";
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
      text: "You want to reject this student?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      content: textarea
    }).then((willDelete) => {
      if (typeof willDelete == "string") {
         this.statusreject(id, willDelete);
      }
     
    });
  };
  statusaccept = (id, code) => {
    let data = {
      id: id,
      status: "2",
    };

    API.get(`/admin/secure/create/student/${id}`, data)
      .then((res) => {
        if (res.data.status == 201) {
          swal("Success", res.data.message, "success");
          this.componentDidMount();
        } else {
          swal("Warning", res.data.message, "warning");
          this.componentDidMount();
        }
      })
      .catch((err) => {
        console.log("err:", err);
        showErrorMessage(err, this.props);
      });
  };
  statusreject = (id, code= null) => {
    let data = {
      id: id,
      status: "0",
      reason:code
    };

    API.put(`admin/secure/create/student/reject/${id}`, data)
      .then((res) => {
        if (res.data.status == 201) {
          swal("Success", "Student rejected successfully", "success");
          this.componentDidMount();
        } else {
          swal("Warning", res.data.message, "warning");
        }
      })
      .catch((err) => {
        console.log("err:", err);
        showErrorMessage(err, this.props);
      });
  };

  render() {
    const paginationOptions = {
      page: 1, // which page you want to show as default
      sizePerPageList: [
        {
          text: "5",
          value: 5,
        },
        {
          text: "10",
          value: 10,
        },
        {
          text: "20",
          value: 20,
        },
        {
          text: "50",
          value: 50,
        },
        {
          text: "100",
          value: 100,
        },
        {
          text: "All",
          value: this.state.userconut > 0 ? this.state.userconut : 1,
        },
      ], // you can change the dropdown list for size per page
      sizePerPage: 5, // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 6, // the pagination bar size.
      prePage: "Prev", // Previous page button text
      nextPage: "Next", // Next page button text
      firstPage: "First", // First page button text
      lastPage: "Last", // Last page button text
      paginationPosition: "bottom", // default is bottom, top and both is all available
      // hideSizePerPage: true //> You can hide the dropdown for sizePerPage
      // alwaysShowAllBtns: true // Always show next and previous button
      // withFirstAndLast: false //> Hide the going to First and Last page button
    };
    const actionFormatter = (refObj) => (cell, id) => {
      return (
        <div className="actionStyle">
          {cell == "2" ? (
            <div className="d-flex">
              <Button
                style={{
                  padding: "0.5rem",
                  borderRadius: "5px",
                  backgroundColor: "#ffe0db",
                  color: "#ff3e1d",
                  fontWeight: "bold",
                  border: "none",
                }}
                disabled
              >
                REJECTED
              </Button>
              <Button
                style={{
                  borderRadius: "5px",
                  marginLeft: "10px",
                  padding: "0.4rem",
                  color: "#03c3ec",
                  backgroundColor: "#d7f5fc",
                  border: "none",
                }}
                onClick={() => {
                  window.open(`/admin/view_student_profile/${id.id}`, "_blank");
                }}
              >
                VIEW
              </Button>
            </div>
          ) : (
            <div className="d-flex">
              <Button
                style={{
                  padding: "0.5rem",
                  borderRadius: "5px",
                  backgroundColor: "#e8fadf",
                  color: "#71dd37",
                  border: "none",
                  fontWeight: "bold",
                }}
                onClick={(e) => {
                  refObj.confirmStatusAccept(e, id.id, id.status);
                }}
              >
                APPROVE
              </Button>
              <Button
                style={{
                  padding: "0.5rem",
                  borderRadius: "5px",
                  backgroundColor: "#ffe0db",
                  color: "#ff3e1d",
                  fontWeight: "bold",
                  margin: "0px 10px",
                  border: "none",
                }}
                onClick={(e) => {
                  refObj.confirmStatusReject(e, id.id, id.status);
                }}
              >
                REJECT
              </Button>
              <Button
                style={{
                  borderRadius: "5px",
                  padding: "0.4rem",
                  color: "#03c3ec",
                  backgroundColor: "#d7f5fc",
                  border: "none",
                }}
                onClick={() => {
                  window.open(`/admin/view_student_profile/${id.id}`, "_blank");
                }}
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
                }}
                onClick={() => {
                  window.open(`/admin/edit_student_details/${id.id}`, "_blank");
                }}
              >
                EDIT
              </Button>
            </div>
          )}
        </div>
      );
    };

    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section>
            <div className="row">
              <h3 className="col-xs-8" style={{ marginLeft: "15px" }}>
                <span style={{ color: "#a5adb7" }}>Home / </span>
                <span style={{ color: "#556a7d", fontWeight: "bold" }}>
                  Request Students List
                </span>
              </h3>
            </div>
          </section>
          <section className="content">
            <div className="box">
              <div className="box-body">
                <div className="nav-tabs-custom">
                  <ul className="nav nav-tabs">
                    <li className="tabButtonSec pull-right">
                      {this.state.count > 0 ? (
                        <span onClick={(e) => this.downloadXLSX(e)}>
                          <LinkWithTooltip
                            tooltip={`Click here to download excel`}
                            href="#"
                            id="tooltip-my"
                            clicked={(e) => this.checkHandler(e)}
                          >
                            <i className="fas fa-download"></i>
                          </LinkWithTooltip>
                        </span>
                      ) : null}
                    </li>
                  </ul>
                </div>

                <BootstrapTable
                  data={this.state.usermangment}
                  exportCSV
                  search={true}
                  pagination={true}
                  options={paginationOptions}
                >
                  <TableHeaderColumn
                    width="130"
                    isKey
                    dataField="id"
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                    // dataFormat={custContent(this)}
                  >
                    Student Id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="190"
                    dataField="SFname"
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                    // dataFormat={custContent(this)}
                  >
                    Student's Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="190"
                    dataField="LocGuardName"
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                  >
                    Guardian Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="210"
                    dataField="SmobNo"
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                  >
                    Student's Phone No
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    width="190"
                    dataField="food_preference"
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                  >
                    Food Preference
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="130"
                    dataField="parking"
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                  >
                    Parking
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="100"
                    dataField="room_type"
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                  >
                    Room
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="150"
                    dataField="toilet_type"
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                  >
                    Toilet
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="150"
                    dataField="occupancy"
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                  >
                    Occupancy
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    width="230"
                    className={"text-uppercase"}
                    dataField="status"
                    // dataFormat={statusAction(this)}
                    dataFormat={actionFormatter(this, this.a)}
                    dataSort={true}
                    dataAlign="center"
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
    // }
  }
}
export default StudentApproval;
