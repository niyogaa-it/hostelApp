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

let initialValues = {
    status: "1",
    image: "",
};

class AnnouncementEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            announcementDetails: {},
            file: "",
            isValidFile: true,
            setFileErrors: "",
        };
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
    }

    getAnnouncement() {
        API.get("/admin/secure/announcement/get")
            .then((res) => {
                this.setState({
                    announcementDetails: res.data.result_data ? res.data.result_data[0] || {} : {},
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        this.getAnnouncement();
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

    handleSubmitEvent = (values) => {
        const { announcementDetails } = this.state;
        const post_data = {
            id: announcementDetails.id,
            status: values.status,
        };
        if (this.state.file) {
            post_data.image = this.state.file;
        }


        API.post("/admin/secure/announcement/update", post_data)
            .then((res) => {
                if (res.data.status == 200) {
                    swal("Success", "Announcement Updated Successfully", "success");
                    this.setState({ file: "" });
                    this.getAnnouncement();
                } else {
                    swal("Error", res.data.message, "error");
                }
            })
            .catch((err) => {
                console.log("err", err);
                swal("Error", "Something went wrong", "error");
            });
    };

    render() {
        const { announcementDetails } = this.state;
        const newInitialValues = Object.assign({}, initialValues, {
            status: announcementDetails.status ? String(announcementDetails.status) : "1",
        });
        const validateAnnouncement = Yup.object().shape({
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
                                validationSchema={validateAnnouncement}
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
                                                    <span className="sp1"> Announcement </span>
                                                </h3>
                                                <div className="col-lg-10 col-lg-10 card card-m-l pty-30">
                                                    <div className="row form-m-t">
                                                        <div className="form-group">
                                                            <div className="col-lg-2">
                                                                <label htmlFor="image">
                                                                    Image{" "}
                                                                    <span
                                                                        style={{
                                                                            color: "red",
                                                                            fontSize: "12px",
                                                                            fontWeight: "normal",
                                                                        }}
                                                                    >
                                                                        (Image Size must be less than 5 mb)
                                                                        (For batter resolution, please upload image with 800px width and 1200px height)
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
                                                                {this.state.file ? (
                                                                    // Show newly selected image temporarily
                                                                    <img
                                                                        src={this.state.file}
                                                                        alt="Selected Preview"
                                                                        width="100px"
                                                                        style={{
                                                                            marginTop: "10px",
                                                                            height: "100px",
                                                                            objectFit: "cover",
                                                                            border: "1px solid #ddd",
                                                                            padding: "3px",
                                                                        }}
                                                                    />
                                                                ) : announcementDetails.upload_imag ? (
                                                                    // Show existing image when no new image is selected
                                                                    <img
                                                                        src={announcementDetails.upload_imag}
                                                                        alt="Announcement"
                                                                        width="100px"
                                                                        style={{
                                                                            marginTop: "10px",
                                                                            height: "100px",
                                                                            objectFit: "cover",
                                                                            border: "1px solid #ddd",
                                                                            padding: "3px",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    // Placeholder when there is no image
                                                                    <div
                                                                        style={{
                                                                            marginTop: "10px",
                                                                            width: "100px",
                                                                            height: "100px",
                                                                            border: "1px dashed #ccc",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                            fontSize: "12px",
                                                                            color: "#999",
                                                                        }}
                                                                    >
                                                                        No Image
                                                                    </div>
                                                                )}
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

export default withRouter(connect(mapStateToProps)(AnnouncementEdit));
