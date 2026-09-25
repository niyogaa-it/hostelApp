import React, { Component } from "react";
import moment from "moment";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import { statusBadge } from "./statusConfig";

const initialValues = {
  note: "",
};

const validateNote = Yup.object().shape({
  note: Yup.string().required("Please enter a note"),
});

class RequestHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Invalid: false,
      history: [],
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.emergency_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      this.fetchHistory();
    } else {
      this.setState({ Invalid: true });
    }
  }

  fetchHistory = () => {
    API.get(
      `/admin/secure/services/request/history/${this.props.match.params.id}`
    )
      .then((res) => {
        this.setState({ history: res.data.result_data || [] });
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };

  handleSubmitEvent = (values, { resetForm }) => {
    const postData = {
      manager_id: this.props.auth.userToken.user_details.id,
      note: values.note,
    };

    API.post(
      `/admin/secure/services/request/history/internal/${this.props.match.params.id}`,
      postData
    )
      .then((res) => {
        if (res.data.status == 200) {
          swal("Success", "Internal note saved", "success");
          resetForm(initialValues);
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
          <section
            className="content-header"
            style={{ padding: "30px 15px 15px 15px" }}
          >
            <div className="row">
              <div className="col-lg-12 col-sm-12 col-xs-12">
                <h1 style={{ color: "#a1acb8" }}>
                  Home / Services / Requests /{" "}
                  <b style={{ color: "#566a7f" }}>History</b>
                  <small />
                </h1>
              </div>
            </div>
          </section>
          <section className="content">
            <div
              className="box"
              style={{
                borderRadius: "0.5rem",
                boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              {this.state.history.length > 0 ? (
                this.state.history.map((h) => (
                  <div
                    key={h.id}
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "10px 0",
                    }}
                  >
                    <div>
                      {statusBadge(h.status_name)}{" "}
                      <span style={{ color: "#a1acb8", marginLeft: "10px" }}>
                        {moment(h.created_at).format("DD/MM/YYYY, h:mm:ss a")}
                      </span>
                    </div>
                    {h.remarks ? (
                      <div style={{ marginTop: "5px" }}>{h.remarks}</div>
                    ) : null}
                    {h.requested_date ? (
                      <div style={{ color: "#a1acb8" }}>
                        Rescheduled to{" "}
                        {moment(h.requested_date).format("DD/MM/YYYY")}{" "}
                        {h.requested_time}
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p>No history found.</p>
              )}
            </div>

            <div
              className="box"
              style={{
                borderRadius: "0.5rem",
                boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
                padding: "20px",
              }}
            >
              <h4>Add Internal Note</h4>
              <Formik
                initialValues={initialValues}
                validationSchema={validateNote}
                onSubmit={this.handleSubmitEvent}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="form-group">
                      <Field
                        name="note"
                        component="textarea"
                        className="form-control"
                        placeholder="Internal note (visible to managers only)"
                      />
                      {errors.note && touched.note ? (
                        <div className="text-danger">{errors.note}</div>
                      ) : null}
                    </div>
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
                      Save Note
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
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

export default withRouter(connect(mapStateToProps)(RequestHistory));
