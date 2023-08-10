import React, { Component } from "react";
import { Formik, Field, Form } from 'formik';

import Layout from "../layout/Layout";
//import Reg from "../Register/RegisterNew";
import * as Yup from "yup";
import API from "../../../shared/admin-axios";

import logo from "../../../assets/images/hostel-logo.png";
import swal from "sweetalert";
import "yup-phone-lite";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

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
    paymentoption:""
  };
class AddStudent extends Component {
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
          ImgMaleApp1Error: "",
          ImgMaleApp2Error: "",
          ImgMaleApp3Error: "",
          parking_type_filed_open: false,
          parking_type_filed_value: "Default Value",
          parking_type_wheller: "",
          download_mode: false,
          student_id: "",
          showTransaction: false,
          paymentoption:""
        };
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
        this.fileCheckImageType = this.fileCheckImageType.bind(this);
        this.checkDate = this.checkDate.bind(this);
        
      }
    
      changePaymentOption = (e) => {
        // check target value is not empty
        if (e.target.value == "Online") {
          this.setState({ showTransaction: true });
        } else {
          this.setState({ showTransaction: false });
        }
      };
    
      handleSubmitEvent = (values, { resetForm }) => {
        API.post("/admin/un/secure/create/profile/check_validation", values)
          .then((res) => {
            if (res.data.status === 200) {    
                API.post("/admin/un/secure/create/profile", values)
                .then((res) => {
                  console.log("res", res);
                  if (res.data.status === 200) {
                    swal("Success", res.data.message, "success");
                    // reload page
                    window.location.reload();
                  } else {
                    // swal warning

                    swal("Warning", res.data.message, "warning");
                  }
                })
                .catch((err) => {
                  swal("Error", err.message, "error");
                });
            const options = {
                //key: "rzp_test_IRmV5lo58NFlHA", // Enter the Key ID generated from the Dashboard //TEST KEY
                key: "rzp_live_uApdZqYjtTPLW0", // Enter the Key ID generated from the Dashboard
    
                amount: "100", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: "INR",
                name: "Rani Meyyammai",
                description: "Test Transaction",
                image: "http://3.110.86.116:3000/assets/img/favicon/favicon.ico",
                handler: function (response) {
                  API.post("/admin/un/secure/create/profile", values)
                    .then((res) => {
                      console.log("res", res);
                      if (res.data.status === 200) {
                        swal("Success", res.data.message, "success");
                        // reload page
                        window.location.reload();
                      } else {
                        // swal warning
    
                        swal("Warning", res.data.message, "warning");
                      }
                    })
                    .catch((err) => {
                      swal("Error", err.message, "error");
                    });
                  //alert(response.razorpay_payment_id);
                  // alert(response.razorpay_order_id);
                  //alert(response.razorpay_signature)
                },
                prefill: {},
                notes: {
                  address: "Razorpay Corporate Office",
                },
                theme: {
                  color: "#3399cc",
                },
              };
              //const rzp1 = new window.Razorpay(options);
              //rzp1.on("payment.failed", function (response) {
               // alert(response.error.code);
             // });
              //rzp1.open();
              // integartion of razorpay
            } else {
              swal({
                title: "Warning",
                text: res.data.message,
                icon: "warning",
                button: "Ok",
              });
            }
          })
          .catch((err) => {
            console.log("err", err);
            swal({
              title: "Error",
              text: "Registration Failed",
              icon: "error",
              button: "Ok",
            });
          });
      };
    
      checkDate = (event, setFieldTouched, setFieldValue, setErrors) => {
        // input date not greater than current date
        let today = new Date();
        let inputDate = new Date(event.target.value);
        if (inputDate > today) {
          this.setState({
            date_error_msg: "Date should not be greater than today",
          });
          setErrors({ StudDOB: "Date should not be greater than today" });
        } else {
          this.setState({ date_error_msg: "" });
          setFieldValue("StudDOB", event.target.value);
        }
      };
    
      handleParkingChange = (event, setFieldValue, setFieldTouched) => {
        // check target value yes or no
        if (event.target.value === "Yes") {
          this.setState({
            parking_type_filed_open: true,
            parking_type_filed_value: "Yes",
          });
          setFieldValue("parking", "Yes");
          setFieldTouched("parking", true);
          setFieldValue("parking_type", this.state.parking_type_wheller);
        } else {
          this.setState({
            parking_type_filed_open: false,
            parking_type_filed_value: "No",
          });
          setFieldValue("parking", "No");
          setFieldTouched("parking", true);
          setFieldValue("parking_type", "");
        }
      };
    
      fileCheckImageType = (event, setFieldTouched, setFieldValue, setErrors) => {
        let fieldName = event.target.name;
        const { value: file_name } = event.target;
        const SUPPORT_IMAGE_FORMAT = ["image/jpg", "image/jpeg", "image/png"];
        if (
          event.target.files[0] &&
          SUPPORT_IMAGE_FORMAT.includes(event.target.files[0].type)
        ) {
          let reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          if (event.target.files[0].size < 5242880) {
            reader.onload = () => {
              if (fieldName === "ImgFeMaleApp1") {
                setFieldTouched("ImgFeMaleApp1Base");
                setFieldValue("ImgFeMaleApp1Base", reader.result);
                this.setState({ isValidFile: true });
              }
              if (fieldName === "ImgFeMaleApp2") {
                setFieldTouched("ImgFeMaleApp2Base");
                setFieldValue("ImgFeMaleApp2Base", reader.result);
                this.setState({ isValidFile: true });
              }
              if (fieldName === "ImgFeMaleApp3") {
                setFieldTouched("ImgFeMaleApp3Base");
                setFieldValue("ImgFeMaleApp3Base", reader.result);
                this.setState({ isValidFile: true });
              }
              if (fieldName === "ImgMaleApp1") {
                setFieldTouched("ImgMaleApp1Base");
                setFieldValue("ImgMaleApp1Base", reader.result);
                this.setState({ isValidFile: true });
              }
              if (fieldName === "ImgMaleApp2") {
                setFieldTouched("ImgMaleApp2Base");
                setFieldValue("ImgMaleApp2Base", reader.result);
                this.setState({ isValidFile: true });
              }
              if (fieldName === "ImgMaleApp3") {
                setFieldTouched("ImgMaleApp3Base");
                setFieldValue("ImgMaleApp3Base", reader.result);
                this.setState({ isValidFile: true });
              }
            };
          } else {
            if (fieldName === "ImgFeMaleApp1") {
              this.setState({
                ImgFeMaleApp1Error: "File size should be less than 5 MB",
                isValidFile: false,
              });
              event.target.value = "";
            }
            if (fieldName === "ImgFeMaleApp2") {
              this.setState({
                ImgFeMaleApp2Error: "File size should be less than 5 MB",
                isValidFile: false,
              });
              event.target.value = "";
            }
            if (fieldName === "ImgFeMaleApp3") {
              this.setState({
                ImgFeMaleApp3Error: "File size should be less than 5 MB",
                isValidFile: false,
              });
              event.target.value = "";
            }
            if (fieldName === "ImgMaleApp1") {
              this.setState({
                ImgMaleApp1Error: "File size should be less than 5 MB",
                isValidFile: false,
              });
              event.target.value = "";
            }
            if (fieldName === "ImgMaleApp2") {
              this.setState({
                ImgMaleApp2Error: "File size should be less than 5 MB",
                isValidFile: false,
              });
              event.target.value = "";
            }
            if (fieldName === "ImgMaleApp3") {
              this.setState({
                ImgMaleApp3Error: "File size should be less than 5 MB",
                isValidFile: false,
              });
              event.target.value = "";
            }
          }
        } else {
          if (fieldName === "ImgFeMaleApp1") {
            this.setState({
              ImgFeMaleApp1Error: "File format should be jpg/jpeg/png",
              isValidFile: false,
            });
            event.target.value = "";
          }
          if (fieldName === "ImgFeMaleApp2") {
            this.setState({
              ImgFeMaleApp2Error: "File format should be jpg/jpeg/png",
              isValidFile: false,
            });
            event.target.value = "";
          }
          if (fieldName === "ImgFeMaleApp3") {
            this.setState({
              ImgFeMaleApp3Error: "File format should be jpg/jpeg/png",
              isValidFile: false,
            });
            event.target.value = "";
          }
          if (fieldName === "ImgMaleApp1") {
            this.setState({
              ImgMaleApp1Error: "File format should be jpg/jpeg/png",
              isValidFile: false,
            });
            event.target.value = "";
          }
          if (fieldName === "ImgMaleApp2") {
            this.setState({
              ImgMaleApp2Error: "File format should be jpg/jpeg/png",
              isValidFile: false,
            });
            event.target.value = "";
          }
          if (fieldName === "ImgMaleApp3") {
            this.setState({
              ImgMaleApp3Error: "File format should be jpg/jpeg/png",
              isValidFile: false,
            });
            event.target.value = "";
          }
        }
      };
    
      fileChangedHandler = (event, setFieldTouched, setFieldValue, setErrors) => {
        const fieldName = event.target.name;
        const { value: file_name } = event.target;
    
        const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg"];
        if (!event.target.files[0]) {
          this.setState({
            setFileErrors: "Please select a file",
            isValidFile: false,
          });
          return;
        }
        if (
          event.target.files[0] &&
          SUPPORTED_FORMATS.includes(event.target.files[0].type)
        ) {
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          if (event.target.files[0].size < 5242880) {
            reader.onload = () => {
              console.log({ reader });
              this.setState(
                {
                  setFileErrors: "",
                  isValidFile: true,
                },
                () => {
                  // get file name
                  if (fieldName === "Studimagepath") {
                    setFieldTouched("StudimagepathBase");
                    setFieldValue("StudimagepathBase", file_name);
                    setFieldValue("StudimagepathBase", reader.result);
                  }
                  if (fieldName === "Fatherimagepath") {
                    setFieldTouched("FatherimagepathBase");
                    setFieldValue("FatherimagepathBase", file_name);
                    setFieldValue("FatherimagepathBase", reader.result);
                  }
                  if (fieldName === "Motherimagepath") {
                    setFieldTouched("MotherimagepathBase");
                    setFieldValue("MotherimagepathBase", file_name);
                    setFieldValue("MotherimagepathBase", reader.result);
                  }
                  if (fieldName === "Localimagepath") {
                    setFieldTouched("LocalimagepathBase");
                    setFieldValue("LocalimagepathBase", file_name);
                    setFieldValue("LocalimagepathBase", reader.result);
                  }
                }
              );
            };
          } else {
            if (fieldName === "Studimagepath") {
              this.setState({
                StudimagepathBaseError: "File size is too large",
                isValidFile: false,
              });
              event.target.value = "";
            }
            if (fieldName === "Fatherimagepath") {
              this.setState({
                FatherimagepathBaseError: "File size is too large",
                isValidFile: false,
              });
              event.target.value = "";
            }
            if (fieldName === "Motherimagepath") {
              this.setState({
                MotherimagepathBaseError: "File size is too large",
                isValidFile: false,
              });
              event.target.value = "";
            }
            if (fieldName === "Localimagepath") {
              this.setState({
                LocalimagepathBaseError: "File size is too large",
                isValidFile: false,
              });
              event.target.value = "";
            }
          }
        } else {
          if (fieldName === "Studimagepath") {
            this.setState({
              StudimagepathBaseError: "File format should be jpg/jpeg/png",
              isValidFile: false,
            });
            event.target.value = "";
          }
          if (fieldName === "Fatherimagepath") {
            this.setState({
              FatherimagepathBaseError: "File format should be jpg/jpeg/png",
              isValidFile: false,
            });
            event.target.value = "";
          }
          if (fieldName === "Motherimagepath") {
            this.setState({
              MotherimagepathBaseError: "File format should be jpg/jpeg/png",
              isValidFile: false,
            });
            event.target.value = "";
          }
          if (fieldName === "Localimagepath") {
            this.setState({
              LocalimagepathBaseError: "File format should be jpg/jpeg/png",
              isValidFile: false,
            });
            event.target.value = "";
          }
        }
      };
    
      
      render() {
        // check only number regex
        const onlyNumberRegex = /^[0-9\b]+$/;
        const validationReg = Yup.object().shape({
          SFname: Yup.string().required("Student Name is required"),
          SmobNo: Yup.string()
            .phone("IN", "Please enter a valid phone number")
            .required("Mobile Number is required"),
          SRaddress: Yup.string().required("Student Address is required"),
          StudEmail: Yup.string()
            .email("Please enter a valid email")
            .required("Student Email is required"),
          StudDOB: Yup.string().required("Student DOB is required"),
          StudimagepathBase: Yup.string().required("Student Image is required"),
          NamofInstitute: Yup.string().required("Name of Institute is required"),
          AdrsodInstitute: Yup.string().required(
            "Address of Institute is required"
          ),
          CourEnrolled: Yup.string().required("Course Enrolled is required"),
    
          FatherName: Yup.string().required("Father Name is required"),
          FatherimagepathBase: Yup.string().required("Father Image is required"),
          MothersName: Yup.string().required("Mother Name is required"),
          MotherimagepathBase: Yup.string().required("Mother Image is required"),
          FatherOccu: Yup.string().required("Father Occupation is required"),
          MathersOccu: Yup.string().required("Mother Occupation is required"),
          FatherConNo: Yup.string()
            .phone("IN", "Please enter a valid phone number")
            .required("Father Contact Number is required"),
          MothersConNo: Yup.string()
            .phone("IN", "Please enter a valid phone number")
            .required("Mother Contact Number is required"),
          FatherAnnInc: Yup.string()
            .matches(onlyNumberRegex, "Number is not valid")
            .required("Father Annual Income is required"),
    
          // MotherAnnInc: Yup.string().required("Mother Annual Income is required"),
    
          BankAccHolder: Yup.string().required("Bank Account Holder is required"),
          BanckName: Yup.string().required("Bank Name is required"),
          BankBranch: Yup.string().required("Bank Branch is required"),
          BrankAcctNo: Yup.string()
            .matches(onlyNumberRegex, "Number is not valid")
            .required("Bank Account Number is required"),
          BankIFSC: Yup.string().required("Bank IFSC is required"),
    
          LocalimagepathBase: Yup.string().required("Local Image is required"),
          LocGuardName: Yup.string().required("Local Guardian Name is required"),
          RelWithLocGurd: Yup.string().required(
            "Relation with Local Guardian is required"
          ),
          LocGurdConNo: Yup.string()
            .phone("IN", "Please enter a valid phone number")
            .required("Local Guardian Contact Number is required"),
          LocGurdAdres: Yup.string().required("Local Guardian Address is required"),
    
          food_preference: Yup.string().required("Food Preference is required"),
          parking: Yup.string().required("Parking is required"),
          occupancy: Yup.string().required("Occupancy is required"),
          room_type: Yup.string().required("Room Type is required"),
          toilet_type: Yup.string().required("Toilet Type is required"),
          transportation: Yup.string().required("Transportation is required"),
          check: Yup.string().required("Check is required"),
          StayConNo1: Yup.string().phone("IN", "Please enter a valid phone number"),
          StayConNo: Yup.string().phone("IN", "Please enter a valid phone number"),
          MothersEmail: Yup.string().email("Please enter a valid email"),
          FatherEmail: Yup.string().email("Please enter a valid email"),
          paymentoption:Yup.string().required("Please select an option"),
          parking_type: Yup.string().when("parking", {
            is: "Yes",
            then: Yup.string().required("Parking Type is required"),
          }),
        });
    
        return (
          <>
           <Layout {...this.props}>
                <section className="content-wrapper">
                    {/* <section className="content-header"> */}
                    {/* <div className="row">
                            <h3 className="card-title">
                                <span className="sp1">Home / </span>
                                <span className="sp1">User Management / </span>
                                <span className="sp2">Create Subadmin</span>
                            </h3>
                        </div> */}
                    <div className="row">
                        <div className="col-lg-12">
                        <div className="reg-content">
                <div className="cont-header">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationReg}
                    onSubmit={this.handleSubmitEvent}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      setFieldValue,
                      setFieldTouched,
                      handleChange,
                      setErrors,
                    }) => (
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
                                          type="text"
                                          name="SFname"
                                          className={"form-control"}
                                        />
                                        {errors.SFname && touched.SFname ? (
                                          <div className="error text-left text-danger">
                                            {errors.SFname}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="SmobNo"
                                          className={"form-control"}
                                          // onChange={(e) => {
                                          //   this.checkNumberValidetion(
                                          //     e,
                                          //     setFieldTouched,
                                          //     setFieldValue,
                                          //     setErrors
                                          //   );
                                          // }}
                                        />
                                        {errors.SmobNo && touched.SmobNo ? (
                                          <div className="error text-left text-danger">
                                            {errors.SmobNo}
                                          </div>
                                        ) : null}
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
                                        <Field
                                          type="file"
                                          name="Studimagepath"
                                          className={"form-control"}
                                          accept="image/*"
                                          onChange={(event) =>
                                            this.fileChangedHandler(
                                              event,
                                              setFieldTouched,
                                              setFieldValue,
                                              setErrors
                                            )
                                          }
                                        />
                                        {errors.StudimagepathBase &&
                                        touched.StudimagepathBase ? (
                                          <div className="error text-left text-danger">
                                            {errors.StudimagepathBase}
                                          </div>
                                        ) : null}
                                        {this.state.StudimagepathBaseError != "" ? (
                                          <div className="error text-left text-danger">
                                            {this.state.StudimagepathBaseError}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="NamofInstitute"
                                          className={"form-control"}
                                        />
                                        {errors.NamofInstitute &&
                                        touched.NamofInstitute ? (
                                          <div className="error text-left text-danger">
                                            {errors.NamofInstitute}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="CourEnrolled"
                                          className={"form-control"}
                                        />
                                        {errors.CourEnrolled &&
                                        touched.CourEnrolled ? (
                                          <div className="error text-left text-danger">
                                            {errors.CourEnrolled}
                                          </div>
                                        ) : null}
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
                                          component="textarea"
                                          rows="4"
                                          name="SRaddress"
                                          className={"form-control"}
                                        />
                                        {errors.SRaddress && touched.SRaddress ? (
                                          <div className="error text-left text-danger">
                                            {errors.SRaddress}
                                          </div>
                                        ) : null}
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
                                          type="email"
                                          name="StudEmail"
                                          className={"form-control"}
                                        />
                                        {errors.StudEmail && touched.StudEmail ? (
                                          <div className="error text-left text-danger">
                                            {errors.StudEmail}
                                          </div>
                                        ) : null}
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
                                          type="date"
                                          name="StudDOB"
                                          className={"form-control"}
                                          onChange={(event) =>
                                            this.checkDate(
                                              event,
                                              setFieldTouched,
                                              setFieldValue,
                                              setErrors
                                            )
                                          }
                                        />
                                        {this.state.date_error_msg != "" ? (
                                          <div className="error text-left text-danger">
                                            {this.state.date_error_msg}
                                          </div>
                                        ) : null}
                                        {errors.StudDOB && touched.StudDOB ? (
                                          <div className="error text-left text-danger">
                                            {errors.StudDOB}
                                          </div>
                                        ) : null}
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
                                          component="textarea"
                                          rows="4"
                                          name="AdrsodInstitute"
                                          className={"form-control"}
                                        />
                                        {errors.AdrsodInstitute &&
                                        touched.AdrsodInstitute ? (
                                          <div className="error text-left text-danger">
                                            {errors.AdrsodInstitute}
                                          </div>
                                        ) : null}
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
                                        <Field
                                          type="file"
                                          name="Fatherimagepath"
                                          className={"form-control"}
                                          accept="image/*"
                                          onChange={(event) =>
                                            this.fileChangedHandler(
                                              event,
                                              setFieldTouched,
                                              setFieldValue,
                                              setErrors
                                            )
                                          }
                                        />
                                        {errors.FatherimagepathBase &&
                                        touched.FatherimagepathBase ? (
                                          <div className="error text-left text-danger">
                                            {errors.FatherimagepathBase}
                                          </div>
                                        ) : null}
                                        {this.state.FatherimagepathBaseError !=
                                        "" ? (
                                          <div className="error text-left text-danger">
                                            {this.state.FatherimagepathBaseError}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="FatherName"
                                          className={"form-control"}
                                        />
                                        {errors.FatherName && touched.FatherName ? (
                                          <div className="error text-left text-danger">
                                            {errors.FatherName}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="FatherOccu"
                                          className={"form-control"}
                                        />
                                        {errors.FatherOccu && touched.FatherOccu ? (
                                          <div className="error text-left text-danger">
                                            {errors.FatherOccu}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="FatherConNo"
                                          className={"form-control"}
                                        />
                                        {errors.FatherConNo &&
                                        touched.FatherConNo ? (
                                          <div className="error text-left text-danger">
                                            {errors.FatherConNo}
                                          </div>
                                        ) : null}
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
                                          type="email"
                                          name="FatherEmail"
                                          className={"form-control"}
                                        />
                                        {errors.FatherEmail &&
                                        touched.FatherEmail ? (
                                          <div className="error text-left text-danger">
                                            {errors.FatherEmail}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="FatherAnnInc"
                                          className={"form-control"}
                                        />
                                        {errors.FatherAnnInc &&
                                        touched.FatherAnnInc ? (
                                          <div className="error text-left text-danger">
                                            {errors.FatherAnnInc}
                                          </div>
                                        ) : null}
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
                                        <Field
                                          type="file"
                                          name="Motherimagepath"
                                          className={"form-control"}
                                          accept="image/*"
                                          onChange={(event) =>
                                            this.fileChangedHandler(
                                              event,
                                              setFieldTouched,
                                              setFieldValue,
                                              setErrors
                                            )
                                          }
                                        />
    
                                        {this.state.MotherimagepathBaseError !=
                                        "" ? (
                                          <div className="error text-left text-danger">
                                            {this.state.MotherimagepathBaseError}
                                          </div>
                                        ) : null}
                                        {errors.MotherimagepathBase &&
                                        touched.MotherimagepathBase ? (
                                          <div className="error text-left text-danger">
                                            {errors.MotherimagepathBase}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="MothersName"
                                          className={"form-control"}
                                        />
                                        {errors.MothersName &&
                                        touched.MothersName ? (
                                          <div className="error text-left text-danger">
                                            {errors.MothersName}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="MathersOccu"
                                          className={"form-control"}
                                        />
                                        {errors.MathersOccu &&
                                        touched.MathersOccu ? (
                                          <div className="error text-left text-danger">
                                            {errors.MathersOccu}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="MothersConNo"
                                          className={"form-control"}
                                        />
                                        {errors.MothersConNo &&
                                        touched.MothersConNo ? (
                                          <div className="error text-left text-danger">
                                            {errors.MothersConNo}
                                          </div>
                                        ) : null}
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
                                          type="email"
                                          name="MothersEmail"
                                          className={"form-control"}
                                        />
                                        {errors.MothersEmail &&
                                        touched.MothersEmail ? (
                                          <div className="error text-left text-danger">
                                            {errors.MothersEmail}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="BankAccHolder"
                                          className={"form-control"}
                                        />
                                        {errors.BankAccHolder &&
                                        touched.BankAccHolder ? (
                                          <div className="error text-left text-danger">
                                            {errors.BankAccHolder}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="BankBranch"
                                          className={"form-control"}
                                        />
                                        {errors.BankBranch && touched.BankBranch ? (
                                          <div className="error text-left text-danger">
                                            {errors.BankBranch}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="BankIFSC"
                                          className={"form-control"}
                                        />
                                        {errors.BankIFSC && touched.BankIFSC ? (
                                          <div className="error text-left text-danger">
                                            {errors.BankIFSC}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="BanckName"
                                          className={"form-control"}
                                        />
                                        {errors.BanckName && touched.BanckName ? (
                                          <div className="error text-left text-danger">
                                            {errors.BanckName}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="BrankAcctNo"
                                          className={"form-control"}
                                        />
                                        {errors.BrankAcctNo &&
                                        touched.BrankAcctNo ? (
                                          <div className="error text-left text-danger">
                                            {errors.BrankAcctNo}
                                          </div>
                                        ) : null}
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
                                        <Field
                                          type="file"
                                          name="Localimagepath"
                                          className={"form-control"}
                                          accept="image/*"
                                          onChange={(event) => {
                                            this.fileChangedHandler(
                                              event,
                                              setFieldTouched,
                                              setFieldValue,
                                              setErrors
                                            );
                                          }}
                                        />
                                        {errors.LocalimagepathBase &&
                                        touched.LocalimagepathBase ? (
                                          <div className="error text-left text-danger">
                                            {errors.LocalimagepathBase}
                                          </div>
                                        ) : null}
                                        {this.state.LocalimagepathBaseError !=
                                        "" ? (
                                          <div className="error text-left text-danger">
                                            {this.state.LocalimagepathBaseError}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="LocGuardName"
                                          className={"form-control"}
                                        />
                                        {errors.LocGuardName &&
                                        touched.LocGuardName ? (
                                          <div className="error text-left text-danger">
                                            {errors.LocGuardName}
                                          </div>
                                        ) : null}
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
                                          type="contact"
                                          name="LocGurdConNo"
                                          className={"form-control"}
                                        />
                                        {errors.LocGurdConNo &&
                                        touched.LocGurdConNo ? (
                                          <div className="error text-left text-danger">
                                            {errors.LocGurdConNo}
                                          </div>
                                        ) : null}
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
                                          type="text"
                                          name="RelWithLocGurd"
                                          className={"form-control"}
                                        />
                                        {errors.RelWithLocGurd &&
                                        touched.RelWithLocGurd ? (
                                          <div className="error text-left text-danger">
                                            {errors.RelWithLocGurd}
                                          </div>
                                        ) : null}
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
                                          component="textarea"
                                          rows="4"
                                          name="LocGurdAdres"
                                          className={"form-control"}
                                        />
                                        {errors.LocGurdAdres &&
                                        touched.LocGurdAdres ? (
                                          <div className="error text-left text-danger">
                                            {errors.LocGurdAdres}
                                          </div>
                                        ) : null}
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
                                        <Field
                                          type="file"
                                          name="ImgMaleApp1"
                                          className={"form-control"}
                                          accept="image/*"
                                          onChange={(event) => {
                                            this.fileCheckImageType(
                                              event,
                                              setFieldTouched,
                                              setFieldValue,
                                              setErrors
                                            );
                                          }}
                                        />
    
                                        {this.state.ImgMaleApp1Error != "" ? (
                                          <div className="error text-left text-danger">
                                            {this.state.ImgMaleApp1Error}
                                          </div>
                                        ) : null}
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
                                        <Field
                                          type="file"
                                          name="ImgMaleApp2"
                                          className={"form-control"}
                                          accept="image/*"
                                          onChange={(event) => {
                                            this.fileCheckImageType(
                                              event,
                                              setFieldTouched,
                                              setFieldValue,
                                              setErrors
                                            );
                                          }}
                                        />
                                        {this.state.ImgMaleApp2Error != "" ? (
                                          <div className="error text-left text-danger">
                                            {this.state.ImgMaleApp2Error}
                                          </div>
                                        ) : null}
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
                                        <Field
                                          type="file"
                                          name="ImgMaleApp3"
                                          className={"form-control"}
                                          accept="image/*"
                                          onChange={(event) => {
                                            this.fileCheckImageType(
                                              event,
                                              setFieldTouched,
                                              setFieldValue,
                                              setErrors
                                            );
                                          }}
                                        />
                                        {this.state.ImgMaleApp3Error != "" ? (
                                          <div className="error text-left text-danger">
                                            {this.state.ImgMaleApp3Error}
                                          </div>
                                        ) : null}
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
                                        <Field
                                          type="file"
                                          name="ImgFeMaleApp1"
                                          className={"form-control"}
                                          accept="image/*"
                                          onChange={(event) => {
                                            this.fileCheckImageType(
                                              event,
                                              setFieldTouched,
                                              setFieldValue,
                                              setErrors
                                            );
                                          }}
                                        />
                                        {this.state.ImgFeMaleApp1Error != "" ? (
                                          <div className="error error text-left text-danger">
                                            {this.state.ImgFeMaleApp1Error}
                                          </div>
                                        ) : null}
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
                                        <Field
                                          type="file"
                                          name="ImgFeMaleApp2"
                                          className={"form-control"}
                                          accept="image/*"
                                          onChange={(event) => {
                                            this.fileCheckImageType(
                                              event,
                                              setFieldTouched,
                                              setFieldValue,
                                              setErrors
                                            );
                                          }}
                                        />
                                        {this.state.ImgFeMaleApp2Error != "" ? (
                                          <div className="error error text-left text-danger">
                                            {this.state.ImgFeMaleApp2Error}
                                          </div>
                                        ) : null}
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
                                        <Field
                                          type="file"
                                          name="ImgFeMaleApp3"
                                          className={"form-control"}
                                          accept="image/*"
                                          onChange={(event) => {
                                            this.fileCheckImageType(
                                              event,
                                              setFieldTouched,
                                              setFieldValue,
                                              setErrors
                                            );
                                          }}
                                        />
                                        {this.state.ImgFeMaleApp3Error != "" ? (
                                          <div className="error error text-left text-danger">
                                            {this.state.ImgFeMaleApp3Error}
                                          </div>
                                        ) : null}
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
                                        {errors.food_preference &&
                                        touched.food_preference ? (
                                          <div className="error error text-left text-danger">
                                            {errors.food_preference}
                                          </div>
                                        ) : null}
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
                                          name="parking"
                                          component="select"
                                          className={"form-control"}
                                          autoComplete="off"
                                          onChange={(event) => {
                                            this.handleParkingChange(
                                              event,
                                              setFieldValue,
                                              setFieldTouched,
                                              setErrors
                                            );
                                          }}
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
                                            component="select"
                                            name="parking_type"
                                            className={"form-control"}
                                            // autoComplete="off"
                                            style={{ marginTop: "10px" }}
                                            onChange={(event) => {
                                              this.setState({
                                                parking_type_wheller:
                                                  event.target.value,
                                              });
                                              setFieldTouched("parking_type", true);
                                              setFieldValue(
                                                "parking_type",
                                                event.target.value
                                              );
                                            }}
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
    
                                        {errors.parking_type &&
                                        touched.parking_type ? (
                                          <div className="error error text-left text-danger">
                                            {errors.parking_type}
                                          </div>
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
                                        {errors.occupancy && touched.occupancy ? (
                                          <div className="error error text-left text-danger">
                                            {errors.occupancy}
                                          </div>
                                        ) : null}
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
                                          type="contact"
                                          name="StayConNo"
                                          className={"form-control"}
                                        />
                                        {errors.StayConNo && touched.StayConNo ? (
                                          <div className="error error text-left text-danger">
                                            {errors.StayConNo}
                                          </div>
                                        ) : null}
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
                                          type="contact"
                                          name="StayConNo1"
                                          className={"form-control"}
                                        />
                                        {errors.StayConNo1 && touched.StayConNo1 ? (
                                          <div className="error error text-left text-danger">
                                            {errors.StayConNo1}
                                          </div>
                                        ) : null}
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
                                        {errors.room_type && touched.room_type ? (
                                          <div className="error error text-left text-danger">
                                            {errors.room_type}
                                          </div>
                                        ) : null}
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
                                        {errors.toilet_type &&
                                        touched.toilet_type ? (
                                          <div className="error error text-left text-danger">
                                            {errors.toilet_type}
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <div className="row">
                                      <div className="col-lg-4">
                                        <label htmlFor="transportation">
                                        Do you want to use hostel's transportation for travelling? *
                                        </label>
                                      </div>
                                      <div className="col-lg-8">
                                        <Field
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
                                        {errors.transportation &&
                                        touched.transportation ? (
                                          <div className="error error text-left text-danger">
                                            {errors.transportation}
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <div className="row">
                                      <div className="col-lg-4">
                                        <label htmlFor="paymentoption">
                                        Payment *
                                        </label>
                                      </div>
                                      <div className="col-lg-8">
                                        <Field
                                          name="paymentoption"
                                          component="select"
                                          className={"form-control"}
                                          onClick={this.changePaymentOption}
                                        >
                                          <option value="" selected>
                                            Default select
                                          </option>
                                          <option value="Online">Online</option>                                      
                                          <option value="Offline">Offline</option>
                                        </Field>
                                        {errors.paymentoption &&
                                        touched.paymentoption ? (
                                          <div className="error error text-left text-danger">
                                            {errors.paymentoption}
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                  
                                        {this.state.showTransaction ? (
                                            <div id="toshow1" className="form-group">
                                              <div className="row">
                                                <div className="col-lg-4">
                                                  <label htmlFor="transactionid" style={{ color: "#333333" }}>
                                                  Transaction ID 
                                                  </label>
                                                </div>
                                                <div className="col-lg-8">
                                                  <Field
                                                    type="text"
                                                    name="transactionid"
                                                    className={"form-control"}
                                                  />
                                                  {errors.transactionid &&
                                                  touched.transactionid ? (
                                                    <div className="error error text-left text-danger">
                                                      {errors.transactionid}
                                                    </div>
                                                  ) : null}
                                                </div>
                                              </div>
                                            </div>
                                        ) : null}
    
                                        {this.state.showTransaction ? (
                                            <div id="toshow2" className="form-group">
                                            <div className="row">
                                              <div className="col-lg-4">
                                                <label htmlFor="transactiondate" style={{ color: "#333333" }}>
                                                Transaction Date 
                                                </label>
                                              </div>
                                              <div className="col-lg-8">                                       
                                                <Field
                                                  type="date"
                                                  name="transactiondate"
                                                  className={"form-control"}
                                                    onChange={(event) =>
                                                      this.checkDate(
                                                        event,
                                                        setFieldTouched,
                                                        setFieldValue,
                                                        setErrors
                                                      )
                                                    }
                                              />
                                                {errors.transactiondate &&
                                                touched.transactiondate ? (
                                                  <div className="error error text-left text-danger">
                                                    {errors.transactiondate}
                                                  </div>
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                        ) : null}
    
    
                                        {this.state.showTransaction ? (
                                            <div id="toshow3" className="form-group">
                                            <div className="row">
                                              <div className="col-lg-4">
                                                <label htmlFor="transactionbank" style={{ color: "#333333" }}>
                                                  Bank Name 
                                                </label>
                                              </div>
                                              <div className="col-lg-8">                                       
                                                <Field
                                                  type="text"
                                                  name="transactionbank"
                                                  className={"form-control"}
                                              />
                                                {errors.transactionbank &&
                                                touched.transactionbank ? (
                                                  <div className="error error text-left text-danger">
                                                    {errors.transactionbank}
                                                  </div>
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                        ) : null}
                                     
                                      
    
                                       
                                </div>
                              </div>
                            </form>
                          </div>
                          <div className="footer">
                            {errors.check && touched.check ? (
                              <div className="error error text-left text-danger">
                                {errors.check}
                              </div>
                            ) : null}
                            <Field type="checkbox" name="check" value="checked" />
    
                            <label for="checkbox">We understand that</label>
                            <p>- Room allocation is based on availability.</p>
                            <p>
                              - The decision of the President, Secretary and / or
                              the Warden will be considered final in all matters
                              regarding policies and rules and regulations of the
                              hostel.
                            </p>
                            <p>
                              - If admission is granted, we agree to abide by the
                              rules and regulations of the hostel.
                            </p>
                            <div className="footer-button">
                              <button
                                type="submit"
                                style={{
                                  padding: "8px 18px 8px 18px",
                                  borderRadius: "0.375rem",
    
                                  fontSize: "16px",
                                  color: "#fff",
                                  backgroundColor: "#883495",
                                  borderColor: "#883495",
                                  boxShadow:
                                    "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%",
                                }}
                              >
                                Submit
                              </button>
                            </div>
                            <div style={{ marginBottom: "3%" }}>
                              <span>
                                View{" "}
                                <a
                                  href="https://www.ranimeyyammaihostel.org/wp-content/uploads/2022/06/RMH_rules_and_regulations.pdf"
                                  target="_blank"
                                >
                                  Rules and Regulations
                                </a>{" "}
                                of Hostel
                              </span>
                              <span>
                                <b>Note:</b> Filling the form is to furnish your
                                details and share your preferences. Admission is not
                                guaranteed until completion of the process.
                              </span>
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
                        </div>
                    </div>
                </section>
            </Layout>
            
          </>
        );
      }
}

const mapStateToProps = (state) => {
    return {
      ...state,
    };
  };
  
  export default withRouter(connect(mapStateToProps)(AddStudent));
//export default AddStudent;
