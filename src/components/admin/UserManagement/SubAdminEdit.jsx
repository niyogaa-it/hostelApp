import React, { Component } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Button, FormGroup } from "react-bootstrap";

import { Row, Col } from "react-bootstrap";

import API from "../../../shared/admin-axios";
import swal from "sweetalert";

import Layout from "../layout/Layout";
import whitelogo from "../../../assets/images/drreddylogo_white.png";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  role: "",
  password: "",
};

class UpdatePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminDetails: [],
      adminDetailsNew: [],

      isLoading: false,
      showModalLoader: false,
    };
  }

  componentDidMount() {
    let id = decodeURIComponent(this.props.match.params.id);
    this.getAdmin(id);
  }

  getAdmin(id) {
    API.get(`/admin/secure/subadmin/details/${id}`)
      .then((res) => {
        //console.log(res.data.data);
        this.setState({
          adminDetails: res.data.result[0],
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSubmitEvent = (values, actions) => {
    let id = decodeURIComponent(this.props.match.params.id);
    const post_data = {
      id: id,
      name: values.name,
      phone_no: values.phone,
      email: values.email,
      role: values.role,
      password: values.password,
    };
    API.post(`admin/secure/update/subadmin`, post_data)
      .then((res) => {
        swal({
          closeOnClickOutside: false,
          title: "Success",
          text: "Record updated successfully.",
          icon: "success",
        }).then(() => {
          actions.setSubmitting(false);
          this.getAdmin(id);
        });
      })
      .catch((err) => {
        actions.setErrors(err.data.errors);
        actions.setSubmitting(false);
      });
  };

  render() {
    const { adminDetails } = this.state;
    const newInitialValues = Object.assign(initialValues, {
      name: adminDetails.name ? adminDetails.name : "",
      phone: adminDetails.phone_no ? adminDetails.phone_no : "",
      email: adminDetails.email ? adminDetails.email : "",
      role: adminDetails.role ? adminDetails.role : "",
    });

    const validateLogin = Yup.object().shape({
      name: Yup.string()
        .trim()
        .required("Please enter name")
        .min(1, "Last name can be minimum 1 characters long")
        .matches(/^[A-Za-z\s]*$/, "Only alphabets allowed")
        .max(30, "Last name can be maximum 30 characters long"),
      email: Yup.string()
        .trim()
        .required("Please enter email")
        .email("Invalid email")
        .max(80, "Email can be maximum 80 characters long"),
      phone: Yup.string()
        .phone("IN", "Please enter a valid phone number")
        .required(),
      password: Yup.string()
        .required("Please enter password")
        .matches(/[a-z]+/, "One lowercase character")
        .matches(/[A-Z]+/, "One uppercase character")
        .matches(/\d+/, "One number")
        .min(4, "Password is too short - should be 4 chars minimum.")
        .max(10, "must be less then 10"),
    });

    if (this.state.isLoading) {
      return (
        <>
          <div className="loderOuter">
            <div className="loading_reddy_outer">
              <div className="loading_reddy">
                <img src={whitelogo} alt="logo" />
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section className="content-header">
              <div className="row">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <h1 style={{ color: "#a1acb8" }}>
                    Home / <b style={{ color: "#566a7f" }}>Subadmin Details</b>
                    <small />
                  </h1>
                </div>
              </div>
            </section>
            <section className="content admin-profile">
              <div className="box box-default">
                <div className="box-body">
                  <Formik
                    initialValues={newInitialValues}
                    validationSchema={validateLogin}
                    onSubmit={this.handleSubmitEvent}
                  >
                    {({ values, errors, touched, isValid, isSubmitting }) => {
                      return (
                        <Form>
                          {this.state.showModalLoader === true ? (
                            <div className="loading_reddy_outer">
                              <div className="loading_reddy">
                                <img src={whitelogo} alt="loader" />
                              </div>
                            </div>
                          ) : (
                            ""
                          )}

                          <Row>
                            <Col xs={12} sm={6} md={6}>
                              <FormGroup controlId="name" large="medium">
                                <label>Name</label>
                                <Field
                                  name="name"
                                  type="text"
                                  className={`form-control`}
                                  placeholder="Enter name"
                                  autoComplete="off"
                                  disabled={adminDetails.super_admin == 0}
                                />
                                {errors.name && touched.name ? (
                                  <span className="errorMsg">
                                    {errors.name}
                                  </span>
                                ) : null}
                              </FormGroup>
                            </Col>
                            <Col xs={12} sm={6} md={6}>
                              <FormGroup
                                controlId="new_password"
                                large="medium"
                              >
                                <label>Phone No</label>
                                <Field
                                  name="phone"
                                  type="text"
                                  className={`form-control`}
                                  placeholder="Enter phone number"
                                  autoComplete="off"
                                  disabled={adminDetails.super_admin == 0}
                                />
                                {errors.phone ? (
                                  <span className="errorMsg">
                                    {errors.phone}
                                  </span>
                                ) : null}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={6} md={6}>
                              <FormGroup controlId="name" large="medium">
                                <label>Email</label>
                                <Field
                                  name="email"
                                  type="email"
                                  className={`form-control`}
                                  placeholder="Enter email"
                                  autoComplete="off"
                                  disabled={adminDetails.super_admin == 0}
                                />
                                {errors.email && touched.email ? (
                                  <span className="errorMsg">
                                    {errors.email}
                                  </span>
                                ) : null}
                              </FormGroup>
                            </Col>
                            <Col xs={12} sm={6} md={6}>
                              <FormGroup
                                controlId="new_password"
                                large="medium"
                              >
                                <label>Role</label>
                                <Field
                                  name="role"
                                  type="text"
                                  className={`form-control`}
                                  placeholder=""
                                  autoComplete="off"
                                  disabled
                                />
                                {errors.role && touched.role ? (
                                  <span className="errorMsg">
                                    {errors.role}
                                  </span>
                                ) : null}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={6} md={6}>
                              <FormGroup controlId="name" large="medium">
                                <label>Password</label>
                                <Field
                                  name="password"
                                  type="password"
                                  className={`form-control`}
                                  placeholder="Enter password"
                                  autoComplete="off"
                                />
                                {errors.password && touched.password ? (
                                  <span className="errorMsg">
                                    {errors.password}
                                  </span>
                                ) : null}
                              </FormGroup>
                            </Col>
                          </Row>
                          {console.log("errors>>>>", errors)}
                          <Button
                            className={`btn btn-success btn-sm`}
                            type="submit"
                            disabled={isValid ? false : true}
                          >
                            {isSubmitting ? "Updating..." : "Update"}
                          </Button>
                        </Form>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            </section>
          </div>
        </Layout>
      );
    }
  }
}

export default UpdatePassword;
