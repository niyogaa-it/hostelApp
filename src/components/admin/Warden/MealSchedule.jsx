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

        //console.log('this.state.usermangment',this.state.usermangment);
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


    const formatBreakfast = () => (cell) => {

      if (typeof cell !== 'object' || cell === null) return "";
      
        const veg = cell.veg ? `Veg: ${cell.veg.join(", ")}` : "";
        const egg1 = cell.egg1 ? `Egg1: ${cell.egg1.join(", ")}` : "";
        const egg2 = cell.egg2 ? `Egg2: ${cell.egg2.join(", ")}` : "";
        const nonveg1 = cell.nonveg1 ? `Non-Veg1: ${cell.nonveg1.join(", ")}` : "";
        const nonveg2 = cell.nonveg2 ? `Non-Veg2: ${cell.nonveg2.join(", ")}` : "";
        const items = [veg, egg1, egg2, nonveg1, nonveg2].filter(Boolean).join(", ");

        return items || "No items available"; 
    };


    const formatLunch = () => (cell) => {

      if (typeof cell !== 'object' || cell === null) return "";
      
        const veg = cell.veg ? `Veg: ${cell.veg.join(", ")}` : "";
        const egg1 = cell.egg1 ? `Egg1: ${cell.egg1.join(", ")}` : "";
        const egg2 = cell.egg2 ? `Egg2: ${cell.egg2.join(", ")}` : "";
        const nonveg1 = cell.nonveg1 ? `Non-Veg1: ${cell.nonveg1.join(", ")}` : "";
        const nonveg2 = cell.nonveg2 ? `Non-Veg2: ${cell.nonveg2.join(", ")}` : "";
        const items = [veg, egg1, egg2, nonveg1, nonveg2].filter(Boolean).join(", ");

        return items || "No items available"; 
    };


    const formatSnacks = () => (cell) => {

      if (typeof cell !== 'object' || cell === null) return "";
      
        const veg = cell.veg ? `Veg: ${cell.veg.join(", ")}` : "";
        const egg1 = cell.egg1 ? `Egg1: ${cell.egg1.join(", ")}` : "";
        const egg2 = cell.egg2 ? `Egg2: ${cell.egg2.join(", ")}` : "";
        const nonveg1 = cell.nonveg1 ? `Non-Veg1: ${cell.nonveg1.join(", ")}` : "";
        const nonveg2 = cell.nonveg2 ? `Non-Veg2: ${cell.nonveg2.join(", ")}` : "";
        const items = [veg, egg1, egg2, nonveg1, nonveg2].filter(Boolean).join(", ");

        return items || "No items available"; 
    };



    const formatDinner = () => (cell) => {

      if (typeof cell !== 'object' || cell === null) return "";
      
        const veg = cell.veg ? `Veg: ${cell.veg.join(", ")}` : "";
        const egg1 = cell.egg1 ? `Egg1: ${cell.egg1.join(", ")}` : "";
        const egg2 = cell.egg2 ? `Egg2: ${cell.egg2.join(", ")}` : "";
        const nonveg1 = cell.nonveg1 ? `Non-Veg1: ${cell.nonveg1.join(", ")}` : "";
        const nonveg2 = cell.nonveg2 ? `Non-Veg2: ${cell.nonveg2.join(", ")}` : "";
        const items = [veg, egg1, egg2, nonveg1, nonveg2].filter(Boolean).join(", ");

        return items || "No items available"; 
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
                <Link className="btn btn-primary mb-10 mr-0" to="/admin/meal-schedule/add">
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
                  <div className="datepicker-mils">
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

                        dataFormat={formatBreakfast(this)}
                        
                      >
                        Breakfast
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="lunch"
                        dataSort={true}
                        className={"text-uppercase text-secondary"}
                        width="180"
                        dataAlign="center"
                        dataFormat={formatLunch(this)}
                      >
                        Lunch
                      </TableHeaderColumn>

                      <TableHeaderColumn
                        dataField="snacks"
                        dataSort={true}
                        className={"text-uppercase text-secondary"}
                        width="180"
                        dataAlign="center"
                        dataFormat={formatSnacks(this)}
                      >
                        Snacks
                      </TableHeaderColumn>

                      <TableHeaderColumn
                        dataField="dinner"
                        dataSort={true}
                        className={"text-uppercase text-secondary"}
                        width="180"
                        dataAlign="center"
                        dataFormat={formatDinner(this)}
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
