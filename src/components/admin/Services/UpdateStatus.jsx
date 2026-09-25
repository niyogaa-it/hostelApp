import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import API from "../../../shared/admin-axios";
import { SERVICE_STATUS } from "./statusConfig";

const initialValues = {
  status_id: "",
  remarks: "",
};

const validateStatus = Yup.object().shape({
  status_id: Yup.string().required("Please select a status"),
  remarks: Yup.string(),
});

class UpdateStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Invalid: false,
    };
  }

  componentDidMount() {
    if (
      !(
        this.props.auth.userToken.permissions.emergency_management == 0 ||
        this.props.auth.userToken.user_details.role == "admin"
      )
    ) {
      this.setState({ Invalid: true });
    }
  }

  handleSubmitEvent = (values) => {
    const postData = {
      request_id: this.props.match.params.id,
      status_id: values.status_id,
      remarks: values.remarks,
      manager_id: this.props.auth.userToken.user_details.id,
    };

    API.post("/admin/secure/services/updatestatus", postData)
      .then((res) => {
        if (res.data.status == 200) {
          swal("Success", res.data.message, "success").then(() => {
            this.props.history.push(
              `/admin/services/requests/view/${this.props.match.params.id}`
            );
          });
        } else {
          swal("Error", res.data.message, "error");
        }
      })
      .catch((err) => {
        console.log("err", err);
        swal("Error", "Something went wrong", "error");
      });
  };

  render() {
    if (this.state.Invalid) return <Redirect to="/admin/dashboard" />;
    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <Formik
              initialValues={initialValues}
              validationSchema={validateStatus}
              onSubmit={this.handleSubmitEvent}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="row">
                    <h3 className="card-title">
                      <span className="sp1">Home /</span>
                      <span className="sp1"> Services /</span>
                      <span className="sp1"> Requests / </span>
                      <span className="sp2">Update Status</span>
                    </h3>
                    <div className="col-lg-8 card card-m-l pty-30">
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-lg-2">
                            <label htmlFor="status_id">Status</label>
                          </div>
                          <div className="col-lg-6">
                            <Field
                              component="select"
                              name="status_id"
                              className="form-control"
                            >
                              <option value="">Default Select</option>
                              {SERVICE_STATUS.map((s) => (
                                <option value={s.id} key={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </Field>
                            {errors.status_id && touched.status_id ? (
                              <div className="text-danger">
                                {errors.status_id}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-lg-2">
                            <label htmlFor="remarks">Remarks</label>
                          </div>
                          <div className="col-lg-6">
                            <Field
                              name="remarks"
                              component="textarea"
                              className="form-control"
                              placeholder="Remarks"
                            />
                            {errors.remarks && touched.remarks ? (
                              <div className="text-danger">
                                {errors.remarks}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-lg-2"></div>
                          <div className="col-lg-6">
                            <button
                              type="submit"
                              style={{
                                padding: "8px 18px 8px 18px",
                                borderRadius: "0.375rem",
                                fontSize: "16px",
                                color: "#fff",
                                backgroundColor: "#883495",
                                borderColor: "#883495",
                              }}
                            >
                              Update
                            </button>
                          </div>
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
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(UpdateStatus));
