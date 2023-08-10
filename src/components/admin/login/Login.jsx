import React, { Component } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Button, FormGroup, ControlLabel } from "react-bootstrap";
import Layout from "../layout/Layout";
import { Link, Redirect } from "react-router-dom";
import logoImage from "../../../assets/images/logo.svg";

// redux store
import { connect } from "react-redux";
import { adminLogin } from "../../../store/actions/auth";

const validateLogin = Yup.object().shape({
  username: Yup.string().required("Please enter your email or username"),
  password: Yup.string().required("Please enter your password"),
});

const initialValues = {
  username: "",
  password: "",
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username: "",
      password: "",
    };

    var element = document.getElementsByTagName("body");
    element[0].classList.add("bg_color_adm");
  }

  handleSubmitEvent = (values, { setErrors }) => {
    console.log("setErrors>>>..", setErrors);
    this.setState({ isLoading: true });
    this.props.submitLogin(
      values,
      () => {
        var element = document.getElementsByTagName("body");
        element[0].classList.remove("bg_color_adm");
        this.props.history.push("/admin/dashboard");
      },
      setErrors
    );
  };

  render() {
    const newInitialValues = Object.assign(initialValues, {
      username: "",
      password: "",
    });

    let token = localStorage.getItem("admin_token");
    if (token) {
      return <Redirect to="/admin/dashboard" />;
    }

    return (
      <Layout {...this.props}>
        <div className="login-box">
          {/* <span> {this.props.auth_errors && this.props.auth_errors.data.errors} </span> */}
          <Formik
            initialValues={newInitialValues}
            validationSchema={validateLogin}
            onSubmit={this.handleSubmitEvent}
          >
            {({ values, errors, touched, isValid, isSubmitting }) => {
              return (
                <Form>
                  <div
                    className="login-box-body shadow-lg"
                    style={{
                      width: "100%",
                      borderRadius: "2%",
                      marginTop: "45%",
                      boxShadow: "1px 2px 9px #999",
                    }}
                  >
                    <div className="login-logo" style={{ width: "65%" }}>
                      <Link to="/" className="logo">
                        <span className="logo-mini">
                          <img src={logoImage} alt="hostel" />
                        </span>
                      </Link>
                    </div>
                    <h4>Welcome to Rani Meyyammai Hostel</h4>

                    <p>
                      Please sign-in to your account and start the adventure
                    </p>
                    <div className="form-group has-feedback">
                      <FormGroup controlId="username">
                        <ControlLabel>Email Or Username</ControlLabel>
                        <Field
                          name="username"
                          type="text"
                          className={`form-control`}
                          placeholder="Enter your email or username"
                          autoComplete="off"
                        />
                        {errors.username && touched.username ? (
                          <span className="errorMsg">{errors.username}</span>
                        ) : null}
                      </FormGroup>
                    </div>
                    <div className="form-group has-feedback">
                      <FormGroup controlId="password">
                        <ControlLabel>Password</ControlLabel>
                        <Field
                          name="password"
                          type="password"
                          className={`form-control`}
                          placeholder="Enter password"
                          autoComplete="off"
                        />
                        {errors.password && touched.password ? (
                          <span className="errorMsg">{errors.password}</span>
                        ) : null}
                      </FormGroup>
                    </div>
                    <div className="row">
                      <div className="col-xs-12">
                        <Button
                          className={`btn btn-primary btn-block btn-flat`}
                          type="submit"
                          disabled={isValid ? false : true}
                          style={{
                            backgroundColor: "#883494",
                            fontFamily: "'Raleway', sans-serif",
                            fontWeight: "250",
                          }}
                        >
                          Sign In
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  //console.log("dispatch called")
  return {
    submitLogin: (data, onSuccess, setErrors) =>
      dispatch(adminLogin(data, onSuccess, setErrors)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
