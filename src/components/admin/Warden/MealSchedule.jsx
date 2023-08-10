import React, { Component } from "react";
import moment from "moment";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import {
  Row,
  Col,
  ButtonToolbar,
  Button,
  Tooltip,
  OverlayTrigger,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class MealSchedule extends Component {
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
      date: new Date(),
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.warden_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      this.getScheduleData('all');
    } else {
      this.setState({
        Invalid: true,
      });
    }
  }

  getScheduleData(dateSchedule) {
    //const dateSchedule = moment(this.state.date).format("YYYY-MM-DD");
    API.get(`/admin/secure/schedule?date=${dateSchedule}`)
      .then((res) => {
        console.log(res.data);
        this.setState({
          usermangment: res.data.result_data,
        });
      })
      .catch((err) => {
        console.log("err:", err);
      });
  }

  render() {
    const dateFormatting = () => (date) => {
      return moment(date).format("DD/MM/YYYY, h:mm:ss a");
    };
    const actionFormatter = (refObj) => (cell, id) => {
      return (
        <div className="actionStyle">
          <div>
            <Button
              style={{
                border: "none",
                backgroundColor: "#fff2d6",
                color: "#ffab00",
                fontWeight: "bold",
                borderRadius: "5px",
              }}
              onClick={() => {
                console.log(id.id);
                this.props.history.push(`/admin/meal-schedule/edit/${id.id}`);
              }}
            >
              Edit
            </Button>
          </div>
        </div>
      );
    };

    const dayFormatter = (refObj) => (cell, id) => {
      const dateFormat = id.date;
      return <>{moment(dateFormat).format("dddd")}</>;
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
                    <b style={{ color: "#566a7f" }}>Meal Schedule List</b>
                    <small />
                  </h1>
                </div>
              </div>
            </section>
            <section className="content">
              <div style={{ display: "flex", justifyContent: "end" }}>
                <Link className="btn btn-primary" to="/admin/meal-schedule/add">
                  Add New Schedule
                </Link>
              </div>
              <div
                className="box"
                style={{
                  borderRadius: "0.5rem",
                  boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
                }}
              >
                <div className="box-body">
                  <div>
                    <span>Date: &nbsp;&nbsp;&nbsp;</span>
                    <DatePicker
                      placeholder="date"
                      name="schedule_date"
                      onChange={(date) => {
                        this.setState({ date: date }, () => {
                          let dateSchedule = moment(this.state.date).format("YYYY-MM-DD");
                          this.getScheduleData(dateSchedule);
                        });
                      }}
                      autoComplete="off"
                      className="form-control"
                    />
                  </div>
                  {console.log("YYYYYYYYYYYYY", this.state.usermangment)}
                  {this.state.usermangment ? (
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
                        dataField="date"
                        dataSort={true}
                        className={"text-uppercase"}
                        width="180"
                        dataAlign="center"
                        tdStyle={{ textTransform: "capitalize" }}
                      >
                        Date
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="date"
                        dataSort={true}
                        className={"text-uppercase"}
                        width="180"
                        dataAlign="center"
                        tdStyle={{ textTransform: "capitalize" }}
                        dataFormat={dayFormatter(this, this.a)}
                      >
                        Day Name
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="breakfast"
                        dataSort={true}
                        className={"text-uppercase text-secondary"}
                        width="180"
                        dataAlign="center"
                      >
                        Breakfast
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="lunch"
                        dataSort={true}
                        className={"text-uppercase text-secondary"}
                        width="180"
                        dataAlign="center"
                      >
                        Lunch
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="dinner"
                        dataSort={true}
                        className={"text-uppercase text-secondary"}
                        width="180"
                        dataAlign="center"
                      >
                        Dinner
                      </TableHeaderColumn>

                      <TableHeaderColumn
                        dataField="status"
                        className={"text-uppercase"}
                        dataSort={true}
                        width="170"
                        dataAlign="center"
                        export={false}
                        dataFormat={actionFormatter(this, this.a)}
                      >
                        Action
                      </TableHeaderColumn>
                    </BootstrapTable>
                  ) : (
                    <h3 className="text-center">No Record found</h3>
                  )}
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
export default withRouter(connect(mapStateToProps)(MealSchedule));
