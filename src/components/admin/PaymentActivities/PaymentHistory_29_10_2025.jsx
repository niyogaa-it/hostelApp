import React, { Component } from "react";
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
import { Link } from "react-router-dom";
import swal from "sweetalert";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import userLog from "../Utils/Logadd";
import { showErrorMessage } from "../../../shared/handle_error";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

const options = {
  sizePerPage: 5, // Set default page size
  sizePerPageList: [5, 10, 25, 30, 50], // List of options in the dropdown
};

const PlanFilter = {
  OneTime: "One Time",
  MealChange: "Meal Change",
  RoomChange: "Room Change",
  TermChange: "Term Change",
};
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
      studentName: "",
      paymenthistory: [],
      paymenthistorycount: 0,
      Invalid: false,
    };
  }

  componentDidMount() {
    
    if (
      this.props.auth.userToken.permissions.payment_activities == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {

      API.get(`/admin/secure/plan/get_all_plan_history`)
        .then((res) => {
          this.setState({
            paymenthistory: res.data.result,
            paymenthistorycount: res.data.result.length,
          });
          // this.studentData();
          userLog('Payment','Payment Listing');
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


  // updateOfflinePayment = (event, id) => {

  //   event.preventDefault();
  //   setTimeout(()=>{
  //     document.getElementsByClassName("swal-button--confirm")[0].disabled = true;
  //   },10);

    
  //   var datetextinput = document.createElement("input");
  //   datetextinput.className = "swal-content__textarea";
  //   datetextinput.setAttribute("type", "date");

  //   datetextinput.onchange = function (e) {
  //     if(this.value){
  //       document.getElementsByClassName("swal-button--confirm")[0].disabled = false;
  //     }else{
  //       document.getElementsByClassName("swal-button--confirm")[0].disabled = true;
  //       datetextinput.classList.add("border-danger");

  //     }
  //     swal.setActionValue({
  //       confirm: this.value,
  //     });
  //   };
  //   swal({
  //     closeOnClickOutside: false,
  //     title: "Mark as Paid",

  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //     content: datetextinput
  //   }).then((willDelete) => {

  //     if (typeof willDelete == "string") {
  //       this.sendOfflinePaymentDtl(id, willDelete);
  //     }

  //   });
  // };


  // sendOfflinePaymentDtl = (id,payMentclearDate) => {
    
  //   let data = {
  //     id: id,
  //     admin_update_payment_date: payMentclearDate,
  //   };
   
  //   API.post(`/admin/secure/plan/update_offline_paymentdtl/${id}`, data)
  //     .then((res) => {
  //       swal("Success", res.data.message, "success");
  //       this.props.history.push("/admin/payment_history");
  //     })
  //     .catch((err) => {
  //       console.log("err:", err);
     
  //     });
    
  // };

  addPaymentclearDate = (event, id) => {
    event.preventDefault();
    setTimeout(()=>{
      document.getElementsByClassName("swal-button--confirm")[0].disabled = true;
    },10);
    
    var datetextinput = document.createElement("input");
    datetextinput.className = "swal-content__textarea";
    datetextinput.setAttribute("type", "date");
    datetextinput.onchange = function (e) {

   
      if(this.value){
        document.getElementsByClassName("swal-button--confirm")[0].disabled = false;
      }else{
        document.getElementsByClassName("swal-button--confirm")[0].disabled = true;
        datetextinput.classList.add("border-danger");

      }
      
      swal.setActionValue({
        confirm: this.value,
      });
    };
    swal({
      closeOnClickOutside: false,
      title: "Please enter a Date?",

      icon: "warning",
      buttons: true,
      dangerMode: true,
      content: datetextinput
    }).then((willDelete) => {

      if (typeof willDelete == "string") {
        this.sendPaymentLink(id, willDelete);
      }

    });
  };

 
  sendPaymentLink = (id,payMentclearDate) => {

    let data = {
      id: id,
      admin_update_payment_date: payMentclearDate,
    };

    API.post(`/admin/secure/plan/get_payment_details/${id}`, data)
      .then((res) => {
        this.componentDidMount();
        setTimeout(() => {
          window.open(res.data.result, '_blank');
        }, "2000");

      })
      .catch((err) => {
        console.log("err:", err);
        // showErrorMessage(err, this.props);
      });
    
  };

  viewPayment = (id,payMentclearDate) => {

    API.get(`/admin/secure/plan/view_payment_details/${id}`)
      .then((res) => {
        
        console.log('res.data.result',res.data.result);

        setTimeout(() => {
          window.open(res.data.result, '_blank');
        }, "2000");
      })
      .catch((err) => {
        console.log("err:", err);
        // showErrorMessage(err, this.props);
    });
    
  };

  imageShow(cell) {
    return (
      <>
        <img style={{ width: "100%" }} src={cell} alt="" />
      </>
    );
  }

  csvFormatterNull(cell) {
    return cell == null ? "" : cell;
  }

  combinedPlanFormatter(cell, row) {
    const planType = (row && row.plan_type) || '';
    const editPlanType = (row && row.edit_plan_type) || '';

    return editPlanType ? `${planType} - ${editPlanType}` : `${planType}`;
  }

  dateFormattingPaidon(cell, row) {
    const paidOn = row.paid_on 
      ? moment(row.paid_on).format("DD/MM/YYYY, h:mm:ss a") 
      : row.admin_update_payment_date 
      ? moment(row.admin_update_payment_date).format("DD/MM/YYYY, h:mm:ss a") 
      : "N/A";
  
    return `${paidOn}`;
  }

  csvDateFormatter(cell) {
    if (cell === null) {
      return "Payment Due";
    } else {
      return moment(cell).format("DD/MM/YYYY, h:mm:ss a");
    }
  }
  csvFormatterPlan(cell) {
    return cell == "OneTime"
      ? "One Time"
      : // `${row}`
      cell == "RoomChange"
      ? "Room Change"
      : cell == "Term Change"
      ? "Term Change"
      : cell == "Meal Change"
      ? "Meal Change"
      : "";
  }


  handleDeletePlan = (event, id) => {
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
        this.deletePlan(id);
      }
    });
  };

  deletePlan = (id) => {
    if (id) {
      API.get(`/admin/secure/plan/delete_plan/${id}`)
        .then((res) => {
          swal({
            closeOnClickOutside: false,
            title: "Success",
            text: "Record deleted successfully.",
            icon: "success",
          }).then(() => {
            window.location.reload();

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




  render() {

    const paymentStatus = () => (cell,row) => {
  
        //console.log(cell, row.planId,row.payment_id);
      return (
        <>
          <div>
           
            <div>
              {cell == "No" || (row.payment_id === null) ? (
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
                    Not Paid
                  </span>
                </div>
              ) : (
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
                    Paid
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      );
    };

    const dateFormatting = () => (date) => {
      if (date === null) {
        return "N/A";
      } else {
        return moment(date).format("DD/MM/YYYY, h:mm:ss a");
      }

      // return (dateFormat(date, "dddd, dd/mm/yyyy"));
    };


    const paymentMode = () => (cell) => {
      if (cell === "Offline") {
        return "Offline";
      } else if(cell === "One Time"){
        return "Online";
      }else {
        return "Online";
      }
    };
    
    // const planFormat = () => (cell) => {
    //   return (
    //     <>
    //       <div className="actionStyle text-center">
    //         {cell == "OneTime" ? (
    //           <p className="text-center">One Time</p>
    //         ) : cell == "MealChange" ? (
    //           <p className="text-center">Meal Change</p>
    //         ) : cell == "RoomChange" ? (
    //           <p className="text-center">Room Change</p>
    //         ) : cell == "TermChange" ? (
    //           <p className="text-center">Term change</p>
    //         ) : null}
    //       </div>
    //     </>
    //   );
    // };


    const actionFormatter = (refObj) => (cell, row) => {


      //console.log('row',row.paid,row.send_to_student);
    
      return (
        <div>

          {cell == 'No' || row.payment_id === null   ? (
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
                //onClick={(e) => this.updateOfflinePayment(e,row.paymentId)}
                onClick={() => {
                  window.open(`/admin/mark_as_paid/${row.planId}`, "_blank");
                }}
              >
                Mark as Paid
              </Button>
            </div>
          ) : null}


            {row.paid === 'Yes' ? (
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
                  onClick={() => this.viewPayment(row.planId)}
                  // onClick={() => {
                  //   window.open(`/admin/view_plan_invoice/${row.planId}`, "_blank");
                  // }}
                >
                  View Invoice
                </Button>
              </div>

            ) : <Button
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
                  onClick={(event) => this.handleDeletePlan(event, row.planId)}
                >
                  Delete
                </Button>
                              
              }

          {/* {row.paid = 'Yes' && row.send_to_student == "yes" ? (
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
                onClick={(e) => this.addPaymentclearDate(e,row.planId)}
              >
                Generate Invoice
              </Button>
            </div>
          ) : null} */}


         
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
                <span style={{ color: "#a5adb7" }}>Home / Payment / </span>
                <span style={{ color: "#556a7d", fontWeight: "bold" }}>
                  Payment History
                </span>
              </h3>
            </div>
          </section>
          <section className="content">
            <div className="box">
              <div className="box-body">
                <div className="nav-tabs-custom">
                  <ul className="nav nav-tabs">
                    <li className="tabButtonSec pull-right m-5">
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
                  data={this.state.paymenthistory}
                  exportCSV
                  search={true}
                  pagination
                  csvFileName="payment-history.csv"
                  options={options}
                >
                  <TableHeaderColumn
                    isKey
                    dataField="planId"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Plan ID"
                  >
                    Plan Id
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField="student_id"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="100"
                    className={"text-uppercase"}
                    csvHeader="Student ID"
                  >
                    Student Id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="SFname"
                    csvFormat={this.csvFormatterNull}
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                    width="100"
                    csvHeader="Student Name"
                  >
                    Student's Name
                  </TableHeaderColumn>


                  <TableHeaderColumn
                    dataField="AcademicYear"
                    csvFormat={this.csvFormatterNull}
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                    width="100"
                    csvHeader="Academic Year"
                  >
                    Academic Year
                  </TableHeaderColumn>

                   <TableHeaderColumn
                                      dataField="gstIncluded"
                                      csvFormat={this.csvFormatterNull}
                                      className={"text-uppercase"}
                                      dataSort={true}
                                      dataAlign="center"
                                      width="100"
                                      csvHeader="GST Applicable"
                                    >
                                      GST Applicable
                                    </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField="plan_type"
                    csvFormat={this.csvFormatterNull}
                    dataFormat={this.combinedPlanFormatter}
                    dataSort={true}
                    dataAlign="center"
                    width="100"
                    className={"text-uppercase"}
                    //dataFormat={planFormat(this, this.id)}
                   
                    csvHeader="Plan Type"
                  >
                    Plan Type
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField="paid_on"
                    dataSort={true}
                    dataAlign="center"
                    width="90"
                    className={"text-uppercase"}
                    dataFormat={this.dateFormattingPaidon}
                    csvFormat={this.csvDateFormatter}
                    csvHeader="Paid on"
                  >
                    Paid on
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField="type"
                    dataSort={true}
                    dataAlign="center"
                    width="90"
                    className={"text-uppercase"}
                    dataFormat={paymentMode(this)}
                    csvHeader="Payment Mode"
                  >
                    Payment Mode
                  </TableHeaderColumn>


                 


                  <TableHeaderColumn
                    dataField="paid"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    dataFormat={paymentStatus(this, this.a)}
                    csvHeader="Payment Status"
                  >
                    Payment Status
                  </TableHeaderColumn>

                  


                  <TableHeaderColumn
                    dataField="payment_id"
                    csvFormat={this.csvFormatterNull}
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                    width="100"
                    csvHeader="Payment Id"
                  >
                    Payment Id
                  </TableHeaderColumn>



                  <TableHeaderColumn
                    dataField="offline_payment_type"
                    csvFormat={this.csvFormatterNull}
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                    width="100"
                    csvHeader="Offline Payment Type"
                  >
                    Offline Payment Type
                  </TableHeaderColumn>


                  <TableHeaderColumn
                    dataField="offline_payment_ref_dtl"
                    csvFormat={this.csvFormatterNull}
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                    width="100"
                    csvHeader="Offline Payment Referance"
                  >
                    Offline Payment Referance
                  </TableHeaderColumn>

                 

                  <TableHeaderColumn
                    dataField="offline_payment_document"
                    csvFormat={this.csvFormatterNull}
                    className={"text-uppercase"}
                    dataSort={true}
                    dataAlign="center"
                    width="100"
                    csvHeader="Offline Payment Referance"
                    dataFormat={this.imageShow}
                  >
                    Offline Bank Document
                  </TableHeaderColumn>
          


                  <TableHeaderColumn
                    dataField="meal_type"
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Meal Type"
                    csvFormat={this.csvFormatterNull}
                  >
                    Meal Type
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField="room_rent"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Room Rent"
                  >
                    Room Rent
                  </TableHeaderColumn>


                  <TableHeaderColumn
                    dataField="caution_deposit"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Caution Deposit"
                  >
                    Caution Deposit
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="cultural_fees"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Cultural Fees"
                  >
                    Cultural Fees
                  </TableHeaderColumn>

                  
                  <TableHeaderColumn
                    dataField="addmission_fee"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Admission fees"
                  >
                    Admission Fees
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="admisson_kit"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Admission Kit"
                  >
                    Admission Kit
                  </TableHeaderColumn>
                 

                  <TableHeaderColumn
                    dataField="meal"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Meal Fees"
                  >
                    Meal
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField="laundry"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Laundry Fees"
                  >
                    Laundry
                  </TableHeaderColumn>

                 
                  <TableHeaderColumn
                    dataField="monthly_other_fees"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Other Fees"
                  >
                    Other Fees
                  </TableHeaderColumn>
                 
                  <TableHeaderColumn
                    dataField="total"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="Total Fees"
                  >
                    Total Fees
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="to_pay"
                    csvFormat={this.csvFormatterNull}
                    dataSort={true}
                    dataAlign="center"
                    width="80"
                    className={"text-uppercase"}
                    csvHeader="To Pay"
                  >
                    To Pay
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="created_at"
                    csvFormat={this.csvDateFormatter}
                    dataFormat={dateFormatting(this)}
                    dataSort={true}
                    dataAlign="center"
                    width="150"
                    className={"text-uppercase"}
                    csvHeader="Created at"
                  >
                    Created at
                  </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="paid"
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
