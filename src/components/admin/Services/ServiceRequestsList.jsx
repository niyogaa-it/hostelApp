import React, { Component } from "react";
import moment from "moment";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import { SERVICE_STATUS, statusBadge } from "./statusConfig";

class ServiceRequestsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Invalid: false,
      requests: [],
      categories: [],
      status_id: "",
      category_id: "",
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.emergency_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      this.fetchRequests();
      API.get(`/admin/secure/services/categories`)
        .then((res) => {
          this.setState({ categories: res.data.result_data || [] });
        })
        .catch((err) => {
          console.log("err:", err);
        });
    } else {
      this.setState({ Invalid: true });
    }
  }

  fetchRequests = () => {
    API.get(`/admin/secure/services`, {
      params: {
        status_id: this.state.status_id || undefined,
        category_id: this.state.category_id || undefined,
      },
    })
      .then((res) => {
        this.setState({ requests: res.data.result_data || [] });
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };

  handleFilterChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleApplyFilters = (event) => {
    event.preventDefault();
    this.fetchRequests();
  };

  render() {
    const dateFormatting = () => (cell, row) => {
      if (!row.requested_date) return "-";
      return `${moment(row.requested_date).format("DD/MM/YYYY")} ${
        row.requested_time || ""
      }`;
    };

    const statusFormatter = () => (cell) => statusBadge(cell);

    const actionFormatter = () => (cell, row) => {
      return (
        <div className="actionStyle">
          <Link
            to={`/admin/services/requests/view/${row.id}`}
            className="btn btn-sm"
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#d7f5fc",
              color: "#039be5",
              fontWeight: "bold",
              border: "none",
              margin: "2px",
            }}
          >
            VIEW
          </Link>
          <Link
            to={`/admin/services/requests/assign/${row.id}`}
            className="btn btn-sm"
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#f1e4fb",
              color: "#883495",
              fontWeight: "bold",
              border: "none",
              margin: "2px",
            }}
          >
            ASSIGN
          </Link>
          <Link
            to={`/admin/services/requests/status/${row.id}`}
            className="btn btn-sm"
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#fff2d6",
              color: "#ffab00",
              fontWeight: "bold",
              border: "none",
              margin: "2px",
            }}
          >
            STATUS
          </Link>
          <Link
            to={`/admin/services/requests/history/${row.id}`}
            className="btn btn-sm"
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              backgroundColor: "#e8fadf",
              color: "#71dd37",
              fontWeight: "bold",
              border: "none",
              margin: "2px",
            }}
          >
            HISTORY
          </Link>
        </div>
      );
    };

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
                  <b style={{ color: "#566a7f" }}>Requests</b>
                  <small />
                </h1>
              </div>
            </div>
          </section>
          <section className="content">
            <form onSubmit={this.handleApplyFilters}>
              <div className="row" style={{ marginBottom: "15px" }}>
                <div className="col-md-3">
                  <select
                    name="status_id"
                    className="form-control"
                    value={this.state.status_id}
                    onChange={this.handleFilterChange}
                  >
                    <option value="">All Status</option>
                    {SERVICE_STATUS.map((s) => (
                      <option value={s.id} key={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <select
                    name="category_id"
                    className="form-control"
                    value={this.state.category_id}
                    onChange={this.handleFilterChange}
                  >
                    <option value="">All Categories</option>
                    {this.state.categories.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn btn-primary">
                    Apply
                  </button>
                </div>
              </div>
            </form>
            <div
              className="box"
              style={{
                borderRadius: "0.5rem",
                boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
              }}
            >
              <div className="box-body">
                <BootstrapTable data={this.state.requests} search pagination>
                  <TableHeaderColumn
                    isKey
                    dataField="id"
                    dataSort
                    width="6%"
                    dataAlign="center"
                  >
                    Id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="request_no"
                    dataSort
                    width="12%"
                    dataAlign="center"
                  >
                    Request No
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="application_id"
                    dataSort
                    width="10%"
                    dataAlign="center"
                  >
                    Application Id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="category_name"
                    dataSort
                    width="14%"
                    dataAlign="center"
                  >
                    Category
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="requested_date"
                    dataSort
                    width="16%"
                    dataAlign="center"
                    dataFormat={dateFormatting(this)}
                  >
                    Requested On
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="status_name"
                    dataSort
                    width="12%"
                    dataAlign="center"
                    dataFormat={statusFormatter(this)}
                  >
                    Status
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="id"
                    dataAlign="center"
                    width="30%"
                    dataFormat={actionFormatter(this)}
                  >
                    Actions
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
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

export default withRouter(connect(mapStateToProps)(ServiceRequestsList));
