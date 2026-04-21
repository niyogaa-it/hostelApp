import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import "./createPlan.css";

let initialValues = {
  plan_name: "",
  plan_price: "",
  plan: "",
  food_preference: "",
  room_type: "",
  parking: "",
};

class AddRomm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_error: "",
      success: "",
      show_plan: false,
      plan_names: "",
      plan_dta: [],
      floor_list: [],
      singel_building: [],
      plan_aloted: false, // need to be update
    };
  }
  // api get call for building
  // componentDidMount() {
  //   API.get(`admin/secure/building`)
  //     .then((response) => {
  //       this.setState({ plan_dta: response.data.result_data });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  handleSubmitEvent = (values, { resetForm }) => {
    values.plan_names = this.state.plan_names;
    values.plan_id = values.plan_names;
    API.post(`/admin/secure/plan`, values)
      .then((response) => {
        console.log(response);
        if (response.data.status === 201) {
          swal("Success", "Plan Added Successfully", "success");
          resetForm(initialValues);
          this.setState({ show_plan: false });
          this.setState({ singel_building: [] });
          this.setState({ plan_aloted: false });
        }
        if (response.data.status === 401) {
          swal("Warning", response.data.message, "warning");
          // formik warning
          // resetForm(initialValues);
          // this.setState({ show_plan: false });
          //this.setState({ singel_building: [] });
          // this.setState({ plan_aloted: true });
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
      let singel_building = this.state.plan_dta.filter(
        (item) => item.id == e.target.value
      );

      this.setState({ singel_building: singel_building });

      this.setState({ show_plan: true });
      let plan_names = this.state.plan_dta.filter(
        (item) => item.id == e.target.value
      )[0].plan_names;
      this.setState({ plan_names: plan_names });
      let floor_list_filter = this.state.plan_dta.filter(
        (item) => item.id == e.target.value
      )[0].floor_list;
      // push the floor number in floor_list
      let floor_list = [];
      floor_list_filter.map((item) => {
        floor_list.push(item.floor_number);
      });
      this.setState({ floor_list: floor_list });
    } else {
      this.setState({ show_plan: false });
      this.setState({ singel_building: [] });
    }
  };

  render() {
    const validateRoom = Yup.object().shape({
      plan_name: Yup.string().required("Plan Name is required"),
      plan_price: Yup.number().required("Plan Price is required"),
      plan: Yup.string().required("Plan is required"),
      food_preference: Yup.string().required("Food Preference is required"),
      room_type: Yup.string().required("Room type is required"),
      parking: Yup.string().required("Parking field is required"),
    });
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
                      <span className="sp2"> Create Plan</span>
                    </h3>
                    <div className="col-lg-10 card card-m-l pty-30">
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-lg-2">
                            <label htmlFor="plan_name">Plan Name</label>
                          </div>
                          <div className="col-lg-5">
                            <Field
                              name="plan_name"
                              type="text"
                              className="form-control"
                              placeholder="Plan Name"
                            />
                            {errors.plan_name && touched.plan_name ? (
                              <div className="text-danger">
                                {errors.plan_name}
                              </div>
                            ) : null}
                            {/* {this.state.plan_aloted ? (
                              <div className="text-danger">
                                "Plan Name Already Aloted"
                              </div>
                            ) : null} */}
                          </div>
                          <div className="col-lg-5">
                            {this.state.show_plan ? (
                              <Field
                                name="plan_id"
                                type="text"
                                className="form-control"
                                value={this.state.plan_names}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-lg-2">
                            <label htmlFor="plan_price">Plan Price</label>
                          </div>
                          <div className="col-lg-5">
                            <Field
                              name="plan_price"
                              type="number"
                              className="form-control"
                              placeholder="Plan Price"
                            />
                            {errors.plan_price && touched.plan_price ? (
                              <div className="text-danger">
                                {errors.plan_price}
                              </div>
                            ) : null}
                            {/* {this.state.plan_aloted ? (
                              <div className="text-danger">
                                "Plan Price Already Aloted"
                              </div>
                            ) : null} */}
                          </div>
                          <div className="col-lg-5">
                            {this.state.show_plan ? (
                              <Field
                                name="plan_id"
                                type="text"
                                className="form-control"
                                value={this.state.plan_names}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-lg-2">
                            <label htmlFor="plan">Plan</label>
                          </div>
                          <div className="col-lg-5">
                            <Field
                              name="plan"
                              component="select"
                              autoComplete="off"
                              className="form-control"
                            >
                              <option value="">Default Select</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                            </Field>
                            {errors.plan && touched.plan ? (
                              <div className="text-danger">{errors.plan}</div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-lg-2">
                            <label htmlFor="food_preference">
                              Food Preference
                            </label>
                          </div>
                          <div className="col-lg-5">
                            <Field
                              name="food_preference"
                              component="select"
                              autoComplete="off"
                              className="form-control"
                            >
                              <option value="">Default Select</option>
                              <option value="veg">Veg</option>
                              <option value="Non-veg">Non-Veg</option>
                              <option value="egg">Eggeterian</option>
                            </Field>
                            {errors.food_preference &&
                            touched.food_preference ? (
                              <div className="text-danger">
                                {errors.food_preference}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="row form-m-t">
                        <div className="form-group">
                          <div className="col-lg-2">
                            <label htmlFor="room_type">Room</label>
                          </div>
                          <div className="col-lg-5">
                            <Field
                              name="room_type"
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
                              <option value="2 in 1 AC">2 in 1 AC</option>
                              <option value="3 in 1 AC">3 in 1 AC</option>
                              <option value="4 in 1 AC">4 in 1 AC</option>
                              <option value="5 in 1 AC">5 in 1 AC</option>
                              <option value="6 in 1 AC">6 in 1 AC</option>
                              <option value="7 in 1 AC">7 in 1 AC</option>
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
                        <div className="col-lg-2">
                          <label htmlFor="parking">Parking</label>
                        </div>
                        <div className="col-lg-5">
                          <div className="form-group">
                            <Field
                              name="parking"
                              component="select"
                              autoComplete="off"
                              className="form-control"
                            >
                              <option value="">Default Select</option>
                              <option value="yes">Yes</option>
                              <option value="Common">No</option>
                            </Field>
                            {errors.parking && touched.parking ? (
                              <div className="text-danger">
                                {errors.parking}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="row form-m-t form-p-b">
                        <div className="col-lg-2"></div>
                        <div className="col-lg-5">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </section>
          {/* <section className="card-m-l form-m-t">
            <div className="card col-lg-10">
              <div className="row">
                {console.log(this.state.singel_building)}
                {this.state.singel_building.length > 0 &&
                this.state.singel_building[0].floor_list.length > 0
                  ? this.state.singel_building[0].floor_list.map((floor, i) => (
                      <div className="col-lg-5" key={i}>
                        <h4>Floor {floor.floor_number}</h4>
                        <div className="row m-4">
                          {floor.room_list.map((room_type, i) => (
                            <div
                              key={i}
                              className="card-m-t col-sm-1 m-4"
                              style={{
                                width: "150px",
                                height: "150px",
                                backgroundColor: "#71dd37",
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
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </section> */}
        </div>
      </Layout>
    );
  }
}

export default AddRomm;
