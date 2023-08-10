import React, { Component } from "react";
import dateFormat from "dateformat";

class Footer extends Component {
  render() {
    if (this.props.isLoggedIn === false) return null;

    return (
      <footer
        className="main-footer"
        style={{
          bottom: "0",
          position: "fixed",
          zIndex: "10",
          width: "-webkit-fill-available",
          color: "#697a8d",
        }}
      >
        © Copyright @{" "}
        <a target="_blank" href="https://www.ranimeyyammaihostel.org/" style={{color: "#697a8d"}}>
          <b>Rani Meyyammai Hostel </b>
        </a>
      </footer>
    );
  }
}

export default Footer;
