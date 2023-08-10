import React, { Component } from "react";
import moment from "moment";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Layout from "../layout/Layout";
import API from "../../../shared/admin-axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import {
    Row,
    Col,
    ButtonToolbar,
    Button,
    Tooltip,
    OverlayTrigger,
    Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import swal from "sweetalert";

class Meals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            get_access_data: false,
            showModal: false,
            remove_search: false,
            showModalLoader: false,
            //////////
            Invalid: false,
            usermangment: [],
            userconut: 0,
        };
    }

    componentDidMount() {
        if (
            this.props.auth.userToken.permissions.warden_management == 0 ||
            this.props.auth.userToken.user_details.role == "admin"
        ) {
            API.get(`/admin/secure/meal_plan`)
                .then((res) => {
                    this.setState({
                        usermangment: res.data.result_data
                    });
                })
                .catch((err) => {
                    console.log("err:", err);
                });
        } else {
            this.setState({
                Invalid: true,
            });
        }
    }

    confirmDelete = (event, id) => {
        event.preventDefault();
        // swal delete api
        swal({
            closeOnClickOutside: false,
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
            API.post(`/admin/secure/meal/delete/${id}`).then((res) => {
                if (res.data && res.data.status === 200) {
                swal({
                    closeOnClickOutside: false,
                    title: "Success",
                    text: "Meal deleted successfully.",
                    icon: "success",
                });
                this.componentDidMount()
                } else {
                swal({
                    closeOnClickOutside: false,
                    // title: "Error",
                    text: res.data.message,
                    icon: "warning",
                });
                this.componentDidMount()
                }
            });
            //
            }
        });
    };

    handleEditMeal = (event, id) => {
        window.location.href = `/admin/meal/edit/${id}`;
    };

    render() {
        const dateFormatting = () => (date) => {
            return moment(date).format("DD/MM/YYYY, h:mm:ss a");
        };
        const actionFormatter = (refObj) => (cell, id) => {
            return (
                <><button
                onClick={(e) => this.confirmDelete(e, cell)}
                style={{
                padding: "0.5rem",
                borderRadius: "5px",
                backgroundColor: "#ffe0db",
                color: "#ff3e1d",
                fontWeight: "bold",
                border: "none",
                }}
                >
                DELETE
                </button>
                <button
                onClick={(e) => this.handleEditMeal(e, cell)}
                style={{
                padding: "0.5rem",
                borderRadius: "5px",
                backgroundColor: "#d7f5fc",
                color: "#883495",
                fontWeight: "bold",
                border: "none",
                margin: "3%"
                }}
                >
                EDIT
                </button></>
            );
        };



        if (this.state.Invalid) return <Redirect to="/admin/dashboard" />;
        else {
            return (
                <Layout {...this.props}>
                    <div className="content-wrapper">
                        <section
                            className="content-header"
                            style={{ padding: "30px 15px 15px 15px" }}
                        >
                            <div className="row">
                                <div className="col-lg-12 col-sm-12 col-xs-12">
                                    <h1 style={{ color: "#a1acb8" }}>
                                        Home / Warden /{" "}
                                        <b style={{ color: "#566a7f" }}>Meal List</b>
                                        <small />
                                    </h1>
                                </div>
                            </div>
                        </section>
                        <section className="content">
                            <div style={{ display:'flex',justifyContent: 'end' }}>
                                
                                <Link className="btn btn-primary" to="/admin/meal/add">Add Meal</Link>
                            </div>
                            <div
                                className="box"
                                style={{
                                    borderRadius: "0.5rem",
                                    boxShadow: "0 2px 6px 0 rgb(67 89 113 / 12%)",
                                }}
                            >
                                <div className="box-body">
                                    <BootstrapTable
                                        data={this.state.usermangment}
                                        //exportCSV
                                        search={true}
                                        pagination
                                    >
                                        <TableHeaderColumn
                                            isKey
                                            dataField="id"
                                            dataSort={true}
                                            className={"text-uppercase"}
                                            width="180"
                                            dataAlign="center"
                                        >
                                            Id
                                        </TableHeaderColumn>
                                        <TableHeaderColumn
                                            dataField="meal_type"
                                            dataSort={true}
                                            className={"text-uppercase"}
                                            width="180"
                                            dataAlign="center"
                                            tdStyle={{ textTransform:'capitalize' }}
                                        >
                                            Meal Type
                                        </TableHeaderColumn>
                                        <TableHeaderColumn
                                            dataField="food_preference"
                                            dataSort={true}
                                            className={"text-uppercase"}
                                            width="180"
                                            dataAlign="center"
                                            tdStyle={{ textTransform:'capitalize' }}
                                        >
                                            Food Preference
                                        </TableHeaderColumn>
                                        <TableHeaderColumn
                                            dataField="meal_name"
                                            dataSort={true}
                                            className={"text-uppercase text-secondary"}
                                            width="180"
                                            dataAlign="center"
                                        >
                                            Food Name
                                        </TableHeaderColumn>


                                        <TableHeaderColumn
                                            dataField="created_at"
                                            dataFormat={dateFormatting(this)}
                                            dataSort={true}
                                            className={"text-uppercase"}
                                            width="180"
                                            dataAlign="center"
                                        >
                                            Created At
                                        </TableHeaderColumn>

                                        <TableHeaderColumn
                                            dataField="id"
                                            dataFormat={actionFormatter(this)}
                                            dataAlign="center" 
                                        
                                        >
                                            Actions
                                        </TableHeaderColumn>
                                    </BootstrapTable>
                                </div>
                            </div>
                        </section>
                    </div>
                </Layout>
            );
        }
    }
}
const mapStateToProps = (state) => {
    return {
        ...state,
    };
};
export default withRouter(connect(mapStateToProps)(Meals));
