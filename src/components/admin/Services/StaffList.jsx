import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";

class StaffList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Invalid: false,
      staffList: [],
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.emergency_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/services/staff`)
        .then((res) => {
          this.setState({ staffList: res.data.result_data || [] });
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
                  <b style={{ color: "#566a7f" }}>Staff</b>
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
                <BootstrapTable data={this.state.staffList} search pagination>
                  <TableHeaderColumn
                    isKey
                    dataField="id"
                    dataSort
                    width="10%"
                    dataAlign="center"
                  >
                    Id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="name"
                    dataSort
                    width="30%"
                    dataAlign="center"
                  >
                    Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="phone_no"
                    dataSort
                    width="30%"
                    dataAlign="center"
                  >
                    Phone No
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="email"
                    dataSort
                    width="30%"
                    dataAlign="center"
                  >
                    Email
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

export default withRouter(connect(mapStateToProps)(StaffList));
