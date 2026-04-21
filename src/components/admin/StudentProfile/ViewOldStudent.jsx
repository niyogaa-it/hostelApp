import React, { Component } from "react";
import Pagination from "react-js-pagination";
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
import { Link } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import swal from "sweetalert";
import * as Yup from "yup";

import Layout from "../layout/Layout";

import API from "../../../shared/admin-axios";

import { showErrorMessage } from "../../../shared/handle_error";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

class Region extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      oldStudentList: [],
      academicList: [],
      userconut: 0,
      Invalid: false,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.room_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
        API.get(`/admin/secure/student/oldlist`)
          .then((res) => {
            this.setState({
              oldStudentList: res.data.result_data,
              userconut: res.data.result_data.length,
            });
          })
          .catch((err) => {
            console.log("err:", err);
            showErrorMessage(err, this.props);
        });


        API.get(`/admin/secure/student/academic_year_list`)
          .then((res) => {
            this.setState({
              academicList: res.data.result_data,
    
            });
          })
          .catch((err) => {
            console.log("err:", err);
            showErrorMessage(err, this.props);
        });



    } else {
      this.setState({
        Invalid: true,
      });
    }
  }



  searchYear = (event) => {
    const value = event.target.value;
  
    // Perform the search or filter
    const results = this.state.oldStudentList.filter(item => item.AcademicYear === value);
   
    this.setState({
      oldStudentList: results,
      userconut: results.length,
    });
    
  };


 

  render() {
    const columnHover = (cell, row, enumObject, rowIndex) => {
      return cell
    }

    if (this.state.Invalid) return <Redirect to="/admin/dashboard" />;
    else {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section className="content-header">
              <div className="row">
                <h3 className="col-xs-8" style={{ marginLeft: "15px" }}>
                  <span style={{ color: "#a5adb7" }}>
                    Home /{" "}
                  </span>
                  <span style={{ color: "#556a7d", fontWeight: "bold" }}>
                    Old Student list
                  </span>
                </h3>
              </div>
            </section>
            <section className="content">
              <div className="box">
                <div className="box-body">

                  <div className="col-md-12 d-flex text-center">
                      <select value="0" onChange={this.searchYear}>
                      <option value="">Select an option</option>
                        {this.state.academicList &&
                          this.state.academicList.map((academicYear, i) => (
                            <option value={academicYear.year} key={i}>
                              {academicYear.display_value}
                            </option>
                          ))} 
                      </select>
                  </div>
                  
                  <BootstrapTable
                    data={this.state.oldStudentList}
                    search
                    pagination
                  >
                    <TableHeaderColumn
                      isKey
                      dataField="id"
                      dataAlign="center"
                      width="150"
                      // dataFormat={custContent(this)}
                    >
                      ID
                    </TableHeaderColumn>


                    <TableHeaderColumn
                      width="120"
                      dataField="student_type"
                      className={"text-uppercase"}
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                     Student Type
                    </TableHeaderColumn>


                    <TableHeaderColumn
                      width="120"
                      dataField="SFname"
                      className={"text-uppercase"}
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Student's Name
                    </TableHeaderColumn>


                    <TableHeaderColumn
                      dataField="SFname"
                      dataAlign="center"
                      width="150"
                      // dataFormat={custContent(this)}
                    >
                      NAME
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="StudEmail"
                      dataAlign="center"
                      width="150"
                      columnTitle={columnHover}
                    >
                      EMAIL
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="SmobNo"
                      dataAlign="center"
                      width="150"
                    >
                      PHONE
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
