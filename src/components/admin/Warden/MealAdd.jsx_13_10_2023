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

const initialValues = {
    meal_type: "",
    food_preference:"",
    meal_name: "",
};
class AddMeal extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleSubmitEvent = (values, { resetForm }) => {
        API.post("/admin/secure/create/meal_plan", values)
            .then((res) => {
                console.log(res)
                swal("Success", "Meal Added Successfully", "success");
                resetForm(initialValues);
            })
            .catch((err) => {
                console.log("err", err);
                swal("Error", "Something went wrong", "error");
                resetForm(initialValues);
            });
    };

    render() {


        const validateRoom = Yup.object().shape({
            meal_type: Yup.string().required("Meal type is required"),
            food_preference: Yup.string().required("Food preference is required"),
            meal_name: Yup.string().required("Meal name is required"),
        });
        if (
            this.props.auth.userToken.permissions.warden_management == 0 ||
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
                            // enableReinitialize={true}
                            >
                                {({ errors, touched, isSubmitting, setFieldValue, values, handleChange }) => {
                                    return (
                                        <Form>
                                            <div className="row">
                                                <h3 className="card-title">
                                                    <span className="sp1">Home /</span>
                                                    <span className="sp1"> Warden Data /</span>
                                                    <span className="sp1"> Meals / </span>
                                                    <span className="sp2"> Add Meal</span>
                                                </h3>
                                                <div className="col-lg-10 col-lg-10 card card-m-l pty-30">

                                                    <div className="row form-m-t">
                                                        <div className="form-group">
                                                            <div className="col-lg-2">
                                                                <label>MEAL TYPE</label>
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <select
                                                                className="form-control"
                                                                    name="meal_type"
                                                                    value={values.meal_type}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option value="">SELECT MEAL TYPE</option>
                                                                    <option value="breakfast">Breakfast</option>
                                                                    <option value="lunch" >Lunch</option>
                                                                    <option value="snacks" >SNACKS</option>
                                                                    <option value="dinner" >Dinner</option>
                                                                </select>
                                                                {errors.meal_type &&
                                                                    touched.meal_type ? (
                                                                    <div className="text-danger">
                                                                        {errors.meal_type}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row form-m-t">
                                                        <div className="form-group">
                                                            <div className="col-lg-2">
                                                                <label>Food Preference</label>
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <select
                                                                className="form-control"
                                                                    name="food_preference"
                                                                    value={values.food_preference}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option value="">Select Food Preference</option>
                                                                    <option value="VEG">VEG</option>
                                                                    <option value="NON VEG" >NON VEG</option>
                                                                    <option value="EGGETERIAN" >EGGETERIAN</option>
                                                                </select>
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
                                                                <label>MEAL NAME</label>
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <Field
                                                                    type="text"
                                                                    name="meal_name"
                                                                    className="form-control"
                                                                    placeholder="MEAL NAME"
                                                                />
                                                                {errors.meal_name &&
                                                                    touched.meal_name ? (
                                                                    <div className="text-danger">
                                                                        {errors.meal_name}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row form-m-t">
                                                        <div className="form-group">
                                                            <div className="col-lg-2"></div>
                                                            <div className="col-lg-5">
                                                                <button
                                                                    type="submit"
                                                                    style={{
                                                                        padding: "8px 18px 8px 18px",
                                                                        borderRadius: "0.375rem",
                                                                        marginLeft: "43%",
                                                                        marginBottom: "10%",
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
                                            </div>
                                        </Form>
                                    );
                                }}
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

export default withRouter(connect(mapStateToProps)(AddMeal));
