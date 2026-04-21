import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import sampleexcel from "../../../assets/images/postpaid.xlsx";
import * as Yup from "yup";
import userLog from "../Utils/Logadd";

let initialValues = {
  bulkuploadDoc: "",
  BankimagepathBase: "",
};

class PostPaidBulkUpload extends Component {

  constructor(props) {
    const planid = decodeURIComponent(props.match.params.id);
    super(props);
    this.state = {
      server_error: "",
      success: "",
      isValidFile: false,
    
      bulkuploadDoc: "",
    
      setFileErrors: "",
    };

    this.fileChangedHandler = this.fileChangedHandler.bind(this);
  
  }

  componentDidMount() {
    

  }


  fileChangedHandler = (event, setFieldTouched, setFieldValue, setErrors) => {

    const { value: file_name } = event.target;
    setFieldTouched("bulkuploadDoc");
    setFieldValue("bulkuploadDoc", file_name);
  
    const SUPPORTED_FORMATS = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
    
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
      if (event.target.files[0].size < 5242880) { // Keep the 5 MB limit
        reader.onload = () => {
          this.setState(
            {
              setFileErrors: "",
              bulkuploadDoc: reader.result,
              isValidFile: true,
            },
            () => {
              setFieldValue("bulkuploadDoc", file_name);
            }
          );
        };
      } else {
        this.setState({
          setFileErrors: "File size must be less than 5 MB",
          isValidFile: false,
        });
      }
  
      reader.onerror = (error) => {
        console.log("Error: ", error);
      };
    } else {
      this.setState({
        bulkuploadDoc: "",
        isValidFile: false,
        setFileErrors: "Only Excel files are supported",
      });
    }
  };


  submitPostPaid = (values, { setSubmitting }) => {
   
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to update this student's payment",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSet) => {
      if (willSet) {
        this.handleBulkUpload(values);
      }
    });
  };

  handleBulkUpload = (values, actions) => {
    
    let postData = {
      bulkuploadDoc: this.state.bulkuploadDoc,
    };


    if (this.state.bulkuploadDoc) {
      if (this.state.bulkuploadDoc.size > 1000) {
        actions.setErrors({ file: "file size must be less than 5 mb" });
        actions.setSubmitting(false);
      } else {
        postData = { ...postData, StudimagepathBase: this.state.file };

          //console.log('postData',postData);

         API.post(`/admin/un/secure/uploadbulkpostpaid`, postData)
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

      bulkuploadDoc: Yup.mixed().required("File is required"),
    });

    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <Formik
                initialValues={initialValues}
                validationSchema={validateRoom}
                onSubmit={this.submitPostPaid}
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
                        <span className="sp2">Bulk Upload</span>
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
                            <div className="col-lg-4 col-md-4 male-panel">
                              <label htmlFor="bulkuploadDoc">
                                Referance Document
                              </label>
                            </div>
                            <div className="col-lg-8 mb-1">
                              <Field
                                type="file"
                                name="bulkuploadDoc"
                                className={"form-control"}
                                accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                onChange={(e) => {
                                  this.fileChangedHandler(
                                    e,
                                    setFieldTouched,
                                    setFieldValue,
                                    setErrors
                                  );
                                }}
                              />

                              {touched.bulkuploadDoc && errors.bulkuploadDoc ? (
                                <div className="error text-left text-danger">{errors.bulkuploadDoc}</div>
                              ) : null}

                            {this.state.setFileErrors != "" ? (
                                                            <div className="text-danger">
                                                              {this.state.setFileErrors}
                                                            </div>
                                                          ) : null}

                                <a
                                  href={sampleexcel} // Change this to your file path
                                  download
                                  style={{
                                    color: '#883495',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                  }}
                                 
                                >
                                  Download Sample Excel Template
                                </a>
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

export default PostPaidBulkUpload;
