import React, { Component } from "react";
//import './sidebarAdmin.css';
import { Link } from "react-router-dom";
import { getAdminGroup } from "../../../shared/helper";
import API from "../../../shared/admin-axios";
import { getAdminName, getSuperAdmin } from "../../../shared/helper";
import { showErrorMessage } from "../../../shared/handle_error";
import { adminLogout } from "../../../store/actions/auth";

class SidebarAdmin extends Component {
  constructor() {
    super();
    this.state = {
      shown: "",
      super_admin: 0,
      api_end: false,
      userconut: 0,
      user_permmision: "",
      user_role: "",
    };
  }

  /* toggleMenu( event ){
    event.preventDefault();
    this.setState({shown: !this.state.shown});
  } */

  componentDidMount = () => {
    var path = this.props.path_name; //console.log(path);
    if (localStorage.getItem("admin_token")) {
      API.get(`/admin/secure/notification/all`)
        .then((res) => {
          this.setState({
            userconut: res.data.result.length,
          });
        })
        .catch((err) => {
          console.log("err:", err);
          // showErrorMessage(err, this.props);
        });

      API.get(`/admin/secure/check/token`)
        .then((res) => {
          this.setState({
            user_permmision: res.data.permissions,
            user_role: res.data.user_details.role,
          });
        })
        .catch((err) => {
          console.log("err:", err);
          // showErrorMessage(err, this.props);
        });
    }

    if (path === "/admin/create/subadmin" || path === "/admin/subadmin") {
      this.setState({ shown: "1" });
    }
    if (
      path === "/admin/meal_list" ||
      path === "/admin/laundry_managment" ||
      path === "/admin/leave_application" ||
      path === "/admin/water_can" ||
      path === "/admin/meal" || 
      path === "/admin/meals" || 
      path === "/admin/meal/add" ||
      path === "/admin/meal-schedule" ||
      path === "/admin/meal-schedule/add"
    ) {
      this.setState({ shown: "2" });
    }
    if (
      path === "/admin/add/building" ||
      path === "/admin/building" ||
      path === "/admin/room" ||
      path === "/admin/add/room" ||
      path === "/admin/add/parking" ||
      path === "/admin/parking"
    ) {
      this.setState({ shown: "3" });
    }
    if (
      path === "/admin/events" ||
      path === "/admin/increased_sla" ||
      path === "/admin/paused_sla"
    ) {
      this.setState({ shown: "4" });
    }
    if (path === "/admin/error_log" || path === "/admin/crm_error") {
      this.setState({ shown: "5" });
    }
    if (
      path === "/admin/task_ratings" ||
      path === "/admin/task_rating_questions" ||
      path === "/admin/task_rating_options"
    ) {
      this.setState({ shown: "6" });
    }

    if (
      path === "/admin/fa_ratings" ||
      path === "/admin/fa_rating_questions" ||
      path === "/admin/fa_rating_options" ||
      path === "/admin/product_enquiries" ||
      path === "/admin/product_search"
    ) {
      this.setState({ shown: "7" });
    }
    if (
      path === "/admin/alerts/coa" ||
      path === "/admin/alerts/awb" ||
      path === "/admin/alerts/task" ||
      path === "/admin/alerts/invoice" ||
      path === "/admin/alerts/packing" ||
      path === "/admin/alerts/batch_number"
    ) {
      this.setState({ shown: "8" });
    }
    if (path === "/admin/student_approval") {
      this.setState({ shown: "9" });
    }
    if (
      path === "/admin/create_profile" ||
      path === "/admin/view_student" ||
      path === "/admin/view_guardian"
    ) {
      this.setState({ shown: "11" });
    }
    if (
      path === "/admin/payment_activities" ||
      path === "/admin/monthly_activities" ||
      path === "/admin/payment_history"
    ) {
      this.setState({ shown: "15" });
    }
  };

  logout = () => {
    this.props.dispatch(adminLogout());
    this.props.history.push("/");
  };

  handleClick = (event) => {
    event.preventDefault();
    const id = event.target.getAttribute("data-id");
    this.setState({ shown: id == this.state.shown ? "" : id });
  };

  innerHandlePlus = (event) => {
    event.preventDefault();
    const id = event.target.getAttribute("inner-data-id");
    // console.log(id);
    id != this.state.innerShown
      ? this.setState({ innerShown: id })
      : this.setState({ innerShown: "" });
  };

  getSuperAdminMenu = () => {
    const rotate = this.state.shown;
    const innerRotate = this.state.innerShown;
    return (
      <section className="sidebar">
        <ul className="sidebar-menu">
          {/* <li> <Link to="/admin" onClick={this.logout} > <i className="fas fa-sign-out-alt"></i> <span>Logout</span></Link>
          </li> */}

          {this.props.path_name === "/admin/dashboard" ? (
            <li className="active">
              {" "}
              <Link to="/admin/dashboard">
                {" "}
                <span>Dashboard</span>
              </Link>{" "}
            </li>
          ) : (
            <li>
              {" "}
              <Link to="/admin/dashboard">
                {" "}
                <span>Dashboard</span>
              </Link>{" "}
            </li>
          )}
          {/* user managment */}
          {this.state.user_role == "admin" ? (
            <li className={rotate == "1" ? "treeview active" : "treeview"}>
              <Link to="#" data-id="1" onClick={this.handleClick}>
                <i data-id="1" onClick={this.handleClick}></i>{" "}
                <span data-id="1" onClick={this.handleClick}>
                  User Managment{" "}
                </span>
                <span className="pull-right-container">
                  <i
                    data-id="1"
                    onClick={this.handleClick}
                    className={
                      rotate == "1"
                        ? "fa pull-right fa-minus"
                        : "fa pull-right fa-plus"
                    }
                  ></i>
                </span>
              </Link>

              <ul className="treeview-menu">
                {this.props.path_name === "/admin/create/subadmin" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/create/subadmin">
                      {" "}
                      <span>Create Sub Admin</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/create/subadmin">
                      {" "}
                      <span>Create Sub Admin</span>
                    </Link>{" "}
                  </li>
                )}
                {this.props.path_name === "/admin/subadmin" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/subadmin">
                      {" "}
                      <span>Sub Admin List</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/subadmin">
                      {" "}
                      <span>Sub Admin List</span>
                    </Link>{" "}
                  </li>
                )}
              </ul>
            </li>
          ) : null}

          {/* user managment end */}
          {/* master data */}
          {this.state.user_permmision.master_data_management == 0 ||
          this.state.user_role == "admin" ? (
            <li className={rotate == "3" ? "treeview active" : "treeview"}>
              <Link to="#" data-id="3" onClick={this.handleClick}>
                <i data-id="3" onClick={this.handleClick}></i>{" "}
                <span data-id="3" onClick={this.handleClick}>
                  Master Data
                </span>
                <span className="pull-right-container">
                  <i
                    data-id="3"
                    onClick={this.handleClick}
                    className={
                      rotate == "3"
                        ? "fa pull-right fa-minus"
                        : "fa pull-right fa-plus"
                    }
                  ></i>
                </span>
              </Link>

              <ul className="treeview-menu">
                {this.props.path_name === "/admin/add/building" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/add/building">
                      {" "}
                      <span>Create Building</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/add/building">
                      {" "}
                      <span>Create Building</span>
                    </Link>{" "}
                  </li>
                )}

                {this.props.path_name === "/admin/building" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/building">
                      {" "}
                      <span>Building</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/building">
                      {" "}
                      <span>Building</span>
                    </Link>{" "}
                  </li>
                )}
                {this.props.path_name === "/admin/add/room" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/add/room">
                      {" "}
                      <span>Add Room</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/add/room">
                      {" "}
                      <span>Add Room</span>
                    </Link>{" "}
                  </li>
                )}
                {this.props.path_name === "/admin/room" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/room">
                      {" "}
                      <span>Check Room</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/room">
                      {" "}
                      <span>Check Room</span>
                    </Link>{" "}
                  </li>
                )}
                {this.props.path_name === "/admin/add/parking" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/add/parking">
                      {" "}
                      <span>Add Parking</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/add/parking">
                      {" "}
                      <span>Add Parking</span>
                    </Link>{" "}
                  </li>
                )}
                {this.props.path_name === "/admin/parking" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/parking">
                      {" "}
                      <span>Parking</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/parking">
                      {" "}
                      <span>Parking</span>
                    </Link>{" "}
                  </li>
                )}
              </ul>
            </li>
          ) : null}

          {/* master data end */}
          {/* warden  */}
          {this.state.user_permmision.warden_management == 0 ||
          this.state.user_role == "admin" ? (
            <li className={rotate == "2" ? "treeview active" : "treeview"}>
              <Link to="#" data-id="2" onClick={this.handleClick}>
                <i data-id="2" onClick={this.handleClick}></i>{" "}
                <span data-id="2" onClick={this.handleClick}>
                  Warden{" "}
                </span>
                <span className="pull-right-container">
                  <i
                    data-id="2"
                    onClick={this.handleClick}
                    className={
                      rotate == "2"
                        ? "fa pull-right fa-minus"
                        : "fa pull-right fa-plus"
                    }
                  ></i>
                </span>
              </Link>

              <ul className="treeview-menu">
                {/* {this.props.path_name === "/admin/meal" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/meal">
                      {" "}
                      <span>Add Meal</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/meal">
                      {" "}
                      <span>Add Meal</span>
                    </Link>{" "}
                  </li>
                )} */}

                <li className={["/admin/meals","/admin/meal/add"].includes(this.props.path_name) ? 'active' : ''}>
                    {" "}
                    <Link to="/admin/meals">
                      {" "}
                      <span>Meals</span>
                    </Link>{" "}
                  </li>
                  <li className={["/admin/meal-schedule","/admin/meal-schedule/add"].includes(this.props.path_name) ? 'active' : ''}>
                    {" "}
                    <Link to="/admin/meal-schedule">
                      {" "}
                      <span>Meal Schedule</span>
                    </Link>{" "}
                  </li>

                {/* {this.props.path_name === "/admin/meal_list" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/meal_list">
                      {" "}
                      <span>Check Meal</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/meal_list">
                      {" "}
                      <span>Check Meal</span>
                    </Link>{" "}
                  </li>
                )} */}

                {this.props.path_name === "/admin/laundry_managment" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/laundry_managment">
                      {" "}
                      <span>Laundry Managment</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/laundry_managment">
                      {" "}
                      <span>Laundry Managment</span>
                    </Link>{" "}
                  </li>
                )}
                {this.props.path_name === "/admin/leave_application" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/leave_application">
                      {" "}
                      <span>Leave Application</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/leave_application">
                      {" "}
                      <span>Leave Application</span>
                    </Link>{" "}
                  </li>
                )}

                {this.props.path_name === "/admin/water_can" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/water_can">
                      {" "}
                      <span>Water Can</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/water_can">
                      {" "}
                      <span>Water Can</span>
                    </Link>{" "}
                  </li>
                )}
              </ul>
            </li>
          ) : null}

          {/* warden end */}

          {/* hosteller */}
          {this.state.user_permmision.room_management == 0 ||
          this.state.user_role == "admin" ? (
            <li className={rotate == "9" ? "treeview active" : "treeview"}>
              <Link to="#" data-id="9" onClick={this.handleClick}>
                <i data-id="2" onClick={this.handleClick}></i>{" "}
                <span data-id="9" onClick={this.handleClick}>
                  Hosteller{" "}
                </span>
                <span className="pull-right-container">
                  <i
                    data-id="9"
                    onClick={this.handleClick}
                    className={
                      rotate == "9"
                        ? "fa pull-right fa-minus"
                        : "fa pull-right fa-plus"
                    }
                  ></i>
                </span>
              </Link>

              <ul className="treeview-menu">
                {this.props.path_name === "/admin/student_approval" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/student_approval">
                      {" "}
                      <span>Student Approval</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/student_approval">
                      {" "}
                      <span>Student Approval</span>
                    </Link>{" "}
                  </li>
                )}
              </ul>
            </li>
          ) : null}

          {/* hosteller end */}

          {/* student profile  */}
          {this.state.user_permmision.student_management == 0 ||
          this.state.user_role == "admin" ? (
            <li className={rotate == "11" ? "treeview active" : "treeview"}>
              <Link to="#" data-id="11" onClick={this.handleClick}>
                <i data-id="2" onClick={this.handleClick}></i>{" "}
                <span data-id="11" onClick={this.handleClick}>
                  Student{" "}
                </span>
                <span className="pull-right-container">
                  <i
                    data-id="11"
                    onClick={this.handleClick}
                    className={
                      rotate == "11"
                        ? "fa pull-right fa-minus"
                        : "fa pull-right fa-plus"
                    }
                  ></i>
                </span>
              </Link>

              <ul className="treeview-menu">
                {this.props.path_name === "/admin/create_profile" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/create_profile">
                      {" "}
                      <span>Create Profile</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/create_profile">
                      {" "}
                      <span>Create Profile</span>
                    </Link>{" "}
                  </li>
                )}

                {this.props.path_name === "/admin/view_student" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/view_student">
                      {" "}
                      <span>View Student</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/view_student">
                      {" "}
                      <span>View Student</span>
                    </Link>{" "}
                  </li>
                )}

                {this.props.path_name === "/admin/view_guardian" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/view_guardian">
                      {" "}
                      <span>View Guardian</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/view_guardian">
                      {" "}
                      <span>View Guardian</span>
                    </Link>{" "}
                  </li>
                )}
              </ul>
            </li>
          ) : null}
          {/* student profile end */}

          {/* subscription  */}

          {/* {this.props.path_name === "/admin/subscription_plan" ? (
            <li className="active">
              {" "}
              <Link to="/admin/subscription_plan">
                {" "}
                <span>&nbsp; Subscription Plan</span>
              </Link>{" "}
            </li>
          ) : (
            <li>
              {" "}
              <Link to="/admin/subscription_plan">
                {" "}
                <span>&nbsp; Subscription Plan</span>
              </Link>{" "}
            </li>
          )} */}

          {/* subscription end */}

          {/* create plan */}

          {/* {this.props.path_name === "/admin/create_plan" ? (
            <li className="active">
              {" "}
              <Link to="/admin/create_plan">
                {" "}
                <span>&nbsp; Create Plan</span>
              </Link>{" "}
            </li>
          ) : (
            <li>
              {" "}
              <Link to="/admin/create_plan">
                {" "}
                <span>&nbsp; Create Plan</span>
              </Link>{" "}
            </li>
          )} */}

          {/* create plan end */}

          {/* payment activities */}
          {this.state.user_permmision.payment_activities == 0 ||
          this.state.user_role == "admin" ? (
            <li className={rotate == "15" ? "treeview active" : "treeview"}>
              <Link to="#" data-id="15" onClick={this.handleClick}>
                <i data-id="2" onClick={this.handleClick}></i>{" "}
                <span data-id="15" onClick={this.handleClick}>
                  Payment Details{" "}
                </span>
                <span className="pull-right-container">
                  <i
                    data-id="15"
                    onClick={this.handleClick}
                    className={
                      rotate == "15"
                        ? "fa pull-right fa-minus"
                        : "fa pull-right fa-plus"
                    }
                  ></i>
                </span>
              </Link>

              <ul className="treeview-menu">
                {this.props.path_name === "/admin/create_profile" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/payment_activities">
                      {" "}
                      <span>Payment Activities</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/payment_activities">
                      {" "}
                      <span>Payment Activities</span>
                    </Link>{" "}
                  </li>
                )}

                {this.props.path_name === "/admin/monthly_activities" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/monthly_activities">
                      {" "}
                      <span>Monthly Activities</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/monthly_activities">
                      {" "}
                      <span>Monthly Activities</span>
                    </Link>{" "}
                  </li>
                )}
                {this.props.path_name === "/admin/payment_history" ? (
                  <li className="active">
                    {" "}
                    <Link to="/admin/payment_history">
                      {" "}
                      <span>Payment History</span>
                    </Link>{" "}
                  </li>
                ) : (
                  <li>
                    {" "}
                    <Link to="/admin/payment_history">
                      {" "}
                      <span>Payment History</span>
                    </Link>{" "}
                  </li>
                )}
              </ul>
            </li>
          ) : null}
          {/* ------------------------------------------------ */}

          {/* {this.state.user_permmision.payment_activities == 1 ||
          this.state.user_role == "admin" ? (
            <>
              {this.props.path_name === "/admin/payment_activities" ? (
                <li className="active">
                  {" "}
                  <Link to="/admin/payment_activities">
                    {" "}
                    <span>&nbsp; Payment Details</span>
                  </Link>{" "}
                </li>
              ) : (
                <li>
                  {" "}
                  <Link to="/admin/payment_activities">
                    {" "}
                    <span>&nbsp; Payment Activities</span>
                  </Link>{" "}
                </li>
              )}
            </>
          ) : null} */}

          {/* payment activities end */}

          {/* upgrade request */}
          {/* {this.state.user_permmision.update_meal == 0 ||
          this.state.user_role == "admin" ? (
            <>
              {this.props.path_name === "/admin/upgrade_request" ? (
                <li className="active">
                  {" "}
                  <Link to="/admin/upgrade_request">
                    {" "}
                    <span>&nbsp; Upgrade Request</span>
                  </Link>{" "}
                </li>
              ) : (
                <li>
                  {" "}
                  <Link to="/admin/upgrade_request">
                    {" "}
                    <span>&nbsp; Upgrade Request</span>
                  </Link>{" "}
                </li>
              )}
            </>
          ) : null} */}

          {/* ugrade request end */}

          {/* help and queries */}
          {this.state.user_permmision.help_quieres == 0 ||
          this.state.user_role == "admin" ? (
            <>
              {this.props.path_name === "/admin/help_and_quieres" ? (
                <li className="active">
                  {" "}
                  <Link to="/admin/help_and_quieres">
                    {" "}
                    <span>&nbsp; Help & Queries</span>
                  </Link>{" "}
                </li>
              ) : (
                <li>
                  {" "}
                  <Link to="/admin/help_and_quieres">
                    {" "}
                    <span>&nbsp; Help & Queries</span>
                  </Link>{" "}
                </li>
              )}
            </>
          ) : null}
          {/* help and queries end */}

          {/* Emergency */}
          {this.state.user_permmision.emergency_management == 0 ||
          this.state.user_role == "admin" ? (
            <>
              {this.props.path_name === "/admin/emergency" ? (
                <li className="active">
                  {" "}
                  <Link to="/admin/emergency">
                    {" "}
                    <span>&nbsp; Emergency</span>
                  </Link>{" "}
                </li>
              ) : (
                <li>
                  {" "}
                  <Link to="/admin/emergency">
                    {" "}
                    <span>&nbsp; Emergency</span>
                  </Link>{" "}
                </li>
              )}{" "}
            </>
          ) : null}

          {/* Emergency end */}

          {/* laundry process */}
          {this.state.user_permmision.laundary_management == 0 ||
          this.state.user_role == "admin" ? (
            <>
              {this.props.path_name === "/admin/laundry_process" ? (
                <li className="active">
                  {" "}
                  <Link to="/admin/laundry_process">
                    {" "}
                    <span>&nbsp; Laundry Process</span>
                  </Link>{" "}
                </li>
              ) : (
                <li>
                  {" "}
                  <Link to="/admin/laundry_process">
                    {" "}
                    <span>&nbsp; Laundry Process</span>
                  </Link>{" "}
                </li>
              )}
            </>
          ) : null}

          {/* laundry process end */}

          {/* push notification */}
          {this.props.path_name === "/admin/push_notification" ? (
            <li className="active">
              {" "}
              <Link to="/admin/push_notification">
                {" "}
                <span>&nbsp; Push Notification</span>
              </Link>{" "}
            </li>
          ) : (
            <li>
              {" "}
              <Link to="/admin/push_notification">
                {" "}
                <span>&nbsp; Push Notification</span>
              </Link>{" "}
            </li>
          )}

          {/* push notification end */}

          {/* notificcation */}
          {this.state.user_permmision.notification_management == 0 ||
          this.state.user_role == "admin" ? (
            <>
              {this.props.path_name === "/admin/notification" ? (
                <li className="active">
                  {" "}
                  <Link to="/admin/notification">
                    {" "}
                    <span>
                      &nbsp;Notification{" "}
                      <span
                        style={{
                          padding: "2px",
                          borderRadius: "45%",
                          background: "red",
                          color: "white",
                          fontSize: "10px",
                        }}
                      >
                        {this.state.userconut}
                      </span>
                    </span>
                  </Link>{" "}
                </li>
              ) : (
                <li>
                  {" "}
                  <Link to="/admin/notification">
                    {" "}
                    <span>
                      &nbsp;Notification{" "}
                      <span
                        style={{
                          padding: "2px",
                          borderRadius: "45%",
                          background: "red",
                          color: "white",
                          fontSize: "10px",
                        }}
                      >
                        {this.state.userconut}
                      </span>
                    </span>
                  </Link>{" "}
                </li>
              )}
            </>
          ) : null}
          {/* notification end */}

          {/* events */}
          {this.state.user_permmision.events == 0 ||
          this.state.user_role == "admin" ? (
            <>
              {this.props.path_name === "/admin/events" ? (
                <li className="active">
                  {" "}
                  <Link to="/admin/events">
                    {" "}
                    <span>&nbsp;Events</span>
                  </Link>{" "}
                </li>
              ) : (
                <li>
                  {" "}
                  <Link to="/admin/events">
                    {" "}
                    <span>&nbsp;Events</span>
                  </Link>{" "}
                </li>
              )}

              {/* events end */}

              {/* events list */}
              {this.props.path_name === "/admin/events_list" ? (
                <li className="active">
                  {" "}
                  <Link to="/admin/events_list">
                    {" "}
                    <span>&nbsp;Events List</span>
                  </Link>{" "}
                </li>
              ) : (
                <li>
                  {" "}
                  <Link to="/admin/events_list">
                    {" "}
                    <span>&nbsp;Events List</span>
                  </Link>{" "}
                </li>
              )}
            </>
          ) : null}
          {/* events list end*/}

          {/* log out */}
          <li className="">
            <Link to="#" onClick={this.logout}>
              {" "}
              <span>&nbsp;Log Out</span>
            </Link>
          </li>
        </ul>
      </section>
    );
  };

  render() {
    if (this.props.isLoggedIn === false) return null;
    return (
      <aside className="main-sidebar">
        {/* 	{this.state.api_end === true &&
					(this.state.super_admin === 1 ? this.getSuperAdminMenu() : this.getPermittedMenu())} */}
        {this.getSuperAdminMenu()}
      </aside>
    );
  }
}

export default SidebarAdmin;
