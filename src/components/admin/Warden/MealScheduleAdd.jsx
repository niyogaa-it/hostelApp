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
import userLog from "../Utils/Logadd";
import "react-datepicker/dist/react-datepicker.css";

const initialValues = {
    schedule_date: "",
};
class MealScheduleAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breakfastListVeg: [],
            breakfastListEg1: [],
            breakfastListEg2: [],
            breakfastListNv1: [],
            breakfastListNv2: [],
            lunchListVeg: [],
            lunchListEg1: [],
            lunchListEg2: [],
            lunchListNv1: [],
            lunchListNv2: [],
            snacksListVeg: [],
            snacksListEg1: [],
            snacksListEg2: [],
            snacksListNv1: [],
            snacksListNv2: [],
            dinnerListVeg: [],
            dinnerListEg1: [],
            dinnerListEg2: [],
            dinnerListNv1: [],
            dinnerListNv2: [],
            meals: [],
            meal_repeat: false
        };
    }

    componentDidMount() {
        API.get(`/admin/secure/meal_plan`)
            .then((res) => {
                const mealData = res.data.result_data;
                console.log(mealData)

                let breakfastveg = [];
                let breakfasteg1 = [];
                let breakfasteg2 = [];
                let breakfastnv1 = [];
                let breakfastnv2 = [];

                let lunchveg = [];
                let luncheg1 = [];
                let luncheg2 = [];
                let lunchnv1 = [];
                let lunchnv2 = [];

                let snacksveg = [];
                let snackseg1 = [];
                let snackseg2 = [];
                let snacksnv1 = [];
                let snacksnv2 = [];

                let dinnerveg = [];
                let dinnereg1 = []
                let dinnereg2 = []
                let dinnernv1 = []
                let dinnernv2 = []

                mealData.forEach(element => {
                    if (element.meal_type == "breakfast" && element.food_preference == "Veg") {
                        breakfastveg.push(element)
                    }
                    if (element.meal_type == "breakfast" && element.food_preference == "Eggeterian - 1") {
                        breakfasteg1.push(element)
                    }
                    if (element.meal_type == "breakfast" && element.food_preference == "Eggeterian - 2") {
                        breakfasteg2.push(element)
                    }
                    if (element.meal_type == "breakfast" && element.food_preference == "Non-Veg -1") {
                        breakfastnv1.push(element)
                    }
                    if (element.meal_type == "breakfast" && element.food_preference == "Non-Veg -2") {
                        breakfastnv2.push(element)
                    }

                    if (element.meal_type == "lunch" && element.food_preference == "Veg") {
                        lunchveg.push(element)
                    }
                    if (element.meal_type == "lunch" && element.food_preference == "Eggeterian - 1") {
                        luncheg1.push(element)
                    }
                    if (element.meal_type == "lunch" && element.food_preference == "Eggeterian - 2") {
                        luncheg2.push(element)
                    }
                    if (element.meal_type == "lunch" && element.food_preference == "Non-Veg -1") {
                        lunchnv1.push(element)
                    }
                    if (element.meal_type == "lunch" && element.food_preference == "Non-Veg -2") {
                        lunchnv2.push(element)
                    }


                    if (element.meal_type == "snacks" && element.food_preference == "Veg") {
                        snacksveg.push(element)
                    }
                    if (element.meal_type == "snacks" && element.food_preference == "Eggeterian - 1") {
                        snackseg1.push(element)
                    }
                    if (element.meal_type == "snacks" && element.food_preference == "Eggeterian - 2") {
                        snackseg2.push(element)
                    }
                    if (element.meal_type == "snacks" && element.food_preference == "Non-Veg -1") {
                        snacksnv1.push(element)
                    }
                    if (element.meal_type == "snacks" && element.food_preference == "Non-Veg -2") {
                        snacksnv2.push(element)
                    }


                    if (element.meal_type == "dinner" && element.food_preference == "Veg") {
                        dinnerveg.push(element)
                    }
                    if (element.meal_type == "dinner" && element.food_preference == "Eggeterian - 1") {
                        dinnereg1.push(element)
                    }
                    if (element.meal_type == "dinner" && element.food_preference == "Eggeterian - 2") {
                        dinnereg2.push(element)
                    }
                    if (element.meal_type == "dinner" && element.food_preference == "Non-Veg -1") {
                        dinnernv1.push(element)
                    }
                    if (element.meal_type == "dinner" && element.food_preference == "Non-Veg -2") {
                        dinnernv2.push(element)
                    }
                });

                this.setState({
                    breakfastListVeg: [...breakfastveg],
                    breakfastListEg1: [...breakfasteg1],
                    breakfastListEg2: [...breakfasteg2],
                    breakfastListNv1: [...breakfastnv1],
                    breakfastListNv2: [...breakfastnv2],

                    lunchListVeg: [...lunchveg],
                    lunchListEg1: [...luncheg1],
                    lunchListEg2: [...luncheg2],
                    lunchListNv1: [...lunchnv1],
                    lunchListNv2: [...lunchnv2],

                    snacksListVeg: [...snacksveg],
                    snacksListEg1: [...snackseg1],
                    snacksListEg2: [...snackseg2],
                    snacksListNv1: [...snacksnv1],
                    snacksListNv2: [...snacksnv2],

                    dinnerListVeg: [...dinnerveg],
                    dinnerListEg1: [...dinnereg1],
                    dinnerListEg2: [...dinnereg2],
                    dinnerListNv1: [...dinnernv1],
                    dinnerListNv2: [...dinnernv2]
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
                userLog('Add Meal Schedule', 'Add Meal Schedule');
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

                                                    <div className="row1 form-m-t">
                                                        <div className="align-item-center d-flex form-group">
                                                            <div className="col-lg-21 mr-10">
                                                                <label>Schedule Date</label>
                                                            </div>
                                                            <div className="col-lg-51">

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
                                                                            onChange={() => this.setState({ meal_repeat: !this.state.meal_repeat })}
                                                                        />
                                                                        &nbsp;Meal will repeat throughout the year on the selected day.
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="permission-panel food-main-cate-wrap">
                                                        <h3>Breakfast</h3>
                                                        <div className="sub-cate-food-wrap" role="group" aria-labelledby="checkbox-group">
                                                                <h4>Veg</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.breakfastListVeg.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                                <h4>Eggeterian - 1</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.breakfastListEg1.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                                <h4>Eggeterian - 2</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.breakfastListEg2.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                                <h4>Non-Veg -1</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.breakfastListNv1.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                                <h4>Non-Veg -2</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.breakfastListNv2.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="permission-panel food-main-cate-wrap">
                                                        <h3>Lunch</h3>
                                                        <div className="sub-cate-food-wrap" role="group" aria-labelledby="checkbox-group">
                                                                <h4>Veg</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.lunchListVeg.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                                <h4>Eggeterian - 1</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.lunchListEg1.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                                <h4>Eggeterian - 2</h4>
                                                            <div className="sub-cate-food">

                                                                <div className="row">
                                                                    {this.state.lunchListEg2.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                                <h4>Non-Veg -1</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.lunchListNv1.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                                <h4>Non-Veg -2</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.lunchListNv2.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>


                                                    <div className="permission-panel food-main-cate-wrap">
                                                        <h3>Snacks</h3>
                                                        <div className="sub-cate-food-wrap" role="group" aria-labelledby="checkbox-group">
                                                                <h4>Veg</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.snacksListVeg.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                                <h4>Eggeterian - 1</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.snacksListEg1.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                                <h4>Eggeterian - 2</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.snacksListEg2.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                                <h4>Non-Veg -1</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.snacksListNv1.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                                <h4>Non-Veg -2</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.snacksListNv2.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="permission-panel food-main-cate-wrap">
                                                        <h3>Dinner</h3>
                                                        <div className="sub-cate-food-wrap" role="group" aria-labelledby="checkbox-group">
                                                                <h4>Veg</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.dinnerListVeg.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                                <h4>Eggeterian - 1</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.dinnerListEg1.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                                <h4>Eggeterian - 2</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.dinnerListEg2.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                                <h4>Non-Veg -1</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.dinnerListNv1.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                                <h4>Non-Veg -2</h4>
                                                            <div className="sub-cate-food">
                                                                <div className="row">
                                                                    {this.state.dinnerListNv2.map((el, index) => {
                                                                        return (
                                                                            <div className="col-lg-3" key={el.id}>
                                                                                <label>
                                                                                    <Field
                                                                                        className="meal-checkbox"
                                                                                        type="checkbox"
                                                                                        checked={this.getMealCheckedStatus(el.id)}
                                                                                        onChange={() => this.changeMealCheckedStatus(el.id)}
                                                                                    />
                                                                                    {el.meal_name}
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>

                                                    <div className="row form-m-t">
                                                        <div className="form-group text-center">
                                                              
                                                                <button
                                                                    type="submit"
                                                                    style={{
                                                                        padding: "8px 18px 8px 18px",
                                                                        borderRadius: "0.375rem",
                                                                        marginLeft: "auto",
                                                                        marginRight: "auto",
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
