import React, { Component } from "react";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import moment from "moment";
class SetPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_error: "",
      success: "",
      plan_data: [],
      studentDetails: {},
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    API.get(`/admin/secure/student_plan/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
        
          this.setState({
            studentDetails: res.data.student_details,
            plan_data: res.data.student_plan,
          });


        } else {

          swal("Oops!", res.data.message, "error");

        }
      })
      .catch((err) => {

        swal("Oops!", "Something went wrong!", "error");
        
      });
  }



  render() {
    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <div className="row">
              <div className="col-lg-10">
                <h3 className="card-title">
                  <span className="sp1">Home /</span>
                  <span className="sp1"> Student /</span>
                  <span className="sp2"> View Plan </span>
                </h3>
              </div>
            </div>
            <div className="col-lg-1"></div>
            <div
                      className="col-lg-8 card card-m-l pty-30"
                      style={{
                        width: "97%",
                      //   marginLeft: "16%",
                      // marginRight: "10%",
                      // marginLeft:"3%"
                      }}
                    >
              <div className="row">
                <>
                  <table className="table table-bordered">
                    
                    <tbody>
                      <tr>
                      <td
                        colSpan={2}
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                        >
                        Student Detail
                      </td>
                      </tr>
                      <tr>
                      <td>Student Name</td>
                      <td>{this.state.studentDetails.SFname}</td>
                      </tr>

                      <tr>
                      <td>Student Type</td>
                      <td> {this.state.studentDetails.student_type &&
                                    this.state.studentDetails.student_type.toUpperCase()}</td>
                      </tr>
                      
                      <tr>
                      <td>Student Phone No</td>
                      <td>{this.state.studentDetails.SmobNo}</td>
                      </tr>

                      <tr>
                      <td>Student Email</td>
                      <td>{this.state.studentDetails.StudEmail}</td>
                      </tr>

                      <tr>
                      <td>Room No</td>
                      <td>{this.state.studentDetails.roomNumber}</td>
                      </tr>

                      <tr>
                      <td>Type of Room</td>
                      <td>{this.state.studentDetails.room_type}</td>
                      </tr>

                      <tr>
                      <td>Type of Sharing</td>
                      <td>{this.state.studentDetails.occupancy}</td>
                      </tr>

                      <tr>
                      <td>Toilet type</td>
                      <td>{this.state.studentDetails.toilet_type}</td>
                      </tr>

                      <tr>
                      <td>Bed Type</td>
                      <td> 
                                  {" "}
                                  {this.state.studentDetails.bed_type &&
                                  this.state.studentDetails.bed_type == "ub"
                                    ? "Upper Berth"
                                    : "Lower Berth"}
                                </td>
                      </tr>

                      <tr>
                      <td> Meal Type</td>
                      <td>{this.state.studentDetails.food_preference &&
                                      this.state.studentDetails.food_preference}</td>
                      </tr>

                      <tr>
                      <td> Parking</td>
                      <td>{this.state.studentDetails.parking != 0 ? "YES" : "NA"}</td>
                      </tr>

                      <tr>
                      <td> Parking Type</td>
                      <td> {this.state.studentDetails.parking_type != null
                                    ? this.state.studentDetails.parking_type + " WHEELER"
                                    : "NA"}</td>
                      </tr>

                     {this.state.plan_data.length > 0 &&
                      this.state.plan_data.map((plan, index) => (
                        <React.Fragment key={index}>
                          {/* Header */}
                          <tr>
                            <td colSpan={2} style={{ fontWeight: "bold", textAlign: "center" }}>
                              {plan.plan_type}
                            </td>
                          </tr>

                          {/* PLAN ID 1, 2, 3 → One Time Payment */}
                          {(plan.plan_id === 1 || plan.plan_id === 2 || plan.plan_id === 3) && (
                            <>
                              <tr>
                                <td colSpan={2} style={{ fontWeight: "bold", textAlign: "center" }}>
                                  One Time Payment
                                </td>
                              </tr>
                              <tr><td>Room Rent (including gst)</td><td>{Number(plan.room_rent).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Cultural Fee (including gst)</td><td>{Number(plan.cultural_fees).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Caution Deposit</td><td>{Number(plan.caution_deposit).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Admission Fee (including gst)</td><td>{Number(plan.addmission_fee).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Admission Kit (including gst)</td><td>{Number(plan.admisson_kit).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                            </>
                          )}

                          {/* PLAN 1, 2 → Term I */}
                          {(plan.plan_id === 1 || plan.plan_id === 2) && (
                            <>
                              <tr><td colSpan={2} style={{fontWeight:"bold",textAlign:"center"}}>Term I</td></tr>
                              <tr><td>Meal Fees (including gst)</td><td>{Number(plan.meal_t1).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Laundry (including gst)</td><td>{Number(plan.laundry_t1).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                            </>
                          )}

                          {/* PLAN 1, 3, 4 → Term II */}
                          {(plan.plan_id === 1 || plan.plan_id === 3 || plan.plan_id === 4) && (
                            <>
                              <tr><td colSpan={2} style={{fontWeight:"bold",textAlign:"center"}}>Term II</td></tr>
                              <tr><td>Meal Fees (including gst)</td><td>{Number(plan.meal_t2).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Laundry (including gst)</td><td>{Number(plan.laundry_t2).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                            </>
                          )}

                          {/* PLAN 5 → Lateral / Temporary */}
                          {plan.plan_id === 5 && (plan.plan_type === "lateral" || plan.plan_type === "temporary") && (
                            <>
                              <tr><td colSpan={2} style={{fontWeight:"bold",textAlign:"center"}}>One Time Payment</td></tr>
                              <tr><td>Room Rent (including gst)</td><td>{Number(plan.room_rent).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Cultural Fee (including gst)</td><td>{Number(plan.cultural_fees).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Caution Deposit</td><td>{Number(plan.caution_deposit).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Admission Fee (including gst)</td><td>{Number(plan.addmission_fee).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Admission Kit (including gst)</td><td>{Number(plan.admisson_kit).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Meal Fees (including gst)</td><td>{Number(plan.monthly_mess_fee).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Laundry (including gst)</td><td>{Number(plan.monthly_laundry_fee).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                            </>
                          )}

                          {/* PLAN 5 → Prepaid */}
                          {plan.plan_id === 5 && plan.plan_type === "prepaid" && (
                            <>
                              <tr><td colSpan={2} style={{fontWeight:"bold",textAlign:"center"}}>Monthly</td></tr>
                              <tr><td>Transportation Date</td><td>{plan.transport_start_date} - {plan.transport_end_date}</td></tr>
                              <tr><td>Transportation Fee (including gst)</td><td>{Number(plan.transportation).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Parking Date</td><td>{plan.parking_start_date} - {plan.parking_end_date}</td></tr>
                              <tr><td>Parking Fee (including gst)</td><td>{Number(plan.parking).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                            </>
                          )}

                          {/* PLAN 5 → Postpaid */}
                          {plan.plan_id === 5 && plan.plan_type === "postpaid" && (
                            <>
                              <tr><td colSpan={2} style={{fontWeight:"bold",textAlign:"center"}}>Monthly</td></tr>
                              <tr><td>Water Bill (including gst)</td><td>{Number(plan.monthly_water_bill).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                              <tr><td>Electricity Bill (including gst)</td><td>{Number(plan.monthly_electricity_bill).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td></tr>
                            </>
                          )}

                          {/* Common Footer for All */}
                          <tr>
                            <td>Monthly Other Fees</td>
                            <td>{Number(plan.monthly_other_fees).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</td>
                          </tr>
                          <tr>
                            <td>Other Fees Remark</td>
                            <td>{plan.monthly_other_fees_remark}</td>
                          </tr>
                          <tr>
                            <td><b>Total (including gst)</b></td>
                            <td><b>{Number(plan.to_pay).toLocaleString("en-IN",{style:"currency",currency:"INR"})}</b></td>
                          </tr>
                        </React.Fragment>
                      ))}


                      {this.state.plan_data.length === 0 && (
                        <tr>
                          <td colSpan="2" style={{ textAlign: "center", color: "gray" }}>
                            No plan selected
                          </td>
                        </tr>
                      )}


                      </tbody>
                 
                  </table>
                  <br />
                </>
              </div>
            </div>
          </section>
          <section className="card-m-l form-m-t"></section>
        </div>
      </Layout>
    );
  }
}

export default SetPlan;
