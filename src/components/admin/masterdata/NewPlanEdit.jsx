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
  addmission_fee: 0,
  admisson_kit: 0,
  cultural_fees: 0,
  caution_deposit: 0,
  room_rent: 0,
  total: 0,
 
};

class NewPlanDatalEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
        server_error: "",
        success: "",
        show_buliding: false,
        addmission_fee: 0,
        admisson_kit: 0,
        cultural_fees: 0,
        caution_deposit: 0,
        room_rent: 0,
        new_plan_id: "",
        total: 0,
        isLoading: true,
    };
  }
  // api get call for building
  componentDidMount() {
    let id = decodeURIComponent(this.props.match.params.id);

    API.get(`admin/secure/new_plan_details/${id}`)
      .then((response) => {

  
        this.setState({
          addmission_fee: response.data.details[0].addmission_fee,
          admisson_kit: response.data.details[0].admisson_kit,
          cultural_fees: response.data.details[0].cultural_fees,
          caution_deposit: response.data.details[0].caution_deposit,
          room_rent: response.data.details[0].room_rent,
          total: response.data.details[0].total,
          new_plan_id: id,
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


  const total =
  (parseFloat(values.addmission_fee) || 0) +
  (parseFloat(values.admisson_kit) || 0) +
  (parseFloat(values.cultural_fees) || 0) +
  (parseFloat(values.caution_deposit) || 0) +
  (parseFloat(values.room_rent) || 0);


  const payload = {
    id: decodeURIComponent(this.props.match.params.id),
    addmission_fee: values.addmission_fee,
    admisson_kit: values.admisson_kit,
    cultural_fees: values.cultural_fees,
    caution_deposit: values.caution_deposit,
    room_rent: values.room_rent,
    total: total,
  };




    API.post("/admin/secure/edit_new_plan", payload)
    .then((response) => {
      if (response.data.status === 201) {
        swal("Success", response.data.message, "success");
        userLog('Edit New plan', 'Edit New plan');
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
    
    const { plan_details } = this.state;
    const newInitialValues = Object.assign(initialValues, {
      // addmission_fee: plan_details.addmission_fee ? plan_details.addmission_fee : "",
      // admisson_kit: plan_details.admisson_kit ? plan_details.admisson_kit : "",
      
    });
    const validateRoom = Yup.object().shape({
      addmission_fee: Yup.string().required("admission fees is required"),
      admisson_kit: Yup.string().required("Admission kit is required"),
      caution_deposit: Yup.string().required("Caution Name is required"),
      room_rent: Yup.string().required("Room rent is required"),
     
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
                  addmission_fee: this.state.addmission_fee || 0,
                  admisson_kit: this.state.admisson_kit || 0,
                  cultural_fees: this.state.cultural_fees || 0,
                  caution_deposit: this.state.caution_deposit || 0,
                  room_rent: this.state.room_rent || 0,
                 
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
                        <span className="sp2"> Edit New Plan</span>
                      </h3>
                      <div className="col-lg-10 card card-m-l pty-30">
                        <div className="row">
                          <div className="col-md-8">


                                      <div className="row form-m-t">
                                        <div className="form-group">
                                          <div className="col-lg-4">
                                            <label htmlFor="addmission_fee">Addmission fee</label>
                                          </div>
                                          <div className="col-lg-8">
                                            <Field
                                              type="text"
                                              autoComplete="off"
                                              name="addmission_fee"
                                              className="form-control"
                                            />
                                            {errors.addmission_fee && touched.addmission_fee ? (
                                              <div className="text-danger">{errors.addmission_fee}</div>
                                            ) : null}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row form-m-t">
                                        <div className="form-group">
                                          <div className="col-lg-4">
                                            <label htmlFor="admisson_kit">Admisson Kit</label>
                                          </div>
                                          <div className="col-lg-8">
                                            <Field
                                              name="admisson_kit"
                                              type="text"
                                              autoComplete="off"
                                              className="form-control"
                                            />
                                            {errors.admisson_kit && touched.admisson_kit ? (
                                              <div className="text-danger">{errors.admisson_kit}</div>
                                            ) : null}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row form-m-t">
                                        <div className="form-group">
                                          <div className="col-lg-4">
                                            <label htmlFor="cultural_fees">Cultural fees</label>
                                          </div>
                                          <div className="col-lg-8">
                                            <Field
                                              name="cultural_fees"
                                              type="text"
                                              autoComplete="off"
                                              className="form-control"
                                            />
                                            {errors.cultural_fees && touched.cultural_fees ? (
                                              <div className="text-danger">{errors.cultural_fees}</div>
                                            ) : null}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row form-m-t">
                                        <div className="form-group">
                                          <div className="col-lg-4">
                                            <label htmlFor="caution_deposit">Caution deposit</label>
                                          </div>
                                          <div className="col-lg-8">
                                            <Field
                                              name="caution_deposit"
                                              type="text"
                                              autoComplete="off"
                                              className="form-control"
                                            />
                                            {errors.caution_deposit && touched.caution_deposit ? (
                                              <div className="text-danger">{errors.caution_deposit}</div>
                                            ) : null}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row form-m-t">
                                        <div className="form-group">
                                          <div className="col-lg-4">
                                            <label htmlFor="room_rent">Room rent</label>
                                          </div>
                                          <div className="col-lg-8">
                                            <Field
                                              name="room_rent"
                                              type="text"
                                              autoComplete="off"
                                              className="form-control"
                                            />
                                            {errors.room_rent && touched.room_rent ? (
                                              <div className="text-danger">{errors.room_rent}</div>
                                            ) : null}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Total Field (Read-only, auto calculated) */}
                                      <div className="row form-m-t">
                                        <div className="form-group">
                                          <div className="col-lg-4">
                                            <label htmlFor="total">Total</label>
                                          </div>
                                          <div className="col-lg-8">
                                            <Field name="total">
                                              {({ form }) => {
                                                const { values, setFieldValue } = form;
                                                const total =
                                                  (parseFloat(values.addmission_fee) || 0) +
                                                  (parseFloat(values.admisson_kit) || 0) +
                                                  (parseFloat(values.cultural_fees) || 0) +
                                                  (parseFloat(values.caution_deposit) || 0) +
                                                  (parseFloat(values.room_rent) || 0);


                                                if (values.total !== total) {
                                                  setFieldValue("total", total);
                                                }

                                                return (
                                                  <input
                                                    type="text"
                                                    name="total"
                                                    className="form-control"
                                                    value={total.toFixed(2)}
                                                    readOnly
                                                  />
                                                );
                                              }}
                                            </Field>
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
                                              boxShadow: "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%",
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

export default withRouter(connect(mapStateToProps)(NewPlanDatalEdit));
