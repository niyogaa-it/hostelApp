import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import "yup-phone-lite";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

let initialValues = {
  name: "",
  phone_no: "",
  email: "",
  password: "",
  role: "",
};

class CreateSubAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStudent: false,
      isPayment: false,
      isMeal: false,
      isMaster: false,
      isQueries: false,
      isEvents: false,
      isWarden: false,
      isNotification: false,
      isLaundry: false,
      isHosteller: false,
      isEmergency: false,
    };
    this.baseState = this.state;
  }
  onChangeStudent = () => {
    this.setState((initialState) => ({
      isStudent: !initialState.isStudent,
    }));
  };
  onChangePayment = () => {
    this.setState((initialState) => ({
      isPayment: !initialState.isPayment,
    }));
  };
  onChangeMeal = () => {
    this.setState((initialState) => ({
      isMeal: !initialState.isMeal,
    }));
  };
  onChangeMaster = () => {
    this.setState((initialState) => ({
      isMaster: !initialState.isMaster,
    }));
  };
  onChangeQueries = () => {
    this.setState((initialState) => ({
      isQueries: !initialState.isQueries,
    }));
  };
  onChangeEvents = () => {
    this.setState((initialState) => ({
      isEvents: !initialState.isEvents,
    }));
  };
  onChangeWarden = () => {
    this.setState((initialState) => ({
      isWarden: !initialState.isWarden,
    }));
  };
  onChangeNotification = () => {
    this.setState((initialState) => ({
      isNotification: !initialState.isNotification,
    }));
  };
  onChangeLaundry = () => {
    this.setState((initialState) => ({
      isLaundry: !initialState.isLaundry,
    }));
  };
  onChangeHosteller = () => {
    this.setState((initialState) => ({
      isHosteller: !initialState.isHosteller,
    }));
  };
  onChangeEmergency = () => {
    this.setState((initialState) => ({
      isEmergency: !initialState.isEmergency,
    }));
  };
  handleSubmitEvent = (values, { resetForm }) => {
    values.UserManagement = this.state.isStudent;
    values.PaymentActivities = this.state.isPayment;
    values.UpdateMeal = this.state.isMeal;
    values.MasterDataManagement = this.state.isMaster;
    values.HelpQuieres = this.state.isQueries;
    values.Events = this.state.isEvents;
    values.WardenManagement = this.state.isWarden;
    values.NotificationManagement = this.state.isNotification;
    values.LaundaryManagement = this.state.isLaundry;
    values.RoomManagement = this.state.isHosteller;
    values.EmergencyManagement = this.state.isEmergency;

    // console.log("Line:103->Value:", values);
    // console.log("Line:104->this.state:", this.state);
    // console.log("Line:105->this.baseState:", this.baseState);

    if (
      this.state.isStudent ||
      this.state.isPayment ||
      this.state.isMeal ||
      this.state.isMaster ||
      this.state.isQueries ||
      this.state.isEvents ||
      this.state.isWarden ||
      this.state.isNotification ||
      this.state.isLaundry ||
      this.state.isHosteller ||
      this.state.isEmergency
    ) {
      API.post(`/admin/secure/create/admin`, values)
        .then((response) => {
          // console.log(response);
          if (response.data.status === 201) {
            swal("Success", "Admin Added Successfully", "success");
            resetForm(initialValues);
            this.setState(this.baseState);
          }
          if (response.data.status === 401) {
            swal("Warning", response.data.message, "warning");
          }
        })
        .catch((error) => {
          console.log("error -> ", error);
          if (
            error &&
            (error.response.data.status == 401 ||
              error.response.data.status == 400)
          ) {
            swal("Error", error.response.data.message, "error");
            resetForm(initialValues);
            this.setState(this.baseState);
          }
        });
    } else {
      swal("Please give atleast one permission.");
    }
  };
  render() {
    const validateAdmin = Yup.object().shape({
      name: Yup.string().required("Name is required"),
      phone_no: Yup.string()
        .phone("IN", "Please enter a valid phone number")
        .required("Phone number is required"),
      email: Yup.string()
        .email()
        .required("Email is required"),
      password: Yup.string()
        .required("Please enter password")
        .matches(/[a-z]+/, "One lowercase character")
        .matches(/[A-Z]+/, "One uppercase character")
        .matches(/\d+/, "One number")
        .min(4, "Password is too short - should be 4 chars minimum.")
        .max(10, "must be less then 10"),
      role: Yup.string().required("Role is required"),
    });
    if (
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section className="content-header">
              <div className="row">
                <h3 className="card-title">
                  <span className="sp1">Home / </span>
                  <span className="sp1">User Management / </span>
                  <span className="sp2">Create Subadmin</span>
                </h3>
              </div>
              <div className="row">
                <div className="col-lg-10">
                  <div className="sub-admin">
                    <div className="sub-admin-content">
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validateAdmin}
                        onSubmit={this.handleSubmitEvent}
                      >
                        {({ errors, touched }) => (
                          <Form>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-lg-2">
                                  <label htmlFor="name">NAME</label>
                                </div>
                                <div className="col-lg-10">
                                  <Field
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    className="form-control"
                                  />
                                  {errors.name && touched.name ? (
                                    <div className="text-danger">
                                      {errors.name}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-lg-2">
                                  <label htmlFor="phone_no">PHONE NUMBER</label>
                                </div>
                                <div className="col-lg-10">
                                  <Field
                                    type="text"
                                    name="phone_no"
                                    placeholder="Phone number"
                                    className="form-control"
                                  />
                                  {errors.phone_no && touched.phone_no ? (
                                    <div className="text-danger">
                                      {errors.phone_no}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-lg-2">
                                  <label htmlFor="email">EMAIL</label>
                                </div>
                                <div className="col-lg-10">
                                  <Field
                                    type="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="form-control"
                                  />
                                  {errors.email && touched.email ? (
                                    <div className="text-danger">
                                      {errors.email}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-lg-2">
                                  <label htmlFor="password">
                                    CREATE PASSWORD
                                  </label>
                                </div>
                                <div className="col-lg-10">
                                  <Field
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Password"
                                  />
                                  {errors.password && touched.password ? (
                                    <div className="text-danger">
                                      {errors.password}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-lg-2">
                                  <label htmlFor="name">ROLE</label>
                                </div>
                                <div className="col-lg-6">
                                  <Field
                                    name="role"
                                    component="select"
                                    className="form-control"
                                  >
                                    <option value="" selected>
                                      Default select
                                    </option>
                                    <option value="accountant">Accountant</option>
                                    <option value="manager">Manager</option>
                                    <option value="warden">Warden</option>
                                    <option value="laundry-man">
                                      Laundry Man
                                    </option>
                                  </Field>
                                  {errors.role && touched.role ? (
                                    <div className="text-danger">
                                      {errors.role}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div className="permission-panel">
                              <h4>Permission</h4>
                              <div
                                role="group"
                                aria-labelledby="checkbox-group"
                              >
                                <div className="row">
                                  <div className="col-lg-3">
                                    <label>
                                      <Field
                                        type="checkbox"
                                        checked={this.state.isStudent}
                                        onChange={this.onChangeStudent}
                                      />
                                      Student Management
                                    </label>
                                    <label>
                                      <Field
                                        type="checkbox"
                                        checked={this.state.isPayment}
                                        onChange={this.onChangePayment}
                                      />
                                      Payment Activities
                                    </label>
                                    <label>
                                      <Field
                                        type="checkbox"
                                        checked={this.state.isMeal}
                                        onChange={this.onChangeMeal}
                                      />
                                      Update Meal
                                    </label>
                                  </div>
                                  <div className="col-lg-3">
                                    <label>
                                      <Field
                                        type="checkbox"
                                        checked={this.state.isMaster}
                                        onChange={this.onChangeMaster}
                                      />
                                      Master Data Management
                                    </label>
                                    <label>
                                      <Field
                                        type="checkbox"
                                        checked={this.state.isQueries}
                                        onChange={this.onChangeQueries}
                                      />
                                      Help Quieres
                                    </label>
                                    <label>
                                      <Field
                                        type="checkbox"
                                        checked={this.state.isEvents}
                                        onChange={this.onChangeEvents}
                                      />
                                      Events
                                    </label>
                                  </div>
                                  <div className="col-lg-3">
                                    <label>
                                      <Field
                                        type="checkbox"
                                        checked={this.state.isWarden}
                                        onChange={this.onChangeWarden}
                                      />
                                      Warden Management
                                    </label>
                                    <label>
                                      <Field
                                        type="checkbox"
                                        checked={this.state.isNotification}
                                        onChange={this.onChangeNotification}
                                      />
                                      Notification Management
                                    </label>
                                    <label>
                                      <Field
                                        type="checkbox"
                                        checked={this.state.isLaundry}
                                        onChange={this.onChangeLaundry}
                                      />
                                      Laundry Process
                                    </label>
                                  </div>
                                  <div className="col-lg-3">
                                    <label>
                                      <Field
                                        type="checkbox"
                                        checked={this.state.isHosteller}
                                        onChange={this.onChangeHosteller}
                                      />
                                      Hosteller Management
                                    </label>
                                    <label>
                                      <Field
                                        type="checkbox"
                                        checked={this.state.isEmergency}
                                        onChange={this.onChangeEmergency}
                                      />
                                      Emergency Management
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="create-button">
                              <button type="submit">Create</button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
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

export default withRouter(connect(mapStateToProps)(CreateSubAdmin));
