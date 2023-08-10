import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {useParams }  from "react-router-dom";

let initialValues = {
  building_name: "",
  no_of_floors: "",
};

class EditBuilding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_error: "",
      success: "",
      buildingDetails: [],
    };
  }
  
  componentDidMount() {
    let id = decodeURIComponent(this.props.match.params.id);
    this.getBuilding(id);
  }

  getBuilding(id) {
    API.get(`/admin/secure/buildingDetails/${id}`)
      .then((res) => {
        this.setState({
          buildingDetails: res.data.result[0],
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
      building_name: values.building_name,
      no_of_floor: values.no_of_floors,
    };
    API.post(`admin/secure/update/building`, post_data)
      .then((res) => {
        if (res.data.status === 200) {
          swal({
            closeOnClickOutside: false,
            title: "Success",
            text: "Record updated successfully.",
            icon: "success",
          }).then(() => {
            actions.setSubmitting(false);
            this.getBuilding(id);
          });
        } else {
          swal("Warning", res.data.message, "warning");
          actions.setSubmitting(false);
          this.getBuilding(id);
        }
      })
      .catch((err) => {
        actions.setErrors(err.data.errors);
        swal("Warning", "Something went wrong", "warning");
        actions.setSubmitting(false);
      });
  };

  render() {
    const { buildingDetails } = this.state;
    const newInitialValues = Object.assign(initialValues, {
      building_name: buildingDetails.building_name ? buildingDetails.building_name : "",
      no_of_floors: buildingDetails.no_of_floor ? buildingDetails.no_of_floor : "",
    });
    const validateBuilding = Yup.object().shape({
      building_name: Yup.string().required("Building Name is required"),
      no_of_floors: Yup.number().required("No of Floors is required"),
    });
    if (
      this.props.auth.userToken.permissions.master_data_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section className="content-header">
              <div className="row">
                <h3 className="card-title">
                  <span className="sp1">Home /</span>
                  <span className="sp1"> Master Data /</span>
                  <span className="sp2"> Create Building</span>
                </h3>
                <div className="col-lg-10 card card-m-l pty-30">
                  <Formik
                    initialValues={newInitialValues}
                    validationSchema={validateBuilding}
                    onSubmit={this.handleSubmitEvent}
                  >
                    {({ errors, touched }) => (
                      <Form>
                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2 text-">
                              <label htmlFor="building_name">
                                Building Name
                              </label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                name="building_name"
                                type="text"
                                className={"form-control"}
                                placeholder="Enter building name"
                              />
                              {errors.building_name && touched.building_name ? (
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
                              <label htmlFor="no_of_floors">
                                No. of Floors
                              </label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                name="no_of_floors"
                                type="number"
                                className={"form-control"}
                                placeholder="Enter no. of floors"
                              />
                              {errors.no_of_floors && touched.no_of_floors ? (
                                <div className="text-danger">
                                  {errors.no_of_floors}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="create-button mt-5">
                          <button
                            type="submit"
                            style={{
                              padding: "8px 18px 8px 18px",
                              borderRadius: "0.375rem",
                              margin: "15px 0",
                              fontSize: "16px",
                              color: "#fff",
                              backgroundColor: "#883495",
                              borderColor: "#883495",
                              boxShadow:
                                "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%",
                            }}
                          >
                            Save
                          </button>
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

export default withRouter(connect(mapStateToProps)(EditBuilding));
