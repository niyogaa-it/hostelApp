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

class EditRomm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_error: "",
      success: "",
      show_buliding: false,
      building_name: "",
      building_id: "",
      floor_id: "",
      building_dta: [],
      floor_list: [],
      singel_building: [],
      room_number_aloted: false,
      room_details: [],
      room_list: [],
      room_type: [],
      occupancy_lists: [],
      toilet_type_lists: [],
      room_number_lists: [],
      room_info: null,
    };
  }
  // api get call for building
  componentDidMount() {
    API.get(`admin/secure/building`)
      .then((response) => {
        this.setState({ building_dta: response.data.result_data });
        this.changeBlock();
      })
      .catch((error) => {
        console.log(error);
      });

    let id = decodeURIComponent(this.props.match.params.id);
    this.getRoom(id);
  }

  getRoom(id) {
    API.get(`/admin/secure/roomDetails/${id}`)
      .then((res) => {
        this.setState({
          room_details: res.data.result[0],
        });
        // this.setState({ show_buliding: true });
        // this.setState({ building_name: res.data.result[0].building_name });
        // this.setState({ building_id: res.data.result[0].building_id });
        // this.loadBlock(res.data.result[0].building_id);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSubmitEvent = (values, { resetForm }) => {
    values.building_name = this.state.room_details.building_name;
    values.building_id = this.state.building_name;
    values.id = decodeURIComponent(this.props.match.params.id);
    API.post("/admin/secure/edit/room", values)
      .then((response) => {
        if (response.data.status === 201) {
          swal("Success", response.data.message, "success");
          resetForm(initialValues);
          this.setState({ show_buliding: false });
          this.setState({ singel_building: [] });
          this.setState({ room_number_aloted: false });
        }
        if (response.data.status === 401) {
          swal("Warning", response.data.message, "warning");
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

    let id = decodeURIComponent(this.props.match.params.id);
    this.getRoom(id);
  };

  changeBlock = (e = null) => {
    let buildingValue = e
      ? e.target.value
      : this.state.room_details.building_id;

    if (buildingValue) {
      // Set Floor
      let floor_list_filter = this.state.building_dta.filter(
        (item) => item.id == buildingValue
      );
      this.setState({ floor_list: floor_list_filter[0].floor_list });
      this.setState({ building_name: floor_list_filter[0].building_name });
    }

    if (e) {
      this.setState({
        room_details: {
          ...this.state.room_details,
          floor: "",
          room_type: "",
          room_number: "",
          occupancy: "",
          toilet_type: "",
          building_id: buildingValue,
        },
      });
      this.setState({ room_list: [] });
      this.setState({ room_type: [] });
      this.setState({ occupancy_lists: [] });
      this.setState({ toilet_type_lists: [] });
      this.setState({ room_number_lists: [] });
      this.setState({ room_info: null });
    } else {
      this.changeFloor();
    }
  };
  changeFloor = (e = null) => {
    let floorValue = e ? e.target.value : this.state.room_details.floor;

    let room_filter = this.state.floor_list.filter(
      (item) => item.floor_number == floorValue
    )[0].room_list;

    let room_type_lists = room_filter.map((item) => item.room_type);
    this.setState({ room_type: [...new Set(room_type_lists)] });

    if (e) {
      this.setState({
        room_details: {
          ...this.state.room_details,
          room_type: "",
          room_number: "",
          occupancy: "",
          toilet_type: "",
          floor: floorValue,
        },
      });
      this.setState({ occupancy_lists: [] });
      this.setState({ toilet_type_lists: [] });
      this.setState({ room_number_lists: [] });
      this.setState({ room_info: null });
    } else {
      this.changeRoomType();
    }
  };
  loadBlock = (target_id) => {
    // check target value is not empty
    if (target_id !== "") {
      let singel_building = this.state.building_dta.filter(
        (item) => item.id == target_id
      );
      this.setState({ singel_building: singel_building });
      this.setState({ show_buliding: true });
      let building_name = this.state.building_dta.filter(
        (item) => item.id == target_id
      )[0].building_name;
      this.setState({ building_name: building_name });
      this.setState({ building_id: target_id });
      let floor_list_filter = this.state.building_dta.filter(
        (item) => item.id == target_id
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

  changeRoomType = (e = null) => {
    let roomTypeValue = e ? e.target.value : this.state.room_details.room_type;

    if (e) {
      this.setState({
        room_details: {
          ...this.state.room_details,
          room_type: roomTypeValue,
          room_number: "",
          occupancy: "",
          toilet_type: "",
        },
      });
      this.setState({ toilet_type_lists: [] });
      this.setState({ room_number_lists: [] });
      this.setState({ room_info: null });
    } else {
      this.changeOccupancy();
    }

    let room_filter = this.state.floor_list.filter(
      (item) => item.floor_number == this.state.room_details.floor
    )[0].room_list;

    let room_type_filter = room_filter.filter(
      (item) => item.room_type == roomTypeValue
    );

    let occupancy_lists = room_type_filter.map((item) => item.occupancy);
    this.setState({ occupancy_lists: [...new Set(occupancy_lists)] });
  };
  changeOccupancy = (e = null) => {
    let occupancyValue = e ? e.target.value : this.state.room_details.occupancy;
    let room_filter = this.state.floor_list.filter(
      (item) => item.floor_number == this.state.room_details.floor
    )[0].room_list;
    let occupancy_filter = room_filter.filter((item) => {
      return (
        item.room_type == this.state.room_details.room_type &&
        item.occupancy == occupancyValue
      );
    });
    let toilet_type_lists = occupancy_filter.map((item) => item.toilet_type);
    this.setState({ toilet_type_lists: [...new Set(toilet_type_lists)] });

    if (e) {
      this.setState({
        room_details: {
          ...this.state.room_details,
          room_number: "",
          toilet_type: "",
          occupancy: occupancyValue,
        },
      });
      this.setState({ room_number_lists: [] });
      this.setState({ room_info: null });
    } else {
      this.changeToiletType();
    }
  };
  changeToiletType = (e = null) => {
    let toiletTypeValue = e
      ? e.target.value
      : this.state.room_details.toilet_type;

    let room_filter = this.state.floor_list.filter(
      (item) => item.floor_number == this.state.room_details.floor
    )[0].room_list;
    let room_no_filter = room_filter.filter((item) => {
      return (
        item.room_type == this.state.room_details.room_type &&
        item.occupancy == this.state.room_details.occupancy &&
        item.toilet_type == toiletTypeValue
      );
    });

    let room_number_lists = room_no_filter.map((item) => item.room_number);
    this.setState({ room_number_lists: [...new Set(room_number_lists)] });

    if (e) {
      this.setState({
        room_details: {
          ...this.state.room_details,
          room_number: "",
          toilet_type: toiletTypeValue,
        },
      });
      this.setState({ room_info: null });
    } else {
      this.changeRoomNumber();
    }
  };

  changeRoomNumber = (e = null) => {
    let roomNumberValue = e
      ? e.target.value
      : this.state.room_details.room_number;

    let room_filter = this.state.floor_list.filter(
      (item) => item.floor_number == this.state.room_details.floor
    )[0].room_list;
    let room_no_filter = room_filter.filter((item) => {
      return (
        item.room_type == this.state.room_details.room_type &&
        item.occupancy == this.state.room_details.occupancy &&
        item.room_number == roomNumberValue
      );
    });

    let bgColor = "#FFFFFF";
    if (room_no_filter.length > 0) {
      if (room_no_filter[0].total_occupancy == room_no_filter[0].vaccancy) {
        // Green color
        bgColor = "#008000";
      } else if (room_no_filter[0].vaccancy == 1) {
        // Orange color
        bgColor = "#FFA500";
      } else if (room_no_filter[0].vaccancy == 0) {
        // RED color
        bgColor = "#ff0000";
      } else if (
        Math.round(room_no_filter[0].total_occupancy / 2) ==
        room_no_filter[0].vaccancy
      ) {
        // Yellow Color
        bgColor = "#FFFF00";
      }
      room_no_filter[0].bgColor = bgColor;
    }

    this.setState({
      room_info: room_no_filter.length > 0 ? room_no_filter[0] : null,
    });

    if (e) {
      this.setState({
        room_details: {
          ...this.state.room_details,
          room_number: roomNumberValue,
        },
      });
    }
  };

  render() {
    console.log(this.state.room_info);
    const { room_details } = this.state;
    const newInitialValues = Object.assign(initialValues, {
      building_name: room_details.building_id ? room_details.building_id : "",
      floor: room_details.floor ? room_details.floor : "",
      room_number: room_details.room_number ? room_details.room_number : "",
      room_type: room_details.room_type ? room_details.room_type : "",
      occupancy: room_details.occupancy ? room_details.occupancy : "",
      toilet_type: room_details.toilet_type ? room_details.toilet_type : "",
    });
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
                initialValues={newInitialValues}
                validationSchema={validateRoom}
                onSubmit={this.handleSubmitEvent}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="row">
                      <h3 className="card-title">
                        <span className="sp1">Home /</span>
                        <span className="sp1"> Master Data /</span>
                        <span className="sp2"> Edit Room</span>
                      </h3>
                      <div className="col-lg-10 card card-m-l pty-30">
                        <div className="row">
                          <div className="col-md-8">
                            <div className="row form-m-t">
                              <div className="form-group">
                                <div className="col-lg-4">
                                  <label htmlFor="building_name">
                                    Building Name
                                  </label>
                                </div>
                                <div className="col-lg-8">
                                  <Field
                                    component="select"
                                    autoComplete="off"
                                    name="building_name"
                                    className={"form-control"}
                                    onChange={this.changeBlock}
                                  >
                                    <option key="-1" value="">
                                      Default Select
                                    </option>
                                    {this.state.building_dta &&
                                      this.state.building_dta.map(
                                        (building, i) => (
                                          <option value={building.id} key={i}>
                                            {building.building_name}
                                          </option>
                                        )
                                      )}
                                  </Field>

                                  {errors.building_name &&
                                  touched.building_name ? (
                                    <div className="text-danger">
                                      {errors.building_name}
                                    </div>
                                  ) : null}
                                </div>
                                <div className="col-lg-8">
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
                                <div className="col-lg-4">
                                  <label htmlFor="floor">Floor</label>
                                </div>
                                <div className="col-lg-8">
                                  <Field
                                    name="floor"
                                    component="select"
                                    autoComplete="off"
                                    className="form-control"
                                    onChange={this.changeFloor}
                                  >
                                    <option key="-1" value="">
                                      Default Select
                                    </option>
                                    {this.state.floor_list &&
                                      this.state.floor_list.map((floor, i) => (
                                        <option
                                          value={floor.floor_number}
                                          key={i}
                                        >
                                          {floor.floor_number}
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
                                <div className="col-lg-4">
                                  <label htmlFor="room_type">Room Type</label>
                                </div>
                                <div className="col-lg-8">
                                  <Field
                                    name="room_type"
                                    component="select"
                                    autoComplete="off"
                                    className="form-control"
                                    onChange={this.changeRoomType}
                                  >
                                    <option value="-1">Default Select</option>
                                    {this.state.room_type &&
                                      this.state.room_type.map((item, i) => (
                                        <option value={item} key={i}>
                                          {item}
                                        </option>
                                      ))}
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
                                <div className="col-lg-4">
                                  <label htmlFor="occupancy">Occupancy</label>
                                </div>
                                <div className="col-lg-8">
                                  <Field
                                    name="occupancy"
                                    component="select"
                                    autoComplete="off"
                                    className="form-control"
                                    onChange={this.changeOccupancy}
                                  >
                                    <option value="-1">Default Select</option>
                                    {this.state.occupancy_lists &&
                                      this.state.occupancy_lists.map(
                                        (item, i) => (
                                          <option value={item} key={i}>
                                            {item}
                                          </option>
                                        )
                                      )}
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
                              <div className="col-lg-4">
                                <label htmlFor="toilet_type">Toilet Type</label>
                              </div>
                              <div className="col-lg-8">
                                <div className="form-group">
                                  <Field
                                    name="toilet_type"
                                    component="select"
                                    autoComplete="off"
                                    className="form-control"
                                    onChange={this.changeToiletType}
                                  >
                                    <option value="">Default Select</option>
                                    {this.state.toilet_type_lists &&
                                      this.state.toilet_type_lists.map(
                                        (item, i) => (
                                          <option value={item} key={i}>
                                            {item}
                                          </option>
                                        )
                                      )}
                                  </Field>
                                  {errors.toilet_type && touched.toilet_type ? (
                                    <div className="text-danger">
                                      {errors.toilet_type}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            <div className="row form-m-t">
                              <div className="form-group">
                                <div className="col-lg-4">
                                  <label htmlFor="room_number">
                                    Room Number
                                  </label>
                                </div>
                                <div className="col-lg-8">
                                  <div className="form-group">
                                    <Field
                                      name="room_number"
                                      component="select"
                                      autoComplete="off"
                                      className="form-control"
                                      onChange={this.changeRoomNumber}
                                    >
                                      <option value="">Default Select</option>
                                      {this.state.room_number_lists &&
                                        this.state.room_number_lists.map(
                                          (item, i) => (
                                            <option value={item} key={i}>
                                              {item}
                                            </option>
                                          )
                                        )}
                                    </Field>
                                    {errors.room_number &&
                                    touched.room_number ? (
                                      <div className="text-danger">
                                        {errors.room_number}
                                      </div>
                                    ) : null}
                                    {this.state.room_number_aloted ? (
                                      <div className="text-danger">
                                        Room Number Already Allotted
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="row form-m-t form-p-b">
                              <div className="col-lg-4"></div>
                              <div className="col-lg-8">
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
                          <div className="col-md-4">
                            {this.state.room_info ? (
                              <div
                                className="card-m-t col-sm-1 m-4"
                                style={{
                                  width: "150px",
                                  height: "170px",
                                  backgroundColor: this.state.room_info.bgColor,
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
                                  Room Number {this.state.room_info.room_number}
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
                                  Available Room Type{" "}
                                  {this.state.room_info.room_type}
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
                                  Vacancy {this.state.room_info.total_occupancy}
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
                                  Occupancy {this.state.room_info.occupancy}
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
                                  Toilet Type {this.state.room_info.toilet_type}
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
                                  {this.state.room_info.student_id !== null ? (
                                    <span>
                                      {" "}
                                      Student Id:{" "}
                                      {this.state.room_info.student_id}
                                    </span>
                                  ) : null}
                                </p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
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

export default withRouter(connect(mapStateToProps)(EditRomm));
