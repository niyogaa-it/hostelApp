import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
//import { Label } from 'reactstrap';
import { Link } from "react-router-dom";
import swal from "sweetalert";

import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import { showErrorMessage } from "../../../shared/handle_error";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

function LinkWithTooltip({ id, children, href, tooltip, clicked }) {
  return (
    // <OverlayTrigger
    //   overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
    //   placement="left"
    //   delayShow={300}
    //   delayHide={150}
    //   trigger={["hover"]}
    // >
    //   <Link to={href} onClick={clicked}>
    //     {children}
    //   </Link>
    // </OverlayTrigger>
    <span
      style={{
        padding: "0.5rem",
        borderRadius: "5px",
        backgroundColor: "#d7f5fc",
        color: "#03c3ec",
        fontWeight: "bold",
      }}
    >
      <Link to="admin/parking/sloat/">View Parking Slot</Link>
    </span>
  );
}

class Region extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parkinglist: [],
      parkingcount: 0,
      Invalid:false,
    };
  }
  clickParking = (parking) => {
    this.props.history.push({
      pathname: "/admin/parking/sloat" + "/" + parking,
      state: { parking: parking },
    });
  };

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.master_data_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
    API.get(`/admin/secure/parking`)
      .then((res) => {
        this.setState({
          parkinglist: res.data.result_data,
          parkingcount: res.data.result_data.length,
        });
      })
      .catch((err) => {
        console.log("err:", err);
        // showErrorMessage(err, this.props);
      });}
      else{
        {
          this.setState({
            Invalid: true,
          });
        }
      }
  }

  render() {
    const statusAction = () => (parking) => {
      return (
        <button
          onClick={() => this.clickParking(parking)}
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            backgroundColor: "#d7f5fc",
            color: "#03c3ec",
            fontWeight: "bold",
            border:"none"
          }}
        >
          View Parking Slot
        </button>
      );
    };
    if (this.state.Invalid) return <Redirect to="/admin/dashboard" />
    else {
    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <div className="row">
              <h3 className="card-title">
                <span className="sp1">Home /</span>
                <span className="sp1"> Master Data /</span>
                <span className="sp2"> Parking List</span>
              </h3>
              <div className="col-lg-12 col-sm-12 col-xs-12"></div>
            </div>
          </section>
          <section className="content">
            <div className="box">
              <div className="box-body">
                <BootstrapTable data={this.state.parkinglist} pagination search>
                  <TableHeaderColumn
                    isKey
                    dataField="id"
                    dataAlign="center"
                    dataSort
                    // dataFormat={custContent(this)}
                  >
                    Parking ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="parking_name"
                    dataAlign="center"
                    dataSort
                    // dataFormat={custContent(this)}
                  >
                    Building Name
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="no_of_slot" dataAlign="center"   dataSort>
                    No of Parking Slot
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="id"
                    dataAlign="center" 
                    dataFormat={statusAction(this)}
                  >
                    Action
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
}
const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(Region));