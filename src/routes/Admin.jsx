import React, { Component } from "react";

import { Route, Switch, Redirect } from "react-router-dom";

import Login from "../components/admin/login/Login";
import RegisterComponent from "../components/admin/Register/RegisterNew";

import AdminPageNotFound from "../components/404/AdminPageNotFound";
import Dashboard from "../components/admin/dashboard/Dashboard";

import CreateSubAdmin from "../components/admin/UserManagement/CreateSubAdmin";
import SubAdminList from "../components/admin/UserManagement/SubAdminList";
import SubAdminEdit from "../components/admin/UserManagement/SubAdminEdit";
import AdminList from "../components/admin/adminlist/AdminList";
import Profile from "../components/admin/profile/Profile";

import Pharmacopeial from "../components/admin/pharmacopeial/Pharmacopeial.jsx";

import AddBuilding from "../components/admin/masterdata/AddBuilding";
import BuildingList from "../components/admin/masterdata/BuildingList";
import EditBuilding from "../components/admin/masterdata/EditBuilding";
import AddRoom from "../components/admin/masterdata/AddRoom";
import CheckRoom from "../components/admin/masterdata/CheckRoom";
import EditRoom from "../components/admin/masterdata/EditRoom";
import AddParking from "../components/admin/masterdata/AddParking";
import Parking from "../components/admin/masterdata/Parking";
import ParkingSloat from "../components/admin/masterdata/ParkingSloat";

import AddMeal from "../components/admin/Warden/AddMeal";
import CheckMeal from "../components/admin/Warden/CheckMeal";

import Meals from "../components/admin/Warden/Meals";
import MealAdd from "../components/admin/Warden/MealAdd";
import MealEdit from "../components/admin/Warden/MealEdit";

import MealSchedule from "../components/admin/Warden/MealSchedule";
import MealScheduleAdd from "../components/admin/Warden/MealScheduleAdd";
import MealScheduleEdit from "../components/admin/Warden/MealScheduleEdit";

import LaundryManagment from "../components/admin/Warden/LaundryManagment";
import LeaveApplication from "../components/admin/Warden/LeaveApplication";
import StudentApproval from "../components/admin/studentApproval/StudentApproval";
import AssignRoom from "../components/admin/studentApproval/AssignRoom";

import WaterCan from "../components/admin/Warden/WaterCan";

import AddStudent from "../components/admin/StudentProfile/AddStudent";
import EditStudent from "../components/admin/StudentProfile/EditStudent";
import EditStudentDetails from "../components/admin/StudentProfile/EditStudentDetails";
import ViewStudent from "../components/admin/StudentProfile/ViewStudent";
import ViewGuardian from "../components/admin/StudentProfile/ViewGuardian";
// import ViewStudentProfile from "../components/admin/StudentProfile/ViewStudentProfile";
import CreatePlan from "../components/admin/CreatePlan/CreatePlan";

import SubscriptionPlan from "../components/admin/SubscriptionPlan/SubscriptionPlan";
import PaymentActivity from "../components/admin/PaymentActivities/PaymentActivities";
import MonthlyActivity from "../components/admin/PaymentActivities/MonthlyActivities";
import SetPayment from "../components/admin/PaymentActivities/AppPayment.js";
import MonthlyPayment from "../components/admin/PaymentActivities/MonthlyPayment.js";

import UpgradeRequest from "../components/admin/UpgradeRequest/UpgradeRequest";
import HelpAndQuieres from "../components/admin/HelpAndQuieres/HelpAndQuieres";
import Emergency from "../components/admin/Emergency/Emergency";
import LaundryProcess from "../components/admin/LaundryProcess/LaundryProcess";
import PushNotification from "../components/admin/PushNotification/PushNotification";
import Notification from "../components/admin/Notification/Notification";

// /////////////

import ErrLog from "../components/admin/error-log/ErrLog";
import ErrLogDetails from "../components/admin/error-log/ErrLogDetails";
import CrmErr from "../components/admin/error-log/CrmErr";

////
import AddEvent from "../components/admin/Events/AddEvent";
import EditEvent from "../components/admin/Events/EditEvent";

import EventsList from "../components/admin/EventsList/EventsList";

import SetPlan from "../components/admin/Plan/SetPlan";
import ViewPlan from "../components/admin/Plan/ViewPlan";
import EditPlan from "../components/admin/Plan/EditPlan";
import MonthlyPlan from "../components/admin/Plan/MonthlyPlan";

import Xceldownload from "../components/admin/xceldownload/xceldownload";

import "../assets/css/all.css";
import "../assets/css/admin-style.css";
import "../assets/css/admin-skin-blue.css";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
import ViewStudentProfile from "../components/admin/StudentProfile/ViewStudentProfile";
import PaymentHistory from "../components/admin/PaymentActivities/PaymentHistory";

// Private Route for inner component
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem("admin_token") ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);

class Admin extends Component {
  render() {
    //console.log('Admin',localStorage.getItem('token'));
    return (
      <Switch>
        <PrivateRoute
          exact
          path="/admin/dashboard"
          component={Dashboard}
          handler="Dashboard"
        />
        <PrivateRoute
          exact
          path="/admin/create/subadmin"
          component={CreateSubAdmin}
        />
        <PrivateRoute exact path="/admin/subadmin" component={SubAdminList} />
        <PrivateRoute exact path="/admin/subadmin/edit/:id" component={SubAdminEdit} />
        <PrivateRoute exact path="/admin/admin_list" component={AdminList} />

        <PrivateRoute exact path="/admin/profile" component={Profile} />

        <PrivateRoute
          exact
          path="/admin/laundry_managment"
          component={LaundryManagment}
        />
        <PrivateRoute
          exact
          path="/admin/leave_application"
          component={LeaveApplication}
        />
        <PrivateRoute exact path="/admin/meal" component={AddMeal} />
        <PrivateRoute exact path="/admin/meal_list" component={CheckMeal} />

        <PrivateRoute exact path="/admin/meals" component={Meals} />
        <PrivateRoute exact path="/admin/meal/add" component={MealAdd} />
        <PrivateRoute exact path="/admin/meal/edit/:id" component={MealEdit} />

        <PrivateRoute exact path="/admin/meal-schedule" component={MealSchedule} />
        <PrivateRoute exact path="/admin/meal-schedule/add" component={MealScheduleAdd} />
        <PrivateRoute exact path="/admin/meal-schedule/edit/:id" component={MealScheduleEdit} />

        <PrivateRoute exact path="/admin/water_can" component={WaterCan} />
        <PrivateRoute
          exact
          path="/admin/student_approval"
          component={StudentApproval}
        />

        <PrivateRoute
          exact
          path="/admin/assign_room/:id"
          component={AssignRoom}
        />

        <PrivateRoute
          exact
          path="/admin/view_student"
          component={ViewStudent}
        />
        <PrivateRoute
          exact
          path="/admin/edit_student/:id"
          component={EditStudent}
        />
        <PrivateRoute
          exact
          path="/admin/edit_student_details/:id"
          component={EditStudentDetails}
        />
        <PrivateRoute
          exact
          path="/admin/view_student_profile/:id"
          component={ViewStudentProfile}
        />
        <PrivateRoute
          exact
          path="/admin/view_guardian"
          component={ViewGuardian}
        />
        <PrivateRoute
          exact
          path="/admin/create_profile"
          component={AddStudent}
        />

        <PrivateRoute
          exact
          path="/admin/xceldownload"
          component={Xceldownload}
        />
        <PrivateRoute exact path="/admin/events" component={AddEvent} />
        <PrivateRoute exact path="/admin/event_edit/:id" component={EditEvent} />
        <PrivateRoute exact path="/admin/events_list" component={EventsList} />

        <PrivateRoute exact path="/admin/create_plan" component={CreatePlan} />
        <PrivateRoute
          exact
          path="/admin/subscription_plan"
          component={SubscriptionPlan}
        />
        <PrivateRoute
          exact
          path="/admin/payment_activities"
          component={PaymentActivity}
        />
        <PrivateRoute
          exact
          path="/admin/monthly_activities"
          component={MonthlyActivity}
        />
        <PrivateRoute
          exact
          path="/admin/payment_history"
          component={PaymentHistory}
        />
        <PrivateRoute
          exact
          path="/admin/upgrade_request"
          component={UpgradeRequest}
        />
        <PrivateRoute
          exact
          path="/admin/help_and_quieres"
          component={HelpAndQuieres}
        />
        <PrivateRoute exact path="/admin/emergency" component={Emergency} />
        <PrivateRoute
          exact
          path="/admin/laundry_process"
          component={LaundryProcess}
        />
        <PrivateRoute
          exact
          path="/admin/push_notification"
          component={PushNotification}
        />
        <PrivateRoute
          exact
          path="/admin/notification"
          component={Notification}
        />

        <PrivateRoute
          exact
          path="/admin/pharmacopeial"
          component={Pharmacopeial}
        />

        <PrivateRoute
          exact
          path="/admin/add/building"
          component={AddBuilding}
        />
        <PrivateRoute exact path="/admin/set_plan/:id" component={SetPlan} />
        <PrivateRoute exact path="/admin/view_plan/:id" component={ViewPlan} />
        <PrivateRoute exact path="/admin/edit_plan/:id" component={EditPlan} />
        <PrivateRoute exact path="/admin/monthly_plan/:id" component={MonthlyPlan} />

        <PrivateRoute exact path="/admin/building" component={BuildingList} />
        <PrivateRoute exact path="/admin/edit_building/:id" component={EditBuilding} />
        {/* ///////////////////////// */}
        <PrivateRoute exact path="/admin/add/room" component={AddRoom} />
        <PrivateRoute exact path="/admin/room" component={CheckRoom} />
        <PrivateRoute exact path="/admin/edit_room/:id" component={EditRoom} />
        <PrivateRoute exact path="/admin/add/parking" component={AddParking} />
        <PrivateRoute exact path="/admin/parking" component={Parking} />

        <PrivateRoute exact path="/admin/error_log" component={ErrLog} />
        <PrivateRoute
          exact
          path="/admin/parking/sloat/:id"
          component={ParkingSloat}
        />
        <PrivateRoute
          exact
          path="/admin/error_log_details"
          component={ErrLogDetails}
        />
        <PrivateRoute exact path="/admin/crm_error" component={CrmErr} />
        <Route exact path="/register" component={RegisterComponent} />
        <Route exact path="/" component={Login} />
        <Route
          exact
          path="/payments/:token/:amount/:id/:type"
          component={SetPayment}
        />
        <Route
          exact
          path="/monthly_payments/:token/:amount/:id"
          component={MonthlyPayment}
        />

        <Route from="*" component={AdminPageNotFound} />
      </Switch>
    );
  }
}

export default Admin;
