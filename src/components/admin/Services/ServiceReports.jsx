import React, { Component } from "react";
import moment from "moment";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import { SERVICE_STATUS, statusBadge } from "./statusConfig";

class ServiceReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Invalid: false,
      reports: [],
      categories: [],
      from_date: "",
      to_date: "",
      status_id: "",
      category_id: "",
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.emergency_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      this.fetchReports();
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

  fetchReports = () => {
    API.get(`/admin/secure/services/reports`, {
      params: {
        from_date: this.state.from_date || undefined,
        to_date: this.state.to_date || undefined,
        status_id: this.state.status_id || undefined,
        category_id: this.state.category_id || undefined,
      },
    })
      .then((res) => {
        this.setState({ reports: res.data.result_data || [] });
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
    this.fetchReports();
  };

  render() {
    const dateFormatting = () => (cell) => {
      return cell ? moment(cell).format("DD/MM/YYYY") : "-";
    };
    const dateTimeFormatting = () => (cell) => {
      return cell ? moment(cell).format("DD/MM/YYYY, h:mm:ss a") : "-";
    };
    const statusFormatter = () => (cell) => statusBadge(cell);

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
                  <b style={{ color: "#566a7f" }}>Reports</b>
                  <small />
                </h1>
              </div>
            </div>
          </section>
          <section className="content">
            <form onSubmit={this.handleApplyFilters}>
              <div className="row" style={{ marginBottom: "15px" }}>
                <div className="col-md-2">
                  <label>From Date</label>
                  <input
                    type="date"
                    name="from_date"
                    className="form-control"
                    value={this.state.from_date}
                    onChange={this.handleFilterChange}
                  />
                </div>
                <div className="col-md-2">
                  <label>To Date</label>
                  <input
                    type="date"
                    name="to_date"
                    className="form-control"
                    value={this.state.to_date}
                    onChange={this.handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
                  <label>Status</label>
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
                  <label>Category</label>
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
                <div className="col-md-2" style={{ marginTop: "24px" }}>
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
                <BootstrapTable
                  data={this.state.reports}
                  exportCSV
                  csvFileName="service-requests-report.csv"
                  search
                  pagination
                >
                  <TableHeaderColumn
                    isKey
                    dataField="request_no"
                    dataSort
                    width="14%"
                    dataAlign="center"
                  >
                    Request No
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="application_id"
                    dataSort
                    width="14%"
                    dataAlign="center"
                  >
                    Application Id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="student_id"
                    dataSort
                    width="10%"
                    dataAlign="center"
                  >
                    Student Id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="category_name"
                    dataSort
                    width="16%"
                    dataAlign="center"
                  >
                    Category
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="status_name"
                    dataSort
                    width="14%"
                    dataAlign="center"
                    dataFormat={statusFormatter(this)}
                  >
                    Status
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="requested_date"
                    dataSort
                    width="14%"
                    dataAlign="center"
                    dataFormat={dateFormatting(this)}
                  >
                    Requested Date
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="created_at"
                    dataSort
                    width="18%"
                    dataAlign="center"
                    dataFormat={dateTimeFormatting(this)}
                  >
                    Created At
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

export default withRouter(connect(mapStateToProps)(ServiceReports));
