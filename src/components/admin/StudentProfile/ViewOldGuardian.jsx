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
      oldGuardianList: [],
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
            oldGuardianList: res.data.result_data,
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
    const results = this.state.oldGuardianList.filter(item => item.AcademicYear === value);
   
    this.setState({
      oldGuardianList: results,
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
                    Home / {" "}
                  </span>
                  <span style={{ color: "#556a7d", fontWeight: "bold" }}>
                    Old Guardian list
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
                    data={this.state.oldGuardianList}
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
                      dataField="AcademicYear"
                      className={"text-uppercase"}
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                     Academic Year
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
                      dataField="LocGuardName"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Guardian Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="LocGurdConNo"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Phone No
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="FatherName"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Father Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="MothersName"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Mothers Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="FatherOccu"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Fathers Occupation
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="MathersOccu"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Mothers Occupation
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="FatherConNo"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Father Contact No
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="MothersConNo"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Mothers Contact No
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="FatherEmail"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Father Email
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="MothersEmail"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Mothers Email
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="FatherAnnInc"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Fathers Annual Income
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="MotherAnnInc"
                      className={"text-uppercase"}
                      width="120"
                      dataSort={true}
                      dataAlign="center"
                      columnTitle={columnHover}
                    >
                      Motherss Annual Income
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
