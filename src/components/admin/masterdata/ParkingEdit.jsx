import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import userLog from "../Utils/Logadd";



let initialValues = {
 
  building_id: "",
  no_of_slot: "",
};

class ParkingEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_error: "",
      success: "",
      building_dta: [],
      parkingDetails: [],
    };
  }
  // get params id from url
  componentDidMount() {
    const { id } = this.props.match.params;
    API.get(`admin/secure/building`)
      .then((response) => {
        this.setState({ building_dta: response.data.result_data });
      })
      .catch((error) => {
        console.log(error);
      });

      this.fetchParkingDetails(id);


      // API.get(`admin/secure/edit/parking/${id}`)
      // .then((response) => {
      //   this.setState({
      //     parkingDetails: response.data.result[0],
      //   });
      // })
      // .catch((error) => {
      //   console.log(error);
      // });
  };


  fetchParkingDetails = (id) => {
    API.get(`admin/secure/edit/parking/${id}`)
      .then((response) => {
        this.setState({
          parkingDetails: response.data.result[0],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };


  handleSubmitParking = (values, { resetForm }) => {
   
    values.id  = decodeURIComponent(this.props.match.params.id);

    API.post("/admin/secure/edit/parking", values)
      .then((response) => {
        if (response.data.status === 201) {
          swal("Success", response.data.message, "success");
          //userLog('Add Parking','Add Parking');
          //resetForm(initialValues);
          this.fetchParkingDetails(values.id);
        }
        if (response.data.status === 401) {
          swal("Error", response.data.message, "error");
          //resetForm(initialValues);
          this.fetchParkingDetails(values.id);
        }
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response.data.status == 401 ||
          error.response.data.status == 400
        ) {
          swal("Error", error.response.data.message, "error");
          //resetForm(initialValues);
          this.fetchParkingDetails(values.id);
        }
      });
    
  };



  render() {

    const { parkingDetails } = this.state;
    const newInitialValues = Object.assign(initialValues, {
      building_id: parkingDetails.parking_name ? parkingDetails.id : "",
      no_of_slot: parkingDetails.no_of_slot ? parkingDetails.no_of_slot : "",
     
    });


    const parkingSchema = Yup.object().shape({
      building_id: Yup.string().required("Building Name is required"),
      //parking_slot: Yup.number().required("Parking slot is required"),
      no_of_slot: Yup.number().required("Parking slot is required"),
    
    });
    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <div className="row ">
              <h3 className="card-title">
                <span className="sp1">Home /</span>
                <span className="sp1"> Master Data /</span>
                <span className="sp2"> Edit Parking</span>
              </h3>
              <div className="col-lg-10 card card-m-l pty-30">
                <div className="card-header"></div>
                <div className="card-body">
                  <Formik
                        enableReinitialize={true}  
                        initialValues={{
                          building_id: parkingDetails.id || "",
                       
                          no_of_slot: parkingDetails.no_of_slot || "",
                       
                        }}
                        validationSchema={parkingSchema}
                        onSubmit={this.handleSubmitParking}
                      >
                    {({ errors, touched }) => (
                      <Form>
                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="building_id">
                                Building Name
                              </label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                component="select"
                                autoComplete="off"
                                name="building_id"
                                className={"form-control"}
                                defaultValue={this.state.parkingDetails
                                  .id}
                                onClick={this.changeBlock}
                              >
                                <option key="-1" value="">
                                  Default Select
                                </option>
                                {this.state.building_dta &&
                                  this.state.building_dta.map(
                                    (building, i) => (
                                      <option
                                        value={building.id}
                                        key={i}
                                      >
                                        {building.building_name}
                                      </option>
                                    )
                                  )}
                              </Field>
                              {errors.building_id &&
                              touched.building_id ? (
                                <div className="text-danger">
                                  {errors.building_id}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>



                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="no_of_slot">Parking Slot</label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                type="number"
                                name="no_of_slot"
                                className="form-control"
                                placeholder="Enter Parking Slot"
                              />
                              {errors.no_of_slot && touched.no_of_slot ? (
                                <div className="text-danger">{errors.no_of_slot}</div>
                              ) : null}
                            </div>
                          </div>
                        </div>


                        {/* <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="no_of_slot_four">
                                Parking Slot Four wheeler
                              </label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                type="number"
                                name="no_of_slot_four"
                                className="form-control"
                                placeholder="Enter Parking Slot"
                              />
                              {errors.no_of_slot_four && touched.no_of_slot_four ? (
                                <div className="text-danger">
                                  {errors.no_of_slot_four}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div> */}


                        <div className="row form-m-t form-p-b">
                          <div className="form-group">
                            <div className="col-lg-2"></div>
                            <div className="col-lg-5">
                              <button
                                type="submit"
                                style={{
                                  padding: "8px 18px 8px 18px",
                                  borderRadius: "0.375rem",
                                  marginLeft: "-43%",
                                  fontSize: "16px",
                                  color: "#fff",
                                  backgroundColor: "#883495",
                                  borderColor: "#883495",
                                  boxShadow:
                                    "0 0.125rem 0.25rem 0 rgb(105 108 255 / 40%",
                                }}
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    );
  }
}

export default ParkingEdit;
