import React, { Component } from "react";
import { Formik, Field, Form } from "formik";

import Layout from "../layout/Layout";

class CreateSubAdmin extends Component {
  render() {
    return (
      <Layout {...this.props}>
        <div className="content-wrapper">
          <section className="content-header">
            <div className="row">
              <h3 className="card-title">
                <span className="sp1">Home / </span>
                <span className="sp1">User Management / </span>
                <span className="sp2">Create Subadmin</span>
              </h3>
            </div>
            <div className="row">
              <div className="col-lg-10">
                <div className="sub-admin">
                  <h2>Create Subadmin</h2>
                  <div className="sub-admin-content">
                    <Formik>
                      <form>
                        <div className="form-group">
                          <div className="row">
                            <div className="col-lg-2">
                              <label htmlFor="name">NAME</label>
                            </div>
                            <div className="col-lg-10">
                              <Field
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                className={"form-control"}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="row">
                            <div className="col-lg-2">
                              <label htmlFor="phone">PHONE NUMBER</label>
                            </div>
                            <div className="col-lg-10">
                              <Field
                                type="number"
                                name="phone"
                                placeholder="Phone number"
                                className={"form-control"}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="row">
                            <div className="col-lg-2">
                              <label htmlFor="email">EMAIL</label>
                            </div>
                            <div className="col-lg-10">
                              <Field
                                type="email"
                                name="email"
                                placeholder="@example.com"
                                className={"form-control"}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="row">
                            <div className="col-lg-2">
                              <label htmlFor="password">CREATE PASSWORD</label>
                            </div>
                            <div className="col-lg-10">
                              <Field
                                type="password"
                                name="password"
                                className={"form-control"}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="row">
                            <div className="col-lg-2">
                              <label htmlFor="name">ROLE</label>
                            </div>
                            <div className="col-lg-6">
                              <Field
                                name="role"
                                component="select"
                                className={"form-control"}
                              >
                                <option value="" selected>
                                  Default select
                                </option>
                                <option value="hosteller">Hosteller</option>
                                <option value="warden">Warden</option>
                                <option value="laundry-man">Laundry Man</option>
                              </Field>
                            </div>
                          </div>
                        </div>
                        <div className="permission-panel">
                          <h4>Permission</h4>
                          <div role="group" aria-labelledby="checkbox-group">
                            <div className="row">
                              <div className="col-lg-3">
                                <label>
                                  <Field
                                    type="checkbox"
                                    name="checked"
                                    value="Student Management"
                                  />
                                  Student Management
                                </label>
                                <label>
                                  <Field
                                    type="checkbox"
                                    name="checked"
                                    value="Payment Activities"
                                  />
                                  Payment Activities
                                </label>
                                <label>
                                  <Field
                                    type="checkbox"
                                    name="checked"
                                    value="Update Meal"
                                  />
                                  Update Meal
                                </label>
                              </div>
                              <div className="col-lg-3">
                                <label>
                                  <Field
                                    type="checkbox"
                                    name="checked"
                                    value="Master Data Management"
                                  />
                                  Master Data Management
                                </label>
                                <label>
                                  <Field
                                    type="checkbox"
                                    name="checked"
                                    value="Help Quieres"
                                  />
                                  Help Quieres
                                </label>
                                <label>
                                  <Field
                                    type="checkbox"
                                    name="checked"
                                    value="Events"
                                  />
                                  Events
                                </label>
                              </div>
                              <div className="col-lg-3">
                                <label>
                                  <Field
                                    type="checkbox"
                                    name="checked"
                                    value="Warden Management"
                                  />
                                  Warden Management
                                </label>
                                <label>
                                  <Field
                                    type="checkbox"
                                    name="checked"
                                    value="Notification Management"
                                  />
                                  Notification Management
                                </label>
                                <label>
                                  <Field
                                    type="checkbox"
                                    name="checked"
                                    value="Laundry Process"
                                  />
                                  Laundry Process
                                </label>
                              </div>
                              <div className="col-lg-3">
                                <label>
                                  <Field
                                    type="checkbox"
                                    name="checked"
                                    value=" Hosteller Management"
                                  />
                                  Hosteller Management
                                </label>
                                <label>
                                  <Field
                                    type="checkbox"
                                    name="checked"
                                    value="Emergency Management"
                                  />
                                  Emergency Management
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="create-button">
                          <button type="submit">Create</button>
                        </div>
                      </form>
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    );
  }
}
export default CreateSubAdmin;
