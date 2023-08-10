import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";

let initialValues = {
  event_name: "",
  description: "",
  file: "",
  start_date: "",
  end_date: "",
};

class PushNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_error: "",
      success: "",
      startDate: "",
      endDate: "",
      endDateMin: new Date(),
      file: "",
      // files: [],
      isValidFile: false,
      setFileErrors: "",
    };
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
  }

  handleSubmitEvent = (values, actions) => {
    let postData = {
      event_name: values.event_name,
      event_start_time: moment(values.start_date).format("YYYY-MM-DD"),
      event_end_time: moment(values.end_date).format("YYYY-MM-DD"),
      description: values.description,
    };

    if (this.state.file) {
      if (this.state.file.size > 1000) {
        actions.setErrors({ file: "file size must be less than 5 mb" });
        actions.setSubmitting(false);
      } else {
        postData = { ...postData, StudimagepathBase: this.state.file };
        API.post("/admin/secure/create/event", postData)
          .then((res) => {
            if (res.data.status === 201) {
              swal({
                closeOnClickOutside: false,
                title: "Success",
                text: "Event Added Successfully",
                icon: "success",
              }).then(() => {
                window.location.reload();
              });
            } else {
              swal({
                closeOnClickOutside: false,
                title: "Warning",
                text: res.data.message,
                //  icon: "success",
              }).then(() => {});
            }
          })
          .catch((err) => {
            this.setState({ closeModal: true, showModalLoader: false });
            if (err.data.status === 3) {
            } else {
              actions.setErrors(err.data.errors);
              actions.setSubmitting(false);
            }
          });
      }
    }
  };
  fileChangedHandler = (event, setFieldTouched, setFieldValue, setErrors) => {
    const { value: file_name } = event.target;
    setFieldTouched("file");
    setFieldValue("file", file_name);

    const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg"];
    if (!event.target.files[0]) {
      this.setState({
        file: "",
        isValidFile: false,
      });
      return;
    }
    if (
      event.target.files[0] &&
      SUPPORTED_FORMATS.includes(event.target.files[0].type)
    ) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      if (event.target.files[0].size < 5242880) {
        reader.onload = () => {
          this.setState(
            {
              setFileErrors: "",
              file: reader.result,
              isValidFile: true,
            },
            () => {
              setFieldValue("file", file_name);
            }
          );
        };
      } else {
        this.setState({
          setFileErrors: "Image size must be less than 5 mb",
          isValidFile: false,
        });
      }

      reader.onerror = (error) => {
        console.log("Error: ", error);
      };
    } else {
      this.setState({
        file: "",
        isValidFile: false,
      });
    }
  };

  render() {
    const onValueChange = (name, value) => {
      if (name === "startDate") {
        this.setState({ startDate: value });
      } else if (name === "endDate") {
        this.setState({ endDate: value });
      }
    };

    const validateBuilding = Yup.object().shape({
      event_name: Yup.string().required("Event Name is required"),
      description: Yup.string().required("Description is required"),
      start_date: Yup.date().required("Please select the Start Date"),
      end_date: Yup.date().required("Please select the End Date"),

      file: Yup.string()
        .required("Please select the Image")
        .test(
          "image",
          "Only files with the following extensions are allowed: png jpg jpeg",
          () => this.state.isValidFile
        ),
    });
    if (
      this.props.auth.userToken.permissions.events == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section className="content-header">
              <div className="row">
                <h3 className="card-title">
                  <span className="sp1">Home /</span>
                  <span className="sp2"> Events</span>
                </h3>
                <div className="col-lg-10 card card-m-l pty-30">
                  {/* errors, touched, setFieldValue */}
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validateBuilding}
                    onSubmit={this.handleSubmitEvent}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      isValid,
                      isSubmitting,
                      setFieldValue,
                      setFieldTouched,
                      handleChange,
                      setErrors,
                    }) => (
                      <Form>
                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="file">
                                Event Image{" "}
                                <span
                                  style={{
                                    color: "red",
                                    fontSize: "12px",
                                    fontWeight: "normal",
                                  }}
                                >
                                  (Image Size must be less than 5 mb)
                                </span>
                              </label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                name="file"
                                type="file"
                                className={`form-control`}
                                placeholder="Select Image"
                                autoComplete="off"
                                accept="image/*"
                                onChange={(e) => {
                                  this.fileChangedHandler(
                                    e,
                                    setFieldTouched,
                                    setFieldValue,
                                    setErrors
                                  );
                                }}
                              />
                              {this.state.setFileErrors != "" ? (
                                <div className="text-danger">
                                  {this.state.setFileErrors}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="event_name">Event Name</label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                name="event_name"
                                type="text"
                                className={"form-control"}
                                placeholder="Enter event name"
                              />
                              {errors.event_name && touched.event_name ? (
                                <div className="text-danger">
                                  {errors.event_name}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="start_date">
                                Event Start Date
                              </label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                name="start_date"
                                type="date"
                                className={"form-control"}
                              />
                              {errors.start_date && touched.start_date ? (
                                <div className="text-danger">
                                  {errors.start_date}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="end_date">Event End Date</label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                disabled={values.start_date == ""}
                                name="end_date"
                                type="date"
                                min={values.start_date}
                                className={"form-control"}
                              />
                              {errors.end_date && touched.end_date ? (
                                <div className="text-danger">
                                  {errors.end_date}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="description">Message</label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                name="description"
                                component="textarea"
                                className={`form-control`}
                                placeholder="Enter description"
                                autoComplete="off"
                                style={{ height: "120px" }}
                              />
                              {errors.description && touched.description ? (
                                <div className="text-danger">
                                  {errors.description}
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
                                Add
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

export default withRouter(connect(mapStateToProps)(PushNotification));
