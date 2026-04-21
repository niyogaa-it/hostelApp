import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import Multiselect from 'multiselect-react-dropdown';


let initialValues = {
  title: "",
  message: "",
  // student_name: [],
};

class PushNotification extends Component {
  student_name = [];
  student_data = [];
  student_value = [];
  
  constructor(props) {
    super(props);
    this.state = {
      server_error: "",
      success: "",
      student_dta: "",
    };
  }

  // api get call for Students
  componentDidMount() {
    API.get(`/admin/secure/student`)
      .then((response) => {
        this.setState({ student_dta: response.data.result_data });
        this.student_name.push(response.data.result_data);
        this.student_value.push({
          name : 'All', 
          id : 0
        })
        for(let i=0; i<this.student_name[0].length; i++){
          this.student_value.push({
            name : this.student_name[0][i].SFname, 
            id : this.student_name[0][i].id
          })
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleSubmitEvent = (values, { resetForm }) => {
    values['student_data'] = this.student_data;
    console.log(values);
    API.post("/admin/secure/notification/push", values)
      .then((response) => {
        console.log(response);
        if (response.data.status === 201) {
          swal("Success", "Notification pushed succesfully", "success");
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
      title: Yup.string().required("Title is required"),
      message: Yup.string().required("Message is required"),
    });

    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <div className="row">
              <h3 className="card-title">
                <span className="sp1">Home /</span>
                <span className="sp2"> Push Notification</span>
              </h3>
              <div className="col-lg-10 card card-m-l pty-30">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validateBuilding}
                  onSubmit={this.handleSubmitEvent}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-lg-2">
                            <label htmlFor="building_name">
                              Select Student
                            </label>
                          </div>
                          <div className="col-lg-5">
                            {/* <Field
                              component={"select"}
                              name="student_name[]"
                              // value="name"
                              className={"form-control"}
                              multiple={true}
                            >
                              <option value="all">
                                All
                              </option>
                              {this.state.student_dta &&
                                this.state.student_dta.map((student, i) => (
                                  <option onChange={this.handleSelect} value={student.id}>
                                    {student.SFname}
                                  </option>
                                ))}
                            </Field>  */}

                            <Multiselect
                              isObject={true}
                              displayValue="name"
                              name="search_name_input[]"
                              value="value"
                              onSelect={(event)=>{
                                this.student_data = event
                              }}
                              options={this.student_value}
                            /> 

                           {errors.student_name && touched.student_name ? (
                              <div className="text-danger">
                                {errors.student_name}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-lg-2">
                            <label htmlFor="title">Title</label>
                          </div>
                          <div className="col-lg-5">
                            <Field
                              name="title"
                              type="text"
                              className={"form-control"}
                              placeholder="Enter Title"
                            />
                            {errors.title && touched.title ? (
                              <div className="text-danger">{errors.title}</div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-lg-2">
                            <label htmlFor="message">Message</label>
                          </div>
                          <div className="col-lg-5">
                            <Field
                              name="message"
                              component="textarea"
                              className={`form-control`}
                              placeholder="Enter Message"
                              autoComplete="off"
                              style={{ height: "120px" }}
                            />
                            {errors.message && touched.message ? (
                              <div className="text-danger">
                                {errors.message}
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
                                marginBottom: "5%",
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
export default PushNotification;
