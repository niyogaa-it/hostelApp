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
      plan_data: {},
      studentDetails: "",
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    API.get(`/admin/secure/student_plan/${id}`)
      .then((res) => {
        if (res.data.status === 200) {

          console.log(res.data.student_plan);
        
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
                  <span className="sp2"> View Plan</span>
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

                      { this.state.plan_data.length > 0 && (this.state.plan_data[0].plan_id == 1 || this.state.plan_data[0].plan_id == 2 || this.state.plan_data[0].plan_id == 3) &&
                      <>

                      <tr>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}>
                          {this.state.plan_data[0].plan_type}
                        </td>
                      </tr>

                      <tr>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}>
                          One Time Payment
                        </td>
                      </tr>

                      <tr>
                        <td>Room Rent (including gst)</td>
                        <td>
                          {this.state.plan_data[0].room_rent &&
                            Number(
                              this.state.plan_data[0].room_rent
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                      <tr>
                        <td>Cultural Fee (including gst)</td>
                        <td>
                          {this.state.plan_data[0].cultural_fees &&
                            Number(
                              this.state.plan_data[0].cultural_fees
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>
                   
                      <tr>
                        <td>Caution Deposit</td>
                        <td>
                          {this.state.plan_data[0].caution_deposit &&
                            Number(
                              this.state.plan_data[0].caution_deposit
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                      <tr>
                        <td>Admission Fee (including gst)</td>
                        <td>
                          {this.state.plan_data[0].addmission_fee &&
                            Number(
                              this.state.plan_data[0].addmission_fee
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                      <tr>
                        <td>Admission Kit (including gst)</td>
                        <td>
                          {this.state.plan_data[0].admisson_kit &&
                            Number(
                              this.state.plan_data[0].admisson_kit
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>
                      </> }

                      { this.state.plan_data.length > 0 && (this.state.plan_data[0].plan_id == 1 || this.state.plan_data[0].plan_id == 2 ) &&
                      <>

                      <tr>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}>
                           Term I 
                        </td>
                      </tr>

                      <tr>
                        <td>Meal Fees (including gst)</td>
                        <td>
                          {this.state.plan_data[0].meal_t1 &&
                            Number(
                              this.state.plan_data[0].meal_t1

                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                      <tr>
                        <td>Laundry (including gst)</td>
                        <td>
                          {this.state.plan_data[0].laundry_t1 &&
                            Number(
                              this.state.plan_data[0].laundry_t1
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                      </> }


                      { this.state.plan_data.length > 0 && (this.state.plan_data[0].plan_id == 1 || this.state.plan_data[0].plan_id == 3 || this.state.plan_data[0].plan_id == 4) &&
                      <>

                      <tr>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}>
                           Term II
                        </td>
                      </tr>

                      <tr>
                        <td>Meal Fees (including gst)</td>
                        <td>
                          {this.state.plan_data[0].meal_t2 &&
                            Number(
                              this.state.plan_data[0].meal_t2
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                      <tr>
                        <td>Laundry (including gst)</td>
                        <td>
                          {this.state.plan_data[0].laundry_t2 &&
                            Number(
                              this.state.plan_data[0].laundry_t2
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                     

                      </> }




                      { this.state.plan_data.length > 0 && this.state.plan_data[0].plan_id == 5 && (this.state.plan_data[0].plan_type == 'lateral' || this.state.plan_data[0].plan_type == 'temporary') &&
                      <>

                      <tr>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}>
                          {this.state.plan_data[0].plan_type}
                        </td>
                      </tr>

                      <tr>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}>
                          One Time Payment
                        </td>
                      </tr>

                      <tr>
                        <td>Room Rent (including gst)</td>
                        <td>
                          {this.state.plan_data[0].room_rent &&
                            Number(
                              this.state.plan_data[0].room_rent
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                      <tr>
                        <td>Cultural Fee (including gst)</td>
                        <td>
                          {this.state.plan_data[0].cultural_fees &&
                            Number(
                              this.state.plan_data[0].cultural_fees
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>
                   
                      <tr>
                        <td>Caution Deposit</td>
                        <td>
                          {this.state.plan_data[0].caution_deposit &&
                            Number(
                              this.state.plan_data[0].caution_deposit
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                      <tr>
                        <td>Admission Fee (including gst)</td>
                        <td>
                          {this.state.plan_data[0].addmission_fee &&
                            Number(
                              this.state.plan_data[0].addmission_fee
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                      <tr>
                        <td>Admission Kit (including gst)</td>
                        <td>
                          {this.state.plan_data[0].admisson_kit &&
                            Number(
                              this.state.plan_data[0].admisson_kit
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>


                            
                      <tr>
                        <td>Meal Fees (including gst)</td>
                        <td>
                          {this.state.plan_data[0].monthly_mess_fee &&
                            Number(
                              this.state.plan_data[0].monthly_mess_fee

                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                      <tr>
                        <td>Laundry (including gst)</td>
                        <td>
                          {this.state.plan_data[0].monthly_laundry_fee &&
                            Number(
                              this.state.plan_data[0].monthly_laundry_fee
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                      </> }



                      { this.state.plan_data.length > 0 && this.state.plan_data[0].plan_id == 5 && (this.state.plan_data[0].plan_type == 'prepaid') &&
                      <>

                      <tr>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}>
                          {this.state.plan_data[0].plan_type}
                        </td>
                      </tr>

                      <tr>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}>
                          Monthly
                        </td>
                      </tr>

                      <tr>
                        <td>Transpotation Date</td>
                        <td>
                        {moment(this.state.plan_data[0].transport_start_date).format("YYYY-MM-DD")} - {moment(this.state.plan_data[0].transport_end_date).format("YYYY-MM-DD")}
                        </td>
                      </tr>

                      <tr>
                        <td>Transpotation fees (including gst)</td>
                        <td>
                          {this.state.plan_data[0].transportation &&
                            Number(
                              this.state.plan_data[0].transportation
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>


                      <tr>
                        <td>Parking  Date</td>
                        <td>
                        {moment(this.state.plan_data[0].parking_start_date).format("YYYY-MM-DD")} - {moment(this.state.plan_data[0].parking_end_date).format("YYYY-MM-DD")}
                        </td>
                      </tr>

                      <tr>
                        <td>Parking fees (including gst)</td>
                        <td>
                          {this.state.plan_data[0].parking &&
                            Number(
                              this.state.plan_data[0].parking
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>
                  
                      </> }



                      { this.state.plan_data.length > 0 && this.state.plan_data[0].plan_id == 5 && (this.state.plan_data[0].plan_type == 'postpaid') &&
                      <>

                      <tr>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}>
                          {this.state.plan_data[0].plan_type}
                        </td>
                      </tr>

                      <tr>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}>
                          Monthly
                        </td>
                      </tr>

                      <tr>
                        <td>Water Bill (including gst)</td>
                        <td>
                          {this.state.plan_data[0].monthly_water_bill &&
                            Number(
                              this.state.plan_data[0].monthly_water_bill
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>

                      <tr>
                        <td>Electricity Bill (including gst)</td>
                        <td>
                          {this.state.plan_data[0].monthly_electricity_bill &&
                            Number(
                              this.state.plan_data[0].monthly_electricity_bill
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>
                  
                      </> }

                      { this.state.plan_data.length > 0 &&
                      <>


                      <tr>
                        <td>Monthly Other Fees</td>
                        <td>
                          {this.state.plan_data[0].monthly_other_fees &&
                            Number(
                              this.state.plan_data[0].monthly_other_fees
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>


                      <tr>
                        <td>Other fees Remark</td>
                        <td>
                          {this.state.plan_data[0].monthly_other_fees_remark &&
                            Number(
                              this.state.plan_data[0].monthly_other_fees_remark
                            ).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                              style: "currency",
                              currency: "INR",
                            })}
                        </td>
                      </tr>



                      <tr>
                        <td>
                        <b>Total (including gst)</b>
                        </td>
                        <td>
                        <b>
                        {this.state.plan_data[0].to_pay.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                            style: "currency",
                            currency: "INR",
                          }
                          )}
                        </b>
                        </td>
                      </tr>

                   

                    

                      </> }


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
