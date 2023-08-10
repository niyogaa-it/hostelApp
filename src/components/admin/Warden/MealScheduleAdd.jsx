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
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

const initialValues = {
    schedule_date: "",
};
class MealScheduleAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breakfastList: [],
            lunchList: [],
            dinnerList: [],
            snacksList:[],
            meals: [],
            meal_repeat:false
        };
    }

    componentDidMount() {
        API.get(`/admin/secure/meal_plan`)
            .then((res) => {
                const mealData = res.data.result_data;
                console.log(mealData)

                let breakfast = [];
                let lunch = [];
                let snacks = [];
                let dinner = []

                mealData.forEach(element => {
                    if (element.meal_type == "breakfast") {
                        breakfast.push(element)
                    } else if (element.meal_type == "dinner") {
                        dinner.push(element)
                    } else if (element.meal_type == "snacks") {
                        snacks.push(element)
                    } else if (element.meal_type == "lunch") {
                        lunch.push(element)
                    }
                });

                this.setState({
                    breakfastList: [...breakfast],
                    lunchList: [...lunch],
                    dinnerList: [...dinner],
                    snacksList: [...snacks]
                })

            })
            .catch((err) => {
                console.log("err:", err);
            });
    }

    handleSubmitEvent = (values, { resetForm }) => {
        const content = {
            "meal_day": moment(values.schedule_date).format('YYYY-MM-DD'),
            "meals": this.state.meals,
            "meal_repeat": this.state.meal_repeat
        }
        //console.log(content);return;
        API.post("/admin/secure/schedule_food", content)
            .then((res) => {
                console.log(res)
                swal("Success", "Schedule Added Successfully", "success");
                resetForm(initialValues);
                this.state.meals = []
            })
            .catch((err) => {
                console.log("err", err);
                swal("Error", "Something went wrong", "error");
                resetForm(initialValues);
                this.state.meals = []
            });
    };

    getMealCheckedStatus(id) {
        let flag = this.state.meals.includes(id)
        return flag
    }

    changeMealCheckedStatus(id) {
        if (this.state.meals.includes(id)) {
            let meals = [...this.state.meals];
            const index = meals.indexOf(id);
            if (index > -1) {
                meals.splice(index, 1);
                this.setState({
                    meals: meals
                })
            }

        } else {
            let meals = [...this.state.meals];
            meals.push(id);
            this.setState({
                meals: meals
            })
        }
    }

    render() {


        const validateRoom = Yup.object().shape({
            schedule_date: Yup.string().required("Date is required"),
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
                                                    <span className="sp1"> Meal Schedule / </span>
                                                    <span className="sp2"> Add Schedule</span>
                                                </h3>
                                                <div className="col-lg-10 col-lg-10 card card-m-l pty-30">

                                                    <div className="row form-m-t">
                                                        <div className="form-group">
                                                            <div className="col-lg-2">
                                                                <label>Schedule Date</label>
                                                            </div>
                                                            <div className="col-lg-5">
                                                                
                                                                <DatePicker selected={values.schedule_date} placeholder="Date" name="schedule_date" onChange={(date) => setFieldValue('schedule_date', date)}
                                                                    minDate={new Date()}
                                                                    autoComplete="off"
                                                                    value={values.schedule_date}
                                                                    className={
                                                                        errors.schedule_date && touched.schedule_date
                                                                            ? 'form-control is-invalid'
                                                                            : 'form-control'
                                                                    } />
                                                                {errors.schedule_date &&
                                                                    touched.schedule_date ? (
                                                                    <div className="text-danger">
                                                                        {errors.schedule_date}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="permission-panel">
                                                        <h4>Breakfast</h4>
                                                        <div
                                                            role="group"
                                                            aria-labelledby="checkbox-group"
                                                        >
                                                            <div className="row">
                                                            <div className="col-lg-12">
                                                                            <label>
                                                                                <Field
                                                                                    className="meal-checkbox"
                                                                                    type="checkbox"
                                                                                    checked={this.state.meal_repeat}
                                                                                    onChange={() => this.setState({meal_repeat: !this.state.meal_repeat})}
                                                                                />
                                                                                Meal will repeat throughout the year on the selected day.
                                                                            </label>
                                                                        </div>


                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="permission-panel">
                                                        <h4>Breakfast</h4>
                                                        <div
                                                            role="group"
                                                            aria-labelledby="checkbox-group"
                                                        >
                                                            <div className="row">
                                                                {this.state.breakfastList.map((el, index) => {
                                                                    return (
                                                                        <div className="col-lg-3" key={el.id}>
                                                                            <label>
                                                                                <Field
                                                                                    className="meal-checkbox"
                                                                                    type="checkbox"
                                                                                    checked={this.getMealCheckedStatus(el.id)}
                                                                                    onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                />
                                                                                {el.meal_name} ({el.food_preference})
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                })}


                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="permission-panel">
                                                        <h4>Lunch</h4>
                                                        <div
                                                            role="group"
                                                            aria-labelledby="checkbox-group"
                                                        >
                                                            <div className="row">
                                                                {this.state.lunchList.map((el, index) => {
                                                                    return (
                                                                        <div className="col-lg-3" key={el.id}>
                                                                            <label>
                                                                                <Field
                                                                                    className="meal-checkbox"
                                                                                    type="checkbox"
                                                                                    checked={this.getMealCheckedStatus(el.id)}
                                                                                    onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                />
                                                                                {el.meal_name} ({el.food_preference})
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                })}


                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="permission-panel">
                                                        <h4>Snacks</h4>
                                                        <div
                                                            role="group"
                                                            aria-labelledby="checkbox-group"
                                                        >
                                                            <div className="row">
                                                                {this.state.snacksList.map((el, index) => {
                                                                    return (
                                                                        <div className="col-lg-3" key={el.id}>
                                                                            <label>
                                                                                <Field
                                                                                    className="meal-checkbox"
                                                                                    type="checkbox"
                                                                                    checked={this.getMealCheckedStatus(el.id)}
                                                                                    onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                />
                                                                                {el.meal_name} ({el.food_preference})
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                })}


                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="permission-panel">
                                                        <h4>Dinner</h4>
                                                        <div
                                                            role="group"
                                                            aria-labelledby="checkbox-group"
                                                        >
                                                            <div className="row">
                                                                {this.state.dinnerList.map((el, index) => {
                                                                    return (
                                                                        <div className="col-lg-3" key={el.id}>
                                                                            <label>
                                                                                <Field
                                                                                    className="meal-checkbox"
                                                                                    type="checkbox"
                                                                                    checked={this.getMealCheckedStatus(el.id)}
                                                                                    onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                />
                                                                                {el.meal_name} ({el.food_preference})
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                })}


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

export default withRouter(connect(mapStateToProps)(MealScheduleAdd));
