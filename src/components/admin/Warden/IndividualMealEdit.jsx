import React, { Component } from "react";
import Layout from "../layout/Layout";
import { Formik, Form, Field } from "formik";
import API from "../../../shared/admin-axios";
import swal from "sweetalert";
import * as Yup from "yup";
import "./masterdata.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const initialValues = {
    meal_name: "",
    quantity: "",
    unit_price: "",
    status: "1",
    image: "",
};

class IndividualMealEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mealDetails: [],
            file: "",
            isValidFile: true,
            setFileErrors: "",
        };
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
    }

    getMeal(id) {
        API.get(`/admin/secure/individualmeal/dtl/${id}`)
            .then((res) => {
                this.setState({
                    mealDetails: res.data.result_data ? res.data.result_data[0] || {} : {},
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        let id = decodeURIComponent(this.props.match.params.id);
        this.getMeal(id);
    }

    fileChangedHandler = (event, setFieldTouched, setFieldValue) => {
        const { value: file_name } = event.target;
        setFieldTouched("image");
        setFieldValue("image", file_name);

        const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg"];
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
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            if (event.target.files[0].size < 5242880) {
                reader.onload = () => {
                    this.setState(
                        {
                            setFileErrors: "",
                            file: reader.result,
                            isValidFile: true,
                        },
                        () => {
                            setFieldValue("image", file_name);
                        }
                    );
                };
            } else {
                this.setState({
                    setFileErrors: "Image size must be less than 5 mb",
                    isValidFile: false,
                });
            }

            reader.onerror = (error) => {
                console.log("Error: ", error);
            };
        } else {
            this.setState({
                file: "",
                isValidFile: false,
            });
        }
    };

    handleSubmitEvent = (values, { resetForm }) => {
        let id = decodeURIComponent(this.props.match.params.id);
        const post_data = {
            id: id,
            meal_name: values.meal_name,
            quantity: values.quantity,
            unit_price: values.unit_price,
            status: values.status,
        };
        if (this.state.file) {
            post_data.StudimagepathBase = this.state.file;
        }
        API.post("/admin/secure/individualmeal/update", post_data)
            .then((res) => {
                if (res.data.status == 200) {
                    swal("Success", "Meal Updated Successfully", "success");
                    this.setState({ file: "" });
                    this.getMeal(id);
                } else {
                    swal("Error", res.data.message, "error");
                    this.getMeal(id);
                }
            })
            .catch((err) => {
                console.log("err", err);
                swal("Error", "Something went wrong", "error");
                this.getMeal(id);
            });
    };

    render() {
        const { mealDetails } = this.state;
        const newInitialValues = Object.assign({}, initialValues, {
            meal_name: mealDetails.meal_name ? mealDetails.meal_name : "",
            quantity: mealDetails.quantity ? mealDetails.quantity : "",
            unit_price: mealDetails.unit_price ? mealDetails.unit_price : "",
            status: mealDetails.status ? String(mealDetails.status) : "1",
        });
        const validateMeal = Yup.object().shape({
            meal_name: Yup.string().required("Meal name is required"),
            quantity: Yup.number()
                .typeError("Quantity must be a number")
                .required("Quantity is required"),
            unit_price: Yup.number()
                .typeError("Price must be a number")
                .required("Price is required"),
            status: Yup.string().required("Status is required"),
            image: Yup.string().test(
                "image",
                "Only files with the following extensions are allowed: png jpg jpeg",
                () => this.state.isValidFile
            ),
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
                                initialValues={newInitialValues}
                                validationSchema={validateMeal}
                                onSubmit={this.handleSubmitEvent}
                                enableReinitialize={true}
                            >
                                {({ errors, touched, setFieldValue, setFieldTouched }) => {
                                    return (
                                        <Form>
                                            <div className="row">
                                                <h3 className="card-title">
                                                    <span className="sp1">Home /</span>
                                                    <span className="sp1"> Warden /</span>
                                                    <span className="sp1"> Individual Meal / </span>
                                                    <span className="sp2"> Edit Meal</span>
                                                </h3>
                                                <div className="col-lg-10 col-lg-10 card card-m-l pty-30">
                                                    <div className="row form-m-t">
                                                        <div className="form-group">
                                                            <div className="col-lg-2">
                                                                <label htmlFor="image">
                                                                    Meal Image{" "}
                                                                    <span
                                                                        style={{
                                                                            color: "red",
                                                                            fontSize: "12px",
                                                                            fontWeight: "normal",
                                                                        }}
                                                                    >
                                                                        (Image Size must be less than 5 mb)
                                                                    </span>
                                                                </label>
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <Field
                                                                    name="image"
                                                                    type="file"
                                                                    className="form-control"
                                                                    placeholder="Select Image"
                                                                    autoComplete="off"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        this.fileChangedHandler(
                                                                            e,
                                                                            setFieldTouched,
                                                                            setFieldValue
                                                                        );
                                                                    }}
                                                                />
                                                                {this.state.setFileErrors != "" ? (
                                                                    <div className="text-danger">
                                                                        {this.state.setFileErrors}
                                                                    </div>
                                                                ) : null}
                                                                {mealDetails.meal_image ? (
                                                                    <img
                                                                        src={mealDetails.meal_image}
                                                                        alt="meal"
                                                                        width="100px"
                                                                        style={{ marginTop: "10px" }}
                                                                    />
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row form-m-t">
                                                        <div className="form-group">
                                                            <div className="col-lg-2">
                                                                <label>FOOD NAME</label>
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <Field
                                                                    type="text"
                                                                    name="meal_name"
                                                                    className="form-control"
                                                                    placeholder="FOOD NAME"
                                                                />
                                                                {errors.meal_name && touched.meal_name ? (
                                                                    <div className="text-danger">
                                                                        {errors.meal_name}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row form-m-t">
                                                        <div className="form-group">
                                                            <div className="col-lg-2">
                                                                <label>QUANTITY</label>
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <Field
                                                                    type="text"
                                                                    name="quantity"
                                                                    className="form-control"
                                                                    placeholder="QUANTITY"
                                                                />
                                                                {errors.quantity && touched.quantity ? (
                                                                    <div className="text-danger">
                                                                        {errors.quantity}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row form-m-t">
                                                        <div className="form-group">
                                                            <div className="col-lg-2">
                                                                <label>PRICE</label>
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <Field
                                                                    type="text"
                                                                    name="unit_price"
                                                                    className="form-control"
                                                                    placeholder="PRICE"
                                                                />
                                                                {errors.unit_price && touched.unit_price ? (
                                                                    <div className="text-danger">
                                                                        {errors.unit_price}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row form-m-t">
                                                        <div className="form-group">
                                                            <div className="col-lg-2">
                                                                <label htmlFor="status">Status</label>
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <Field
                                                                    component="select"
                                                                    name="status"
                                                                    className="form-control"
                                                                >
                                                                    <option value="1">Active</option>
                                                                    <option value="0">Inactive</option>
                                                                </Field>
                                                                {errors.status && touched.status ? (
                                                                    <div className="text-danger">
                                                                        {errors.status}
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
                                                                    Update
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

export default withRouter(connect(mapStateToProps)(IndividualMealEdit));
