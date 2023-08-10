import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import "./masterdata.css";

let initialValues = {
  monthly_transportation_fee: "",
  monthly_four_wheeler_parking_fee: "",
  monthly_two_wheeler_parking_fee: "",
  monthly_water_bill: "",
  monthly_electricity_bill: "",
  monthly_mess_fee: "",
  monthly_laundry_fee: "",
  monthly_room_rent: "",
  monthly_admission_fee: "",
  monthly_other_fees: "",
  monthly_other_fees_remark: "",
};

class MonthlyPlan extends Component {
  constructor(props) {
    const studentid = decodeURIComponent(props.match.params.id);
    super(props);
    this.state = {
      server_error: "",
      success: "",
      show_buliding: false,
      bed_type: "",
      building_name: "",
      building_id: "",
      building_dta: [],
      floor_list: [],
      singel_building: [],
      room_number_aloted: false,
      bedType: [],
      roomData: [],
      studenttype: "",
      total_price: 0,
      studentDetails: [],
      price_obj: "",
      monthlyFormValues: {
        monthly_transportation_fee: "",
        monthly_four_wheeler_parking_fee: "",
        monthly_two_wheeler_parking_fee: "",
        monthly_water_bill: "",
        monthly_electricity_bill: "",
        monthly_mess_fee: "",
        monthly_laundry_fee: "",
        monthly_room_rent: "",
        monthly_admission_fee: "",
        monthly_other_fees: "",
        monthly_other_fees_remark: "",
      },
    };
  }


  componentDidMount() {
    let id = decodeURIComponent(this.props.match.params.id);
    this.getPlanDtl(id);
  }

  getPlanDtl(id) {
   
    API.get(`/admin/secure/student_plan/${id}`)
      .then((response) => {

        if (response.status === 200) {

          this.setState({
            studentDetails: response.data.details,
            total_price:
            response.data.details.monthly_transportation_fee +
            response.data.details.monthly_four_wheeler_parking_fee +
            response.data.details.monthly_two_wheeler_parking_fee +
            response.data.details.monthly_water_bill +
            response.data.details.monthly_electricity_bill + 
            response.data.details.monthly_mess_fee +
            response.data.details.monthly_admission_fee +
            response.data.details.monthly_laundry_fee +
            response.data.details.monthly_room_rent +
            response.data.details.monthly_other_fees,
          });

        
        }
        if (response.status === 401) {
          swal("Warning", response.data.message, "warning");
        }
        
      })
      .catch((err) => {
        console.log(err);
      });
  }

  submitAlert = (values) => {
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to set this Monthly plan",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSet) => {
      if (willSet) {
        
        this.handleSubmitEvent(values);
      }
    });
  };

  
  handleSubmitEvent = (e) => {
 
    let postData = {
      //id: decodeURIComponent(this.props.match.params.id),
      id: this.state.studentDetails.id,
      StudEmail: this.state.studentDetails.student_email,
      SmobNo: this.state.studentDetails.student_phone_no,
      SFname: this.state.studentDetails.student_name,
      monthly_transportation_fee: e.monthly_transportation_fee,
      monthly_four_wheeler_parking_fee: e.monthly_four_wheeler_parking_fee,
      monthly_two_wheeler_parking_fee: e.monthly_two_wheeler_parking_fee,
      monthly_water_bill: e.monthly_water_bill,
      monthly_electricity_bill: e.monthly_electricity_bill,
      monthly_mess_fee: e.monthly_mess_fee,
      monthly_laundry_fee: e.monthly_laundry_fee,
      monthly_room_rent: e.monthly_room_rent,
      monthly_admission_fee: e.monthly_admission_fee,
      monthly_other_fees: e.monthly_other_fees,
      monthly_other_fees_remark: e.monthly_other_fees_remark,
      
    };

    API.post("/admin/secure/plan/edit_monthly_plan", postData)
      .then((response) => {
    
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          this.props.history.push("/admin/view_student/");
        }
        if (response.data.status === 401) {
          console.log(response.data.message);
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch((error) => {
        swal("Error", error, "warning");
      });
  };


  /*handleChange = (e) => {
    e.target.value;
    
  };*/


  render() {

    const initialMonthlyValues = Object.assign(initialValues, {
      monthly_transportation_fee: this.state.studentDetails.monthly_transportation_fee ? this.state.studentDetails.monthly_transportation_fee : 0 ,
      monthly_four_wheeler_parking_fee: this.state.studentDetails.monthly_four_wheeler_parking_fee ? this.state.studentDetails.monthly_four_wheeler_parking_fee : 0 ,
      monthly_two_wheeler_parking_fee: this.state.studentDetails.monthly_two_wheeler_parking_fee ? this.state.studentDetails.monthly_two_wheeler_parking_fee : 0,
      monthly_water_bill: this.state.studentDetails.monthly_water_bill ? this.state.studentDetails.monthly_water_bill : 0,

      monthly_electricity_bill: this.state.studentDetails.monthly_electricity_bill ? this.state.studentDetails.monthly_electricity_bill : 0,
      monthly_mess_fee: this.state.studentDetails.monthly_mess_fee ? this.state.studentDetails.monthly_mess_fee : 0,
      monthly_room_rent: this.state.studentDetails.monthly_laundry_fee ? this.state.studentDetails.monthly_laundry_fee : 0,
      monthly_laundry_fee: this.state.studentDetails.monthly_room_rent ? this.state.studentDetails.monthly_room_rent : 0,
      monthly_admission_fee: this.state.studentDetails.monthly_admission_fee ? this.state.studentDetails.monthly_admission_fee : 0,
      monthly_other_fees: this.state.studentDetails.monthly_other_fees ? this.state.studentDetails.monthly_other_fees : 0,
      monthly_other_fees_remark: this.state.studentDetails.monthly_other_fees_remark,
    });


    /*const validateMonthly = Yup.object().shape({
      monthly_transportation_fee: Yup.number().required(
        "Transportation Fee is required"
      ),
      monthly_four_wheeler_parking_fee: Yup.number().required(
        "Four wheeler Parking Fee is required"
      ),
      monthly_two_wheeler_parking_fee: Yup.number().required(
        "Two wheeler Parking Fee is required"
      ),
      monthly_water_bill: Yup.number().required("Water Bill is required"),
      monthly_electricity_bill: Yup.number().required(
        "Electricity Bill is required"
      ),
      monthly_mess_fee: Yup.number().required("Mess Fee is required"),
      monthly_laundry_fee: Yup.number().required("Laundry Fee is required"),
      monthly_room_rent: Yup.number().required("Room Rent is required"),
      monthly_admission_fee: Yup.number().required("Admission Fee is required"),
      monthly_other_fees: Yup.number().required("Other Fees is required"),
      monthly_other_fees_remark: Yup.string().required(
        "Other Fees Remark is required"
      ),
    });*/


    const validateMonthly = Yup.object().shape({
      monthly_transportation_fee: Yup.number().required(
        "Transportation Fee is required"
      ),
      monthly_four_wheeler_parking_fee: Yup.number().required(
        "Four wheeler Parking Fee is required"
      ),
      monthly_two_wheeler_parking_fee: Yup.number().required(
        "Two wheeler Parking Fee is required"
      ),
      monthly_water_bill: Yup.number().required("Water Bill is required"),
      monthly_electricity_bill: Yup.number().required(
        "Electricity Bill is required"
      ),
      monthly_mess_fee: Yup.number().required("Mess Fee is required"),
      monthly_laundry_fee: Yup.number().required("Laundry Fee is required"),
      monthly_room_rent: Yup.number().required("Room Rent is required"),
      monthly_admission_fee: Yup.number().required("Admission Fee is required"),
      monthly_other_fees: Yup.number().required("Other Fees is required"),
    });

    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <Formik
              initialValues={initialMonthlyValues}
              validationSchema={validateMonthly}
              onSubmit={this.handleSubmitEvent}
            >
              {({ errors, touched, setFieldValue, values }) => (
               
                <Form>
                  <div className="row">
                    <h3 className="card-title">
                      <span className="sp1">Home /</span>
                      <span className="sp1"> Student /</span>
                      <span className="sp2"> Monthly Plan</span>
                    </h3>
                  </div>
                  <div
                    className="col-lg-8 card card-m-l pty-30"
                    style={{
                      width: "97%",
                    }}
                  >
                    <div className="row">
                     
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td>Room No</td>
                                  <td>{this.state.studentDetails.room_no}</td>
                                </tr>
                                <tr>
                                  <td>Student Name</td>
                                  <td>{this.state.studentDetails.student_name}</td>
                                </tr>
                                <tr>
                                  <td>Student Phone No</td>
                                  <td>{this.state.studentDetails.student_phone_no}</td>
                                </tr>
                                <tr>
                                  <td>Student Email</td>
                                  <td>{this.state.studentDetails.student_email}</td>
                                </tr>

                                <tr>
                                  <td>Monthly Transportation Fee</td>
                                  <td>
                                    <Field
                                      name="monthly_transportation_fee"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      onChange={(e) => {
                                        
                                        this.setState({
                                          ...this.state,
                                          monthlyFormValues: {
                                            ...this.state.monthlyFormValues,
                                            monthly_transportation_fee:
                                              e.target.value,
                                          },
                                        });
                                        setFieldValue(
                                          "monthly_transportation_fee",
                                          e.target.value
                                        );
                                      }}

                                      
                                    ></Field>
                                    {errors.monthly_transportation_fee &&
                                    touched.monthly_transportation_fee ? (
                                      <div className="text-danger">
                                        {errors.monthly_transportation_fee}
                                      </div>
                                    ) : null}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Four wheeler Parking Fee</td>
                                  <td>
                                    <Field
                                      name="monthly_four_wheeler_parking_fee"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      onChange={(e) => {
                                        this.setState({
                                          ...this.state,
                                          monthlyFormValues: {
                                            ...this.state.monthlyFormValues,
                                            monthly_four_wheeler_parking_fee:
                                              e.target.value,
                                          },
                                        });
                                        setFieldValue(
                                          "monthly_four_wheeler_parking_fee",
                                          e.target.value
                                        );
                                      }}
                                    ></Field>
                                    {errors.monthly_four_wheeler_parking_fee &&
                                    touched.monthly_four_wheeler_parking_fee ? (
                                      <div className="text-danger">
                                        {
                                          errors.monthly_four_wheeler_parking_fee
                                        }
                                      </div>
                                    ) : null}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Two wheeler Parking Fee</td>
                                  <td>
                                    <Field
                                      name="monthly_two_wheeler_parking_fee"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      onChange={(e) => {
                                        this.setState({
                                          ...this.state,
                                          monthlyFormValues: {
                                            ...this.state.monthlyFormValues,
                                            monthly_two_wheeler_parking_fee:
                                              e.target.value,
                                          },
                                        });
                                        setFieldValue(
                                          "monthly_two_wheeler_parking_fee",
                                          e.target.value
                                        );
                                      }}
                                    ></Field>
                                    {errors.monthly_two_wheeler_parking_fee &&
                                    touched.monthly_two_wheeler_parking_fee ? (
                                      <div className="text-danger">
                                        {errors.monthly_two_wheeler_parking_fee}
                                      </div>
                                    ) : null}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Water Bill</td>
                                  <td>
                                    <Field
                                      name="monthly_water_bill"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      onChange={(e) => {
                                        this.setState({
                                          ...this.state,
                                          monthlyFormValues: {
                                            ...this.state.monthlyFormValues,
                                            monthly_water_bill:
                                              e.target.value,
                                          },
                                        });
                                        setFieldValue(
                                          "monthly_water_bill",
                                          e.target.value
                                        );
                                      }}
                                    ></Field>
                                    {errors.monthly_water_bill &&
                                    touched.monthly_water_bill ? (
                                      <div className="text-danger">
                                        {errors.monthly_water_bill}
                                      </div>
                                    ) : null}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Electricity Bill</td>
                                  <td>
                                    <Field
                                      name="monthly_electricity_bill"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      onChange={(e) => {
                                        this.setState({
                                          ...this.state,
                                          monthlyFormValues: {
                                            ...this.state.monthlyFormValues,
                                            monthly_electricity_bill:
                                              e.target.value,
                                          },
                                        });
                                        setFieldValue(
                                          "monthly_electricity_bill",
                                          e.target.value
                                        );
                                      }}
                                    ></Field>
                                    {errors.monthly_electricity_bill &&
                                    touched.monthly_electricity_bill ? (
                                      <div className="text-danger">
                                        {errors.monthly_electricity_bill}
                                      </div>
                                    ) : null}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Mess Fee</td>
                                  <td>
                                    <Field
                                      name="monthly_mess_fee"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      onChange={(e) => {
                                        this.setState({
                                          ...this.state,
                                          monthlyFormValues: {
                                            ...this.state.monthlyFormValues,
                                            monthly_mess_fee:
                                              e.target.value,
                                          },
                                        });
                                        setFieldValue(
                                          "monthly_mess_fee",
                                          e.target.value
                                        );
                                      }}
                                    ></Field>
                                    {errors.monthly_mess_fee &&
                                    touched.monthly_mess_fee ? (
                                      <div className="text-danger">
                                        {errors.monthly_mess_fee}
                                      </div>
                                    ) : null}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Laundry Fee</td>
                                  <td>
                                    <Field
                                      name="monthly_laundry_fee"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      onChange={(e) => {
                                        this.setState({
                                          ...this.state,
                                          monthlyFormValues: {
                                            ...this.state.monthlyFormValues,
                                            monthly_laundry_fee:
                                              e.target.value,
                                          },
                                        });
                                        setFieldValue(
                                          "monthly_laundry_fee",
                                          e.target.value
                                        );
                                      }}
                                    ></Field>
                                    {errors.monthly_laundry_fee &&
                                    touched.monthly_laundry_fee ? (
                                      <div className="text-danger">
                                        {errors.monthly_laundry_fee}
                                      </div>
                                    ) : null}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Room Rent</td>
                                  <td>
                                    <Field
                                      name="monthly_room_rent"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      onChange={(e) => {
                                        this.setState({
                                          ...this.state,
                                          monthlyFormValues: {
                                            ...this.state.monthlyFormValues,
                                            monthly_room_rent:
                                              e.target.value,
                                          },
                                        });
                                        setFieldValue(
                                          "monthly_room_rent",
                                          e.target.value
                                        );
                                      }}
                                    ></Field>
                                    {errors.monthly_room_rent &&
                                    touched.monthly_room_rent ? (
                                      <div className="text-danger">
                                        {errors.monthly_room_rent}
                                      </div>
                                    ) : null}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Admission Fee</td>
                                  <td>
                                    <Field
                                      name="monthly_admission_fee"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      onChange={(e) => {
                                        this.setState({
                                          ...this.state,
                                          monthlyFormValues: {
                                            ...this.state.monthlyFormValues,
                                            monthly_admission_fee:
                                              e.target.value,
                                          },
                                        });
                                        setFieldValue(
                                          "monthly_admission_fee",
                                          e.target.value
                                        );
                                      }}
                                    ></Field>
                                    {errors.monthly_admission_fee &&
                                    touched.monthly_admission_fee ? (
                                      <div className="text-danger">
                                        {errors.monthly_admission_fee}
                                      </div>
                                    ) : null}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Other Fees</td>
                                  <td>
                                    <Field
                                      name="monthly_other_fees"
                                      autoComplete="off"
                                      className="form-control"
                                      type="number"
                                      onChange={(e) => {
                                        this.setState({
                                          ...this.state,
                                          monthlyFormValues: {
                                            ...this.state.monthlyFormValues,
                                            monthly_other_fees:
                                              e.target.value,
                                          },
                                        });
                                        setFieldValue(
                                          "monthly_other_fees",
                                          e.target.value
                                        );
                                      }}
                                    ></Field>
                                    {errors.monthly_other_fees &&
                                    touched.monthly_other_fees ? (
                                      <div className="text-danger">
                                        {errors.monthly_other_fees}
                                      </div>
                                    ) : null}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Other Remark</td>
                                  <td>
                                    <Field
                                      name="monthly_other_fees_remark"
                                      autoComplete="off"
                                      className="form-control"
                                      type="textarea"
                                     
                                    ></Field>
                                    {errors.monthly_other_fees_remark &&
                                    touched.monthly_other_fees_remark ? (
                                      <div className="text-danger">
                                        {errors.monthly_other_fees_remark}
                                      </div>
                                    ) : null}
                                  </td>
                                </tr>
                                
                                <tr>
                                  <td>
                                    <b>Total (including gst)</b>
                                  </td>
                                  <td>
                                    <b>
                                    {this.state.total_price.toLocaleString(
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
                            </table>
                            <div style={{ marginLeft: "38%" }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  this.submitAlert(values);
                                }}
                                style={{
                                  padding: "8px 18px 8px 18px",
                                  borderRadius: "0.375rem",

                                  fontSize: "16px",
                                  color: "#fff",
                                  backgroundColor: "#883495",
                                  borderColor: "#883495",
                                  boxShadow:
                                    "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%",
                                }}
                              >
                                Submit
                              </button>

                            </div>
                            <br />
                         
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </section>
        </div>
      </Layout>
    );
  }
}

export default MonthlyPlan;
