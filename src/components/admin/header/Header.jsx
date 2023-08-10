import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { getAdminName, getSuperAdmin } from "../../../shared/helper";
import API from "../../../shared/admin-axios";

// connect to store
import { connect, useDispatch } from "react-redux";

import { adminLogout } from "../../../store/actions/auth";

import logoImage from "../../../assets/images/logo.svg";
import logoImageMini from "../../../assets/images/drreddylogosmall_white.png";
import userIcon from "../../../assets/images/usericon.png";
import { store_user_token } from "../../../store/actions/admin";

class Header extends Component {
  // const dispatch = useDispatch();

  constructor() {
    super();
    this.state = {
      openProfile: false,
      openNotification: false,
      toggleMenu: false,
      user_details: "",
    };
  }

  // SATYAJIT
  displayProfile = () => {
    this.setState({
      openProfile: !this.state.openProfile,
      openNotification: false,
    });
  };
  // SATYAJIT
  displayNotification = () => {
    this.setState({
      openProfile: false,
      openNotification: !this.state.openNotification,
    });
  };
  // SATYAJIT
  setContainerRef = (node) => {
    this.containerRef = node;
  };
  // SATYAJIT
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    // for web page
    document.body.classList.add("sidebar-open");
    if (localStorage.getItem("admin_token")) {
      API.get(`/admin/secure/check/token`)
        .then((res) => {
          this.props.dispatch(store_user_token(res.data));
          // console.log("token user data",res.data)
          this.setState({
            user_details: res.data.user_details,
          });
        })
        .catch((err) => {
          console.log("err:", err);
          // showErrorMessage(err, this.props);
        });
    }
  }
  //SATYAJIT
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  // SATYAJIT
  handleClickOutside = (event) => {
    if (this.containerRef && !this.containerRef.contains(event.target)) {
      this.setState({
        openProfile: false,
        openNotification: false,
      });
    }
  };
  //SATYAJIT
  handleToggleMenu = () => {
    if (document.body.classList.contains("sidebar-open")) {
      document.body.classList.remove("sidebar-open");
      document.body.classList.add("sidebar-collapse");
    } else if (document.body.classList.contains("sidebar-collapse")) {
      document.body.classList.add("sidebar-open");
      document.body.classList.remove("sidebar-collapse");
    }
  };
  //SATYAJIT
  logout = () => {
    this.props.dispatch(adminLogout());
    this.props.history.push("/");
  };

  render() {
    if (this.props.isLoggedIn === false) return null;

    // display name
    const displayAdminName = getAdminName(localStorage.admin_token);

    const superAdmin = getSuperAdmin(localStorage.admin_token);

    return (
      <header className="main-header">
        <Link to="/" className="logo" style={{ backgroundColor: "white" }}>
          {/*<!-- mini logo for sidebar mini 50x50 pixels -->*/}
          <span className="logo-mini">
            <img src={logoImage} alt="hostel" />
          </span>
          {/*<!-- logo for regular state and mobile devices -->*/}
          <span className="logo-lg">
            <img src={logoImage} alt="hostel" />
          </span>
        </Link>
        <nav className="navbar navbar-static-top">
          <span
            className="sidebar-toggle sidebar-toggle-dektop"
            onClick={this.handleToggleMenu}
            data-toggle="offcanvas"
            role="button"
          >
            <i className="fas fa-bars"></i>
          </span>

          <span
            className="sidebar-toggle sidebar-toggle-mobile"
            onClick={this.handleToggleMenu}
            data-toggle="offcanvas"
            role="button"
          >
            <i className="fas fa-bars"></i>
          </span>

          <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              <li
                ref={this.setContainerRef}
                className={
                  this.state.openProfile === true
                    ? "dropdown user user-menu open"
                    : "dropdown user user-menu"
                }
                onClick={this.displayProfile}
              >
                <span className="dropdown-toggle" data-toggle="dropdown">
                  <img src={userIcon} className="user-image" alt="User Img" />

                  <span className="hidden-xs user-name">
                    {displayAdminName}
                  </span>
                  <i className="fa fa-angle-down"></i>
                  <div className="clearFix"></div>
                </span>

                <ul className="dropdown-menu">
                  <li className="user-header">
                    <img src={userIcon} className="img-circle" alt="User Img" />
                    <p>{this.state.user_details.name}</p>
                    <small>{this.state.user_details.role}</small>
                  </li>
                  <li className="user-footer">
                    <div className="pull-left">
                      <Link
                        to="/admin/profile"
                        className="btn btn-default btn-flat"
                      >
                        Profile
                      </Link>
                    </div>
                    <div className="pull-right">
                      <button
                        className="btn btn-default btn-flat"
                        onClick={this.logout}
                      >
                        Sign out
                      </button>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log("header data",state.auth)
  return {
    // ...state,
    data: state.auth,
  };
};

export default withRouter(connect(mapStateToProps)(Header));
