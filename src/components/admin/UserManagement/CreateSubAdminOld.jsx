import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";

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
      server_error: "",
      success: "",
    };
  }
  roomSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone_no: Yup.number().required("No of Floors is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Required"),
    password: Yup.string()
      .required("No password provided.")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain letters."),
    role: Yup.string().required("Required"),
  });

  handleSubmitEvent = (values, { resetForm }) => {
    API.post("/admin/secure/create/admin", values)
      .then((response) => {
        if (response.data.status === 201) {
          swal("Success", response.data.message, "success");
          resetForm(initialValues);
        }
        if (response.data.status === 401) {
          swal("Error", response.data.message, "error");
          resetForm(initialValues);
        }
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response.data.status == 401 ||
          error.response.data.status == 400
        ) {
          swal("Error", error.response.data.message, "error");
          resetForm(initialValues);
        }
      });
  };

  render() {
    const validateBuilding = Yup.object().shape({
      name: Yup.string().required("Name is required"),
      phone_no: Yup.number().required("No of Floors is required"),
      email: Yup.string()
        .email("Invalid email")
        .required("Email is Required"),
      password: Yup.string()
        .required("No password provided.")
        .min(8, "Password is too short - should be 8 chars minimum.")
        .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
      role: Yup.string().required("Required"),
    });
    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section
            className="content-header"
            style={{ padding: "15px 15px 15px" }}
          >
            <div className="row">
              <h3 className="card-title">
                <span className="sp1">Home /</span>
                <span className="sp1"> User Management /</span>
                <span className="sp2"> Create Subadmin</span>
              </h3>
              <div
                className="col-lg-10 card card-m-l pty-30"
                style={{
                  borderRadius: "0.5rem",
                  marginRight: "1.2rem",
                  boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
                }}
              >
                <Formik
                  initialValues={initialValues}
                  validationSchema={validateBuilding}
                  onSubmit={this.handleSubmitEvent}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-sm-2">
                            <label htmlFor="name">NAME</label>
                          </div>
                          <div className="col-sm-10">
                            <Field
                              name="name"
                              type="text"
                              className={"form-control"}
                              placeholder="John Doe"
                              style={{ borderRadius: "0.375rem" }}
                            />
                            {errors.name && touched.name ? (
                              <div className="text-danger">{errors.name}</div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-sm-2">
                            <label htmlFor="phone_no">PHONE NO</label>
                          </div>
                          <div className="col-sm-10">
                            <Field
                              name="phone_no"
                              type="number"
                              className={"form-control"}
                              placeholder="Phone number"
                              style={{ borderRadius: "0.375rem" }}
                            />
                            {errors.phone_no && touched.phone_no ? (
                              <div className="text-danger">
                                {errors.phone_no}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-sm-2">
                            <label htmlFor="email">EMAIL</label>
                          </div>
                          <div className="col-sm-10">
                            <Field
                              name="email"
                              type="email"
                              className={"form-control"}
                              placeholder="john.doe@exmple.com"
                              style={{ borderRadius: "0.375rem" }}
                            />
                            {errors.email && touched.email ? (
                              <div className="text-danger">{errors.email}</div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-sm-2">
                            <label htmlFor="password">CREATE PASSWORD</label>
                          </div>
                          <div className="col-sm-10">
                            <Field
                              name="password"
                              type="password"
                              className={"form-control"}
                              placeholder="john.doe@exmple.com"
                              style={{ borderRadius: "0.375rem" }}
                            />
                            {errors.password && touched.password ? (
                              <div className="text-danger">
                                {errors.password}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-sm-2">
                            <label htmlFor="password">ROLE</label>
                          </div>
                          <div className="col-sm-6">
                            <select
                              name="role"
                              style={{ display: "block", padding: "0.4375rem 1.875rem 0.4375rem 0.875rem", borderRadius: "0.375rem" }}
                              className="col-sm-6"
                            >
                              <option value="" label="Default Select">
                                Select a color
                              </option>
                              <option value="hosteller" label="hosteller">
                                Hosteller
                              </option>
                              <option value="warden" label="warden">
                                Warden
                              </option>
                              <option value="laundry_man" label="laundry_man">
                                Laundry Man
                              </option>
                            </select>
                            {errors.role && touched.role ? (
                              <div className="text-danger">{errors.role}</div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="row form-m-t form-p-b">
                        <div className="form-group">
                          <div className="col-lg-2"></div>
                          <div className="col-lg-5">
                            <button
                              type="submit"
                              style={{
                                color: "#fff",
                                backgroundColor: "#883495",
                                borderColor: "#883495",
                                fontWeight: "400",
                                boxShadow:
                                  "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%)",
                                border: "1px solid transparent",
                                padding: "0.4375rem 1.25rem",
                                borderRadius: "0.375rem",
                                transition: "all 0.2s ease-in-out",
                              }}
                              className="btn"
                            >
                              Create
                            </button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
                {// server error message
                this.state.server_error ? (
                  <div className="alert alert-danger">
                    {this.state.server_error}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </Layout>
    );
  }
}
export default CreateSubAdmin;
