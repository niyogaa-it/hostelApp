import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";

const CARDS = [
  { key: "open", label: "Open", bg: "#fff2d6", color: "#ffab00" },
  { key: "in_progress", label: "In Progress", bg: "#d7f5fc", color: "#039be5" },
  { key: "completed", label: "Completed", bg: "#e8fadf", color: "#71dd37" },
  { key: "rescheduled", label: "Rescheduled", bg: "#f1e4fb", color: "#883495" },
  { key: "closed", label: "Closed", bg: "#eceff1", color: "#607d8b" },
];

class ServicesDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Invalid: false,
      counts: {},
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.emergency_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/services/dashboard`)
        .then((res) => {
          this.setState({ counts: res.data.result_data || {} });
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
                  Home / Services /{" "}
                  <b style={{ color: "#566a7f" }}>Dashboard</b>
                  <small />
                </h1>
              </div>
            </div>
          </section>
          <section className="content">
            <div className="row">
              {CARDS.map((card) => (
                <div className="col-md-2 col-sm-4 col-xs-6" key={card.key}>
                  <div
                    className="box"
                    style={{
                      borderRadius: "0.5rem",
                      boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
                      padding: "20px 15px",
                      textAlign: "center",
                      backgroundColor: card.bg,
                    }}
                  >
                    <h2 style={{ color: card.color, marginBottom: "5px" }}>
                      {this.state.counts[card.key] || 0}
                    </h2>
                    <div style={{ color: card.color, fontWeight: "bold" }}>
                      {card.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "20px" }}>
              <Link className="btn btn-primary" to="/admin/services/requests">
                View All Requests
              </Link>
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

export default withRouter(connect(mapStateToProps)(ServicesDashboard));
