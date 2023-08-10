import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

let initialValues = {
  building_name: "",
  parking_slot: "",
};

class AddParking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_error: "",
      success: "",
      building_dta: [],
    };
  }

  handleSubmitEvent = (values, { resetForm }) => {
    API.post("/admin/secure/create/parking", values)
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
  componentDidMount() {
    API.get(`admin/secure/building`)
      .then((response) => {
        this.setState({ building_dta: response.data.result_data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const parkingSchema = Yup.object().shape({
      building_name: Yup.string().required("Building Name is required"),
      parking_slot: Yup.number().required("Parking slot is required"),
    });
    if (
      this.props.auth.userToken.permissions.master_data_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section className="content-header">
              <div className="row ">
                <h3 className="card-title">
                  <span className="sp1">Home /</span>
                  <span className="sp1"> Master Data /</span>
                  <span className="sp2"> Add Parking</span>
                </h3>
                <div className="col-lg-10 card card-m-l pty-30">
                  <div className="card-header"></div>
                  <div className="card-body">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={parkingSchema}
                      onSubmit={this.handleSubmitEvent}
                    >
                      {({ errors, touched }) => (
                        <Form>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label htmlFor="building_name">
                                  Building Name
                                </label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  component="select"
                                  autoComplete="off"
                                  name="building_name"
                                  className={"form-control"}
                                  onClick={this.changeBlock}
                                >
                                  <option key="-1" value="">
                                    Default Select
                                  </option>
                                  {this.state.building_dta &&
                                    this.state.building_dta.map(
                                      (building, i) => (
                                        <option
                                          value={building.building_name}
                                          key={i}
                                        >
                                          {building.building_name}
                                        </option>
                                      )
                                    )}
                                </Field>
                                {errors.building_name &&
                                touched.building_name ? (
                                  <div className="text-danger">
                                    {errors.building_name}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row form-m-t">
                            <div className="form-group">
                              <div className="col-lg-2">
                                <label htmlFor="parking_slot">
                                  Parking Slot
                                </label>
                              </div>
                              <div className="col-lg-5">
                                <Field
                                  type="number"
                                  name="parking_slot"
                                  className="form-control"
                                  placeholder="Enter Parking Slot"
                                />
                                {errors.parking_slot && touched.parking_slot ? (
                                  <div className="text-danger">
                                    {errors.parking_slot}
                                  </div>
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
                                    padding: "8px 18px 8px 18px",
                                    borderRadius: "0.375rem",
                                    marginLeft: "-43%",
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
                        </Form>
                      )}
                    </Formik>
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

export default withRouter(connect(mapStateToProps)(AddParking));
