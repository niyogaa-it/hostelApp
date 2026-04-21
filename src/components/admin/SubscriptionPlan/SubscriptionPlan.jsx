import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import moment from "moment";
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
import { Link } from "react-router-dom";

import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import { showErrorMessage } from "../../../shared/handle_error";

function LinkWithTooltip({ id, children, href, tooltip, clicked }) {
  return (
    <OverlayTrigger
      overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
      placement="left"
      delayShow={300}
      delayHide={150}
      trigger={["hover"]}
    >
      <Link to={href} onClick={clicked}>
        {children}
      </Link>
    </OverlayTrigger>
  );
}

class Region extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,

      //////////

      userconut: 0,
    };
  
  }

  componentDidMount() {
    API.get(`/admin/secure/plan/all`)
      .then((res) => {
        this.setState({
          usermangment: res.data.result_data,
          userconut: res.data.result_data.length,
        });
      })
      .catch((err) => {
        console.log("err:", err);
        showErrorMessage(err, this.props);
      });
  }

  render() {
    const dateFormatting = () => (date) => {
      return moment(date).format("dddd, DD/MM/YYYY");
    };

    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section>
            <div className="row">
              <h3 className="col-xs-8" style={{ marginLeft: "15px" }}>
                <span style={{ color: "#a5adb7" }}>Home / </span>
                <span style={{ color: "#556a7d", fontWeight: "bold" }}>
                  Subscription Plan
                </span>
              </h3>
            </div>
          </section>
          <section className="content">
            <div className="box">
              <div className="box-body">
                <div className="nav-tabs-custom">
                  <ul className="nav nav-tabs">
                    <li className="tabButtonSec pull-right">
                      {this.state.count > 0 ? (
                        <span onClick={(e) => this.downloadXLSX(e)}>
                          <LinkWithTooltip
                            tooltip={`Click here to download excel`}
                            href="#"
                            id="tooltip-my"
                            clicked={(e) => this.checkHandler(e)}
                          >
                            <i className="fas fa-download"></i>
                          </LinkWithTooltip>
                        </span>
                      ) : null}
                    </li>
                  </ul>
                </div>

                <BootstrapTable
                  data={this.state.usermangment}
                  exportCSV
                  search
                  pagination
                >
                  <TableHeaderColumn
                    isKey
                    dataField="id"
                    className={"text-uppercase"}
                    width="150"
                    dataSort={true}
                    dataAlign="center"
                    // dataFormat={custContent(this)}
                  >
                    PLAn ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    className={"text-uppercase"}
                    width="150"
                    dataField="plan_name"
                    dataSort={true}
                    dataAlign="center"
                    // dataFormat={custContent(this)}
                  >
                    Plan Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="plan_price"
                    className={"text-uppercase"}
                    width="150"
                    dataSort={true}
                    dataAlign="center"
                  >
                    Plan Price
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="plan"
                    className={"text-uppercase"}
                    width="150"
                    dataSort={true}
                    dataAlign="center"
                  >
                    Plan
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="food_preference"
                    className={"text-uppercase"}
                    width="150"
                    dataSort={true}
                    dataAlign="center"
                  >
                    Food Preference
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="room_type"
                    className={"text-uppercase"}
                    width="150"
                    dataSort={true}
                    dataAlign="center"
                  >
                    Room Type
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="parking"
                    className={"text-uppercase"}
                    width="150"
                    dataSort={true}
                    dataAlign="center"
                  >
                    Parking
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="created_at"
                    className={"text-uppercase"}
                    width="150"
                    dataSort={true}
                    dataAlign="center"
                    dataFormat={dateFormatting(this)}
                  >
                    Created at
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    );
    // }
  }
}
export default Region;
