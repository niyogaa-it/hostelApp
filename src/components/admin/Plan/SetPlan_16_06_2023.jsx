import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import "./masterdata.css";

let initialValues = {
  student_type: "",
  bed_type: "",
  term: "",
};

let initialMonthlyValues = {
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

class SetPlan extends Component {
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
      studentDetails: "",
      price_obj: "",
      formValues: {
        student_type: "",
        bed_type: "",
        term: "",
      },
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

  handleChange = (e) => {
    let studenttype = {
      student_id: decodeURIComponent(this.props.match.params.id),
      student_type: e.target.value,
    };
    this.setState({ studenttype: e.target.value });

    API.post("/admin/secure/plan/get_bed", studenttype)
      .then((response) => {
        if (response.data.status === 200) {
          this.setState({
            bedType: response.data.bed_type,
          });
        }
        if (response.data.status === 401) {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch((error) => {
        swal("Error", error, "warning");
      });
  };
  handleChangeBedType = (e) => {
    this.setState({ bed_type: e.target.value });
  };

  handleChangeTerm = (e) => {
    let bedtype = {
      student_id: decodeURIComponent(this.props.match.params.id),
      student_type: this.state.studenttype,
      bed_type: this.state.bed_type,
      term: e.target.value,
    };
    this.setState({
      formValues: {
        student_type: this.state.studenttype,
        bed_type: this.state.bed_type,
        term: e.target.value,
      },
    });
    if (e.target.value != "monthly") {
      API.post("/admin/secure/plan/get_plan", bedtype)
        .then((response) => {
          if (response.data.status === 200) {
            this.setState({
              roomData: response.data.get_plan,
              price_obj: response.data.price_obj,
              studentDetails: response.data.student_details,
              total_price:
                response.data.get_plan[0].total +
                response.data.price_obj.bus_price +
                response.data.price_obj.laundry +
                response.data.price_obj.meal_price +
                response.data.price_obj.parking_fees,
            });
          }
          if (response.data.status === 401) {
            swal("Warning", response.data.message, "warning");
          }
        })
        .catch((error) => {
          swal("Error", error, "warning");
        });
    } else {
      API.get(
        `/admin/secure/per/student/${decodeURIComponent(
          this.props.match.params.id
        )}`
      )
        .then((response) => {
          if (response.data.status === 200) {
            this.setState({
              studentDetails: response.data.details[0],
            });
          }
          if (response.data.status === 401) {
            swal("Warning", response.data.message, "warning");
          }
        })
        .catch((error) => {
          swal("Error", error, "warning");
        });
    }
  };
  submitAlert = (values, item) => {
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to set this plan",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSet) => {
      if (willSet) {
        this.handleSetPlan(values, item);
      }
    });
  };
  handleSetPlan = (values, item) => {
    // console.log("values>>", values);
    // console.log("item>>", item);

    let postData = {
      student_id: decodeURIComponent(this.props.match.params.id),
      plan_id: item.id,
      bed_type: item.bed_type,
      student_type: values.student_type,
      term: values.term,
      addmission_fee: item.addmission_fee,
      admisson_kit: item.admisson_kit,
      caution_deposit: item.caution_deposit,
      cultural_fees: item.cultural_fees,
      room_no: this.state.studentDetails.room_id,
      room_rent: item.room_rent,
      parking: this.state.price_obj.parking_fees,
      parking_type: this.state.studentDetails.parking_type,
      StudEmail: this.state.studentDetails.StudEmail,
      SmobNo: this.state.studentDetails.SmobNo,
      SFname: this.state.studentDetails.SFname,
      transportation: this.state.price_obj.bus_price,
      meal: this.state.price_obj.meal_price,
      meal_type: this.state.studentDetails.food_preference,
      laundry: this.state.price_obj.laundry,
      total: this.state.total_price,
      to_pay: this.state.total_price,
      plan_type: "OneTime",
      total_one_time: this.state.roomData[0].total,
    };

    API.post("/admin/secure/plan/set_plan", postData)
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

  handleMonthlyChange = (e, value) => {
    console.log(e);
  };

  handleSubmitEvent = (e) => {
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to set this plan",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSet) => {
      if (willSet) {
        let postData = {
          student_id: decodeURIComponent(this.props.match.params.id),
          bed_type:
            this.state.formValues.bed_type == "Lower Birth" ? "lb" : "ub",
          student_type: this.state.formValues.student_type,
          room_no: this.state.studentDetails.room_id,
          parking: 0,
          parking_type: this.state.studentDetails.parking_type,
          StudEmail: this.state.studentDetails.StudEmail,
          SmobNo: this.state.studentDetails.SmobNo,
          SFname: this.state.studentDetails.SFname,
          monthly_transportation_fee: e.monthly_transportation_fee,
          meal: 1,
          meal_type: this.state.studentDetails.food_preference,
          monthly: 0,
          monthly_four_wheeler_parking_fee: e.monthly_four_wheeler_parking_fee,
          monthly_two_wheeler_parking_fee: e.monthly_two_wheeler_parking_fee,
          monthly_water_bill: e.monthly_water_bill,
          monthly_electricity_bill: e.monthly_electricity_bill,
          monthly_mess_fee: e.monthly_mess_fee,
          monthly_laundry_fee: e.monthly_laundry_fee,
          monthly_room_rent: e.monthly_room_rent,
          monthly_admission_fee: e.monthly_admission_fee,
          monthly_other_fees: e.monthly_admission_fee,
          monthly_other_fees_remark: e.monthly_other_fees_remark,
        };

        API.post("/admin/secure/plan/set_plan", postData)
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
      }
    });
  };

  render() {
    const validateRoom = Yup.object().shape({
      student_type: Yup.string().required("Student Type is required"),
      bed_type: Yup.string().required("Bed Type is required"),
      term: Yup.string().required("Term is required"),
    });

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
      monthly_other_fees_remark: Yup.string().required(
        "Other Fees Remark is required"
      ),
    });

    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <Formik
              initialValues={initialValues}
              validationSchema={validateRoom}
              //onSubmit={this.handleSubmitEvent}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form>
                  <div className="row1">
                    <h3 className="card-title">
                      <span className="sp1">Home /</span>
                      <span className="sp1"> Student /</span>
                      <span className="sp2"> Set Plan</span>
                    </h3>
                    <div
                      className="col-lg-8 card card-m-l pty-30"
                      style={{
                        width: "97%",
                        //   marginLeft: "16%",
                        // marginRight: "10%",
                        // marginLeft:"3%"
                      }}
                    >
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-lg-2 ">
                            <label htmlFor="student_type" style={{}}>
                              Student Type
                            </label>
                          </div>
                          <div className="col-lg-5">
                            <Field
                              name="student_type"
                              component="select"
                              autoComplete="off"
                              className="form-control"
                              onChange={(e) => {
                                this.handleChange(e);
                                setFieldValue("student_type", e.target.value);
                                setFieldValue("bed_type", "");
                              }}
                            >
                              <option value="">Default Select</option>
                              <option value="old">Old Student</option>
                              <option value="new">New Student</option>
                            </Field>
                            {errors.student_type && touched.student_type ? (
                              <div className="text-danger">
                                {errors.student_type}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {this.state.bedType.length > 0 && values.student_type ? (
                        <>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label htmlFor="bed_type">Bed Type</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  component="select"
                                  autoComplete="off"
                                  name="bed_type"
                                  className={"form-control"}
                                  onChange={(e) => {
                                    this.handleChangeBedType(e);
                                    setFieldValue("bed_type", e.target.value);
                                    setFieldValue("term", "");
                                  }}
                                >
                                  <option key="-1" value="">
                                    Default Select
                                  </option>
                                  {this.state.bedType.map((bedtype, i) => (
                                    <option value={bedtype.bedType} key={i}>
                                      {bedtype.bed_type == "ub"
                                        ? "Upper Birth"
                                        : bedtype.bed_type == "lb"
                                        ? "Lower Birth"
                                        : null}
                                    </option>
                                  ))}
                                </Field>

                                {errors.bed_type && touched.bed_type ? (
                                  <div className="text-danger">
                                    {errors.bed_type}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          {values.bed_type == "Upper Birth" ||
                          values.bed_type == "Lower Birth" ? (
                            <div className="row form-m-t">
                              <div className="form-group">
                                <div className="col-lg-2">
                                  <label htmlFor="bed_type">Select Term</label>
                                </div>
                                <div className="col-lg-5">
                                  <Field
                                    component="select"
                                    autoComplete="off"
                                    name="term"
                                    className={"form-control"}
                                    onChange={(e) => {
                                      this.handleChangeTerm(e);
                                      setFieldValue("term", e.target.value);
                                    }}
                                  >
                                    <option key="-1" value="">
                                      Default Select
                                    </option>
                                    <option value="1">Term 1 (June-Nov)</option>
                                    <option value="2">Term 2 (Dec-Apr)</option>
                                    <option value="monthly">Monthly</option>
                                  </Field>

                                  {errors.term && touched.term ? (
                                    <div className="text-danger">
                                      {errors.term}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            <div
              className="card card-m-l11"
              style={{
                // width: "738px",
                // marginLeft: "15.4%",
                // paddingLeft: "3%",
                // marginTop: "1%",
                // marginBottom: "5%",
              }}
            >
              <div className="row1">
                {this.state.roomData.length > 0 &&
                  this.state.formValues.term != "monthly" &&
                  this.state.formValues.bed_type &&
                  this.state.formValues.student_type &&
                  this.state.roomData.map((item) => (
                    <>
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Room No</td>
                            <td>{this.state.studentDetails.room_id}</td>
                          </tr>
                          <tr>
                            <td>Student Name</td>
                            <td>{this.state.studentDetails.SFname}</td>
                          </tr>
                          <tr>
                            <td>Student Phone No</td>
                            <td>{this.state.studentDetails.SmobNo}</td>
                          </tr>
                          <tr>
                            <td>Student Email</td>
                            <td>{this.state.studentDetails.StudEmail}</td>
                          </tr>
                          <td
                            colSpan={2}
                            style={{
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            Monthly
                          </td>
                          <tr>
                            <td>Parking Fees Monthly (including gst)</td>
                            <td>
                              {this.state.price_obj.parking_fees.toLocaleString(
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
                            <td>Transportation fees Monthly (including gst)</td>
                            <td>
                              {this.state.price_obj.bus_price.toLocaleString(
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
                            Term {this.state.formValues.term}
                          </td>
                          <tr>
                            <td>
                              Meal Fees (
                              {this.state.studentDetails.food_preference})
                              (including gst)
                            </td>
                            <td>
                              {this.state.price_obj.meal_price.toLocaleString(
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
                            <td>Laundry (including gst)</td>
                            <td>
                              {this.state.price_obj.laundry.toLocaleString(
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
                            <td>Room Rent (including gst)</td>
                            <td>
                              {item.room_rent.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                                style: "currency",
                                currency: "INR",
                              })}
                            </td>
                          </tr>
                          <tr>
                            <td>Cultural Fee (including gst)</td>
                            <td>
                              {item.cultural_fees.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                                style: "currency",
                                currency: "INR",
                              })}
                            </td>
                          </tr>
                          <tr>
                            <td>Caution Deposit (including gst)</td>
                            <td>
                              {item.caution_deposit.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                                style: "currency",
                                currency: "INR",
                              })}
                            </td>
                          </tr>
                          <tr>
                            <td>Admission Fee (including gst)</td>
                            <td>
                              {item.addmission_fee.toLocaleString("en-IN", {
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
                              {/* <b>
                                {this.state.total_price.toLocaleString(
                                  "en-IN",
                                  {
                                    maximumFractionDigits: 0,
                                    style: "currency",
                                    currency: "INR",
                                  }
                                )}
                              </b> */}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div style={{ marginLeft: "38%" }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            this.submitAlert(this.state.formValues, item);
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

                        {/*  <button type="submit" className="btn btn-primary">
                            Submit
                          </button> */}
                      </div>
                      <br />
                    </>
                  ))}
              </div>

              <div className="row1">
                {this.state.formValues.term == "monthly" &&
                  this.state.formValues.bed_type &&
                  this.state.formValues.student_type && (
                    <>
                      <Formik
                        initialValues={initialMonthlyValues}
                        validationSchema={validateMonthly}
                        onSubmit={this.handleSubmitEvent}
                      >
                        {({ errors, touched, setFieldValue, values }) => (
                          <Form>
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td>Room No</td>
                                  <td>{this.state.studentDetails.room_id}</td>
                                </tr>
                                <tr>
                                  <td>Student Name</td>
                                  <td>{this.state.studentDetails.SFname}</td>
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
                                      onChange={(e) => {
                                        this.setState({
                                          ...this.state,
                                          monthlyFormValues: {
                                            ...this.state.monthlyFormValues,
                                            monthly_other_fees_remark:
                                              e.target.value,
                                          },
                                        });
                                        setFieldValue(
                                          "monthly_other_fees_remark",
                                          e.target.value
                                        );
                                      }}
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
                                      {(Number(this.state.monthlyFormValues.monthly_four_wheeler_parking_fee) +  Number(this.state.monthlyFormValues.monthly_two_wheeler_parking_fee) + Number(this.state.monthlyFormValues.monthly_water_bill)  +Number(this.state.monthlyFormValues.monthly_electricity_bill) + Number(this.state.monthlyFormValues.monthly_mess_fee) + Number(this.state.monthlyFormValues.monthly_laundry_fee) +Number(this.state.monthlyFormValues.monthly_room_rent) +Number(this.state.monthlyFormValues.monthly_admission_fee) +Number(this.state.monthlyFormValues.monthly_other_fees) + Number(this.state.monthlyFormValues.monthly_transportation_fee)).toLocaleString(
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
                            <div style={{ textAlign: "center" }}>
                              <button
                                type="submit"
                                style={{
                                  padding: "8px 18px 8px 18px",
                                  borderRadius: "0.375rem",

                                  fontSize: "16px",
                                  color: "#fff",
                                  backgroundColor: "#883495",
                                  borderColor: "#883495",
                                  boxShadow:
                                    "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%",
                                    marginBottom:"60px",
                                }}
                              >
                                Submit
                              </button>

                              {/*  <button type="submit" className="btn btn-primary">
                            Submit
                          </button> */}
                            </div>
                          </Form>
                        )}
                      </Formik>

                      <br />
                    </>
                  )}
              </div>
            </div>
          </section>
        </div>
      </Layout>
    );
  }
}

export default SetPlan;
