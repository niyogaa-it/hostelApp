import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";

class CategoriesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Invalid: false,
      categories: [],
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.emergency_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
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

  render() {
    const activeFormatter = () => (cell) => {
      return cell == 1 ? (
        <span
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            backgroundColor: "#e8fadf",
            color: "#71dd37",
            fontWeight: "bold",
            border: "none",
          }}
        >
          ACTIVE
        </span>
      ) : (
        <span
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            backgroundColor: "#ffe0db",
            color: "#ff3e1d",
            fontWeight: "bold",
            border: "none",
          }}
        >
          INACTIVE
        </span>
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
                  <b style={{ color: "#566a7f" }}>Categories</b>
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
              }}
            >
              <div className="box-body">
                <BootstrapTable data={this.state.categories} search pagination>
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
                    dataField="category_name"
                    dataSort
                    width="20%"
                    dataAlign="center"
                  >
                    Category Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="booking_rule"
                    dataSort
                    width="16%"
                    dataAlign="center"
                  >
                    Booking Rule
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="advance_days"
                    dataSort
                    width="14%"
                    dataAlign="center"
                  >
                    Advance Days
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="booking_start_time"
                    dataSort
                    width="15%"
                    dataAlign="center"
                  >
                    Booking Start
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="booking_end_time"
                    dataSort
                    width="15%"
                    dataAlign="center"
                  >
                    Booking End
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="is_active"
                    dataSort
                    width="14%"
                    dataAlign="center"
                    dataFormat={activeFormatter(this)}
                  >
                    Status
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

export default withRouter(connect(mapStateToProps)(CategoriesList));
