import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import "./masterdata.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

let initialValues = {
  building_name: "",
  floor: "",
  room_number: "",
  room_type: "",
  occupancy: "",
  toilet_type: "",
};

class AddRomm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_error: "",
      success: "",
      show_buliding: false,
      building_name: "",
      building_id: "",
      building_dta: [],
      floor_list: [],
      singel_building: [],
      room_number_aloted: false,
    };
  }
  // api get call for building
  componentDidMount() {
    API.get(`admin/secure/building`)
      .then((response) => {
        this.setState({ building_dta: response.data.result_data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleSubmitEvent = (values, { resetForm }) => {
    values.building_name = this.state.building_name;
    values.building_id = this.state.building_id;
    API.post("/admin/secure/create/room", values)
      .then((response) => {
        console.log(response);
        if (response.data.status === 201) {
          swal("Success", response.data.message, "success");
          resetForm(initialValues);
          this.setState({ show_buliding: false });
          this.setState({ singel_building: [] });
          this.setState({ room_number_aloted: false });
        }
        if (response.data.status === 401) {
          swal("Warning", response.data.message, "warning");
          // formik warning
          // resetForm(initialValues);
          // this.setState({ show_buliding: false });
          //this.setState({ singel_building: [] });
          this.setState({ room_number_aloted: true });
        }
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response.data.status == 401 ||
          error.response.data.status == 400
        ) {
          swal("Error", error.response.data.message, "error");
          resetForm(initialValues);
        }
      });
  };
  changeBlock = (e) => {
    // check target value is not empty

    if (e.target.value !== "") {
      let singel_building = this.state.building_dta.filter(
        (item) => item.id == e.target.value
      );
      this.setState({ singel_building: singel_building });
      this.setState({ show_buliding: true });
      let building_name = this.state.building_dta.filter(
        (item) => item.id == e.target.value
      )[0].building_name;
      this.setState({ building_name: building_name });
      this.setState({ building_id: e.target.value });
      let floor_list_filter = this.state.building_dta.filter(
        (item) => item.id == e.target.value
      )[0].floor_list;
      // push the floor number in floor_list
      let floor_list = [];
      floor_list_filter.map((item) => {
        floor_list.push(item.floor_number);
      });
      this.setState({ floor_list: floor_list });
    } else {
      this.setState({ show_buliding: false });
      this.setState({ singel_building: [] });
    }
  };

  render() {
    const validateRoom = Yup.object().shape({
      building_name: Yup.string().required("Building Name is required"),
      floor: Yup.string().required("Floor is required"),
      room_number: Yup.string().required("Room Number is required"),
      room_type: Yup.string().required("Room Type is required"),
      occupancy: Yup.string().required("Occupancy is required"),
      toilet_type: Yup.string().required("Toilet Type is required"),
    });
    if (
      this.props.auth.userToken.permissions.master_data_management == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      return (
        <Layout {...this.props}>
          <div className="content-wrapper">
            <section className="content-header">
              <Formik
                initialValues={initialValues}
                validationSchema={validateRoom}
                onSubmit={this.handleSubmitEvent}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="row">
                      <h3 className="card-title">
                        <span className="sp1">Home /</span>
                        <span className="sp1"> Master Data /</span>
                        <span className="sp2"> Add Room</span>
                      </h3>
                      <div className="col-lg-10 card card-m-l pty-30">
                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="building_name">
                                Building Name
                              </label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                component="select"
                                autoComplete="off"
                                name="building_name"
                                className={"form-control"}
                                onClick={this.changeBlock}
                              >
                                <option key="-1" value="">
                                  Default Select
                                </option>
                                {this.state.building_dta &&
                                  this.state.building_dta.map((building, i) => (
                                    <option value={building.id} key={i}>
                                      {building.building_name}
                                    </option>
                                  ))}
                              </Field>

                              {errors.building_name && touched.building_name ? (
                                <div className="text-danger">
                                  {errors.building_name}
                                </div>
                              ) : null}
                            </div>
                            <div className="col-lg-5">
                              {this.state.show_buliding ? (
                                <Field
                                  name="building_id"
                                  type="text"
                                  className="form-control"
                                  value={this.state.building_name}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="floor">Floor</label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                name="floor"
                                component="select"
                                autoComplete="off"
                                className="form-control"
                              >
                                <option key="-1" value="">
                                  Default Select
                                </option>
                                {this.state.floor_list &&
                                  this.state.floor_list.map((floor, i) => (
                                    <option value={floor} key={i}>
                                      {floor}
                                    </option>
                                  ))}
                              </Field>
                              {errors.floor && touched.floor ? (
                                <div className="text-danger">
                                  {errors.floor}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="room_number">Room Number</label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                name="room_number"
                                type="number"
                                className="form-control"
                                placeholder="123"
                              />
                              {errors.room_number && touched.room_number ? (
                                <div className="text-danger">
                                  {errors.room_number}
                                </div>
                              ) : null}
                              {this.state.room_number_aloted ? (
                                <div className="text-danger">
                                  "Room Number Already Aloted"
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="room_type">Room Type</label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                name="room_type"
                                component="select"
                                autoComplete="off"
                                className="form-control"
                              >
                                <option value="">Default Select</option>
                                <option value="AC">AC</option>
                                <option value="Non-AC">Non-AC</option>
                              </Field>
                              {errors.room_type && touched.room_type ? (
                                <div className="text-danger">
                                  {errors.room_type}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="row form-m-t">
                          <div className="form-group">
                            <div className="col-lg-2">
                              <label htmlFor="occupancy">Occupancy</label>
                            </div>
                            <div className="col-lg-5">
                              <Field
                                name="occupancy"
                                component="select"
                                autoComplete="off"
                                className="form-control"
                              >
                                <option value="">Default Select</option>
                                <option value="2 in 1">2 in 1</option>
                                <option value="3 in 1">3 in 1</option>
                                <option value="4 in 1">4 in 1</option>
                                <option value="5 in 1">5 in 1</option>
                                <option value="6 in 1">6 in 1</option>
                                <option value="7 in 1">7 in 1</option>
                                {/*   <option value="2 in 1 AC">2 in 1 AC</option>
                              <option value="3 in 1 AC">3 in 1 AC</option>
                              <option value="4 in 1 AC">4 in 1 AC</option>
                              <option value="5 in 1 AC">5 in 1 AC</option>
                              <option value="6 in 1 AC">6 in 1 AC</option>
                              <option value="7 in 1 AC">7 in 1 AC</option> */}
                              </Field>
                              {errors.occupancy && touched.occupancy ? (
                                <div className="text-danger">
                                  {errors.occupancy}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="row form-m-t">
                          <div className="col-lg-2">
                            <label htmlFor="toilet_type">Toilet Type</label>
                          </div>
                          <div className="col-lg-5">
                            <div className="form-group">
                              <Field
                                name="toilet_type"
                                component="select"
                                autoComplete="off"
                                className="form-control"
                              >
                                <option value="">Default Select</option>
                                <option value="Attached">Attached</option>
                                <option value="Common">Common</option>
                              </Field>
                              {errors.toilet_type && touched.toilet_type ? (
                                <div className="text-danger">
                                  {errors.toilet_type}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="row form-m-t form-p-b">
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
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </section>
            <section className="card-m-l form-m-t">
              <div className="card col-lg-10">
                <div className="row">
                  {this.state.singel_building.length > 0 &&
                  this.state.singel_building[0].floor_list.length > 0
                    ? this.state.singel_building[0].floor_list.map(
                        (floor, i) => (
                          <div className="col-lg-5" key={i}>
                            <h4>Floor {floor.floor_number}</h4>
                            <div className="row m-4">
                              {floor.room_list.map((room, i) => (
                                <div
                                  key={i}
                                  className="card-m-t col-sm-1 m-4"
                                  style={{
                                    width: "150px",
                                    height: "170px",
                                    backgroundColor:
                                      room.Is_alloted === 1
                                        ? "#ff3e1d"
                                        : "#71dd37",
                                    textAlign: "center",
                                    paddingTop: "5px",
                                  }}
                                >
                                  <p
                                    style={{
                                      fontSize: "13px",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      marginTop: "5px",
                                      color: "white",
                                    }}
                                  >
                                    Room Number {room.room_number}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: "13px",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      marginTop: "5px",
                                      color: "white",
                                    }}
                                  >
                                    {" "}
                                    Available Room Type {room.room_type}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: "13px",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      marginTop: "5px",
                                      color: "white",
                                    }}
                                  >
                                    {" "}
                                    Occupancy {room.occupancy}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: "13px",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      marginTop: "5px",
                                      color: "white",
                                    }}
                                  >
                                    {" "}
                                    Toilet Type {room.toilet_type}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: "13px",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      marginTop: "5px",
                                      color: "white",
                                    }}
                                  >
                                    {room.student_id !== null ? (
                                      <span>
                                        {" "}
                                        Student Id: {room.student_id}
                                      </span>
                                    ) : null}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )
                    : null}
                </div>
              </div>
            </section>
          </div>
        </Layout>
      );
    } else {
      return <Redirect to="/admin/dashboard" />;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(AddRomm));
