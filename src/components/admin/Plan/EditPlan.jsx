import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import "./masterdata.css";

let initialValues = {
  edit_type: "",
  room_no: "",
  bed_type: "",
  meal_type: "",
  meal_month: "",
  room_month: "",
  term_value: "",
};

class EditPlan extends Component {
  constructor(props) {
    const studentid = decodeURIComponent(props.match.params.id);
    super(props);
    this.state = {
      server_error: "",
      success: "",
      room_no: "",
      bedType: [],
      roomData: [],
      mealData: [],
      mealDataNew: [],
      studenttype: "",
      total_price: 0,
      studentDetails: "",
      price_obj: "",
      plan_details: [],
      student_plan: [],
      new_meal: "",
      new_meal_amount: 0,
      new_room_amount: 0,
      termData: [],
      term_values: "",
    };
  }

  handleChange = (e) => {
    let data = {
      student_id: decodeURIComponent(this.props.match.params.id),
      edit_type: e.target.value == "term" ? "meal" : e.target.value,
    };
    // this.setState({ studenttype: e.target.value });
    if (e.target.value == "room" || e.target.value == "meal") {
      API.post("/admin/secure/plan/get_edit_values", data)
        .then((response) => {
          if (data.edit_type == "room") {
            if (response.data.status === 200) {
              this.setState({
                roomData: response.data.rooms_data,
              });
            } else {
              swal("Warning", response.data.message, "warning");
            }
          } else {
            if (response.data.status === 200) {
              this.setState({
                mealData: response.data.meal_data,
                student_plan: response.data.student_plan,
              });
            } else {
              swal("Warning", response.data.message, "warning");
            }
          }
        })
        .catch((error) => {
          swal("Error", error, "warning");
        });
    } else {
      API.post("/admin/secure/plan/get_edit_values", data)
        .then((response) => {
          if (response.data.status === 200) {
            this.setState({
              termData:
                response.data.student_plan[0].term == 1
                  ? [{ label: "Term 2", value: 2 }]
                  : [{ label: "Term 1", value: 1 }],
              student_plan: response.data.student_plan,
            });
          } else {
            swal("Warning", response.data.message, "warning");
          }
        })
        .catch((error) => {
          swal("Error", error, "warning");
        });
    }
  };

  
  handleChangeTermNew = (e) => {
    let data = {
      student_id: decodeURIComponent(this.props.match.params.id),
      term_id: e.target.value,
      edit_type: "term",
    };
    
    API.post("/admin/secure/plan/get_edit_values", data)
        .then((response) => {
            if (response.data.status === 200) {
              this.setState({
                mealDataNew: response.data.meal_data,
              });
            } else {
              swal("Warning", response.data.message, "warning");
            }
        })
        .catch((error) => {
          swal("Error", error, "warning");
        });
  };

  handleChangeRoom = (e) => {
    this.setState({ bed_type: e.target.value });
    let data = {
      student_id: decodeURIComponent(this.props.match.params.id),
      room_no: e.target.value,
    };
    this.setState({ room_no: e.target.value });

    API.post("/admin/secure/plan/edit_room", data)
      .then((response) => {
        if (response.data.status === 200) {
          this.setState({
            bedType: response.data.bed_type,
          });
        } else {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch((error) => {
        swal("Error", error, "warning");
      });
  };

  handleChangMeal = (e) => {
    let arr = this.state.mealData;
    arr = arr.filter((item) => item.package == e.target.value);
    this.setState({ new_meal: arr });
  };

  handleChangeTerm = (e, term) => {
    let data = {
      student_id: decodeURIComponent(this.props.match.params.id),
      meal: e.target.value,
      term: term,
    };

    API.post("/admin/secure/plan/edit_term", data)
      .then((response) => {
        if (response.data.status === 200) {
          this.setState({
            term_values: response.data.result,
          });
        } else {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch((error) => {
        swal("Error", error, "warning");
      });
  };
  handleChangeBedType = (e) => {
    let bedtype = {
      student_id: decodeURIComponent(this.props.match.params.id),
      room_no: this.state.room_no,
      bed_type: e.target.value,
    };

    API.post("/admin/secure/plan/edit_bed_type", bedtype)
      .then((response) => {
        if (response.data.status === 200) {
          this.setState({
            plan_details: response.data.plan_details[0],
            student_plan: response.data.student_plan,
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
  handleMealMonthChange = (e, original, new_price) => {
    let per_month_meal = original / 6;
    let amount_paid = per_month_meal * e.target.value;
    let amount_remaining = original - amount_paid;
    let per_month_new_meal = new_price / 6;
    let amount_new_paid = per_month_new_meal * (6 - Number(e.target.value));
    let amount_remaidning = amount_new_paid - amount_remaining;
    this.setState({ new_meal_amount: amount_remaidning });
  };
  handleRoomMonthChange = (e, original, new_price) => {
    let per_month_meal = original / 12;
    let amount_paid = per_month_meal * e.target.value;
    let amount_remaining = original - amount_paid;
    let per_month_new_meal = new_price / 12;
    let amount_new_paid = per_month_new_meal * (12 - Number(e.target.value));
    let amount_remaidning = amount_new_paid - amount_remaining;
    this.setState({ new_room_amount: amount_remaidning });
  };
  submitRoom = (values, amount) => {
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to update this student's room",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSet) => {
      if (willSet) {
        this.handleEditRoomPlan(values, amount);
      }
    });
  };

  handleEditRoomPlan = (values, amount) => {
    let postData = {
      student_id: decodeURIComponent(this.props.match.params.id),
      bed_type: values.bed_type,
      room_no: values.room_no,
      to_pay: parseInt(amount),
      plan_type: "RoomChange",
    };
    // return;
    API.post("/admin/secure/plan/edit_room_plan", postData)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          this.props.history.push("/admin/view_student/");
        }
        if (response.data.status === 401) {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch((error) => {
        swal("Error", error, "warning");
      });
  };

  submitMeal = (values, new_amount) => {
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to update this student's meal",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSet) => {
      if (willSet) {
        this.handleEditMealPlan(values, new_amount);
      }
    });
  };
  submitTerm = (meal_price, laundry_price, meal_type, term_value) => {
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to update this student's term",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSet) => {
      if (willSet) {
        this.handleEditTermPlan(
          meal_price,
          laundry_price,
          meal_type,
          term_value
        );
      }
    });
  };

  handleEditTermPlan = (meal_price, laundry_price, meal_type, term_value) => {
    let postData = {
      student_id: decodeURIComponent(this.props.match.params.id),
      meal_type: meal_type,
      plan_type: "TermChange",
      to_pay: meal_price + laundry_price,
      meal_price: meal_price,
      laundry_price: laundry_price,
      term: term_value,
    };
    API.post("/admin/secure/plan/edit_term_plan", postData)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          this.props.history.push("/admin/view_student/");
        }
        if (response.data.status === 401) {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch((error) => {
        swal("Error", error, "warning");
      });
  };
  handleEditMealPlan = (values, new_amount) => {
    let postData = {
      student_id: decodeURIComponent(this.props.match.params.id),
      meal_type: values.meal_type,
      plan_type: "MealChange",
      to_pay: parseInt(new_amount),
    };

    API.post("/admin/secure/plan/edit_meal_plan", postData)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          this.props.history.push("/admin/view_student/");
        }
        if (response.data.status === 401) {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch((error) => {
        swal("Error", error, "warning");
      });
  };

  render() {
    const validateRoom = Yup.object().shape({
      edit_type: Yup.string().required("This field is required"),
      room_no: Yup.string().when("edit_type", {
        is: "room",
        then: Yup.string().required("Please select room"),
      }),
      meal_type: Yup.string().when("edit_type", {
        is: "meal",
        then: Yup.string().required("Please select meal type"),
      }),
      term: Yup.string().required("Term is required"),
      term_value: Yup.string().when("edit_type", {
        is: "term",
        then: Yup.string().required("Please select term"),
      }),
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
                  <>
                    <div className="row">
                      <h3 className="card-title">
                        <span className="sp1">Home /</span>
                        <span className="sp1"> Student /</span>
                        <span className="sp2"> Edit Plan</span>
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
                              <label htmlFor="edit_type" style={{}}>
                                Select what you want to edit
                              </label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                name="edit_type"
                                component="select"
                                autoComplete="off"
                                className="form-control"
                                onChange={(e) => {
                                  this.handleChange(e);
                                  setFieldValue("edit_type", e.target.value);
                                  setFieldValue("room_no", "");
                                  setFieldValue("meal_type", "");
                                  setFieldValue("term_value", "");
                                }}
                              >
                                <option value="">Default Select</option>
                                <option value="room">Room</option>
                                <option value="meal">Meal</option>
                                <option value="term">Term</option>
                              </Field>
                              {errors.edit_type && touched.edit_type ? (
                                <div className="text-danger">
                                  {errors.edit_type}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {this.state.roomData.length > 0 &&
                        values.edit_type == "room" ? (
                          <>
                            <div className="row form-m-t">
                              <div className="form-group">
                                <div className="col-lg-2">
                                  <label htmlFor="room_no">Select Room</label>
                                </div>
                                <div className="col-lg-8">
                                  <Field
                                    component="select"
                                    autoComplete="off"
                                    name="room_no"
                                    className={"form-control"}
                                    onChange={(e) => {
                                      this.handleChangeRoom(e);
                                      setFieldValue("room_no", e.target.value);
                                      setFieldValue("bed_type", "");
                                    }}
                                  >
                                    <option key="-1" value="">
                                      Default Select
                                    </option>
                                    {this.state.roomData.map((item, i) => (
                                      <option value={item.room_number} key={i}>
                                        Room No: {item.room_number} (Building:{" "}
                                        {item.building_name}, Toilet Type:{" "}
                                        {item.toilet_type}, Occupancy:{" "}
                                        {item.occupancy}, Room Type:{" "}
                                        {item.room_type}, Vaccancy:{" "}
                                        {item.vaccancy}, Floor: {item.floor} )
                                      </option>
                                    ))}
                                  </Field>

                                  {errors.room_no && touched.room_no ? (
                                    <div className="text-danger">
                                      {errors.room_no}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            {values.room_no && this.state.bedType.length > 0 ? (
                              <div className="row form-m-t">
                                <div className="form-group">
                                  <div className="col-lg-2">
                                    <label htmlFor="bed_type">
                                      Select Bed Type
                                    </label>
                                  </div>
                                  <div className="col-lg-5">
                                    <Field
                                      component="select"
                                      autoComplete="off"
                                      name="bed_type"
                                      className={"form-control"}
                                      onChange={(e) => {
                                        this.handleChangeBedType(e);
                                        setFieldValue(
                                          "bed_type",
                                          e.target.value
                                        );
                                        setFieldValue("room_month", "");
                                      }}
                                    >
                                      <option key="-1" value="">
                                        Default Select
                                      </option>
                                      {this.state.bedType.map((bedtype, i) => (
                                        <option value={bedtype.bedType} key={i}>
                                          {bedtype.bed_type == "ub"
                                            ? "Upper Berth"
                                            : bedtype.bed_type == "lb"
                                            ? "Lower Berth"
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
                            ) : null}
                          </>
                        ) : null}
                        <br></br>
                        {this.state.student_plan.length > 0 &&
                        values.room_no &&
                        values.bed_type &&
                        values.edit_type == "room" &&
                        this.state.student_plan[0].total_one_time -
                          this.state.plan_details.total <=
                          0 ? (
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2 ">
                                <label htmlFor="room_month" style={{}}>
                                  Select after which month upgrading room
                                </label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  name="room_month"
                                  component="select"
                                  autoComplete="off"
                                  className="form-control"
                                  onChange={(e) => {
                                    this.handleRoomMonthChange(
                                      e,
                                      this.state.student_plan[0].total_one_time,
                                      this.state.plan_details.total
                                    );
                                    setFieldValue("room_month", e.target.value);
                                    // setFieldValue("room_no", "");
                                    // setFieldValue("meal_type", "");
                                  }}
                                >
                                  <option value="">Default Select</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                  <option value="6">6</option>
                                  <option value="7">7</option>
                                  <option value="8">8</option>
                                  <option value="9">9</option>
                                  <option value="10">10</option>
                                  <option value="11">11</option>
                                </Field>
                                {errors.room_month && touched.room_month ? (
                                  <div className="text-danger">
                                    {errors.room_month}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ) : null}
                        <table class="table table-bordered">
                          {this.state.plan_details &&
                          this.state.plan_details &&
                          values.bed_type &&
                          values.edit_type == "room" &&
                          values.room_no ? (
                            <tbody>
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
                                  {this.state.plan_details.addmission_fee &&
                                    this.state.plan_details.addmission_fee.toLocaleString(
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
                                  {this.state.plan_details.admisson_kit &&
                                    this.state.plan_details.admisson_kit.toLocaleString(
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
                                  {this.state.plan_details.caution_deposit &&
                                    this.state.plan_details.caution_deposit.toLocaleString(
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
                                  {this.state.plan_details.cultural_fees &&
                                    this.state.plan_details.cultural_fees.toLocaleString(
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
                                  {this.state.plan_details.room_rent &&
                                    this.state.plan_details.room_rent.toLocaleString(
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
                                <td>
                                  <b>New Total</b>
                                </td>
                                <td>
                                  <b>
                                    {this.state.plan_details.total &&
                                      this.state.plan_details.total.toLocaleString(
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

                              <tr>
                                <td>
                                  <b>Total Paid by Student</b>
                                </td>
                                <td>
                                  <b>
                                    {this.state.student_plan.length > 0 &&
                                      this.state.student_plan[0].total_one_time.toLocaleString(
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
                              {this.state.student_plan.length > 0 &&
                              values.room_no &&
                              values.bed_type &&
                              values.edit_type == "room" &&
                              values.room_month &&
                              this.state.student_plan[0].total_one_time -
                                this.state.plan_details.total <=
                                0 ? (
                                <>
                                  <tr>
                                    <td>
                                      <b>
                                        Total amount need to pay by the student
                                      </b>
                                    </td>
                                    <td>
                                      <b>
                                        {this.state.new_room_amount.toLocaleString(
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
                                  <br></br>

                                  <div style={{ marginLeft: "50%" }}>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        this.submitRoom(
                                          values,
                                          this.state.new_room_amount
                                        );
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
                                      Update Room
                                    </button>
                                  </div>
                                </>
                              ) : null}
                              {this.state.student_plan.length > 0 &&
                              this.state.student_plan[0].total_one_time -
                                this.state.plan_details.total >=
                                0 ? (
                                <>
                                  <tr>
                                    <td>
                                      <b>
                                        Total amount need to pay by the student
                                      </b>
                                    </td>
                                    <td>
                                      <b>
                                        {this.state.student_plan[0]
                                          .total_one_time -
                                          this.state.plan_details.total >=
                                        0 ? (
                                          <span>&#8377;0</span>
                                        ) : (
                                          (
                                            this.state.plan_details.total -
                                            this.state.student_plan[0]
                                              .total_one_time
                                          ).toLocaleString("en-IN", {
                                            maximumFractionDigits: 0,
                                            style: "currency",
                                            currency: "INR",
                                          })
                                        )}
                                      </b>
                                    </td>
                                  </tr>
                                  <br></br>
                                  <br></br>
                                  <div style={{ marginLeft: "50%" }}>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        this.submitRoom(values, 0);
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
                                      Update Room
                                    </button>
                                  </div>
                                  <br />
                                  <br /> <br />
                                </>
                              ) : null}
                            </tbody>
                          ) : null}
                        </table>

                        {this.state.mealData.length > 0 &&
                        values.edit_type == "meal" ? (
                          <>
                            <div className="row form-m-t">
                              <div className="form-group">
                                <div className="col-lg-2">
                                  <label htmlFor="meal_type">Select Meal</label>
                                </div>
                                <div className="col-lg-5">
                                  <Field
                                    component="select"
                                    autoComplete="off"
                                    name="meal_type"
                                    className={"form-control"}
                                    onChange={(e) => {
                                      this.handleChangMeal(e);
                                      setFieldValue(
                                        "meal_type",
                                        e.target.value
                                      );
                                      setFieldValue("meal_month", "");
                                    }}
                                  >
                                    <option key="-1" value="">
                                      Default Select
                                    </option>
                                    {this.state.mealData.map((item, i) => (
                                      <option value={item.package} key={i}>
                                        {item.package}
                                      </option>
                                    ))}
                                  </Field>

                                  {errors.meal_type && touched.meal_type ? (
                                    <div className="text-danger">
                                      {errors.meal_type}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            {this.state.student_plan &&
                            this.state.new_meal &&
                            values.meal_type &&
                            this.state.student_plan[0].meal -
                              this.state.new_meal[0].price <=
                              0 ? (
                              <div className="row form-m-t">
                                <div className="form-group">
                                  <div className="col-lg-2 ">
                                    <label htmlFor="meal_month" style={{}}>
                                      Select after which month upgrading meal
                                    </label>
                                  </div>
                                  <div className="col-lg-5">
                                    <Field
                                      name="meal_month"
                                      component="select"
                                      autoComplete="off"
                                      className="form-control"
                                      onChange={(e) => {
                                        this.handleMealMonthChange(
                                          e,
                                          this.state.student_plan[0].meal,
                                          this.state.new_meal[0].price
                                        );
                                        setFieldValue(
                                          "meal_month",
                                          e.target.value
                                        );
                                        // setFieldValue("room_no", "");
                                        // setFieldValue("meal_type", "");
                                      }}
                                    >
                                      <option value="">Default Select</option>
                                      <option value="1">1</option>
                                      <option value="2">2</option>
                                      <option value="3">3</option>
                                      <option value="4">4</option>
                                      <option value="5">5</option>
                                      {/*     <option value="6">6</option> */}
                                    </Field>
                                    {errors.meal_month && touched.meal_month ? (
                                      <div className="text-danger">
                                        {errors.meal_month}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            {values.meal_type &&
                            this.state.new_meal.length > 0 ? (
                              <table class="table table-bordered">
                                <br></br>
                                <br></br> <br></br>
                                {values.meal_type &&
                                this.state.new_meal.length > 0 &&
                                values.edit_type == "meal" ? (
                                  <tbody>
                                    <tr>
                                      <td>
                                        <b>
                                          New Total Meal Fees (
                                          {this.state.new_meal[0].package})
                                        </b>
                                      </td>
                                      <td>
                                        <b>
                                          {this.state.new_meal &&
                                            this.state.new_meal[0].price.toLocaleString(
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

                                    <tr>
                                      <td>
                                        <b>
                                          Total Paid by Student (
                                          {this.state.student_plan[0].meal_type}
                                          )
                                        </b>
                                      </td>
                                      <td>
                                        <b>
                                          {this.state.student_plan.length > 0 &&
                                            this.state.student_plan[0].meal.toLocaleString(
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
                                    {this.state.student_plan[0].meal -
                                      this.state.new_meal[0].price >=
                                    0 ? (
                                      <>
                                        <tr>
                                          <td>
                                            <b>
                                              Total amount need to pay by the
                                              student
                                            </b>
                                          </td>
                                          <td>
                                            <b>
                                              <span>&#8377;0</span>
                                            </b>
                                          </td>
                                        </tr>
                                        <br></br>

                                        <div style={{ marginLeft: "50%" }}>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              this.submitMeal(values, 0);
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
                                            Update Meal
                                          </button>
                                        </div>
                                      </>
                                    ) : null}

                                    {values.meal_month &&
                                    this.state.student_plan[0].meal -
                                      this.state.new_meal[0].price <=
                                      0 ? (
                                      <>
                                        <tr>
                                          <td>
                                            <b>
                                              Total amount need to pay by the
                                              student
                                            </b>
                                          </td>
                                          <td>
                                            <b>
                                              {this.state.new_meal_amount.toLocaleString(
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
                                        <br></br>

                                        <div style={{ marginLeft: "50%" }}>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              this.submitMeal(
                                                values,
                                                this.state.new_meal_amount
                                              );
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
                                            Update Meal
                                          </button>

                                          {/*  <button type="submit" className="btn btn-primary">
                        Submit
                      </button> */}
                                        </div>
                                      </>
                                    ) : null}
                                  </tbody>
                                ) : null}
                              </table>
                            ) : null}
                          </>
                        ) : null}

                        {this.state.termData.length > 0 &&
                        values.edit_type == "term" ? (
                          <>
                            <div className="row form-m-t">
                              <div className="form-group">
                                <div className="col-lg-2">
                                  <label htmlFor="term_value">
                                    Select Term
                                  </label>
                                </div>
                                <div className="col-lg-5">
                                  <Field
                                    component="select"
                                    autoComplete="off"
                                    name="term_value"
                                    className={"form-control"}
                                    onChange={(e) => {
                                      this.handleChangeTermNew(e);
                                      setFieldValue(
                                        "term_value",
                                        e.target.value
                                      );
                                      setFieldValue("meal_type", "");
                                    }}
                                  >
                                    <option key="-1" value="">
                                      Default Select
                                    </option>
                                    {this.state.termData.map((item, i) => (
                                      <option value={item.value} key={i}>
                                        {item.label}
                                      </option>
                                    ))}
                                  </Field>

                                  {errors.term_value && touched.term_value ? (
                                    <div className="text-danger">
                                      {errors.term_value}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                        {this.state.termData.length > 0 &&
                        this.state.mealDataNew.length > 0 &&
                        values.edit_type == "term" &&
                        values.term_value ? (
                          <>
                            <div className="row form-m-t">
                              <div className="form-group">
                                <div className="col-lg-2">
                                  <label htmlFor="meal_type">Select Meal</label>
                                </div>
                                <div className="col-lg-5">
                                  <Field
                                    component="select"
                                    autoComplete="off"
                                    name="meal_type"
                                    className={"form-control"}
                                    onChange={(e) => {
                                      this.handleChangeTerm(
                                        e,
                                        values.term_value
                                      );
                                      setFieldValue(
                                        "meal_type",
                                        e.target.value
                                      );
                                    }}
                                  >
                                    <option key="-1" value="">
                                      Default Select
                                    </option>
                                    {this.state.mealDataNew.map((item, i) => (
                                      <option value={item.package} key={i}>
                                        {item.package}
                                      </option>
                                    ))}
                                  </Field>

                                  {errors.term_value && touched.term_value ? (
                                    <div className="text-danger">
                                      {errors.term_value}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                        {this.state.termData.length > 0 &&
                        values.edit_type == "term" &&
                        values.term_value &&
                        values.meal_type &&
                        this.state.term_values != "" ? (
                          <table class="table table-bordered">
                            <br></br>
                            <br></br> <br></br>
                            <tbody>
                              <tr>
                                <td>
                                  <b>
                                    New Total Meal Fees ({values.meal_type})
                                  </b>
                                </td>
                                <td>
                                  <b>
                                    {this.state.term_values &&
                                      this.state.term_values.meal_plan[0].price.toLocaleString(
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
                              <tr>
                                <td>
                                  <b>New Total Laundry Fees</b>
                                </td>
                                <td>
                                  <b>
                                    {this.state.term_values &&
                                      this.state.term_values.laundry_plan[0].price.toLocaleString(
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

                              <tr>
                                <td>
                                  <b>New fees need to pay by the student</b>
                                </td>
                                <td>
                                  <b>
                                    {(
                                      this.state.term_values.laundry_plan[0]
                                        .price +
                                      this.state.term_values.meal_plan[0].price
                                    ).toLocaleString("en-IN", {
                                      maximumFractionDigits: 0,
                                      style: "currency",
                                      currency: "INR",
                                    })}
                                    {/*     {this.state.term_values &&
                                      this.state.term_values.laundry_plan[0].price} */}
                                  </b>
                                </td>
                              </tr>

                              <br></br>

                              <div style={{ marginLeft: "50%" }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    this.submitTerm(
                                      this.state.term_values.meal_plan[0].price,
                                      this.state.term_values.laundry_plan[0]
                                        .price,
                                      values.meal_type,
                                      values.term_value
                                    );
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
                                  Update Term
                                </button>
                              </div>
                            </tbody>
                          </table>
                        ) : null}
                      </div>
                    </div>
                  </>
                </Form>
              )}
            </Formik>
          </section>
        </div>
      </Layout>
    );
  }
}

export default EditPlan;
