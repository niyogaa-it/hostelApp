import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import "./masterdata.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const initialValues = {
  eggetarian_breakfast: "",
  eggetarian_dinner: "",
  eggetarian_lunch: "",
  no_veg_breakfast: "",
  no_veg_dinner: "",
  no_veg_lunch: "",
  veg_breakfast: "",
  veg_dinner: "",
  veg_lunch: "",
};
class AddMeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setMeal: {},
      setusermil: {},
      id: "",
      eggetarian_breakfast: "",
      eggetarian_dinner: "",
      eggetarian_lunch: "",
      no_veg_breakfast: "",
      no_veg_dinner: "",
      no_veg_lunch: "",
      veg_breakfast: "",
      veg_dinner: "",
      veg_lunch: "",
    };
  }

  // get update api data
  // componentDidMount() {
  //   API.get("/admin/secure/meal")
  //     .then((res) => {
  //       console.log("res", res.data);
  //       this.setState({
  //         setMeal: res.data.result_data[0],
  //         id: res.data.result_data.length > 0 ? res.data.result_data[0].id : "",
  //         eggetarian_breakfast:
  //           res.data.result_data.length > 0
  //             ? res.data.result_data[0].eggetarian_breakfast
  //             : "",
  //         eggetarian_dinner:
  //           res.data.result_data.length > 0
  //             ? res.data.result_data[0].eggetarian_dinner
  //             : "",
  //         eggetarian_lunch:
  //           res.data.result_data.length > 0
  //             ? res.data.result_data[0].eggetarian_lunch
  //             : "",
  //         no_veg_breakfast:
  //           res.data.result_data.length > 0
  //             ? res.data.result_data[0].no_veg_breakfast
  //             : "",
  //         no_veg_dinner:
  //           res.data.result_data.length > 0
  //             ? res.data.result_data[0].no_veg_dinner
  //             : "",
  //         no_veg_lunch:
  //           res.data.result_data.length > 0
  //             ? res.data.result_data[0].no_veg_lunch
  //             : "",
  //         veg_breakfast:
  //           res.data.result_data.length > 0
  //             ? res.data.result_data[0].veg_breakfast
  //             : "",
  //         veg_dinner:
  //           res.data.result_data.length > 0
  //             ? res.data.result_data[0].veg_dinner
  //             : "",
  //         veg_lunch:
  //           res.data.result_data.length > 0
  //             ? res.data.result_data[0].veg_lunch
  //             : "",
  //       });
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });
  // }
  handleSubmitEvent = (values, { resetForm }) => {
    API.post("/admin/secure/create/meal", values)
      .then((res) => {
        swal("Success", "Meal Added Successfully", "success");
        resetForm(initialValues);
      })
      .catch((err) => {
        console.log("err", err);
        swal("Error", "Something went wrong", "error");
        resetForm(initialValues);
      });
  };

  render() {
    const {
      eggetarian_breakfast,
      eggetarian_dinner,
      eggetarian_lunch,
      no_veg_breakfast,
      no_veg_dinner,
      no_veg_lunch,
      veg_breakfast,
      veg_dinner,
      veg_lunch,
    } = this.state;
    // let initialValues = {
    //   eggetarian_breakfast: eggetarian_breakfast,
    //   eggetarian_dinner: eggetarian_dinner,
    //   eggetarian_lunch: eggetarian_lunch,
    //   no_veg_breakfast: no_veg_breakfast,
    //   no_veg_dinner: no_veg_dinner,
    //   no_veg_lunch: no_veg_lunch,
    //   veg_breakfast: veg_breakfast,
    //   veg_dinner: veg_dinner,
    //   veg_lunch: veg_lunch,
    // };

    const validateRoom = Yup.object().shape({
      eggetarian_breakfast: Yup.string().required(
        "Eggetarian Breakfast is required"
      ),
      eggetarian_dinner: Yup.string().required("Eggetarian Dinner is required"),
      eggetarian_lunch: Yup.string().required("Eggetarian Lunch is required"),
      no_veg_breakfast: Yup.string().required("Non Veg Breakfast is required"),
      no_veg_dinner: Yup.string().required("Non Veg Dinner is required"),
      no_veg_lunch: Yup.string().required("Non Veg Lunch is required"),
      veg_breakfast: Yup.string().required("Veg Breakfast is required"),
      veg_dinner: Yup.string().required("Veg Dinner is required"),
      veg_lunch: Yup.string().required("Veg Lunch is required"),
    });
    if (
      this.props.auth.userToken.permissions.warden_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section className="content-header">
              <Formik
                initialValues={initialValues}
                validationSchema={validateRoom}
                onSubmit={this.handleSubmitEvent}
                // enableReinitialize={true}
              >
                {({ errors, touched, isSubmitting, setFieldValue }) => {
                  return (
                    <Form>
                      <div className="row">
                        <h3 className="card-title">
                          <span className="sp1">Home /</span>
                          <span className="sp1"> Warden Data /</span>
                          <span className="sp2"> Add Meal</span>
                        </h3>
                        <div className="col-lg-10 col-lg-10 card card-m-l pty-30">
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label>FOOD PREFERENCE</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="text"
                                  name="FOODPREFERENCE"
                                  className="form-control"
                                  disabled="true"
                                  value="VEG"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label>BREAK FAST</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="text"
                                  name="veg_breakfast"
                                  className="form-control"
                                  placeholder="Veg Breakfast"
                                />
                                {errors.veg_breakfast &&
                                touched.veg_breakfast ? (
                                  <div className="text-danger">
                                    {errors.veg_breakfast}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label>LUNCH</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="text"
                                  name="veg_lunch"
                                  className="form-control"
                                  placeholder="Veg Lunch"
                                />
                                {errors.veg_lunch && touched.veg_lunch ? (
                                  <div className="text-danger">
                                    {errors.veg_lunch}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label>DINNER</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="text"
                                  name="veg_dinner"
                                  className="form-control"
                                  placeholder="Veg Dinner"
                                />
                                {errors.veg_dinner && touched.veg_dinner ? (
                                  <div className="text-danger">
                                    {errors.veg_dinner}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label>FOOD PREFERENCE</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="text"
                                  name="FOODPREFERENCE"
                                  className="form-control"
                                  disabled="true"
                                  value="NON VEG"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label>BREAK FAST</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="text"
                                  name="no_veg_breakfast"
                                  className="form-control"
                                  placeholder="Non-Veg Breakfast"
                                />
                                {errors.no_veg_breakfast &&
                                touched.no_veg_breakfast ? (
                                  <div className="text-danger">
                                    {errors.no_veg_breakfast}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label>LUNCH</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="text"
                                  name="no_veg_lunch"
                                  className="form-control"
                                  placeholder="Non-Veg Lunch"
                                />
                                {errors.no_veg_lunch && touched.no_veg_lunch ? (
                                  <div className="text-danger">
                                    {errors.no_veg_lunch}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label>DINNER</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="text"
                                  name="no_veg_dinner"
                                  className="form-control"
                                  placeholder="Non-Veg Dinner"
                                />
                                {errors.no_veg_dinner &&
                                touched.no_veg_dinner ? (
                                  <div className="text-danger">
                                    {errors.no_veg_dinner}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label>FOOD PREFERENCE</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="text"
                                  name="FOODPREFERENCE"
                                  className="form-control"
                                  disabled="true"
                                  value="Eggetarian"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label>BREAK FAST</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="text"
                                  name="eggetarian_breakfast"
                                  className="form-control"
                                  placeholder="Eggetarian Breakfast"
                                />
                                {errors.eggetarian_breakfast &&
                                touched.eggetarian_breakfast ? (
                                  <div className="text-danger">
                                    {errors.eggetarian_breakfast}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label>LUNCH</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="text"
                                  name="eggetarian_lunch"
                                  className="form-control"
                                  placeholder="Eggetarian Lunch"
                                />
                                {errors.eggetarian_lunch &&
                                touched.eggetarian_lunch ? (
                                  <div className="text-danger">
                                    {errors.eggetarian_lunch}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label>DINNER</label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="text"
                                  name="eggetarian_dinner"
                                  className="form-control"
                                  placeholder="Eggetarian Dinner"
                                />
                                {errors.eggetarian_dinner &&
                                touched.eggetarian_dinner ? (
                                  <div className="text-danger">
                                    {errors.eggetarian_dinner}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2"></div>
                              <div className="col-lg-5">
                                <button
                                  type="submit"
                                  style={{
                                    padding: "8px 18px 8px 18px",
                                    borderRadius: "0.375rem",
                                    marginLeft: "43%",
                                    marginBottom: "10%",
                                    fontSize: "16px",
                                    color: "#fff",
                                    backgroundColor: "#883495",
                                    borderColor: "#883495",
                                    boxShadow:
                                      "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%",
                                  }}
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </section>
          </div>
        </Layout>
      );
    } else {
      return <Redirect to="/admin/dashboard" />;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(AddMeal));
