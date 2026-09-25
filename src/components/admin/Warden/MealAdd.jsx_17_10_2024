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
//import { MultiSelect } from "../custominput/MultiSelect";
import Multiselect from 'multiselect-react-dropdown';

const initialValues = {
    // meal_type: [],
    // food_preference:[],
    meal_name: "",
};


class AddMeal extends Component {
    mealType = [];
    foodPreference = [];

    constructor(props) {
        super(props);
        this.state = {

        };
    }


    handleSubmitEvent = (values,{ resetForm }) => {

        values['mealType'] = this.mealType;
        values['foodPreference'] = this.foodPreference;

        API.post("/admin/secure/create/meal_plan", values)
            .then((res) => {
               

                if(res.data.status==200){
                    swal("Success", "Meal Added Successfully", "success");
                    //resetForm(initialValues);
                    window.location.reload();

                }else{
                    swal("Error", res.data.message, "error");
                    resetForm(initialValues);

                }
                
            })
            .catch((err) => {
                console.log("err", err);
                swal("Error", "Something went wrong", "error");
                resetForm(initialValues);
        });
    };




    render() {
        const validateRoom = Yup.object().shape({
            // meal_type: Yup.string().required("Meal type is required"),
            //food_preference: Yup.string().required("Food preference is required"),
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
                                {({ errors, touched }) => {
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


                                                                <Multiselect
                                                                    isObject={true}
                                                                    displayValue="name"
                                                                    name="meal_type[]"
                                                                    value="value"
                                                                    onSelect={(event) => {
                                                                        this.mealType = event  
                                                                    }}
                                                                    options={[
                                                                        { name: 'Breakfast', id: "breakfast" },
                                                                        { name: 'Lunch', id: "lunch" },
                                                                        { name: 'Snacks', id: "snacks" },
                                                                        { name: 'Dinner', id: "dinner" },
                                                                    ]}

                                                                />

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
                                                                <label>FOOD PREFERENCE</label>
                                                            </div>
                                                            <div className="col-lg-5">

                                                                <Multiselect
                                                                    isObject={true}
                                                                    displayValue="name"
                                                                    name="food_preference[]"
                                                                    value="value"
                                                                    onSelect={(event) => {
                                                                        this.foodPreference = event
                                                                    }}
                                                                    options={[
                                                                        { name: 'Veg', id: 'Veg' },
                                                                        { name: 'Veg + Egg (Plan 1) : Egg 3 Meals a week', id: 'Eggeterian - 1' },
                                                                        { name: 'Veg + Egg (Plan 2) : Egg 5 Meals a week', id: 'Eggeterian - 2' },
                                                                        { name: 'Non-veg 3 meals & Egg 3 Meals a week', id: 'Non-Veg -1' },
                                                                        { name: 'Non-veg 3 Meals & Egg 5 Meals a week', id: 'Non-Veg -2' },
                                                                    ]}

                                                                />

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
