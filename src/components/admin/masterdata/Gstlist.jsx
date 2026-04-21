import React, { Component } from "react";
import moment from "moment";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Tooltip, OverlayTrigger, Modal } from "react-bootstrap";
//import { Label } from 'reactstrap';
import { Link } from "react-router-dom";
import swal from "sweetalert";
import Layout from "../layout/Layout";
import whitelogo from "../../../assets/images/logo.svg";
import API from "../../../shared/admin-axios";
import { showErrorMessage } from "../../../shared/handle_error";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

const dateFormatting = () => (date) => {
  return moment(date).format("dddd, DD/MM/YYYY");
};


class Gstlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      gstList: [],
      gstCount: 0,
      Invalid: false,
    };
  }

  componentDidMount() {
    if (
      this.props.auth.userToken.permissions.events == 0 ||
      this.props.auth.userToken.user_details.role == "admin"
    ) {
      API.get(`/admin/secure/gst_list`)
        .then((res) => {
          this.setState({
            gstList: res.data.result_data,
            gstCount: res.data.result_data.length,
            isLoading: false,
          });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
          });
          console.log("err:", err);
          showErrorMessage(err, this.props);
        });
    } else {
      this.setState({
        Invalid: true,
      });
    }
  }

  handleEditEvent = (event, id) => {
    window.location.href = `/admin/gstedit/${id}`;
  };

  render() {
    const actionFormatter = () => (cell) => {
      return (
        <>
        <button
        onClick={(e) => this.handleEditEvent(e, cell)}
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
        </button>
       
        </>
      );
    };
    if (this.state.isLoading === true) {
      return (
        <>
          <div className="loderOuter">
            <div className="loading_reddy_outer">
              <div className="loading_reddy">
                {/*    <img src={whitelogo} alt="logo" /> */}
              </div>
            </div>
          </div>
        </>
      );
    } else {
      if (this.state.Invalid) return <Redirect to="/admin/dashboard" />;
      else {
        return (
          <Layout {...this.props}>
            <div className="content-wrapper">
              <section className="content-header">
                <div className="row">
                  <h3 className="card-title">
                    <span className="sp1">Home /</span>
                    <span className="sp2"> GST List</span>
                  </h3>
                  <div className="col-lg-12 col-sm-12 col-xs-12"></div>
                </div>
              </section>
              <section></section>
              <section className="content">
                <div className="box">
                  <div className="box-body">
                    <BootstrapTable
                      data={this.state.gstList}
                      search
                      pagination
                    >
                      <TableHeaderColumn
                        isKey
                        dataField="id"
                        dataSort={true}
                        dataAlign="center"
                        width="170"
                      >
                        ID
                      </TableHeaderColumn>

                       <TableHeaderColumn
                        dataField="tax_name"
                        dataSort={true}
                        dataAlign="center"
                        width="170"
                      >
                        GST Name
                      </TableHeaderColumn>


                       <TableHeaderColumn
                        dataField="cgst"
                        dataSort={true}
                        dataAlign="center"
                        width="170"
                      >
                        CGST
                      </TableHeaderColumn>


                       <TableHeaderColumn
                        dataField="sgst"
                        dataSort={true}
                        dataAlign="center"
                        width="170"
                      >
                        SGST
                      </TableHeaderColumn>
                     
                     
                     
                      <TableHeaderColumn
                        dataField="created_at"
                        dataFormat={dateFormatting(this)}
                        dataSort={true}
                        dataAlign="center"
                        width="170"
                      >
                        Created at
                      </TableHeaderColumn>
                      
                      <TableHeaderColumn
                        dataField="id"
                        dataAlign="center"
                        dataFormat={actionFormatter(this)}
                        width="170"
                      >
                        ACTION
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
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(Gstlist));
