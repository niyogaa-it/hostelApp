import React, { Component } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import API from "../../../shared/admin-axios";

import logo from "../../../assets/images/hostel-logo.png";
import swal from "sweetalert";
import "yup-phone-lite";
import Moment from 'moment';

const initialValues = {
  SFname: "",
  SmobNo: "",
  SRaddress: "",
  StudEmail: "",
  StudDOB: "",
  NamofInstitute: "",
  AdrsodInstitute: "",
  CourEnrolled: "",
  FatherName: "",
  MothersName: "",
  FatherOccu: "",
  MathersOccu: "",
  FatherConNo: "",
  MothersConNo: "",
  FatherEmail: "",
  MothersEmail: "",
  FatherAnnInc: "",
  MotherAnnInc: "",
  BankAccHolder: "",
  BanckName: "",
  BankBranch: "",
  BrankAcctNo: "",
  BankIFSC: "",
  LocGuardName: "",
  RelWithLocGurd: "",
  LocGurdConNo: "",
  LocGurdAdres: "",
  NameVistMale1: "",
  RelVistMaleApp1: "",
  NameVistMale2: "",
  RelVistMaleApp2: "",
  NameVistMale3: "",
  RelVistMaleApp3: "",
  NameVistFeMale1: "",
  RelVistFeMaleApp1: "",
  NameVistFeMale2: "",
  RelVistFeMaleApp2: "",
  NameVistFeMale3: "",
  RelVistFeMaleApp3: "",
  StayPersonName: "",
  StayRelWithApp: "",
  StayAddress: "",
  StayConNo: "",
  StayPersonName1: "",
  StayRelWithApp1: "",
  StayAddress1: "",
  StayConNo1: "",
  food_preference: "",
  room_type: "",
  occupancy: "",
  toilet_type: "",
  parking: "",
  transportation: "",
  academic_year: "",
  check: "",
  parking_type: "",
  // image
  StudimagepathBase: "",
  FatherimagepathBase: "",
  MotherimagepathBase: "",
  LocalimagepathBase: "",
  ImgMaleApp1Base: "",
  ImgMaleApp2Base: "",
  ImgMaleApp3Base: "",
  ImgFeMaleApp1Base: "",
  ImgFeMaleApp2Base: "",
  ImgFeMaleApp3Base: "",
};

export default class ViewStudentProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_error: "",
      success: "",
      file: "",
      StudimagepathBase: "",
      isValidFile: false,
      setFileErrors: "",
      ImgFeMaleApp1Error: "",
      ImgFeMaleApp2Error: "",
      ImgFeMaleApp3Error: "",
      date_error_msg: "",
      StudimagepathBaseError: "",
      FatherimagepathBaseError: "",
      MotherimagepathBaseError: "",
      LocalimagepathBaseError: "",
      dob:"",
      ImgMaleApp1Error: "",
      ImgMaleApp2Error: "",
      ImgMaleApp3Error: "",
      parking_type_filed_open: false,
      parking_type_filed_value: "Default Value",
      parking_type_wheller: "",
      download_mode: false,
      student_id: "",
      student_details: "",
      student_images: "",
    };
  }
  componentDidMount() {
    let student_id = decodeURIComponent(this.props.match.params.id);
    API.get(`/admin/secure/per/student/${student_id}`)
      .then((res) => {
        console.log("res", res);
        if (res.data.status === 200) {
          this.setState({
            student_details: res.data.details[0],
            student_images: res.data.photo[0],
          });
        } else {
          swal("Warning", res.data.message, "warning");
        }
      })
      .catch((err) => {
        swal("Error", err.message, "error");
      });
  }

  render() {
    const { student_details, student_images } = this.state;

    if(student_details.StudDOB) {
      let rev_dob_list = student_details.StudDOB.split('/');
      this.state.dob = rev_dob_list[2]+'-'+rev_dob_list[0]+'-'+rev_dob_list[1];
      console.log(this.state.dob);
      console.log("testing");
    }

    const newInitialValues = Object.assign(initialValues, {
      SFname: student_details.SFname ? student_details.SFname : "",
      SmobNo: student_details.SmobNo ? student_details.SmobNo : "",
      SRaddress: student_details.SRaddress ? student_details.SRaddress : "",
      StudEmail: student_details.StudEmail ? student_details.StudEmail : "",
      StudDOB: student_details.StudDOB ? this.state.dob : "",
      NamofInstitute: student_details.NamofInstitute
        ? student_details.NamofInstitute
        : "",
      AdrsodInstitute: student_details.AdrsodInstitute
        ? student_details.AdrsodInstitute
        : "",
      CourEnrolled: student_details.CourEnrolled
        ? student_details.CourEnrolled
        : "",
      FatherName: student_details.FatherName ? student_details.FatherName : "",
      MothersName: student_details.MothersName
        ? student_details.MothersName
        : "",
      FatherOccu: student_details.FatherOccu ? student_details.FatherOccu : "",
      MathersOccu: student_details.MathersOccu
        ? student_details.MathersOccu
        : "",
      FatherConNo: student_details.FatherConNo
        ? student_details.FatherConNo
        : "",
      MothersConNo: student_details.MothersConNo
        ? student_details.MothersConNo
        : "",
      FatherEmail: student_details.FatherEmail
        ? student_details.FatherEmail
        : "",
      MothersEmail: student_details.MothersEmail
        ? student_details.MothersEmail
        : "",
      FatherAnnInc: student_details.FatherAnnInc
        ? student_details.FatherAnnInc
        : "",
      MotherAnnInc: student_details.MotherAnnInc
        ? student_details.MotherAnnInc
        : "",
      BankAccHolder: student_details.BankAccHolder
        ? student_details.BankAccHolder
        : "",
      BanckName: student_details.BanckName ? student_details.BanckName : "",
      BankBranch: student_details.BankBranch ? student_details.BankBranch : "",
      BrankAcctNo: student_details.BrankAcctNo
        ? student_details.BrankAcctNo
        : "",
      BankIFSC: student_details.BankIFSC ? student_details.BankIFSC : "",
      LocGuardName: student_details.LocGuardName
        ? student_details.LocGuardName
        : "",
      RelWithLocGurd: student_details.RelWithLocGurd
        ? student_details.RelWithLocGurd
        : "",
      LocGurdConNo: student_details.LocGurdConNo
        ? student_details.LocGurdConNo
        : "",
      LocGurdAdres: student_details.LocGurdAdres
        ? student_details.LocGurdAdres
        : "",
      NameVistMale1: student_details.NameVistMale1
        ? student_details.NameVistMale1
        : "",
      RelVistMaleApp1: student_details.RelVistMaleApp1
        ? student_details.RelVistMaleApp1
        : "",
      NameVistMale2: student_details.NameVistMale2
        ? student_details.NameVistMale2
        : "",
      RelVistMaleApp2: student_details.RelVistMaleApp2
        ? student_details.RelVistMaleApp2
        : "",
      NameVistMale3: student_details.NameVistMale3
        ? student_details.NameVistMale3
        : "",
      RelVistMaleApp3: student_details.RelVistMaleApp3
        ? student_details.RelVistMaleApp3
        : "",
      NameVistFeMale1: student_details.NameVistFeMale1
        ? student_details.NameVistFeMale1
        : "",
      RelVistFeMaleApp1: student_details.RelVistFeMaleApp1
        ? student_details.RelVistFeMaleApp1
        : "",
      NameVistFeMale2: student_details.NameVistFeMale2
        ? student_details.NameVistFeMale2
        : "",
      RelVistFeMaleApp2: student_details.RelVistFeMaleApp2
        ? student_details.RelVistFeMaleApp2
        : "",
      NameVistFeMale3: student_details.NameVistFeMale3
        ? student_details.NameVistFeMale3
        : "",
      RelVistFeMaleApp3: student_details.RelVistFeMaleApp3
        ? student_details.RelVistFeMaleApp3
        : "",
      StayPersonName: student_details.StayPersonName
        ? student_details.StayPersonName
        : "",
      StayRelWithApp: student_details.StayRelWithApp
        ? student_details.StayRelWithApp
        : "",
      StayAddress: student_details.StayAddress
        ? student_details.StayAddress
        : "",
      StayConNo: student_details.StayConNo ? student_details.StayConNo : "",
      StayPersonName1: student_details.StayPersonName1
        ? student_details.StayPersonName1
        : "",
      StayRelWithApp1: student_details.StayRelWithApp1
        ? student_details.StayRelWithApp1
        : "",
      StayAddress1: student_details.StayAddress1
        ? student_details.StayAddress1
        : "",
      StayConNo1: student_details.StayConNo1 ? student_details.StayConNo1 : "",
      food_preference: student_details.food_preference
        ? student_details.food_preference
        : "",
      room_type: student_details.room_type ? student_details.room_type : "",
      occupancy: student_details.occupancy ? student_details.occupancy : "",
      toilet_type: student_details.toilet_type
        ? student_details.toilet_type
        : "",
      parking: student_details.parking ? student_details.parking : "",
      transportation: student_details.transportation
        ? student_details.transportation
        : "",
      academic_year: student_details.academic_year
        ? student_details.academic_year
        : "",
      check: student_details.check ? student_details.check : "",
      parking_type: student_details.parking_type
        ? student_details.parking_type
        : "",
    });

    return (
      <div>
        <section className="register-panel">
          <div className="reg-header">
          <a href="https://www.ranimeyyammaihostel.org/" target="_blank">
            <img
              src={logo}
              height="150px"
              alt="Chettinad Rani Meyyammai Hostel"
            />
            </a>
            <p>
              No. 25, Ethiraj Salai, Egmore Chennai – 600 008.
              <br />
              Telephone: 044 2827 1617
            </p>
          </div>
          <div className="reg-content">
            <div className="cont-header">
              {console.log("newInitialValues>>>", newInitialValues)}
              <Formik initialValues={newInitialValues}>
                {({ values, errors, touched }) => (
                  <Form>
                    <div className="container-fluid">
                      <h1>Application Form</h1>

                      <div className="form">
                        <form className="form-inline">
                          <div className="row">
                            {/* Student's Details */}

                            <div className="col-lg-12">
                              <div className="form-heading">
                                <h3>Student's Details:</h3>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 txt-position">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="SFname">
                                      Student's Full Name *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="SFname"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="SmobNo">
                                      Student's Mobile No. *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="SmobNo"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="Studimagepath">
                                      Upload Student's Photograph (Max file size
                                      5 mb) *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <img
                                      src={student_images.StudimagepathBase}
                                      width="100px"
                                      style={{ float: "left" }}
                                    />

                                    <img src />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="NamofInstitute">
                                      Name of the Institution enrolled *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="NamofInstitute"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="CourEnrolled">
                                      Course enrolled / Year *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="CourEnrolled"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-6 col-md-6 txt-position">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="SRaddress">
                                      Student's Residential Address *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      component="textarea"
                                      rows="4"
                                      name="SRaddress"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="StudEmail">
                                      Student's Email Id. *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="email"
                                      name="StudEmail"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="StudDOB">
                                      Student's Date of Birth *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="date"
                                      name="StudDOB"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="AdrsodInstitute">
                                      Address of the Institution *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      component="textarea"
                                      rows="4"
                                      name="AdrsodInstitute"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Parent's Details */}

                            <div className="col-lg-12">
                              <div className="form-heading">
                                <h3>Parent's Details:</h3>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 txt-position">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="Fatherimagepath">
                                      Father Photo (Max file size 5 mb) *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <img
                                      src={student_images.FatherimagepathBase}
                                      width="100px"
                                      style={{ float: "left" }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="FatherName">
                                      Father's Name *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="FatherName"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="occupation">
                                      Father's Occupation *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="FatherOccu"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="contact">
                                      Father's Contact No. *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="FatherConNo"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label
                                      htmlFor="FatherEmail"
                                      style={{ color: "#333333" }}
                                    >
                                      Father's Email Id.
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="email"
                                      name="FatherEmail"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="FatherAnnIncincome">
                                      Father's Annual Income *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="FatherAnnInc"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-6 col-md-6 txt-position">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="Motherimagepath">
                                      Mother Photo (Max file size 5 mb) *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <img
                                      src={student_images.MotherimagepathBase}
                                      width="100px"
                                      style={{ float: "left" }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="MothersName">
                                      Mother's Name *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="MothersName"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="MathersOccu">
                                      Mother's Occupation *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="MathersOccu"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="MothersConNo">
                                      Mother's Contact No. *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="MothersConNo"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label
                                      htmlFor="MothersEmail"
                                      style={{ color: "#333333" }}
                                    >
                                      Mother's Email Id.
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="email"
                                      name="MothersEmail"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label
                                      htmlFor="MotherAnnInc"
                                      style={{ color: "#333333" }}
                                    >
                                      Mother's Annual Income
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="MotherAnnInc"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Bank Details */}

                            <div className="col-lg-12">
                              <div className="form-heading">
                                <h3>Bank Details:</h3>
                              </div>
                            </div>
                            <div className="col-lg-6 txt-position">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="BankAccHolder">
                                      Bank A/c Holder's Name *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="BankAccHolder"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="BankBranch">
                                      Bank Branch Name *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="BankBranch"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="BankIFSC">
                                      Bank IFSC Code *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="BankIFSC"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-6 txt-position">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="BanckName">
                                      Bank Name *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="BanckName"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="BrankAcctNo">
                                      Bank Account Number *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="BrankAcctNo"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Local Guardian Details */}

                            <div className="col-lg-12">
                              <div className="form-heading">
                                <h3>Local Guardian's Details:</h3>
                              </div>
                            </div>

                            <div className="col-lg-6 txt-position">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="Localimagepath">
                                      Local Guardian's Photo (Max file size 5
                                      mb) *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <img
                                      src={student_images.LocalimagepathBase}
                                      width="100px"
                                      style={{ float: "left" }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="LocGuardName">
                                      Local Guardian's Name *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="LocGuardName"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="LocGurdConNo">
                                      Local Guardian's Contact No. *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="contact"
                                      name="LocGurdConNo"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-6 txt-position">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="RelWithLocGurd">
                                      Relationship with Local Guardian *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="RelWithLocGurd"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4 col-md-4">
                                    <label htmlFor="LocGurdAdres">
                                      Local Guardian's Address *
                                    </label>
                                  </div>
                                  <div className="col-lg-8 col-md-12">
                                    <Field
                                      disabled
                                      component="textarea"
                                      rows="4"
                                      name="LocGurdAdres"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* List of Male Visitors */}

                            <div className="col-lg-12">
                              <div className="form-heading">
                                <h3>
                                  List of Male visitors who will be visiting:
                                </h3>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 txt-position male-panel">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="NameVistMale1">
                                      Name of the Visitor:
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <Field
                                      disabled
                                      type="text"
                                      name="NameVistMale1"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="NameVistMale2">
                                      Name of the Visitor:
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <Field
                                      disabled
                                      type="text"
                                      name="NameVistMale2"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="NameVistMale3">
                                      Name of the Visitor:
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <Field
                                      disabled
                                      type="text"
                                      name="NameVistMale3"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6 txt-position male-panel">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="RelVistMaleApp1">
                                      Relationship of the Visitor to the
                                      applicant:
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <Field
                                      disabled
                                      type="text"
                                      name="RelVistMaleApp1"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="RelVistMaleApp2">
                                      Relationship of the Visitor to the
                                      applicant:
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <Field
                                      disabled
                                      type="text"
                                      name="RelVistMaleApp2"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="RelVistMaleApp3">
                                      Relationship of the Visitor to the
                                      applicant:
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <Field
                                      disabled
                                      type="text"
                                      name="RelVistMaleApp3"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6 txt-position male-panel">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="ImgMaleApp1">
                                      Upload Photograph of the Visitor
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <img
                                      src={student_images.ImgMaleApp1Base}
                                      width="100px"
                                      style={{ float: "left" }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="ImgMaleApp2">
                                      Upload Photograph of the Visitor (Max file
                                      size 5 mb)
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <img
                                      src={student_images.ImgMaleApp2Base}
                                      width="100px"
                                      style={{ float: "left" }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="ImgMaleApp3">
                                      Upload Photograph of the Visitor (Max file
                                      size 5 mb)
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <img
                                      src={student_images.ImgMaleApp3Base}
                                      width="100px"
                                      style={{ float: "left" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* List of Female Visitors */}

                            <div className="col-lg-12">
                              <div className="form-heading">
                                <h3>
                                  List of Female visitors who will be visiting:
                                </h3>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-12 txt-position female-panel">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="NameVistFeMale1">
                                      Name of the Visitor:
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <Field
                                      disabled
                                      type="text"
                                      name="NameVistFeMale1"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="NameVistFeMale2">
                                      Name of the Visitor:
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <Field
                                      disabled
                                      type="text"
                                      name="NameVistFeMale2"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="NameVistFeMale3">
                                      Name of the Visitor:
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <Field
                                      disabled
                                      type="text"
                                      name="NameVistFeMale3"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4 -col-md-12 txt-position female-panel">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="RelVistFeMaleApp1">
                                      Relationship of the Visitor to the
                                      applicant:
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <Field
                                      disabled
                                      type="text"
                                      name="RelVistFeMaleApp1"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="RelVistFeMaleApp2">
                                      Relationship of the Visitor to the
                                      applicant:
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <Field
                                      disabled
                                      type="text"
                                      name="RelVistFeMaleApp2"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="RelVistFeMaleApp3">
                                      Relationship of the Visitor to the
                                      applicant:
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <Field
                                      disabled
                                      type="text"
                                      name="RelVistFeMaleApp3"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-12 txt-position female-panel">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="ImgFeMaleApp1">
                                      Upload Photograph of the Visitor (Max file
                                      size 5 mb)
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <img
                                      src={student_images.ImgFeMaleApp1Base}
                                      width="100px"
                                      style={{ float: "left" }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="ImgFeMaleApp2">
                                      Upload Photograph of the Visitor (Max file
                                      size 5 mb)
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <img
                                      src={student_images.ImgFeMaleApp2Base}
                                      width="100px"
                                      style={{ float: "left" }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label htmlFor="ImgFeMaleApp3">
                                      Upload Photograph of the Visitor (Max file
                                      size 5 mb)
                                    </label>
                                  </div>
                                  <div className="col-lg-6">
                                    <img
                                      src={student_images.ImgFeMaleApp3Base}
                                      width="100px"
                                      style={{ float: "left" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Weekend Stay in Chennai */}

                            <div className="col-lg-12">
                              <div className="form-heading">
                                <h3>Weekend Stay in Chennai:</h3>
                              </div>
                            </div>
                            <div className="col-lg-6 txt-position">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label
                                      htmlFor="StayPersonName"
                                      style={{ color: "#333333" }}
                                    >
                                      Name of Person:
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="StayPersonName"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label
                                      htmlFor="StayAddress"
                                      style={{ color: "#333333" }}
                                    >
                                      Address:
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      component="textarea"
                                      rows="4"
                                      name="StayAddress"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label
                                      htmlFor="StayPersonName1"
                                      style={{ color: "#333333" }}
                                    >
                                      Name of Person:
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="StayPersonName1"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label
                                      htmlFor="StayAddress1"
                                      style={{ color: "#333333" }}
                                    >
                                      Address:
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      component="textarea"
                                      rows="4"
                                      name="StayAddress1"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="food_preference">
                                      Food Preference *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      name="food_preference"
                                      component="select"
                                      className={"form-control"}
                                      autoComplete="off"
                                    >
                                      <option value="" selected>
                                        Default select
                                      </option>
                                      <option value="Veg">Veg</option>
                                      <option value="Non-Veg">Non-Veg</option>
                                      <option value="Eggeterian">
                                        Eggeterian
                                      </option>
                                    </Field>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="parking">Parking *</label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      name="parking"
                                      component="select"
                                      className={"form-control"}
                                      autoComplete="off"
                                    >
                                      <option value="" selected>
                                        Default select
                                      </option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </Field>
                                    {errors.parking && touched.parking ? (
                                      <div className="error error text-left text-danger">
                                        {errors.parking}
                                      </div>
                                    ) : null}
                                    {this.state.parking_type_filed_open ? (
                                      <Field
                                        disabled
                                        component="select"
                                        name="parking_type"
                                        className={"form-control"}
                                        // autoComplete="off"
                                        style={{ marginTop: "10px" }}
                                      >
                                        <option value="" selected>
                                          Default select
                                        </option>
                                        <option value="2">
                                          2 Wheeler Parking
                                        </option>
                                        <option value="4">
                                          4 Wheeler Parking
                                        </option>
                                      </Field>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="occupancy">
                                      Occupancy *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      name="occupancy"
                                      component="select"
                                      className={"form-control"}
                                      autoComplete="off"
                                    >
                                      <option value="" selected>
                                        Default select
                                      </option>
                                      <option value="2 in 1">2 in 1</option>
                                      <option value="3 in 1">3 in 1</option>
                                      <option value="4 in 1">4 in 1</option>
                                      <option value="5 in 1">5 in 1</option>
                                      <option value="6 in 1">6 in 1</option>
                                      <option value="7 in 1">7 in 1</option>
                                    </Field>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 txt-position">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label
                                      htmlFor="StayRelWithApp"
                                      style={{ color: "#333333" }}
                                    >
                                      Relationship with the Applicant:
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="StayRelWithApp"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label
                                      htmlFor="StayConNo"
                                      style={{ color: "#333333" }}
                                    >
                                      Contact No.:
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="contact"
                                      name="StayConNo"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label
                                      htmlFor="StayPersonName1"
                                      style={{ color: "#333333" }}
                                    >
                                      Relationship with the Applicant:
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="text"
                                      name="StayPersonName1"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label
                                      htmlFor="StayConNo1"
                                      style={{ color: "#333333" }}
                                    >
                                      Contact No.:
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      type="contact"
                                      name="StayConNo1"
                                      className={"form-control"}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="name">Room Type *</label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      name="room_type"
                                      component="select"
                                      className={"form-control"}
                                      autoComplete="off"
                                    >
                                      <option value="" selected>
                                        Default select
                                      </option>
                                      <option value="AC">AC</option>
                                      <option value="Non-AC">Non-AC</option>
                                    </Field>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="toilet_type">
                                      Toilet Type *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      name="toilet_type"
                                      component="select"
                                      className={"form-control"}
                                      autoComplete="off"
                                    >
                                      <option value="" selected>
                                        Default select
                                      </option>
                                      <option value="Attached">Attached</option>
                                      <option value="Common">Common</option>
                                    </Field>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <label htmlFor="transportation">
                                      Do you want to use hostel's transportation
                                      for travelling? *
                                    </label>
                                  </div>
                                  <div className="col-lg-8">
                                    <Field
                                      disabled
                                      name="transportation"
                                      component="select"
                                      className={"form-control"}
                                    >
                                      <option value="" selected>
                                        Default select
                                      </option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </Field>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="footer">
                        <span>
                          View 
                          <a
                            href="https://www.ranimeyyammaihostel.org/wp-content/uploads/2022/06/RMH_rules_and_regulations.pdf"
                            target="_blank"
                          >
                            {" "}
                            Rules and Regulations
                          </a>
                          {" "}
                          of Hostel
                        </span>
                        <span>
                          <b>Note:</b> Filling the form is to furnish your
                          details and share your preferences. Admission is not
                          guaranteed until completion of the process.
                        </span>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
