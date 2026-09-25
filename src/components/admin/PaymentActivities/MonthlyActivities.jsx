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
import { showErrorMessage } from "../../../shared/handle_error";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

const options = {
  sizePerPage: 5, // Set default page size
  sizePerPageList: [5, 10, 25, 30, 50], // List of options in the dropdown
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
      //////////
      Invalid: false,
      paymentactivity: [],
      paymentactivitycount: 0,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.payment_activities == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/plan/get_all_monthly_plan`)
        .then((res) => {
          this.setState({
            paymentactivity: res.data.result,
            paymentactivitycount: res.data.result.length,
          });
          // this.studentData();
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


  viewPayment = (id,payMentclearDate) => {

    API.get(`/admin/secure/plan/view_payment_details/${id}`)
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



  
handleCustomExportCSV = () => {
  API.get(`/admin/secure/downloadcsvmonthly`)
    .then((response) => {
      const paymenthistory = response.data.data; // data returned from API

      // Define custom headers
      const headers = [
        "Plan ID","Plan Type","Paid on","Payment Status","Date","R.NO","Student ID","Student Name",
        "Meal Type","Application","GST @ 18%","Caution deposit","Admission fees","GST @ 18%",
        "Cultural Fees","GST @ 18%","Room Rent","GST @ 18%","Admission Kit","GST @ 18%",
        "Meal Fees","GST @ 18%","Laundry Fees","GST @ 18%","Parking Fees","GST @ 18%",
        "Transportation Fees","GST @ 18%","AC Electricity","GST @ 18%","water can","GST @ 18%",
        "Other fees","GST @ 18%","Fees Total","GST Total","Paid","Payment Id","Created at"
      ];



      // Map data rows
       const rows = paymenthistory.map((row) => {
        // Define all GST components
        const gst_addmission_fee = Number((row.addmission_fee * 0.18).toFixed(2));
        const gst_cultural_fees = Number((row.cultural_fees * 0.18).toFixed(2));
        const gst_room_rent = Number((row.room_rent * 0.18).toFixed(2));
        const gst_admisson_kit = Number((row.admisson_kit * 0.18).toFixed(2));
        const gst_meal = Number((row.meal * 0.18).toFixed(2));
        const gst_laundry = Number((row.laundry * 0.18).toFixed(2));
        const gst_parking = Number((row.parking * 0.18).toFixed(2));
        const gst_transportation = Number((row.transportation * 0.18).toFixed(2));
        const gst_electricity = Number(((row.monthly_electricity_bill || 0) * 0.18).toFixed(2));
        const gst_water = Number(((row.monthly_water_bill || 0) * 0.18).toFixed(2));
        const gst_other = Number(((row.other_fees || 0) * 0.18).toFixed(2));

        // Calculate total GST for this row
        const totalGST = gst_addmission_fee + gst_cultural_fees + gst_room_rent + gst_admisson_kit + gst_meal +
                        gst_laundry + gst_parking + gst_transportation + gst_electricity + gst_water + gst_other;

        // Now return row data including total GST
        return [
          row.planId,
          row.plan_type,
          row.paid_on,
          row.payment_id ? "Paid" : "Unpaid",
          row.created_at,
          row.invoice_no,
          row.student_id,
          row.SFname,
          row.meal_type,
          0,
          0,
          row.caution_deposit,
          row.addmission_fee,
          gst_addmission_fee,
          row.cultural_fees,
          gst_cultural_fees,
          row.room_rent,
          gst_room_rent,
          row.admisson_kit,
          gst_admisson_kit,
          row.meal,
          gst_meal,
          row.laundry,
          gst_laundry,
          row.parking,
          gst_parking,
          row.transportation,
          gst_transportation,
          row.monthly_electricity_bill || 0,
          gst_electricity,
          row.monthly_water_bill || 0,
          gst_water,
          row.other_fees || 0,
          gst_other,
          row.to_pay,
          totalGST, // Add total GST here
          row.payment_id ? "Yes" : "No",
          row.payment_id,
          row.paid_on,
        ];
      });



      // Convert to CSV string
      const csvContent = [headers, ...rows]
        .map((e) => e.map((v) => `"${v || ""}"`).join(","))
        .join("\n");

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "monthly-history.csv";
      link.click();
      URL.revokeObjectURL(url);
    })
    .catch((err) => {
      console.log("ERR:", err);
      alert("Error fetching data");
    });
};



  render() {
    const paymentStatus = () => (cell,row) => {

      return (
        <>
          <div>
            {/* {console.log("paid value", cell)}; */}
            <div>
              {cell == 'No' || row.payment_id === null ? (
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


    const paymentMode = () => (cell) => {
      if (cell === "Offline") {
        return "Offline";
      } else if(cell === "One Time"){
        return "Online";
      }else {
        return "Online";
      }
    };


    const actionFormatter = (refObj) => (cell, row) => {

      return (
        <div>

          {cell == 'No' || row.payment_id === null ? (
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
                  window.open(`/admin/monthly_mark_as_paid/${row.planId}`, "_blank");
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

            ) :  <Button
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
                onClick={(e) => this.addPaymentclearDate(e,row.plan_id)}
              >
                Generate Invoice
              </Button>
            </div>
          ) : null} */}


          
         
        </div>
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
                    Monthly Activity
                  </span>
                </h3>
              </div>
            </section>
            <section className="content">
              <div className="box">
                <div className="box-body exportclass">

                      {/* <div class="additionalbutton"> 
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
                          window.open(`/admin/invoice_bulk_upload`, "_blank");
                        }}

                      >
                       Invoice Bulk Upload
                      </Button>
                      </div> */}

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


                <button className="btn btn-primary mb-2" onClick={this.handleCustomExportCSV}>
                  Download  CSV
                </button>
                  <BootstrapTable
                    data={this.state.paymentactivity}
                    exportCSV={ false }
                    search={true}
                    pagination
                    options={options}
                  >
                    <TableHeaderColumn
                      isKey
                      dataField="planId"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                     PLAN ID
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="SFname"
                      className={"text-uppercase"}
                      dataSort={true}
                      dataAlign="center"
                      width="150"
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
                      dataField="monthly"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      For Month
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="paid"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                      dataFormat={paymentStatus(this, this.a)}
                    >
                      Payment Status
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="paid_on"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                      dataFormat={this.dateFormattingPaidon}
                    >
                      Paid on
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="payment_id"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
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
                      dataField="parking"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Parking Fees
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="transportation"
                      dataSort={true}
                      dataAlign="center"
                      width="190"
                      className={"text-uppercase"}
                    >
                      Transportation Fees
                    </TableHeaderColumn>


                    <TableHeaderColumn
                      dataField="monthly_water_bill"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                     Monthly Water Bill
                    </TableHeaderColumn>


                    <TableHeaderColumn
                      dataField="monthly_electricity_bill"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Monthly Electricity Bill
                    </TableHeaderColumn>


                    <TableHeaderColumn
                      dataField="room_rent"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Room Rent
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="cultural_fees"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Cultural Fees
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="caution_deposit"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Caution deposit
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="addmission_fee"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Addmission Fee
                    </TableHeaderColumn>


                    <TableHeaderColumn
                      dataField="admisson_kit"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Admission Kit
                    </TableHeaderColumn>


                    <TableHeaderColumn
                      dataField="monthly_mess_fee"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Meal Fees
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="monthly_laundry_fee"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Laundry
                    </TableHeaderColumn>


                    <TableHeaderColumn
                      dataField="monthly_other_fees"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Monthly Other Fees
                    </TableHeaderColumn>


                    <TableHeaderColumn
                      dataField="monthly_other_fees_remark"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                     Other fees Remark
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="to_pay"
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
                    >
                      Total Fees To Pay
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="created_at"
                      dataFormat={dateFormatting(this)}
                      dataSort={true}
                      dataAlign="center"
                      width="150"
                      className={"text-uppercase"}
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
