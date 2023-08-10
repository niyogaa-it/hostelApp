import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";

let initialValues = {
  room_no: "",
};

class AssignRoom extends Component {
  constructor(props) {
    const studentid = decodeURIComponent(props.match.params.id);
    super(props);
    this.state = {
      server_error: "",
      success: "",
      room_no: "",
      roomData: [],
    };
  }

  componentDidMount() {
    let data = {
      student_id: decodeURIComponent(this.props.match.params.id)
    };
    
    API.post("/admin/secure/plan/get_room_values", data)
      .then((response) => {
        if (response.data.status === 200) {
          this.setState({
            roomData: response.data.rooms_data,
          });
        } else {
          swal("Warning", response.data.message, "warning");
        }        
      })
      .catch((error) => {
        swal("Error", error, "warning");
      });
  }

  submitRoom = (values, amount) => {
    swal({
      closeOnClickOutside: false,
      title: "Are you sure?",
      text: "You want to update this student's room",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSet) => {
      if (willSet) {
        this.handleEditRoomPlan(values, amount);
      }
    });
  };

  handleEditRoomPlan = (values, amount) => {
    //return true;
    let postData = {
      student_id: decodeURIComponent(this.props.match.params.id),
      room_no: values.room_no
    };

    API.post("/admin/secure/create/student/assign_room", postData)
      .then((response) => {
        if (response.data.status === 201) {
          swal("Success", response.data.message, "success");
          this.props.history.push("/admin/view_student/");
        }
        if (response.data.status === 401) {
          swal("Warning", response.data.message, "warning");
          this.componentDidMount();
        }
      })
      .catch((error) => {
        swal("Error", error, "warning");
      });
  };

  

  render() {
    const validateRoom = Yup.object().shape({
      room_no: Yup.string().required("Please select a room"),
    });

    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <Formik
              initialValues={initialValues}
              validationSchema={validateRoom}
              //onSubmit={this.handleSubmitEvent}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form>
                  <>
                    <div className="row">
                      <h3 className="card-title">
                        <span className="sp1">Home /</span>
                        <span className="sp1"> Student /</span>
                        <span className="sp2"> Assign Room</span>
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
                        

                        {this.state.roomData.length > 0 ? (
                          <>
                            <div className="row form-m-t">
                              <div className="form-group">
                                <div className="col-lg-2">
                                  <label htmlFor="room_no">Select Room</label>
                                </div>
                                <div className="col-lg-8">
                                  <Field
                                    component="select"
                                    autoComplete="off"
                                    name="room_no"
                                    className={"form-control"}
                                    onChange={(e) => {
                                      setFieldValue("room_no", e.target.value);
                                    }}
                                  >
                                    <option key="-1" value="">
                                      Default Select
                                    </option>
                                    {this.state.roomData.map((item, i) => (
                                      <option value={item.room_number} key={i}>
                                        Room No: {item.room_number} (Building:{" "}
                                        {item.building_name}, Toilet Type:{" "}
                                        {item.toilet_type}, Occupancy:{" "}
                                        {item.occupancy}, Room Type:{" "}
                                        {item.room_type}, Vaccancy:{" "}
                                        {item.vaccancy}, Floor: {item.floor} )
                                      </option>
                                    ))}
                                  </Field>

                                  {errors.room_no && touched.room_no ? (
                                    <div className="text-danger">
                                      {errors.room_no}
                                    </div>
                                  ) : null}
                                </div>

                                <div style={{ marginLeft: "50%" }}>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        this.submitRoom(
                                          values,
                                          0
                                        );
                                      }}
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
                                      Allocate Room
                                    </button>
                                  </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                        <br></br>
                      </div>
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

export default AssignRoom;
