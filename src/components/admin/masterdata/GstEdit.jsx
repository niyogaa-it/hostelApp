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
import userLog from "../Utils/Logadd";

let initialValues = {
  cgst_amount: "",
  sgst_amount: "",
 
};

class GstEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
        server_error: "",
        success: "",
        show_buliding: false,
        cgst_amount: "",
        sgst_amount: "",
        gst_id: "",
        isLoading: true,
    };
  }
 
  componentDidMount() {
    let id = decodeURIComponent(this.props.match.params.id);

    API.get(`admin/secure/gst_details/${id}`)
      .then((response) => {

         const data = Array.isArray(response.data.details)
          ? response.data.details[0]
          : response.data.details;

        this.setState({
          cgst_amount: data.cgst,
          sgst_amount: data.sgst,
          gst_id: data.id,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
      });
  }

 

  handleSubmitEvent = (values, { resetForm }) => {
  // Prepare the payload for the API
  const payload = {
    id: decodeURIComponent(this.props.match.params.id),
    cgst: values.cgst_amount,
    sgst: values.sgst_amount,
  };

  API.post("/admin/secure/edit_gst", payload)
    .then((response) => {
      if (response.data.status === 201) {
        swal("Success", response.data.message, "success");
        userLog('Edit GST', 'Edit GST');
      } else if (response.data.status === 401) {
        swal("Warning", response.data.message, "warning");
      }
    })
    .catch((error) => {
      if (
        error.response &&
        (error.response.data.status === 401 || error.response.data.status === 400)
      ) {
        swal("Error", error.response.data.message, "error");
        resetForm();
      }
    });
};

 

  render() {
    
    const { room_details } = this.state;
    const newInitialValues = Object.assign(initialValues, {
      // cgst_amount: room_details.gst_id ? room_details.cgst_amount : "",
      // sgst_amount: room_details.sgst_amount ? room_details.sgst_amount : "",
      
    });
    const validateRoom = Yup.object().shape({
      cgst_amount: Yup.string().required("CGST amount is required"),
      sgst_amount: Yup.string().required("SGST amount is required"),
     
    });
    if (
      this.props.auth.userToken.permissions.master_data_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section className="content-header">
              <Formik
                enableReinitialize
                initialValues={{
                  cgst_amount: this.state.cgst_amount || "",
                  sgst_amount: this.state.sgst_amount || "",
                }}
                validationSchema={validateRoom}
                onSubmit={this.handleSubmitEvent}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="row">
                      <h3 className="card-title">
                        <span className="sp1">Home /</span>
                        <span className="sp1"> Master Data /</span>
                        <span className="sp2"> Edit GST</span>
                      </h3>
                      <div className="col-lg-10 card card-m-l pty-30">
                        <div className="row">
                          <div className="col-md-8">
                            <div className="row form-m-t">
                              <div className="form-group">
                                <div className="col-lg-4">
                                  <label htmlFor="cgst_amount">
                                    CGST 
                                  </label>
                                </div>
                                <div className="col-lg-8">
                                  <Field
                                   type="text"
                                    autoComplete="off"
                                    name="cgst_amount"
                                    className={"form-control"}
                                   
                              
                                  >
                                    
                                  </Field>

                                  {errors.cgst_amount &&
                                    touched.cgst_amount ? (
                                    <div className="text-danger">
                                      {errors.cgst_amount}
                                    </div>
                                  ) : null}
                                </div>
                                
                              </div>
                            </div>
                            <div className="row form-m-t">
                              <div className="form-group">
                                <div className="col-lg-4">
                                  <label htmlFor="sgst_amount">SGST</label>
                                </div>
                                <div className="col-lg-8">
                                  <Field
                                    name="sgst_amount"
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                   
                                   
                                  >
                                    
                                  </Field>
                                  {errors.sgst_amount && touched.sgst_amount ? (
                                    <div className="text-danger">
                                      {errors.sgst_amount}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                           
                           
                            <div className="row form-m-t form-p-b">
                              <div className="col-lg-4"></div>
                              <div className="col-lg-8">
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
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            {this.state.room_info ? (
                              <div
                                className="card-m-t col-sm-1 m-4"
                                style={{
                                  width: "150px",
                                  height: "170px",
                                  backgroundColor: this.state.room_info.bgColor,
                                  textAlign: "center",
                                  paddingTop: "5px",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "13px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    marginTop: "5px",
                                    color: "white",
                                  }}
                                >
                                  Room Number {this.state.room_info.room_number}
                                </p>
                                <p
                                  style={{
                                    fontSize: "13px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    marginTop: "5px",
                                    color: "white",
                                  }}
                                >
                                  {" "}
                                  Available Room Type{" "}
                                  {this.state.room_info.room_type}
                                </p>
                                <p
                                  style={{
                                    fontSize: "13px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    marginTop: "5px",
                                    color: "white",
                                  }}
                                >
                                  {" "}
                                  Vacancy {this.state.room_info.vaccancy}
                                </p>
                                <p
                                  style={{
                                    fontSize: "13px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    marginTop: "5px",
                                    color: "white",
                                  }}
                                >
                                  {" "}
                                  Occupancy {this.state.room_info.occupancy}
                                </p>
                                <p
                                  style={{
                                    fontSize: "13px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    marginTop: "5px",
                                    color: "white",
                                  }}
                                >
                                  {" "}
                                  Toilet Type {this.state.room_info.toilet_type}
                                </p>
                                <p
                                  style={{
                                    fontSize: "13px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    marginTop: "5px",
                                    color: "white",
                                  }}
                                >
                                  {this.state.room_info.student_id !== null ? (
                                    <span>
                                      {" "}
                                      Student Id:{" "}
                                      {this.state.room_info.student_id}
                                    </span>
                                  ) : null}
                                </p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
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

export default withRouter(connect(mapStateToProps)(GstEdit));
