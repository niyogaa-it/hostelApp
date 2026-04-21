import React, { Component } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import API from "../../../shared/admin-axios";
import logo from "../../../assets/images/hostel-logo.png";
import swal from "sweetalert";
import "yup-phone-lite";
import useRazorpay from "react-razorpay";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const initialValues = {
  AcademicYear:"",
  SFname: "",
  SmobNo: "",
  SRaddress: "",
  StudEmail: "",
  StudDOB: "",
  NamofInstitute: "",
  AdrsodInstitute: "",
  //CourEnrolled: moment().year()+"-"+ (moment().year() + 1),
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
  BankimagepathBase: "",
  ImgMaleApp1Base: "",
  ImgMaleApp2Base: "",
  ImgMaleApp3Base: "",
  ImgFeMaleApp1Base: "",
  ImgFeMaleApp2Base: "",
  ImgFeMaleApp3Base: "",
};
class Regsuccess extends Component {


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
      BankimagepathBaseError: "",
      ImgMaleApp1Error: "",
      ImgMaleApp2Error: "",
      ImgMaleApp3Error: "",
      parking_type_filed_open: false,
      parking_type_filed_value: "Default Value",
      parking_type_wheller: "",
      download_mode: false,
      student_id: "",
      showTransaction: false,
      academicList: [],
      paymentResponse: [],
      studentDetail:[]
    };
   
  }


  componentDidMount() {

   

  }


  render() {
    // check only number regex
    

    return (
      <>
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
              <div className="container-fluid">
              <center><h1> Payment Successful</h1></center>
             
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(Regsuccess));
