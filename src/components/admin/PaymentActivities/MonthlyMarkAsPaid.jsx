import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import userLog from "../Utils/Logadd";

let initialValues = {
  offline_payment_type: "",
  offline_payment_date: "",
  offline_payment_ref_dtl: "",
  offline_payment_amout: "",
  offline_payment_document: "",
  BankimagepathBase: "",
};

class MonthlyMarkAsPaid extends Component {
  constructor(props) {
    const planid = decodeURIComponent(props.match.params.id);
    super(props);
    this.state = {
      server_error: "",
      success: "",
      isValidFile: false,
      offline_payment_type: "",
      offline_payment_date: "",
      offline_payment_ref_dtl: "",
      offline_payment_amout: "",
      offline_payment_document: "",
      planDetail: [],
      setFileErrors: "",
    };

    this.fileChangedHandler = this.fileChangedHandler.bind(this);
  
  }

  componentDidMount() {
    let planid = decodeURIComponent(this.props.match.params.id);
  
    API.get(`/admin/secure/plan/get_plandtl/${planid}`)
    .then((res) => {
      this.setState({
        planDetail: res.data.result[0]

      });
    })
      .catch((err) => {
        console.log("err:", err);
        //showErrorMessage(err, this.props);
    });

  }


  fileChangedHandler = (event, setFieldTouched, setFieldValue, setErrors) => {
    const { value: file_name } = event.target;
    setFieldTouched("offline_payment_document");
    setFieldValue("offline_payment_document", file_name);

    const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg"];
    if (!event.target.files[0]) {
      this.setState({
        file: "",
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
          this.setState(
            {
              setFileErrors: "",
              offline_payment_document: reader.result,
              isValidFile: true,
            },
            () => {
              setFieldValue("offline_payment_document", file_name);
            }
          );
        };
      } else {
        this.setState({
          setFileErrors: "Image size must be less than 5 mb",
          isValidFile: false,
        });
      }

      reader.onerror = (error) => {
        console.log("Error: ", error);
      };
    } else {
      this.setState({
        offline_payment_document: "",
        isValidFile: false,
      });
    }
  };


  submitOffline = (values, { setSubmitting }) => {
   
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to update this student's payment",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSet) => {
      if (willSet) {
        this.handleOffiline(values);
      }
    });
  };

  handleOffiline = (values, actions) => {
    
    let postData = {
      plan_id: decodeURIComponent(this.props.match.params.id),
      offline_payment_type: values.offline_payment_type,
      offline_payment_date: values.offline_payment_date,
      offline_payment_ref_dtl: values.offline_payment_ref_dtl,
      offline_payment_amout: values.offline_payment_amout,
      offline_payment_document: this.state.offline_payment_document,
    };


    if (this.state.offline_payment_document) {
      if (this.state.offline_payment_document.size > 1000) {
        actions.setErrors({ file: "file size must be less than 5 mb" });
        actions.setSubmitting(false);
      } else {
        postData = { ...postData, StudimagepathBase: this.state.file };

      

         API.post(`/admin/secure/plan/update_offline_paymentdtl/${postData.plan_id}`, postData)
          .then((res) => {
            swal("Success", res.data.message, "success");
            this.props.history.push("/admin/monthly_activities");
          })
          .catch((err) => {
            console.log("err:", err);

          });
       
      }
    }
  };



  render() {

    const validateRoom = Yup.object().shape({
      offline_payment_type: Yup.string().required("Payment Type is required"),
      offline_payment_date: Yup.string().required("Payment Date is required"),
      offline_payment_ref_dtl: Yup.string().required("Payment Ref is required"),
      // offline_payment_amout: Yup.number()
      //   .required('The number is required!')
      //   .test('Is positive?', 'ERROR: The number must be Positive!', (value) => value >= 0),
     
      offline_payment_document: Yup.mixed().required("File is required"),
    });

    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <Formik
                initialValues={initialValues}
                validationSchema={validateRoom}
                onSubmit={this.submitOffline}
            >
              {({ values,
                      errors,
                      touched,
                      isValid,
                      isSubmitting,
                      setFieldValue,
                      setFieldTouched,
                      handleChange,
                      setErrors }) => (
                <Form>
                  <>
                    <div className="row">
                      <h3 className="card-title">
                        <span className="sp1">Home /</span>
                        <span className="sp1"> Payment History /</span>
                        <span className="sp2"> Mark as Paid</span>
                      </h3>
                      <div
                        className="col-lg-8 card card-m-l pty-30"
                        style={{
                          width: "97%",
                          //   marginLeft: "16%",
                          // marginRight: "10%",
                          // marginLeft:"3%"
                        }}
                      >



                        <div className="row form-m-t">
                          {/* <div className="form-group"> */}


                            <div className="col-lg-4">
                              <label htmlFor="offline_payment_type">Select Payment Type</label>
                            </div>
                            <div className="col-lg-8">
                              <Field
                                component="select"
                                autoComplete="off"
                                name="offline_payment_type"
                                className={"form-control"}
                                onChange={(e) => {
                                  setFieldValue("offline_payment_type", e.target.value);
                                }}
                              >
                                <option defaultValue="" selected>
                                  Default select
                                </option>
                                <option value="UPI">UPI</option>
                                <option value="NEFT/RTGS" >NEFT/RTGS </option>
                                <option value="Card">Card</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Cash">Cash</option>

                              </Field>

                              {errors.offline_payment_type && touched.offline_payment_type ? (
                                <div className="text-danger">
                                  {errors.offline_payment_type}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="row form-m-t">

                            <div className="col-lg-4">
                              <label htmlFor="offline_payment_date">
                                Payment date
                              </label>
                            </div>
                            <div className="col-lg-8">
                              <Field
                                type="date"
                                name="offline_payment_date"
                                className={"form-control"}

                              />
                              {this.state.date_error_msg != "" ? (
                                <div className="error text-left text-danger">
                                  {this.state.date_error_msg}
                                </div>
                              ) : null}
                              {errors.offline_payment_date && touched.offline_payment_date ? (
                                <div className="error text-left text-danger">
                                  {errors.offline_payment_date}
                                </div>
                              ) : null}
                            </div>
                          </div>


                          <div className="row form-m-t">
                            <div className="col-lg-4">
                              <label htmlFor="offline_payment_ref_dtl">
                                Payment Referance Detail
                              </label>
                            </div>
                            <div className="col-lg-8">
                              <Field
                                type="text"
                                name="offline_payment_ref_dtl"
                                className={"form-control"}
                              />
                              {errors.offline_payment_ref_dtl && touched.offline_payment_ref_dtl ? (
                                <div className="error text-left text-danger">
                                  {errors.offline_payment_ref_dtl}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          
                          <div className="row form-m-t">
                            <div className="col-lg-4">
                              <label htmlFor="offline_payment_amout">
                                Payment Amount
                              </label>
                            </div>

                            <div className="col-lg-8">
                              <Field
                                 readOnly
                                 type="number"
                                 min="1"
                                 name="offline_payment_amout"
                                 className={"form-control"}
                                 value={this.state.planDetail.to_pay}
                              />
                              {errors.offline_payment_amout && touched.offline_payment_amout ? (
                                <div className="error text-left text-danger">
                                  {errors.offline_payment_amout}
                                </div>
                              ) : null}
                            </div>
                          </div>


                          <div className="row form-m-t">
                            <div className="col-lg-4 col-md-4 male-panel">
                              <label htmlFor="offline_payment_document">
                                Referance Document
                              </label>
                            </div>
                            <div className="col-lg-8 mb-1">
                              <Field
                                type="file"
                                name="offline_payment_document"
                                className={"form-control"}
                                accept="image/*"
                                onChange={(e) => {
                                  this.fileChangedHandler(
                                    e,
                                    setFieldTouched,
                                    setFieldValue,
                                    setErrors
                                  );
                                }}
                              />

                              {touched.offline_payment_document && errors.offline_payment_document ? (
                                <div className="error text-left text-danger">{errors.offline_payment_document}</div>
                              ) : null}

                            {this.state.setFileErrors != "" ? (
                                                            <div className="text-danger">
                                                              {this.state.setFileErrors}
                                                            </div>
                                                          ) : null}
                            </div>
                          </div>




                            <div className="form-group">
                              
                            <button
                                  type="submit"
                                  style={{
                                    padding: '8px 18px',
                                    borderRadius: '0.375rem',
                                    fontSize: '16px',
                                    color: '#fff',
                                    backgroundColor: '#883495',
                                    borderColor: '#883495',
                                    boxShadow: '0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%)',
                                  }}
                                >
                                  Save
                                </button>
                            </div>
                          {/* </div> */}
                        </div>

                        <br></br>
                      </div>
                    
                  </>
                </Form>
              )}
            </Formik>
          </section>
        </div>
      </Layout>
    );
  }
}

export default MonthlyMarkAsPaid;
