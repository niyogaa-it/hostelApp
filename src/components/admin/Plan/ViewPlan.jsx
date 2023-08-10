import React, { Component } from "react";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
class SetPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_error: "",
      success: "",
      plan_data: {},
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    API.get(`/admin/secure/student_plan/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          this.setState({
            plan_data: res.data.details,
          });
        } else {
          swal("Oops!", res.data.message, "error");
          this.props.history.push("/admin/view_student");
        }
      })
      .catch((err) => {
        swal("Oops!", "Something went wrong!", "error");
        this.props.history.push("/admin/view_student");
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
                  <table class="table table-bordered">
                    {this.state.plan_data && this.state.plan_data ? (
                      <tbody>
                        <tr>
                          <td>Student Type</td>
                          <td>
                            {this.state.plan_data.student_type &&
                              this.state.plan_data.student_type.toUpperCase()}
                          </td>
                        </tr>
                        <tr>
                          <td>Student Name</td>
                          <td>{this.state.plan_data.student_name}</td>
                        </tr>
                        <tr>
                          <td>Plan Id</td>
                          <td>{this.state.plan_data.id}</td>
                        </tr>
                        <tr>
                          <td>Room No</td>
                          <td>{this.state.plan_data.room_no}</td>
                        </tr>
                        <tr>
                          <td>Bed Type</td>
                          <td>
                            {" "}
                            {this.state.plan_data.bed_type &&
                            this.state.plan_data.bed_type == "ub"
                              ? "Upper Berth"
                              : "Lower Berth"}
                          </td>
                        </tr>
                        {/*   <tr>
                          <td>
                            Meal Type
                          </td>
                          <td>
                            
                              {this.state.plan_data.meal_type &&
                                this.state.plan_data.meal_type}
                            
                          </td>
                        </tr> */}
                        <tr>
                          <td>Parking </td>
                          <td>
                            {this.state.plan_data.parking != 0 ? "YES" : "NA"}
                          </td>
                        </tr>
                        <tr>
                          <td>Parking Type</td>
                          <td>
                            {this.state.plan_data.parking_type != null
                              ? this.state.plan_data.parking_type + " WHEELER"
                              : "NA"}
                          </td>
                        </tr>
                        { this.state.plan_data.monthly != 0 &&
                        <>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          Monthly
                        </td>
                        <tr>
                          <td>Parking Fees</td>
                          <td>
                            {this.state.plan_data.parking &&
                              Number(
                                this.state.plan_data.parking
                              ).toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                                style: "currency",
                                currency: "INR",
                              })}
                          </td>
                        </tr>
                        <tr>
                          <td>Transportation Fees</td>
                          <td>
                            {this.state.plan_data.transportation &&
                              this.state.plan_data.transportation.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          Term {this.state.plan_data.term}
                        </td>
                        <tr>
                          <td>
                            Meal (
                            {this.state.plan_data.meal_type &&
                              this.state.plan_data.meal_type}
                            )
                          </td>
                          <td>
                            {this.state.plan_data.meal &&
                              this.state.plan_data.meal.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>
                        <tr>
                          <td>Laundry</td>
                          <td>
                            {this.state.plan_data.laundry &&
                              this.state.plan_data.laundry.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>
                        <td
                          colSpan={2}
                          style={{
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          One Time Payment
                        </td>
                        <tr>
                          <td>Admission Fee</td>
                          <td>
                            {this.state.plan_data.addmission_fee &&
                              this.state.plan_data.addmission_fee.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>
                        <tr>
                          <td>Admisson Kit</td>
                          <td>
                            {this.state.plan_data.admisson_kit &&
                              this.state.plan_data.admisson_kit.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>

                        <tr>
                          <td>Caution Deposit</td>
                          <td>
                            {this.state.plan_data.caution_deposit &&
                              this.state.plan_data.caution_deposit.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>
                        <tr>
                          <td>Cultural Fees</td>
                          <td>
                            {this.state.plan_data.cultural_fees &&
                              this.state.plan_data.cultural_fees.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>

                        <tr>
                          <td>Room Rent</td>
                          <td>
                            {this.state.plan_data.room_rent &&
                              this.state.plan_data.room_rent.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>
                        </> }
                        { this.state.plan_data.monthly == 0 && 
                        <>
                        <td
                          colSpan={2}
                          style={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          Monthly
                        </td>
                         <tr>
                          <td>Transportation Fee</td>
                          <td>
                          {this.state.plan_data.monthly_transportation_fee &&
                              this.state.plan_data.monthly_transportation_fee.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>

                        <tr>
                          <td>Four wheeler Parking Fee</td>
                          <td>
                          {this.state.plan_data.monthly_four_wheeler_parking_fee &&
                              this.state.plan_data.monthly_four_wheeler_parking_fee.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>

                        <tr>
                          <td>Two wheeler Parking Fee</td>
                          <td>
                          {this.state.plan_data.monthly_two_wheeler_parking_fee &&
                              this.state.plan_data.monthly_two_wheeler_parking_fee.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>

                        <tr>
                          <td>Water Bill</td>
                          <td>
                          {this.state.plan_data.monthly_water_bill &&
                              this.state.plan_data.monthly_water_bill.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>

                        <tr>
                          <td>Electricity Bill</td>
                          <td>
                          {this.state.plan_data.monthly_electricity_bill &&
                              this.state.plan_data.monthly_electricity_bill.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>

                        <tr>
                          <td>Mess Fee</td>
                          <td>
                          {this.state.plan_data.monthly_mess_fee &&
                              this.state.plan_data.monthly_mess_fee.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>

                        <tr>
                          <td>Laundry Fee</td>
                          <td>
                          {this.state.plan_data.monthly_laundry_fee &&
                              this.state.plan_data.monthly_laundry_fee.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>

                        <tr>
                          <td>Room Rent</td>
                          <td>
                          {this.state.plan_data.monthly_room_rent &&
                              this.state.plan_data.monthly_room_rent.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>

                        <tr>
                          <td>Admission Fee</td>
                          <td>
                          {this.state.plan_data.monthly_admission_fee &&
                              this.state.plan_data.monthly_admission_fee.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>

                        <tr>
                          <td>Other Fees</td>
                          <td>
                          {this.state.plan_data.monthly_other_fees &&
                              this.state.plan_data.monthly_other_fees.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                  style: "currency",
                                  currency: "INR",
                                }
                              )}
                          </td>
                        </tr>

                        <tr>
                          <td>Other Fees Remark</td>
                          <td>
                          {this.state.plan_data.monthly_other_fees_remark}
                          </td>
                        </tr>
                        </>}
                        <tr>
                          <td>
                            <b>Total</b>
                          </td>
                          <td>
                            <b>
                              {this.state.plan_data.total &&
                                this.state.plan_data.total.toLocaleString(
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
                      </tbody>
                    ) : null}
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
