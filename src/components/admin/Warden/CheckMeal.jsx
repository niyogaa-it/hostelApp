import React, { Component } from "react";
import moment from "moment";
import dateFormat from "dateformat";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import {
  Row,
  Col,
  ButtonToolbar,
  Button,
  Tooltip,
  OverlayTrigger,
  Modal,
} from "react-bootstrap";
//import { Label } from 'reactstrap';
import swal from "sweetalert";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

class CheckMeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      get_access_data: false,
      showModal: false,
      remove_search: false,
      showModalLoader: false,
      //////////
      Invalid: false,
      usermangment: [],
      userconut: 0,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.warden_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/meal/get_all_meals`)
        .then((res) => {
          this.setState({
            usermangment: res.data.result,
            userconut: res.data.result.length,
          });
        })
        .catch((err) => {
          console.log("err:", err);
        });
    } else {
      this.setState({
        Invalid: true,
      });
    }
  }

  render() {
    const dateFormatting = () => (date) => {
      return moment(date).format("DD/MM/YYYY, h:mm:ss a");
    };
    if (this.state.Invalid) return <Redirect to="/admin/dashboard" />;
    else {
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
                    Home / Warden /{" "}
                    <b style={{ color: "#566a7f" }}>Meal List</b>
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
                  <BootstrapTable
                    data={this.state.usermangment}
                    //exportCSV
                    search={true}
                    pagination
                  >
                    <TableHeaderColumn
                      isKey
                      dataField="id"
                      dataSort={true}
                      className={"text-uppercase"}
                      width="180"
                      dataAlign="center"
                    >
                      Id
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="veg_breakfast"
                      dataSort={true}
                      className={"text-uppercase"}
                      width="180"
                      dataAlign="center"
                    >
                      Veg Breakfast
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="veg_lunch"
                      dataSort={true}
                      className={"text-uppercase text-secondary"}
                      width="180"
                      dataAlign="center"
                    >
                      Veg Lunch
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="veg_dinner"
                      dataSort={true}
                      className={"text-uppercase"}
                      width="190"
                      dataAlign="center"
                    >
                      Veg Dinner
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="no_veg_breakfast"
                      dataSort={true}
                      className={"text-uppercase"}
                      width="190"
                      dataAlign="center"
                    >
                      Non-Veg Breakfast
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="no_veg_lunch"
                      dataSort={true}
                      className={"text-uppercase"}
                      width="190"
                      dataAlign="center"
                    >
                      Non-Veg Lunch
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="no_veg_dinner"
                      dataSort={true}
                      className={"text-uppercase"}
                      width="190"
                      dataAlign="center"
                    >
                      Non-Veg Dinner
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="eggetarian_breakfast"
                      dataSort={true}
                      className={"text-uppercase"}
                      width="190"
                      dataAlign="center"
                    >
                      Eggetarian Breakfast
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="eggetarian_lunch"
                      dataSort={true}
                      className={"text-uppercase"}
                      width="190"
                      dataAlign="center"
                    >
                      Eggetarian Lunch
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="eggetarian_dinner"
                      dataSort={true}
                      className={"text-uppercase"}
                      width="190"
                      dataAlign="center"
                    >
                      Eggetarian Dinner
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="created_at"
                      dataFormat={dateFormatting(this)}
                      dataSort={true}
                      className={"text-uppercase"}
                      width="180"
                      dataAlign="center"
                    >
                      Created At
                    </TableHeaderColumn>

                    {/*   <TableHeaderColumn
                      dataField="status"
                      dataFormat={statusAction(this)}
                      dataSort={true}
                      className={"text-uppercase"}
                      width="180"
                      dataAlign="center"
                    >
                      Action
                    </TableHeaderColumn> */}
                  </BootstrapTable>
                </div>
              </div>
            </section>
          </div>
        </Layout>
      );
    }
  }
}
const mapStateToProps = (state) => {
  return {
    ...state,
  };
};
export default withRouter(connect(mapStateToProps)(CheckMeal));
