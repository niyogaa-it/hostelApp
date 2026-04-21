import React, { Component, Fragment } from "react";
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from "../header/Header";
import Footer from "../footer/Footer";
import SidebarAdmin from "../sidebaradmin/SidebarAdmin";

class Layout extends Component {
  componentDidMount() {
    document.body.classList.add("admin-skin-blue");
    document.body.classList.add("sidebar-mini");
    document.body.classList.add("fixed");
  }

  render() {
    //console.log("layout called", this.props);

    const isLoggedIn =
      localStorage.getItem("admin_token") !== null ? true : false;

    const path_name = this.props.history.location.pathname;

    return (
      <Fragment>
        <Header isLoggedIn={isLoggedIn} />
        <SidebarAdmin isLoggedIn={isLoggedIn} path_name={path_name} />
        {/*<SidebarAdmin></SidebarAdmin>*/}

        {this.props.children}

        <Footer isLoggedIn={isLoggedIn} />
      </Fragment>
    );
  }
}

export default Layout;
