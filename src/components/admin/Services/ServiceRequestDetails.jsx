import React, { Component } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import { statusBadge } from "./statusConfig";

class ServiceRequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Invalid: false,
      details: null,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.emergency_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/services/${this.props.match.params.id}`)
        .then((res) => {
          this.setState({ details: res.data.result_data });
        })
        .catch((err) => {
          console.log("err:", err);
        });
    } else {
      this.setState({ Invalid: true });
    }
  }

  render() {
    if (this.state.Invalid) return <Redirect to="/admin/dashboard" />;
    const d = this.state.details;
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
                  <b style={{ color: "#566a7f" }}>View</b>
                  <small />
                </h1>
              </div>
            </div>
          </section>
          <section className="content">
            {d ? (
              <div
                className="box"
                style={{
                  borderRadius: "0.5rem",
                  boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
                  padding: "20px",
                }}
              >
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Request No</th>
                      <td>{d.request_no}</td>
                    </tr>
                    <tr>
                      <th>Application Id</th>
                      <td>{d.application_id}</td>
                    </tr>
                    <tr>
                      <th>Student Id</th>
                      <td>{d.student_id}</td>
                    </tr>
                    <tr>
                      <th>Category</th>
                      <td>{d.category_name}</td>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <td>{d.description}</td>
                    </tr>
                    <tr>
                      <th>Requested On</th>
                      <td>
                        {d.requested_date
                          ? moment(d.requested_date).format("DD/MM/YYYY")
                          : "-"}{" "}
                        {d.requested_time}
                      </td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>{statusBadge(d.status_name)}</td>
                    </tr>
                    <tr>
                      <th>Assigned To (Staff Id)</th>
                      <td>{d.assigned_to || "-"}</td>
                    </tr>
                    <tr>
                      <th>Assigned By</th>
                      <td>{d.assigned_by || "-"}</td>
                    </tr>
                    <tr>
                      <th>Closed At</th>
                      <td>
                        {d.closed_at
                          ? moment(d.closed_at).format("DD/MM/YYYY, h:mm:ss a")
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <th>Created At</th>
                      <td>
                        {d.created_at
                          ? moment(d.created_at).format("DD/MM/YYYY, h:mm:ss a")
                          : "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ marginTop: "15px" }}>
                  <Link
                    to={`/admin/services/requests/assign/${d.id}`}
                    className="btn btn-primary"
                    style={{ marginRight: "10px" }}
                  >
                    Assign Staff
                  </Link>
                  <Link
                    to={`/admin/services/requests/status/${d.id}`}
                    className="btn btn-primary"
                    style={{ marginRight: "10px" }}
                  >
                    Update Status
                  </Link>
                  <Link
                    to={`/admin/services/requests/history/${d.id}`}
                    className="btn btn-default"
                  >
                    View History
                  </Link>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
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

export default withRouter(connect(mapStateToProps)(ServiceRequestDetails));
